import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Svg, Line } from 'react-native-svg';
import Back from '../../common/Back';
import useFullScreen from '../../hooks/useFullScreen';
import Fontsizes from '../../styles/fontsizes';
import { ask } from '../../../models/chat';

const SafeView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Container = styled.View`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Top = styled.View`
    height: ${props => props.keyboardVisible ? '10%' : '20%'};
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: ${Colors.background.bg};
`;

const Gradient = styled(LinearGradient).attrs({
    colors: Colors.background.gradientReverse,
    start: {x: 0, y: 0},
    end: {x: 0, y: 1},
    opacity: 0.14,
})`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

const TopText = styled.Text`
    font-size: ${Fontsizes.mm};
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
`;

const Date = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: absolute;
    bottom: 20px;
    z-index: 2;
`;

const DateText = styled.Text`
    font-size: 14px;
    color: #000000;
    opacity: 0.7;
    text-align: center;
    margin: 0 15px;
    font-weight: 500;
`;

const LineContainer = styled.View`
    flex: 1;
    height: 1px;
    justify-content: center;
`;

const ChatScrollView = styled(ScrollView)`
    flex: 1;
    padding: 20px;
`;

const Kong = styled.View`
    flex-direction: row;
    align-items: center;
    padding-left: 10px;
    margin-bottom: 10px;
`;

const SmallKongIcon = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid ${Colors.primary};
    background-color: white;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
`;

const SmallKongImage = styled(Image)`
    width: 30px;
    height: 30px;
    resize-mode: contain;
`;

const KongText = styled.Text`
    color: #171717;
    opacity: 0.68;
    margin-right: 10px;
`;

const KongContainer = styled.View`
    align-items: center;
    justify-content: center;
    margin: 20px 0;
`;

const LargeKongIcon = styled.View`
    width: 80px;
    height: 80px;
    border-radius: 40px;
    background-color: #DEF3FB;
    border: 3px solid ${Colors.primary};
    justify-content: center;
    align-items: center;
`;

const LargeKongImage = styled(Image)`
    width: 60px;
    height: 60px;
    resize-mode: contain;
`;

const WelcomeMessage = styled.Text`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    color: #333;
    margin: 20px 0;
`;

const ChatMessage = styled.View`
    border: 2px solid ${Colors.primary};
    border-radius: 20px;
    background-color: white;
    padding: 16px;
    margin: 10px 0;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
    align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
    max-width: 80%;
`;

const ChatText = styled.Text`
    font-size: 16px;
    color: #333;
    line-height: 22px;
`;

const SelectWrapper = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5px 0;
    gap: 8px;
`;

const Select = styled(TouchableOpacity)`
    background-color: #F4F4F4;
    border-radius: 30px;
    border: 1px solid #D4AAAA;
    padding: 10px 16px;
`;

const SelectText = styled.Text`
    font-size: 14px;
    color: #171717;
`;

const InputSection = styled.View`
    background-color: ${Colors.background.bg};
    padding: 16px 20px;
    padding-bottom: 20px;
    border-top-width: 1px;
    border-top-color: #f0f0f0;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    min-height: 80px;
`;

const IconButton = styled(TouchableOpacity)`
    width: 40px;
    height: 40px;
    border-radius: 24px;
    background-color: ${Colors.primary};
    justify-content: center;
    align-items: center;
`;

const IconImage = styled(Image)`
    width: 24px;
    height: 24px;
    resize-mode: contain;
    tint-color: white;
`;

const InputWrapper = styled.View`
    flex: 1;
    background-color: white;
    border-radius: 25px;
    border: 1px solid #ddd;
    padding: 4px 20px;
    flex-direction: row;
    align-items: center;
    min-height: 48px;
`;

const Input = styled(TextInput)`
    flex: 1;
    font-size: 16px;
    color: #333;
    max-height: 100px;
`;

const ActionMessage = styled.View`
    border: 2px solid ${Colors.primary};
    border-radius: 20px;
    background-color: white;
    padding: 16px;
    margin: 10px 0;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
    align-self: flex-start;
    max-width: 80%;
`;

const ActionButton = styled(TouchableOpacity)`
    background-color: ${Colors.primary};
    border-radius: 8px;
    padding: 12px 20px;
    margin-top: 10px;
    align-items: center;
`;

const ActionButtonText = styled.Text`
    color: white;
    font-size: 14px;
    font-weight: 600;
`;

const ChatRoomScreen = ({ navigation, route }) => {
    const { enableFullScreen, disableFullScreen } = useFullScreen();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);

    useEffect(() => {
        enableFullScreen();
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            disableFullScreen();
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [enableFullScreen, disableFullScreen]);

    const [messages, setMessages] = useState([
        { id: 1, text: '안녕하세요, 콩콩봇입니다', isUser: false },
        { id: 2, text: '문의하실 내용을 간단히 입력하시거나, 아래 버튼을 선택해주세요', isUser: false },
    ]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (route.params?.diagnosisData) {
            const { diagnosisData } = route.params;

            const diagnosisMessage = {
                id: messages.length + 1,
                text: diagnosisData.content,
                isUser: true,
                diagnosisData: {
                    temp: diagnosisData.temp,
                    ecg: diagnosisData.ecg,
                },
            };

            setMessages(prev => [...prev, diagnosisMessage]);

            handleDiagnosisRequest(diagnosisData);
            navigation.setParams({ diagnosisData: null });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params?.diagnosisData]);

    const handleDiagnosisRequest = async (diagnosisData) => {
        setIsLoading(true);

        try {
            const response = await ask(diagnosisData.content, currentChatId, {
                temperature: diagnosisData.temp,
                ecgResult: diagnosisData.ecg,
            });

            if (response.success && response.chat) {
                if (!currentChatId && response.chat.chat_id) {
                    setCurrentChatId(response.chat.chat_id);
                }

                const botResponse = {
                    id: messages.length + 2,
                    text: response.chat.answer.content,
                    isUser: false,
                    isRecommend: response.chat.answer.is_recommend,
                    isDiag: response.chat.answer.is_diag,
                };

                setMessages(prev => [...prev, botResponse]);

                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            } else {
                throw new Error('진단 응답을 받을 수 없습니다.');
            }
        } catch (error) {
            console.error('진단 요청 오류:', error);
            const errorMessage = {
                id: messages.length + 2,
                text: '진단 처리 중 오류가 발생했습니다. 다시 시도해 주세요.',
                isUser: false,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (inputText.trim() && !isLoading) {
            setIsLoading(true);
            const newMessage = {
                id: messages.length + 1,
                text: inputText,
                isUser: true,
            };

            setMessages(prev => [...prev, newMessage]);
            const currentInput = inputText;
            setInputText('');

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);

            try {
                const response = await ask(currentInput, currentChatId);

                if (response.success && response.chat) {
                    if (!currentChatId && response.chat.chat_id) {
                        setCurrentChatId(response.chat.chat_id);
                    }

                    const botResponse = {
                        id: messages.length + 2,
                        text: response.chat.answer.content,
                        isUser: false,
                        isRecommend: response.chat.answer.is_recommend,
                        isDiag: response.chat.answer.is_diag,
                    };

                    setMessages(prev => [...prev, botResponse]);

                    setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                } else {
                    throw new Error('AI 응답을 받을 수 없습니다.');
                }
            } catch (error) {
                console.error('메시지 전송 에러:', error);

                const errorResponse = {
                    id: messages.length + 2,
                    text: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
                    isUser: false,
                };

                setMessages(prev => [...prev, errorResponse]);

                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);

                Alert.alert('오류', '메시지 전송에 실패했습니다. 다시 시도해주세요.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleQuickSelect = async (text) => {
        if (isLoading) { return; }

        const newMessage = {
            id: messages.length + 1,
            text: text,
            isUser: true,
        };

        setMessages(prev => [...prev, newMessage]);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        if (text === '심전도 검사') {
            setTimeout(() => {
                const diagMessage = {
                    id: messages.length + 2,
                    text: '심전도 검사를 원하시나요?',
                    isUser: false,
                    showDiagButton: true,
                };
                setMessages(prev => [...prev, diagMessage]);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }, 1000);
        } else if (text === '심전도 검사 관련 질문') {
            setTimeout(() => {
                const mostMessage = {
                    id: messages.length + 2,
                    text: '가장 많이 한 질문을 봐보세요!',
                    isUser: false,
                    showMostButton: true,
                };
                setMessages(prev => [...prev, mostMessage]);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }, 1000);
        } else if (text === '기록 보기') {
            setTimeout(() => {
                const periodMessage = {
                    id: messages.length + 2,
                    text: '이전 기록을 확인해보세요!',
                    isUser: false,
                    showPeriodButton: true,
                };
                setMessages(prev => [...prev, periodMessage]);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }, 1000);
        } else {
            try {
                setIsLoading(true);
                const response = await ask(text, currentChatId);

                if (response.success && response.chat) {
                    if (!currentChatId && response.chat.chat_id) {
                        setCurrentChatId(response.chat.chat_id);
                    }

                    const botResponse = {
                        id: messages.length + 2,
                        text: response.chat.answer.content,
                        isUser: false,
                        isRecommend: response.chat.answer.is_recommend,
                        isDiag: response.chat.answer.is_diag,
                    };

                    setMessages(prev => [...prev, botResponse]);

                    setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
            } catch (error) {
                console.error('퀵 셀렉트 에러:', error);
                const errorResponse = {
                    id: messages.length + 2,
                    text: `${text}에 대해 도움을 드리겠습니다. 다시 시도해주세요.`,
                    isUser: false,
                };
                setMessages(prev => [...prev, errorResponse]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <SafeView edges={[]}>
            <Container>
                <Top keyboardVisible={keyboardVisible}>
                    <Back navigation={navigation} />
                    <Gradient />
                    <TopText>콩콩봇</TopText>
                    {!keyboardVisible && (
                        <Date>
                            <LineContainer>
                                <Svg width="100%" height="2">
                                    <Line
                                        x1="0"
                                        y1="1"
                                        x2="100%"
                                        y2="1"
                                        stroke="#000000"
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                </Svg>
                            </LineContainer>
                            <DateText>오늘</DateText>
                            <LineContainer>
                                <Svg width="100%" height="2">
                                    <Line
                                        x1="0"
                                        y1="1"
                                        x2="100%"
                                        y2="1"
                                        stroke="#000000"
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                </Svg>
                            </LineContainer>
                        </Date>
                    )}
                </Top>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ChatScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        ref={scrollViewRef}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <Kong>
                            <SmallKongIcon>
                                <SmallKongImage source={require('../../../assets/kong.png')} />
                            </SmallKongIcon>
                            <KongText style={{ fontSize: 14, paddingLeft: 10 }}>콩콩봇</KongText>
                            <KongText style={{ fontSize: 12 }}>13:42</KongText>
                        </Kong>

                        <KongContainer>
                            <LargeKongIcon>
                                <LargeKongImage source={require('../../../assets/kong.png')} />
                            </LargeKongIcon>
                        </KongContainer>

                        <WelcomeMessage>김미소님, 무엇을 도와드릴까요?</WelcomeMessage>

                        {messages.map((message) => (
                            <React.Fragment key={message.id}>
                                {message.showDiagButton ? (
                                    <ActionMessage>
                                        <ChatText>{message.text}</ChatText>
                                        <ActionButton onPress={() => navigation.navigate('Diag')}>
                                            <ActionButtonText>심전도 검사 시작하기</ActionButtonText>
                                        </ActionButton>
                                    </ActionMessage>
                                ) : message.showMostButton ? (
                                    <ActionMessage>
                                        <ChatText>{message.text}</ChatText>
                                        <ActionButton onPress={() => navigation.navigate('ChatMost')}>
                                            <ActionButtonText>자주 묻는 질문 보기</ActionButtonText>
                                        </ActionButton>
                                    </ActionMessage>
                                ) : message.showPeriodButton ? (
                                    <ActionMessage>
                                        <ChatText>{message.text}</ChatText>
                                        <ActionButton onPress={() => navigation.navigate('ChatPeriod')}>
                                            <ActionButtonText>이전 기록 보기</ActionButtonText>
                                        </ActionButton>
                                    </ActionMessage>
                                ) : message.isRecommend && !message.isUser ? (
                                    // isRecommend가 true일 때 병원 찾기 버튼 표시
                                    <ActionMessage>
                                        <ChatText>{message.text}</ChatText>
                                        <ActionButton onPress={() => navigation.navigate('Map')}>
                                            <ActionButtonText>병원 찾기</ActionButtonText>
                                        </ActionButton>
                                    </ActionMessage>
                                ) : message.isDiag && !message.isUser ? (
                                    // isDiag가 true일 때 심전도 검사 버튼 표시
                                    <ActionMessage>
                                        <ChatText>{message.text}</ChatText>
                                        <ActionButton onPress={() => navigation.navigate('Diag')}>
                                            <ActionButtonText>심전도 검사 시작하기</ActionButtonText>
                                        </ActionButton>
                                    </ActionMessage>
                                ) : (
                                    <ChatMessage isUser={message.isUser}>
                                        <ChatText>{message.text}</ChatText>
                                    </ChatMessage>
                                )}
                            </React.Fragment>
                        ))}

                        {messages.length <= 2 && !keyboardVisible && (
                            <>
                                <SelectWrapper>
                                    <Select onPress={() => handleQuickSelect('심전도 검사')}>
                                        <SelectText>심전도 검사</SelectText>
                                    </Select>
                                    <Select onPress={() => handleQuickSelect('질의 응답')}>
                                        <SelectText>질의 응답</SelectText>
                                    </Select>
                                </SelectWrapper>
                                <SelectWrapper>
                                    <Select onPress={() => handleQuickSelect('심전도 검사 관련 질문')}>
                                        <SelectText>심전도 검사 관련 질문</SelectText>
                                    </Select>
                                    <Select onPress={() => handleQuickSelect('기록 보기')}>
                                        <SelectText>기록 보기</SelectText>
                                    </Select>
                                </SelectWrapper>
                                <SelectWrapper>
                                    <Select onPress={() => handleQuickSelect('기타 서비스 문의')}>
                                        <SelectText>기타 서비스 문의</SelectText>
                                    </Select>
                                </SelectWrapper>
                            </>
                        )}

                        {isLoading && (
                            <ChatMessage isUser={false}>
                                <ChatText>답변을 생성하고 있습니다...</ChatText>
                            </ChatMessage>
                        )}
                    </ChatScrollView>

                    <InputSection>
                        <IconButton onPress={() => navigation.navigate('Main')}>
                            <IconImage source={require('../../../assets/home.png')} />
                        </IconButton>
                        <IconButton>
                            <IconImage source={require('../../../assets/box.png')} />
                        </IconButton>
                        <InputWrapper>
                            <Input
                                placeholder="메시지를 입력해주세요"
                                multiline={true}
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={sendMessage}
                                blurOnSubmit={true}
                                returnKeyType="send"
                                editable={!isLoading}
                            />
                        </InputWrapper>
                    </InputSection>
                </KeyboardAvoidingView>
            </Container>
        </SafeView>
    );
};

export default ChatRoomScreen;
