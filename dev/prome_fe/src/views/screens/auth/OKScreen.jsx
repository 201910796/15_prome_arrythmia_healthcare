import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Back from '../../common/Back';

const SafeView = styled(SafeAreaView)`
    flex: 1;
`;

const Container = styled.View`
    flex: 1;
    position: relative;
`;

const Gradient = styled(LinearGradient).attrs({
    colors: Colors.background.gradient,
    start: {x: 0, y: 0.5},
    end: {x: 0, y: 1},
    opacity: Colors.background.opacity,
})`
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

const Welcome = styled.View`
    padding-top: 30%;
    width: 80%;
    justify-content: center;
    align-self: center;
    z-index: 2;
`;

const WelcomeTitle = styled.Text`
    font-size: 30px;
    font-weight: 600;
    text-align: center;
    padding-bottom: 12px;
`;

const WelcomeDesc = styled.Text`
    font-size: 18px;
    text-align: center;
`;

const Kongs = styled.View`
    width: 100%;
    height: 60%;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
`;

const KongImage = styled(Image)`
    width: 80px;
    height: 80px;
    resize-mode: contain;
    position: absolute;
`;

const Button = styled(TouchableOpacity)`
    background-color: white;
    width: 83%;
    height: 6%;
    align-self: center;
    justify-content: center;
    border-radius: 8px;
    z-index: 2;
`;

const ButtonText = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: ${Colors.primary};
    text-align: center;
`;

const OKScreen = ({ navigation }) => {
    return (
        <SafeView>
            <Container>
                <Back navigation={navigation}/>
                <Gradient />
                <Welcome>
                    <WelcomeTitle>환영합니다 !</WelcomeTitle>
                    <WelcomeDesc style={{color: Colors.primary}}>이제부터 콩콩과 함께</WelcomeDesc>
                    <WelcomeDesc style={{color: Colors.primary}}>심전도 검사를 진행해요.</WelcomeDesc>
                </Welcome>
                <Kongs>
                    <KongImage
                        source={require('../../../assets/kongtext.png')}
                        style={{
                            top: '10%',
                            left: '40%',
                            transform: [{ rotate: '-10deg' }],
                            opacity: 0.6,
                        }}
                    />
                    <KongImage
                        source={require('../../../assets/kongtext2.png')}
                        style={{
                            top: '20%',
                            right: '30%',
                            transform: [{ rotate: '15deg' }],
                            opacity: 0.6,
                        }}
                    />
                    <KongImage
                        source={require('../../../assets/kongtext.png')}
                        style={{
                            top: '0%',
                            right: '2%',
                            transform: [{ rotate: '5deg' }],
                            opacity: 0.3,
                        }}
                    />
                    <KongImage
                        source={require('../../../assets/kongtext.png')}
                        style={{
                            bottom: '20%',
                            left: '20%',
                            transform: [{ rotate: '15deg' }],
                            opacity: 0.6,
                        }}
                    />
                </Kongs>
                <Button onPress={() => navigation.navigate('Register')}>
                    <ButtonText>다음</ButtonText>
                </Button>
            </Container>
        </SafeView>
    );
};

export default OKScreen;
