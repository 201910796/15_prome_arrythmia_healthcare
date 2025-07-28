import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import Colors from '../../styles/Colors';
import TabBar from '../../common/TabBar';
import Hospital from '../../components/etc/Hospital';
import History from '../../components/etc/History';

const SafeView = styled(SafeAreaView)`
    flex: 1;
`;

const Container = styled.View`
    flex: 1;
    background-color: white;
    width: 100%;
`;

const Top = styled(TouchableOpacity)`
    width: 100%;
    height: 16%;
    justify-content: center;
    align-self: center;
    background-color: ${Colors.primary};
`;

const TopText = styled.Text`
    position: absolute;
    color: white;
    font-size: 14px;
    z-index: 1;
`;

const ExpText = styled.Text`
    color: black;
    font-size: 18px;
    font-weight: 600;
    margin-top: 10%;
    margin-left: 5%;
`;

const QuestionWrapper = styled.View`
    flex-direction: row;
    width: 90%;
    height: 25%;
    align-self: center;
    justify-content: center;
    gap: 10px;
    margin-top: 2%;
`;

const QuestionLeft = styled(TouchableOpacity)`
    flex: 10;
    background-color: ${Colors.sky};
    justify-content: center;
    border-radius: 12px;
    border: 1px solid ${Colors.primary};
    overflow: hidden;
`;

const QuestionTextWrapper = styled.View`
    flex-direction: row;
    top: 10%;
    left: 10%;
`;

const QuestionLeftText = styled.Text`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    color: black;  
`;

const QuestionLeftTextSmile = styled(Image)`
    width: 16px;
    resize-mode: contain;
    margin-left: 5px;
    margin-top: 3px;
`;

const QuestionRightWrapper = styled.View`
    flex-direction: column;
    flex: 10;
    gap: 10px;
`;

const QuestionRight1 = styled(TouchableOpacity)`
    flex: 1;
    justify-content: center;
    border-radius: 12px;
    padding: 10px;
    border: 1px solid ${Colors.primary};
`;

const QuestionIcon = styled(Image)`
    position: absolute;
`;

const KongDot = styled(Image)`
    position: absolute;
    bottom: 5;
    right: -20;
`;

const KongVector = styled(Image)`
    position: absoulte;
    left: 65;
    bottom: -40;
    width: 40px;
    resize-mode: contain;
`;


const KongReverseWrapper = styled.View`
    border-radius: 24px;
    background-color: ${Colors.primary};
    width: 44px;
    height: 44px;
    margin-bottom: 13%;
    justify-content: center;
`;

const KongReverse = styled(Image)`
    width: 33px;
    height: 33px;
    resize-mode: contain;
    align-self: center;
`;

const QuestionRight2 = styled(TouchableOpacity)`
    flex: 1;
    justify-content: center;
    border-radius: 12px;
    padding: 10px;
    border: 1px solid ${Colors.primary};
`;

const QuestionRightText = styled.Text`
    position: absolute;
    font-size: 14px;
    color: black;
    bottom: 7;
    right: 10;
`;

const Red = styled.Text`
    color: ${Colors.primary};
`;

const Wrap = styled.View`
    border-radius: 12px;
    width: 90%;
    background-color: ${Colors.buttonWrapper};
    justify-content: center;
    align-self: center;
    margin-top: 5%;
    flex-direction: row;
    gap: 10px;
    padding: 5px;
`;

const Select = styled(TouchableOpacity)`
    border-radius: 12px;
    background-color: ${props => props.selected ? Colors.primary : 'white'};
    border: 1px solid ${props => props.selected ? Colors.primary : '#BCBCBC'};
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const SelectText = styled.Text`
    font-size: 14px;
    color: ${props => props.selected ? 'white' : '#BCBCBC'};
    text-align: center;
`;

const MainScreen = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('이전기록');

    const handleDiag = () => {
        Alert.alert(
            '심전도 진단',
            '심전도 검사를 받으러 갈까요?',
            [
                {
                    text: '아니오',
                    style: 'cancel',
                },
                {
                    text: '네',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            navigation.navigate('Diag');
                        } catch (error) {
                            console.error('로그아웃 실패:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeView>
            <Container>
                <Top onPress={() => handleDiag()}>
                    <TopText style={{  top: 10, left: 10 }}>이런 심전도 검사는 어때요?</TopText>
                    <TopText style={{  top: 80, right: 10 }}>심전도 검사 하러가기 !!</TopText>
                </Top>
                <ExpText>AI 챗봇에게 질문해보세요!</ExpText>
                <QuestionWrapper>
                    <QuestionLeft onPress={() => navigation.navigate('Chat')}>
                        <QuestionTextWrapper>
                            <QuestionLeftText>즉시 답해드려요</QuestionLeftText>
                            <QuestionLeftTextSmile source={require('../../../assets/smile.png')} alt="스마일" />
                        </QuestionTextWrapper>
                        <KongDot source={require('../../../assets/kong_dot.png')} alt="점선콩" />
                        <KongVector source={require('../../../assets/vector_left.png')} alt="콩벡터" />
                        <Red style={{ position: 'absolute', bottom: 4, left: 20, fontSize: 12 }}>with 콩콩봇</Red>
                    </QuestionLeft>
                    <QuestionRightWrapper>
                        <QuestionRight1 onPress={() => navigation.navigate('ChatMost') }>
                            <QuestionIcon source={require('../../../assets/question.png')} alt="물음표"/>
                            <QuestionIcon style={{ bottom: 10, left: 18 }} source={require('../../../assets/eclip.png')} alt="그림자"/>
                            <QuestionIcon style={{ width: 24, height: 24, left: 40, transform: [{ rotate: '45deg' }] }} source={require('../../../assets/question.png')} alt="물음표"/>
                            <QuestionIcon style={{ bottom: 20, left: 38 }} source={require('../../../assets/eclip.png')} alt="그림자"/>
                            <QuestionIcon style={{ width: 30, height: 30, top: 10, right: 10, transform: [{ rotate: '45deg' }], opacity: 0.64 }} source={require('../../../assets/question.png')} alt="물음표"/>
                            <QuestionIcon style={{ top: 42, right: 20, opacity: 0.64 }} source={require('../../../assets/eclip.png')} alt="그림자"/>
                            <QuestionRightText>가장 많이 한 질문</QuestionRightText>
                        </QuestionRight1>
                        <QuestionRight2>
                            <QuestionRightText><Red style={{ fontWeight: 600 }}>콩콩봇이란 ?</Red></QuestionRightText>
                            <KongReverseWrapper>
                                <KongReverse source={require('../../../assets/kong_reverse.png')} alt="콩리버스" />
                            </KongReverseWrapper>
                        </QuestionRight2>
                    </QuestionRightWrapper>
                </QuestionWrapper>
                <Wrap style={{ height: '7%' }}>
                    <Select
                        selected={selectedTab === '병원찾기'}
                        onPress={() => setSelectedTab(selectedTab === '병원찾기' ? '' : '병원찾기')}
                    >
                        <SelectText selected={selectedTab === '병원찾기'}>병원 찾기</SelectText>
                    </Select>
                    <Select
                        selected={selectedTab === '이전기록'}
                        onPress={() => setSelectedTab(selectedTab === '이전기록' ? '' : '이전기록')}
                    >
                        <SelectText selected={selectedTab === '이전기록'}>이전 기록들</SelectText>
                    </Select>
                </Wrap>
                <Wrap style={{ height: '23%' }}>
                    {selectedTab === '병원찾기' ? <Hospital navigation={navigation} /> : selectedTab === '이전기록' ? <History navigation={navigation} /> : null}
                </Wrap>
                <TabBar navigation={navigation} />
            </Container>
        </SafeView>
    );


};
export default MainScreen;
