import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Line } from 'react-native-svg';
import { getChat7Period, getChat30Period, getChatByPeriod } from '../../../models/chat';

const SafeView = styled(SafeAreaView)`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.3);
`;

const ModalOverlay = styled.View`
    flex: 1;
    background-color: transparent;
    flex-direction: row;
`;

const BackgroundChatRoom = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${Colors.background.bg || '#f8f8f8'};
`;

const BackgroundTop = styled.View`
    height: 20%;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: ${Colors.background.bg || '#f8f8f8'};
`;

const BackgroundGradient = styled(LinearGradient).attrs({
    colors: Colors.background?.gradientReverse || ['#e3f2fd', '#bbdefb'],
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

const BackgroundTopText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
`;

const BackgroundDate = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: absolute;
    bottom: 20px;
    z-index: 2;
`;

const BackgroundDateText = styled.Text`
    font-size: 14px;
    color: #000000;
    opacity: 0.7;
    text-align: center;
    margin: 0 15px;
    font-weight: 500;
`;

const BackgroundLineContainer = styled.View`
    flex: 1;
    height: 1px;
    justify-content: center;
`;

const BackgroundChatArea = styled.View`
    flex: 1;
    padding: 20px;
`;

const BackgroundInputSection = styled.View`
    background-color: ${Colors.background.bg || '#f8f8f8'};
    padding: 16px 20px;
    padding-bottom: 20px;
    border-top-width: 1px;
    border-top-color: #f0f0f0;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    min-height: 80px;
`;

const BackgroundIconButton = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 24px;
    background-color: ${Colors.primary || '#4CAF50'};
    justify-content: center;
    align-items: center;
`;

const BackgroundInputWrapper = styled.View`
    flex: 1;
    background-color: white;
    border-radius: 25px;
    border: 1px solid #ddd;
    padding: 4px 20px;
    flex-direction: row;
    align-items: center;
    min-height: 48px;
`;

const BackgroundInputText = styled.Text`
    flex: 1;
    font-size: 16px;
    color: #999;
`;

const DarkOverlay = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
`;

const SidePanel = styled.View`
    width: 70%;
    height: 100%;
    background-color: #f5f5f5;
    z-index: 10;
    border-radius: 30px;
`;

const TouchableArea = styled.View`
    flex: 1;
    background-color: transparent;
`;

const HeaderContainer = styled.View`
    background-color: white;
    padding: 5px 20px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    border-top-right-radius: 30px;
    elevation: 3;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
`;

const CloseButton = styled(TouchableOpacity)`
    position: absolute;
    top: 10px;
    right: 20px;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
`;

const CloseIcon = styled.View`
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
`;

const CloseText = styled.Text`
    font-size: 18px;
    color: #666;
    font-weight: bold;
`;

const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-top: 10px;
    margin-bottom: 20px;
`;

const SearchContainer = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: #f9f9f9;
    border: 1px solid ${Colors.primary};
    border-radius: 25px;
    padding: 0px 16px;
    margin-bottom: 5px;
`;

const SearchIcon = styled.View`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${Colors.primary};
    margin-right: 10px;
    position: relative;
`;

const SearchIconHandle = styled.View`
    position: absolute;
    width: 6px;
    height: 2px;
    background-color: ${Colors.primary};
    bottom: -4px;
    right: -2px;
    transform: rotate(45deg);
`;

const SearchInput = styled(TextInput)`
    flex: 1;
    font-size: 16px;
    color: #333;
`;

const ContentContainer = styled.View`
    flex: 1;
    padding: 0px 20px;
`;

const ChatSection = styled.View`
    margin-bottom: 15px;
`;

const ChatItem = styled(TouchableOpacity)`
    background-color: white;
    padding: 6px;
    margin-bottom: 10px;
    border-radius: 12px;
    elevation: 2;
`;

const ChatTitleText = styled.Text`
    font-size: 14px;
    color: #333;
    font-weight: 600;
    margin-bottom: 6px;
    line-height: 22px;
    text-align: center;
`;

const ChatDateText = styled.Text`
    font-size: 12px;
    color: #666;
    opacity: 0.8;
    text-align: center;
`;

const LoadingText = styled.Text`
    text-align: center;
    color: #666;
    margin-top: 20px;
`;

const EmptyText = styled.Text`
    text-align: center;
    color: #999;
    margin-top: 20px;
    font-size: 16px;
`;

const PeriodSelector = styled.View`
    flex-direction: row;
    justify-content: space-around;
    padding: 10px 20px;
    background-color: white;
    margin-bottom: 5px;
    elevation: 1;
`;

const PeriodButton = styled(TouchableOpacity)`
    padding: 8px 12px;
    border-radius: 15px;
    background-color: ${props => props.active ? (Colors.primary || '#4CAF50') : '#f0f0f0'};
`;

const PeriodButtonText = styled.Text`
    color: ${props => props.active ? 'white' : '#666'};
    font-weight: ${props => props.active ? '600' : '400'};
    font-size: 12px;
`;

const BottomTabContainer = styled.View`
    flex-direction: row;
    background-color: white;
    padding: 15px 20px;
    elevation: 3;
    shadow-color: #000;
    shadow-offset: 0px -2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    border-bottom-right-radius: 30px;
`;

const TabButton = styled(TouchableOpacity)`
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: 2px solid ${Colors.primary || '#4CAF50'};
    background-color: ${props => props.active ? (Colors.primary || '#4CAF50') : 'white'};
    justify-content: center;
    align-items: center;
    margin-right: 15px;
`;

const TabIcon = styled(Image)`
    resize-mode: contain;
    tint-color: ${props => props.active ? 'white' : (Colors.primary || '#4CAF50')};
`;

const ChatPeriodSelectScreen = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(7);

    useEffect(() => {
        if (route?.params?.selectedPeriod) {
            setSelectedPeriod(route.params.selectedPeriod);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadChatHistory = React.useCallback(async () => {
        try {
            setLoading(true);
            let response;

            switch (selectedPeriod) {
                case 7:
                    response = await getChat7Period();
                    break;
                case 30:
                    response = await getChat30Period();
                    break;
                case 90:
                    response = await getChatByPeriod(90);
                    break;
                default:
                    response = await getChatByPeriod(selectedPeriod);
            }


            if (response && response.success && response.data) {
                setChatHistory(response.data);
            } else {
                setChatHistory([]);
            }
        } catch (error) {
            Alert.alert('오류', '채팅 기록을 불러오는데 실패했습니다.');
            setChatHistory([]);
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        loadChatHistory();
    }, [selectedPeriod, loadChatHistory]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredHistory(chatHistory);
        } else {
            const filtered = chatHistory.filter(chat =>
                chat.title && chat.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredHistory(filtered);
        }
    }, [searchText, chatHistory]);

    const handleChatPress = (chatId, title) => {
        navigation.navigate('ChatHistory', {
            chatId: chatId,
            chatTitle: title,
        });
    };

    const handleClose = () => {
        navigation.goBack();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const renderChatItem = (chat) => (
        <ChatItem
            key={chat.chat_id}
            onPress={() => handleChatPress(chat.chat_id, chat.title)}
        >
            <ChatTitleText numberOfLines={2}>
                {chat.title || `채팅방 ${chat.chat_id}`}
            </ChatTitleText>
            <ChatDateText>
                {formatDate(chat.created_at)}
            </ChatDateText>
        </ChatItem>
    );

    return (
        <SafeView>
            <ModalOverlay>
                <BackgroundChatRoom>
                    <BackgroundTop>
                        <BackgroundGradient />
                        <BackgroundTopText>콩콩봇</BackgroundTopText>
                        <BackgroundDate>
                            <BackgroundLineContainer>
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
                            </BackgroundLineContainer>
                            <BackgroundDateText>오늘</BackgroundDateText>
                            <BackgroundLineContainer>
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
                            </BackgroundLineContainer>
                        </BackgroundDate>
                    </BackgroundTop>
                    <BackgroundChatArea />
                    <BackgroundInputSection>
                        <BackgroundIconButton />
                        <BackgroundIconButton />
                        <BackgroundInputWrapper>
                            <BackgroundInputText>메시지를 입력해주세요</BackgroundInputText>
                        </BackgroundInputWrapper>
                    </BackgroundInputSection>
                </BackgroundChatRoom>
                <DarkOverlay />
                <SidePanel>
                    <HeaderContainer>
                        <CloseButton onPress={handleClose}>
                            <CloseIcon>
                                <CloseText>✕</CloseText>
                            </CloseIcon>
                        </CloseButton>
                        <HeaderTitle>콩콩봇's History</HeaderTitle>
                        <SearchContainer>
                            <SearchIcon>
                                <SearchIconHandle />
                            </SearchIcon>
                            <SearchInput
                                placeholder="검색"
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholderTextColor="#999"
                            />
                        </SearchContainer>
                    </HeaderContainer>

                    <PeriodSelector>
                        <PeriodButton
                            active={selectedPeriod === 7}
                            onPress={() => {
                                setSelectedPeriod(7);
                            }}
                        >
                            <PeriodButtonText active={selectedPeriod === 7}>7일</PeriodButtonText>
                        </PeriodButton>
                        <PeriodButton
                            active={selectedPeriod === 30}
                            onPress={() => {
                                setSelectedPeriod(30);
                            }}
                        >
                            <PeriodButtonText active={selectedPeriod === 30}>30일</PeriodButtonText>
                        </PeriodButton>
                        <PeriodButton
                            active={selectedPeriod === 90}
                            onPress={() => {
                                setSelectedPeriod(90);
                            }}
                        >
                            <PeriodButtonText active={selectedPeriod === 90}>90일</PeriodButtonText>
                        </PeriodButton>
                    </PeriodSelector>

                    <ContentContainer>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            <ChatSection>
                                {loading ? (
                                    <LoadingText>채팅 기록을 불러오는 중...</LoadingText>
                                ) : filteredHistory.length > 0 ? (
                                    <>
                                        <EmptyText style={{ fontSize: 14, marginBottom: 15, color: '#888' }}>
                                            총 {filteredHistory.length}개의 채팅방
                                        </EmptyText>
                                        {filteredHistory.map(chat => renderChatItem(chat))}
                                    </>
                                ) : (
                                    <EmptyText>
                                        {searchText ? '검색 결과가 없습니다.' : '채팅 기록이 없습니다.'}
                                    </EmptyText>
                                )}
                            </ChatSection>
                        </ScrollView>
                    </ContentContainer>

                    <BottomTabContainer>
                        <TabButton active={false} onPress={() => navigation.navigate('Main')}>
                            <TabIcon
                                active={false}
                                source={require('../../../assets/home.png')}
                            />
                        </TabButton>
                        <TabButton active={true}>
                            <TabIcon
                                active={true}
                                source={require('../../../assets/box.png')}
                            />
                        </TabButton>
                    </BottomTabContainer>
                </SidePanel>
                <TouchableArea />
            </ModalOverlay>
        </SafeView>
    );
};

export default ChatPeriodSelectScreen;
