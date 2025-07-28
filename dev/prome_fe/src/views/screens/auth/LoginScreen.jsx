import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Colors from '../../styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import useFullScreen from '../../hooks/useFullScreen';
import { login } from '../../../models/auth';
import { useAuthStore, useUserStore } from '../../../store/store';

const SafeView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Container = styled.View`
    background-color: ${Colors.background.bg};
    flex: 1;
`;

const Top = styled.View`
    height: ${props => props.keyboardVisible ? '15%' : '25%'};
    justify-content: center;
    align-items: center;
    position: relative;
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

const Title = styled.Text`
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
`;

const Subtitle = styled.Text`
    font-size: 18px;
    color: #666;
    text-align: center;
`;

const FormContainer = styled(ScrollView)`
    flex: 1;
    padding: 20px;
    background-color: ${Colors.background.bg};
`;

const InputContainer = styled.View`
    margin-bottom: 20px;
`;

const InputLabel = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
`;

const Input = styled.TextInput`
    width: 100%;
    height: 50px;
    border: 1px solid ${Colors.primary};
    border-radius: 8px;
    padding: 0 16px;
    font-size: 16px;
    background-color: white;
    color: #333;
`;

const LoginButton = styled(TouchableOpacity)`
    background-color: ${Colors.primary};
    height: 50px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 20px;
    opacity: ${props => props.disabled ? 0.6 : 1};
`;

const LoginButtonText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: 600;
`;

const SignUpContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;

const SignUpText = styled.Text`
    font-size: 16px;
    color: #666;
`;

const SignUpLink = styled(TouchableOpacity)`
    margin-left: 8px;
`;

const SignUpLinkText = styled.Text`
    font-size: 16px;
    color: ${Colors.primary};
    font-weight: 600;
`;

const LoginScreen = ({ navigation }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { enableFullScreen, disableFullScreen } = useFullScreen();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useUserStore((state) => state.setUser);

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

    const handleLogin = async () => {
        if (!id.trim()) {
            Alert.alert('알림', 'ID를 입력해주세요.');
            return;
        }
        if (!password.trim()) {
            Alert.alert('알림', 'Password를 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            const result = await login(id.trim(), password.trim());
            console.log('로그인 결과:', result);
            if (result.success) {
                setAccessToken(result.accessToken);
                setUser(result.user);
                Alert.alert(
                    '로그인 성공!',
                    '환영합니다!',
                    [
                        {
                            text: '확인',
                            onPress: () => navigation.navigate('Main'),
                        },
                    ]
                );
            } else {
                Alert.alert('로그인 실패', result.message || '아이디 또는 비밀번호를 확인해주세요.');
            }

        } catch (error) {
            console.error('로그인 에러:', error);
            Alert.alert('로그인 실패', '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeView edges={[]}>
            <Container>
                <Top keyboardVisible={keyboardVisible}>
                    <Gradient />
                    <Title>로그인</Title>
                    {!keyboardVisible && (
                        <Subtitle>계정에 로그인하세요</Subtitle>
                    )}
                </Top>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <FormContainer
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 50 }}
                    >
                        <InputContainer>
                            <InputLabel>ID</InputLabel>
                            <Input
                                placeholder="아이디를 입력해주세요"
                                value={id}
                                onChangeText={setId}
                                returnKeyType="next"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </InputContainer>

                        <InputContainer>
                            <InputLabel>PASSWORD</InputLabel>
                            <Input
                                placeholder="비밀번호를 입력해주세요"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                returnKeyType="done"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </InputContainer>

                        <LoginButton onPress={handleLogin} disabled={loading}>
                            <LoginButtonText>
                                {loading ? '로그인 중...' : '로그인'}
                            </LoginButtonText>
                        </LoginButton>

                        <SignUpContainer>
                            <SignUpText>계정이 없으신가요?</SignUpText>
                            <SignUpLink onPress={() => navigation.navigate('OK')}>
                                <SignUpLinkText>회원가입</SignUpLinkText>
                            </SignUpLink>
                        </SignUpContainer>
                    </FormContainer>
                </KeyboardAvoidingView>
            </Container>
        </SafeView>
    );
};

export default LoginScreen;
