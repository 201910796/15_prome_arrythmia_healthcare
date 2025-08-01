import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Colors from '../../styles/Colors';
import Back from '../../common/Back';
import { getAllChats } from '../../../models/chat';

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: #f8f9fa;
`;

const BackWrapper = styled.View`
    margin-top: 20px;
`;

const Header = styled.View`
    padding: 20px;
    background-color: white;
    border-bottom-width: 1px;
    border-bottom-color: #e9ecef;
    margin-top: -20px;
`;

const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #171717;
    text-align: center;
    margin-top: 10px;
`;

const DiagHistoryContainer = styled.View`
    flex: 1;
    padding: 20px;
`;

const DiagHistoryItem = styled(TouchableOpacity)`
    background-color: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #e9ecef;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 3.84px;
    elevation: 5;
`;

const DiagHistoryHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

const DiagDate = styled.Text`
    font-size: 14px;
    color: #6c757d;
    font-weight: 500;
`;

const DiagBadge = styled.View`
    background-color: ${props => props.isDiag ? Colors.primary : '#17a2b8'};
    border-radius: 12px;
    padding: 4px 8px;
`;

const DiagBadgeText = styled.Text`
    color: white;
    font-size: 12px;
    font-weight: 600;
`;

const DiagContent = styled.View`
    margin-bottom: 12px;
`;

const DiagQuestion = styled.Text`
    font-size: 16px;
    color: #171717;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 22px;
`;

const DiagAnswer = styled.Text`
    font-size: 14px;
    color: #495057;
    line-height: 20px;
`;

const DiagValues = styled.View`
    flex-direction: row;
    justify-content: space-between;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
`;

const DiagValueItem = styled.View`
    align-items: center;
`;

const DiagValueLabel = styled.Text`
    font-size: 12px;
    color: #6c757d;
    margin-bottom: 4px;
`;

const DiagValueText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.type === 'temp' ? '#dc3545' : '#28a745'};
`;

const EmptyContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 40px;
`;

const EmptyImage = styled(Image)`
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    opacity: 0.5;
`;

const EmptyText = styled.Text`
    font-size: 16px;
    color: #6c757d;
    text-align: center;
    line-height: 24px;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const LoadingText = styled.Text`
    font-size: 16px;
    color: #6c757d;
    margin-top: 16px;
`;

const DiagResultHistoryScreen = ({ navigation }) => {
    const [diagHistory, setDiagHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDiagHistory();
    }, []);

    const loadDiagHistory = async () => {
        try {
            setLoading(true);
            const response = await getAllChats();

            if (response && response.success && response.data) {
                const diagData = [];

                response.data.forEach(chatRoom => {
                    chatRoom.history.forEach(comment => {
                        if (comment.is_question && 
                            (comment.temp !== null && comment.temp !== 0) ||
                            (comment.ecg !== null && comment.ecg !== -1)) {

                            const answerIndex = chatRoom.history.findIndex(
                                c => c.content_id > comment.content_id && !c.is_question
                            );

                            const answer = answerIndex !== -1 ? chatRoom.history[answerIndex] : null;

                            diagData.push({
                                chat_id: chatRoom.chat_id,
                                question: comment,
                                answer: answer,
                                chatTitle: chatRoom.title,
                            });
                        }
                    });
                });

                diagData.sort((a, b) =>
                    new Date(b.question.created_at) - new Date(a.question.created_at)
                );

                setDiagHistory(diagData);
            }
        } catch (error) {
            console.error('진단 기록 로딩 에러:', error);
            Alert.alert('오류', '진단 기록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return '오늘';
        } else if (diffDays === 2) {
            return '어제';
        } else if (diffDays <= 7) {
            return `${diffDays - 1}일 전`;
        } else {
            return `${date.getMonth() + 1}.${date.getDate()}`;
        }
    };

    const getEcgText = (ecgValue) => {
        const ecgOptions = ['정상', '심방성 부정맥 의심', '심실성 부정맥 의심', '융합 박동', '알 수 없음'];
        return ecgValue >= 0 && ecgValue < ecgOptions.length ? ecgOptions[ecgValue] : '미기록';
    };

    const handleDiagPress = (item) => {
        navigation.navigate('ChatHistory', {
            chatId: item.chat_id,
            chatTitle: item.chatTitle,
        });
    };

    const renderDiagItem = ({ item }) => (
        <DiagHistoryItem onPress={() => handleDiagPress(item)}>
            <DiagHistoryHeader>
                <DiagDate>{formatDate(item.question.created_at)}</DiagDate>
                <DiagBadge isDiag={item.answer?.is_diag}>
                    <DiagBadgeText>
                        {item.answer?.is_diag ? '진단' : '상담'}
                    </DiagBadgeText>
                </DiagBadge>
            </DiagHistoryHeader>

            <DiagContent>
                <DiagQuestion numberOfLines={2}>
                    {item.question.content}
                </DiagQuestion>

                {item.answer && (
                    <DiagAnswer numberOfLines={3}>
                        {item.answer.content}
                    </DiagAnswer>
                )}
            </DiagContent>

            <DiagValues>
                <DiagValueItem>
                    <DiagValueLabel>체온</DiagValueLabel>
                    <DiagValueText type="temp">
                        {item.question.temp ? `${item.question.temp}°C` : '미기록'}
                    </DiagValueText>
                </DiagValueItem>

                <DiagValueItem>
                    <DiagValueLabel>심전도</DiagValueLabel>
                    <DiagValueText type="ecg">
                        {getEcgText(item.question.ecg)}
                    </DiagValueText>
                </DiagValueItem>
            </DiagValues>
        </DiagHistoryItem>
    );

    if (loading) {
        return (
            <Container>
                <Header>
                    <Back navigation={navigation} />
                    <HeaderTitle>검사 기록</HeaderTitle>
                </Header>
                <LoadingContainer>
                    <LoadingText>검사 기록을 불러오는 중...</LoadingText>
                </LoadingContainer>
            </Container>
        );
    }

    return (
        <Container>
            <BackWrapper>
                <Back navigation={navigation} />
            </BackWrapper>
            <Header>
                <HeaderTitle>검사 기록</HeaderTitle>
            </Header>

            <DiagHistoryContainer>
                {diagHistory.length > 0 ? (
                    <FlatList
                        data={diagHistory}
                        renderItem={renderDiagItem}
                        keyExtractor={(item) => `${item.chat_id}-${item.question.content_id}`}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <EmptyContainer>
                        <EmptyImage
                            source={require('../../../assets/diag.png')}
                            resizeMode="contain"
                        />
                        <EmptyText>
                            아직 검사 기록이 없습니다.{'\n'}
                            심전도 검사를 해보세요!
                        </EmptyText>
                    </EmptyContainer>
                )}
            </DiagHistoryContainer>
        </Container>
    );
};

export default DiagResultHistoryScreen;
