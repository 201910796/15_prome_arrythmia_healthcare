import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';

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
    overflow: hidden;
`;

const FindHospitalGradient = styled(LinearGradient).attrs({
    colors: ['rgba(252, 70, 70, 0.23)', 'rgba(255, 255, 255, 1)'],
    start: {x: 1, y: 1},
    end: {x: 0, y: 0},
})`
    flex: 1;
    justify-content: center;
`;

const MapImg = styled(Image)`
    align-self: center;
`;

function Hospital({ navigation }) {
    const handleHospitalSearch = (hospitalType) => {
        navigation.navigate('Map', { hospitalType });
    };

    return (
        <FindHospitalWrapper>
            <FindHospital onPress={() => handleHospitalSearch('모든 병원')}>
                <FindHospitalGradient>
                    <MapImg source={require('../../../assets/total_map.png')} />
                </FindHospitalGradient>
            </FindHospital>
            <FindHospital onPress={() => handleHospitalSearch('심전도 병원')}>
                <FindHospitalGradient>
                    <MapImg source={require('../../../assets/heart_map.png')} />
                </FindHospitalGradient>
            </FindHospital>
        </FindHospitalWrapper>
    );
}

export default Hospital;
