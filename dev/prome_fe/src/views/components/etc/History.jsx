import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';

const HistoryWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: center;
    padding: 3%;
    gap: 10px;
`;

const FindHistory = styled.View`
    flex: 1;
    width: 40%;
    
`;

const FindHistoryLeft = styled(TouchableOpacity)`
    flex: 1;
    border: 1px solid #BCBCBC;
    border-radius: 12px;
    background-color: white;
`;

const FindHistoryLeftText = styled.Text`
    color: #171717;
`;

const FindHistoryImagWrapper = styled.View`
    flex-direction: row;
    padding: 10px;
    margin-top: 15px;
`;

const FindHistoryLeftImg = styled(Image)`
    width: 40px;
    resize-mode: contain;
`;

const FindHistoryRight = styled(TouchableOpacity)`
    border-radius: 12px;
    border: 1px solid #BCBCBC;
    background-color: #E5E5E5;
    height: 30%;
    margin-top: 3px;
    margin-left: 3px;
    margin-right: 3px;
    justify-content: space-between;
    flex-direction: row;
    padding: 10px;
`;

const FindHistoryRightVector = styled(Image)`
    align-self: center;
`;

const FindHistoryRightText = styled.Text`
    font-size: 12px;
    color: #171717;
    text-align: right;
    align-self: center;
`;

function History({ navigation }) {
    // 각 기간별 네비게이션 핸들러
    const handlePeriodPress = (period) => {
        navigation.navigate('ChatPeriod', { selectedPeriod: period });
    };

    return (
        <HistoryWrapper>
            <FindHistory>
                <FindHistoryLeft onPress={() => navigation.navigate('DiagResult')}>
                    <FindHistoryLeftText style={{ fontSize: 18, paddingTop: 15, paddingLeft: 10, fontWeight: 600 }}>방금 한 검사 !</FindHistoryLeftText>
                    <FindHistoryImagWrapper>
                        <FindHistoryLeftImg source={require('../../../assets/diag.png')} alt="검사 확인" />
                        <FindHistoryLeftText style={{ fontSize: 14, paddingLeft: 10, paddingTop: 20 }}>확인해 보세요</FindHistoryLeftText>
                    </FindHistoryImagWrapper>
                </FindHistoryLeft>
            </FindHistory>
            <FindHistory>
                <FindHistoryRight onPress={() => handlePeriodPress(7)}>
                    <FindHistoryRightVector source={require('../../../assets/history_vector.png')} alt="기록벡터" />
                    <FindHistoryRightText>7일 이내</FindHistoryRightText>
                </FindHistoryRight>
                <FindHistoryRight onPress={() => handlePeriodPress(30)}>
                    <FindHistoryRightVector source={require('../../../assets/history_vector.png')} alt="기록벡터" />
                    <FindHistoryRightText>한달 이내</FindHistoryRightText>
                </FindHistoryRight>
                <FindHistoryRight onPress={() => handlePeriodPress(90)}>
                    <FindHistoryRightVector source={require('../../../assets/history_vector.png')} alt="기록벡터" />
                    <FindHistoryRightText>3개월 이내</FindHistoryRightText>
                </FindHistoryRight>
            </FindHistory>
        </HistoryWrapper>
    );
}

export default History;
