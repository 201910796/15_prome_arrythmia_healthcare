import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppState } from '../../../App';
import Colors from '../../styles/Colors';

const SafeView = styled(SafeAreaView)`
    flex: 1;
`;

const Container = styled.View`
    flex: 1;
    position: relative;
`;

const NextImg = styled(Image)`
    position: absolute;
    width: 100%;
    height: 100%;
    resize-mode: cover;
    z-index: 0;
`;

const Welcome = styled.View`
    padding-top: 30%;
    width: 80%;
    justify-content: center;
    align-self: center;
    z-index: 2;
`;

const AnimatedTitle = styled(Animated.View)`
    padding-bottom: 12px;
`;

const WelcomeTitle = styled.Text`
    font-size: 30px;
    font-weight: 600;
    text-align: center;
    color: #333333;
    text-shadow-color: rgba(255, 255, 255, 0.8);
    text-shadow-offset: 1px 1px;
    text-shadow-radius: 2px;
`;

const AnimatedDesc = styled(Animated.View)`
`;

const WelcomeDesc = styled.Text`
    font-size: 18px;
    text-align: center;
    color: ${Colors.primary};
    text-shadow-color: rgba(255, 255, 255, 0.8);
    text-shadow-offset: 1px 1px;
    text-shadow-radius: 2px;
`;

const Spacer = styled.View`
    flex: 1;
`;

const AnimatedButtonContainer = styled(Animated.View)`
    width: 83%;
    height: 6%;
    align-self: center;
    z-index: 2;
    margin-bottom: 8%;
`;

const Button = styled(TouchableOpacity)`
    background-color: white;
    width: 100%;
    height: 100%;
    justify-content: center;
    border-radius: 8px;
`;

const ButtonText = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: ${Colors.primary};
    text-align: center;
`;

const Bold = styled.Text`
    font-weight: 600;
`;

const NextScreen = ({ navigation }) => {
    const titleOpacity = useState(new Animated.Value(0))[0];
    const descOpacity = useState(new Animated.Value(0))[0];
    const buttonOpacity = useState(new Animated.Value(0))[0];

    const { isAppReady } = useAppState();
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (isAppReady && !hasAnimated.current) {
            titleOpacity.setValue(0);
            descOpacity.setValue(0);
            buttonOpacity.setValue(0);

            const startAnimations = () => {
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    Animated.timing(descOpacity, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }).start();
                }, 800);

                setTimeout(() => {
                    Animated.timing(buttonOpacity, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }).start();
                }, 1600);
            };

            const timer = setTimeout(startAnimations, 500);
            hasAnimated.current = true;

            return () => clearTimeout(timer);
        }
    }, [isAppReady, titleOpacity, descOpacity, buttonOpacity]);

    useFocusEffect(
        React.useCallback(() => {
            if (hasAnimated.current) {
                titleOpacity.setValue(1);
                descOpacity.setValue(1);
                buttonOpacity.setValue(1);
            }
        }, [titleOpacity, descOpacity, buttonOpacity])
    );

    return (
        <SafeView>
            <Container>
                <NextImg source={require('../../../assets/prome_start_img.png')} />
                <Welcome>
                    <AnimatedTitle style={{ opacity: titleOpacity }}>
                        <WelcomeTitle>준비되셨나요?</WelcomeTitle>
                    </AnimatedTitle>
                    <AnimatedDesc style={{ opacity: descOpacity }}>
                        <WelcomeDesc>이제부터 <Bold>콩콩</Bold>과 함께</WelcomeDesc>
                        <WelcomeDesc>심전도 검사를 진행해요.</WelcomeDesc>
                    </AnimatedDesc>
                </Welcome>
                <Spacer />
                <AnimatedButtonContainer style={{ opacity: buttonOpacity }}>
                    <Button onPress={() => navigation.navigate('Login')}>
                        <ButtonText>다음</ButtonText>
                    </Button>
                </AnimatedButtonContainer>
            </Container>
        </SafeView>
    );
};

export default NextScreen;
