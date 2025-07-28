import prisma from '../models/prisma.js';
import createError from '../utils/createError.js';
import * as ai from '../services/aiService.js';

export const ask = async (req, res, next) => {
    try {
        // chat_id는 없을 수도 있으므로 let으로 선언
        let { chat_id, content, temp, ecg } = req.body;
        const userId = req.user.userId;

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return next(createError(400, '질문을 입력해주세요', 'INVALID_INPUT'));
        }

        // temp와 ecg 기본값 설정
        const temperatureValue = temp !== undefined && temp !== null ? parseFloat(temp) : 0;
        const ecgValue = ecg !== undefined && ecg !== null ? parseInt(ecg) : -1;

        // ECG 값 검증 (0~4 또는 -1만 허용)
        if (ecgValue !== -1 && (ecgValue < 0 || ecgValue > 4)) {
            return next(createError(400, 'ECG 값은 0~4 사이의 정수여야 합니다', 'INVALID_ECG_VALUE'));
        }

        // 질문 시, chat_id 없이 데이터 POST하면 -> chat_id 만들어서 새 채팅방 생성 
        if (!chat_id) {
            if (!userId) {
                return next(createError(401, '토큰이 유효하지 않습니다.', 'INVALID_TOKEN'));
            }

            const newChatRoom = await prisma.chatRoom.create({
                data: {
                    user_id: userId,
                    title: content.substring(0, 30) // title 임시 생성해둠
                }
            });
            chat_id = newChatRoom.chat_id; // 새로 생성된 chat_id를 변수에 할당
        }

        let aiContent;
        let isRecommend = false;
        let isDiag = false;
        let responseMessage = "질문하기 성공";

        // 질문하기 (실패 시 기본 응답(responseMessage)으로 대체)
        try {
            const aiRequestData = {
                question: content,
                userId: userId, // 사용자 정보도 포함 (개인화를 위해)
                chatId: chat_id, // 채팅방 정보도 포함
                temp: temperatureValue, // 체온 정보 추가
                ecg: ecgValue // ECG 정보 추가
            };

            const aiResponse = await ai.generateAnswer(aiRequestData);
            
            // AI 서버에서 3개의 값을 응답해줌: content, isRecommend, isDiag
            if (aiResponse && aiResponse.content) {
                aiContent = aiResponse.content;
                isRecommend = aiResponse.isRecommend || false;
                isDiag = aiResponse.isDiag || false;
            } else {
                throw new Error('AI_RESPONSE_ERROR');
            }
        } catch (error) {
            console.error("AI 응답 생성 실패:", error.message);
            aiContent = "죄송합니다. 답변을 생성하지 못했습니다.";
            responseMessage = "AI 응답 실패, 기본 메시지로 대체됨";
        }

        // transaction 처리 - AI 플래그와 temp, ecg 값도 함께 저장
        const [questionRecord, answerRecord] = await prisma.$transaction([
            prisma.chatComment.create({
                data: {
                    chat_id: chat_id, 
                    content: content,
                    is_question: true,
                    is_recommend: null, // 질문에는 해당 없음
                    is_diag: null,      // 질문에는 해당 없음
                    temp: temperatureValue, // 질문 시의 체온
                    ecg: ecgValue       // 질문 시의 ECG 값
                }
            }),
            prisma.chatComment.create({
                data: {
                    chat_id: chat_id, 
                    content: aiContent,
                    is_question: false,
                    is_recommend: isRecommend, // AI 응답의 추천 플래그
                    is_diag: isDiag,          // AI 응답의 진단 플래그
                    temp: null,               // AI 응답에는 체온 정보 없음
                    ecg: null                 // AI 응답에는 ECG 정보 없음
                }
            })
        ]);

        return res.status(201).json({
            message: responseMessage,
            success: true,
            chat: {
                chat_id: chat_id,
                question: {
                    content_id: questionRecord.content_id,
                    content: questionRecord.content,
                    is_question: questionRecord.is_question,
                    temp: questionRecord.temp,
                    ecg: questionRecord.ecg,
                    created_at: questionRecord.created_at
                },
                answer: {
                    content_id: answerRecord.content_id,
                    content: answerRecord.content,
                    is_question: answerRecord.is_question,
                    is_recommend: answerRecord.is_recommend,
                    is_diag: answerRecord.is_diag,
                    temp: answerRecord.temp,
                    ecg: answerRecord.ecg,
                    created_at: answerRecord.created_at
                }
            }
        });

    } catch (err) {
        next(err);
    }
};

export const getChat = async (req, res, next) => {
    try {
        const { chat_id } = req.params;
        const userId = req.user.userId;

        const chatRoom = await prisma.chatRoom.findFirst({
            where: {
                chat_id: Number(chat_id),
                user_id: userId
            },
            include: {
                comments: {
                    orderBy: { created_at: 'asc' } // 시간순 정렬
                }
            }
        });

        if (!chatRoom) {
            return next(createError(404, '채팅방이 비어있습니다.', 'NOT_FOUND'));
        }

        const responseData = {
            chat_id: chatRoom.chat_id,
            title: chatRoom.title || "채팅방",
            history: chatRoom.comments.map(comment => ({
                content_id: comment.content_id,
                is_question: comment.is_question,
                content: comment.content,
                is_recommend: comment.is_recommend,
                is_diag: comment.is_diag,
                temp: comment.temp, // 체온 정보 추가
                ecg: comment.ecg,   // ECG 정보 추가
                created_at: comment.created_at
            }))
        };

        return res.status(200).json({
            data: responseData,
            message: '채팅 보기 성공',
            success: true
        });
    } catch (err) {
        next(err);
    }
};

export const getChatPeriod = async (req, res, next) => {
    try {
        const { period } = req.query;
        const userId = req.user.userId;

        // 기본값 7일로 설정
        const days = parseInt(period) || 7;

        if (!userId) {
            return next(createError(401, '토큰이 유효하지 않습니다.', 'INVALID_TOKEN'));
        }

        // N일 전 날짜 계산
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const chatRooms = await prisma.chatRoom.findMany({
            where: {
                user_id: userId,
                created_at: {
                    gte: cutoffDate
                }
            },
            include: {
                comments: {
                    orderBy: { created_at: 'asc' }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        const data = chatRooms.map(room => ({
            chat_id: room.chat_id,
            title: room.title,
            created_at: room.created_at,
            history: room.comments.map(c => ({
                content_id: c.content_id,
                content: c.content,
                is_question: c.is_question,
                is_recommend: c.is_recommend,
                is_diag: c.is_diag,
                temp: c.temp, // 체온 정보 추가
                ecg: c.ecg,   // ECG 정보 추가
                created_at: c.created_at
            }))
        }));

        return res.status(200).json({
            data,
            message: `${days}일 이내 채팅 목록`,
            success: true
        });

    } catch (err) {
        next(err);
    }
};
