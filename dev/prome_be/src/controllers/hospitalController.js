import jwt from 'jsonwebtoken';
import prisma from '../models/prisma.js';
import createError from '../utils/createError.js';
import * as ai from '../services/aiService.js';

export const findHospital = async(req, res, next) => {
    try {

        const userId = req.user.userId;

        const { location, query } = req.bodmyy;
        if (!location || !query) {
            return next(createError(400, "정보를 다 입력해주세요", "INVALID_INPUT"));
        }

        const hospitals = ai.recommendHospital({ location, query });
        if (!hospitals) {
            return next(createError(502, "AI 응답 생성 실패", "AI_RESPONSE_ERROR"));
        }

        await prisma.hospital.createMany({
            data: hospitals.map(h => ({
                user_id: userId,
                hospital_name: h.hospital_name,
                distance: h.distance,
                score: h.score,
                address: h.address
            }))
        });

        return res.status(201).json({
            "message": "병원 리스트 추출 성공",
            "success": true
        });
    } catch(err) {
        next(err);
    }
};

export const getHospital = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const hospitalLists = await prisma.hospital.findMany({
            where: { user_id: userId },
            orderBy: { score: 'desc' },
            select: {
                hospital_id: true,
                hospital_name: true,
                distance: true,
                score: true
            }
        });
        
        return res.status(200).json({
            data: hospitalLists,
            "message": "병원 리스트 보기 성공",
            "success": true
        })

    } catch (err) {
        next(err);

    }
};

export const getHospitalDetail = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { hospital_id } = req.params;

        const hospitalList = await prisma.hospital.findFirst({
            where: { user_id: userId, hospital_id: Number(hospital_id) }
        });

        return res.status(200).json({
            data: hospitalList,
            "message": "병원 상세 보기 성공",
            "success": true
        });
    } catch (err) {
        next(err);
    }
};

export const reserveHospital = async (req, res, next) => {
    // AI -> 통화, 일정 추출
    // TODO : 얻은 Response ???
};

export const scheduleHospital = async (req, res, next) => {
    // TOOO : 위에서 추출된 정보를 calendar table에 추가
};

export const getCalendar = async (req, res, next) => {
    // TODO : 현재 user의 캘린더 예약 내용 다 GET
    try {
        const userId = req.user.userId;

        const calendars = await prisma.calendar.findMany({
            where: {
                hospital: {
                user_id: userId 
                }
            },
            select: {
                calendar_id: true,
                hospital_date: true,
                hospital: {
                select: {
                    hospital_name: true
                }
                }
            }
        });

        return res.status(200).json({
            data: calendars,
            "message": "전체 캘린더 보기 성공",
            "success": true
        });
    } catch (err) {
        next(err);
    }
};

export const getCalendarDetail = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { calendar_id } = req.params;

        
        const calendar = await prisma.calendar.findFirst({
            where: {
                calendar_id: Number(calendar_id),
                hospital: {
                user_id: userId
                }
            }
        });

        return res.status(200).json({
            data: calendar,
            "message": "상세 캘린더 보기 성공",
            "success": true
        });
    } catch (err) {
        next(err);
    }
};