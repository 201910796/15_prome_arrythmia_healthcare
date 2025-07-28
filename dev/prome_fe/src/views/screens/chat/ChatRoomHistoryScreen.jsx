import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Line } from 'react-native-svg';
import Back from '../../common/Back';
import useFullScreen from '../../hooks/useFullScreen';
import Fontsizes from '../../styles/fontsizes';
import { getChat } from '../../../models/chat';

const SafeView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Container = styled.View`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Top = styled.View`
    height: 20%;
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

const LoadingText = styled.Text`
    text-align: center;
    color: #666;
    margin-top: 50px;
    font-size: 16px;
`;

const ErrorText = styled.Text`
    text-align: center;
    color: #ff6b6b;
    margin-top: 50px;
    font-size: 16px;
`;

const ChatRoomHistoryScreen = ({ navigation, route }) => {
    const { enableFullScreen, disableFullScreen } = useFullScreen();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatTitle, setChatTitle] = useState('채팅 기록');
    const scrollViewRef = useRef(null);

    const chatId = route?.params?.chatId;
    const passedTitle = route?.params?.chatTitle;

    useEffect(() => {
        enableFullScreen();

        return () => {
            disableFullScreen();
        };
    }, [enableFullScreen, disableFullScreen]);

    const loadChatHistory = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getChat(chatId);

            if (response && response.success && response.data) {

                const loadedMessages = response.data.history.map((comment, index) => ({
                    id: index + 1,
                    text: comment.content,
                    isUser: comment.is_question,
                    isRecommend: comment.is_recommend,
                    isDiag: comment.is_diag,
                    created_at: comment.created_at,
                }));

                setMessages(loadedMessages);

                if (response.data.title) {
                    setChatTitle(response.data.title);
                }
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            } else {
                setError('채팅 기록을 찾을 수 없습니다.');
            }
        } catch (e) {
            console.error('채팅 기록 로드 에러:', e);
            setError('채팅 기록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        if (passedTitle) {
            setChatTitle(passedTitle);
        }

        if (chatId) {
            loadChatHistory();
        } else {
            setError('채팅방 ID가 없습니다.');
            setLoading(false);
        }

    }, [chatId, passedTitle, loadChatHistory]);

    if (loading) {
        return (
            <SafeView edges={[]}>
                <Container>
                    <Top>
                        <Back navigation={navigation} />
                        <Gradient />
                        <TopText>채팅 기록</TopText>
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
                            <DateText>로딩중</DateText>
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
                    </Top>
                    <LoadingText>채팅 기록을 불러오는 중...</LoadingText>
                </Container>
            </SafeView>
        );
    }

    if (error) {
        return (
            <SafeView edges={[]}>
                <Container>
                    <Top>
                        <Back navigation={navigation} />
                        <Gradient />
                        <TopText>오류</TopText>
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
                            <DateText>오류</DateText>
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
                    </Top>
                    <ErrorText>{error}</ErrorText>
                </Container>
            </SafeView>
        );
    }

    return (
        <SafeView edges={[]}>
            <Container>
                <Top>
                    <Back navigation={navigation} />
                    <Gradient />
                    <TopText>{chatTitle}</TopText>
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
                        <DateText>기록</DateText>
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
                </Top>

                <ChatScrollView
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <Kong>
                        <SmallKongIcon>
                            <SmallKongImage source={require('../../../assets/kong.png')} />
                        </SmallKongIcon>
                        <KongText style={{ fontSize: 14, paddingLeft: 10 }}>콩콩봇</KongText>
                    </Kong>

                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <ChatMessage key={message.id} isUser={message.isUser}>
                                <ChatText>{message.text}</ChatText>
                            </ChatMessage>
                        ))
                    ) : (
                        <ErrorText>채팅 기록이 없습니다.</ErrorText>
                    )}
                </ChatScrollView>
            </Container>
        </SafeView>
    );
};

export default ChatRoomHistoryScreen;
