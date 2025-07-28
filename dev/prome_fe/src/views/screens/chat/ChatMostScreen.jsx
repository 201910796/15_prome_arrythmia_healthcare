import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Svg, Line } from 'react-native-svg';
import Back from '../../common/Back';
import useFullScreen from '../../hooks/useFullScreen';
import Fontsizes from '../../styles/fontsizes';

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

// Kong 정보
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

// 환영 메시지 영역
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

const ChatMessage = styled(TouchableOpacity)`
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

const ChatMostScreen = ({ navigation }) => {
    const { enableFullScreen, disableFullScreen } = useFullScreen();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

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

    const [messages, setMessages] = useState([]);

    const [frequentQuestions] = useState([
        { id: 1, text: '심전도는 어떤 검사에요?', isUser: false },
        { id: 2, text: '저는 지금 병원에 당장 가야 할까요?', isUser: false },
        { id: 3, text: '심전도 검사는 언제 받아야해요?', isUser: false },
        { id: 4, text: '저는 왜 콩콩봇이 아닐까요?', isUser: false },
    ]);

    const scrollViewRef = useRef(null);

    const questionAnswers = {
        '심전도는 어떤 검사에요?': '심전도(ECG)는 심장의 전기적 활동을 측정하는 검사입니다. 심장 박동의 리듬과 강도를 확인하여 부정맥, 심근경색 등을 진단할 수 있습니다.',
        '저는 지금 병원에 당장 가야 할까요?': '심전도 검사 결과나 증상에 따라 다릅니다. 가슴 통증, 호흡곤란, 어지러움 등의 증상이 있다면 즉시 병원에 방문하시는 것이 좋습니다.',
        '심전도 검사는 언제 받아야해요?': '정기 건강검진 시 또는 가슴 통증, 두근거림, 호흡곤란 등의 증상이 있을 때 받으시면 됩니다. 나이가 많거나 심장질환 위험인자가 있다면 정기적으로 받는 것이 좋습니다.',
        '저는 왜 콩콩봇이 아닐까요?': '저는 심전도 검사와 심장 건강에 대해 도움을 드리는 콩콩봇입니다. 궁금한 점이 있으시면 언제든지 질문해주세요!',
    };

    const [messageId, setMessageId] = useState(1);

    const handleQuestionPress = (questionText) => {
        const userMessage = {
            id: messageId,
            text: questionText,
            isUser: true,
        };
        setMessages(prev => [...prev, userMessage]);
        setMessageId(prev => prev + 1);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        setTimeout(() => {
            const botResponse = {
                id: messageId + 1,
                text: questionAnswers[questionText] || '해당 질문에 대한 답변을 준비 중입니다.',
                isUser: false,
            };
            setMessages(prev => [...prev, botResponse]);
            setMessageId(prev => prev + 1);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            setTimeout(() => {
                setMessages([]);
            }, 4000);
        }, 1000);
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

                        <WelcomeMessage>가장 많이 한 질문들을 보여드릴게요 !</WelcomeMessage>

                        {messages.map((message) => (
                            <ChatMessage key={message.id} isUser={message.isUser}>
                                <ChatText>{message.text}</ChatText>
                            </ChatMessage>
                        ))}

                        {messages.length === 0 && frequentQuestions.map((question) => (
                            <ChatMessage
                                key={question.id}
                                isUser={question.isUser}
                                onPress={() => handleQuestionPress(question.text)}
                            >
                                <ChatText>{question.text}</ChatText>
                            </ChatMessage>
                        ))}
                    </ChatScrollView>
                </KeyboardAvoidingView>
            </Container>
        </SafeView>
    );
};

export default ChatMostScreen;
