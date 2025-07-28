import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import Colors from '../../styles/Colors';

const FindHospitalWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    padding: 3%;
    gap: 10px;
`;

const FindHospital = styled(TouchableOpacity)`
    flex: 1;
    width: 40%;
    border: 1px solid #BCBCBC;
    border-radius: 12px;
    justify-content: center;
    background-color: white;
`;

const FindHospitalText = styled.Text`
    font-size: 14px;
    color: ${Colors.primary};
    text-align: center;
`;

function Hospital({ navigation }) {
    const handleHospitalSearch = (hospitalType) => {
        navigation.navigate('Map', { hospitalType });
    };

    return (
        <FindHospitalWrapper>
            <FindHospital onPress={() => handleHospitalSearch('모든 병원')}>
                <FindHospitalText>모든 병원 찾기</FindHospitalText>
            </FindHospital>
            <FindHospital onPress={() => handleHospitalSearch('심전도 병원')}>
                <FindHospitalText>심전도 병원 찾기</FindHospitalText>
            </FindHospital>
        </FindHospitalWrapper>
    );
}

export default Hospital;
