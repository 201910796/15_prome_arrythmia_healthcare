import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Colors from '../../styles/Colors';
import Back from '../../common/Back';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import useFullScreen from '../../hooks/useFullScreen';
import { register } from '../../../models/auth';

const SafeView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Container = styled.View`
    background-color: ${Colors.background.bg};
    flex: 1;
`;

const Top = styled.View`
    height: ${props => props.keyboardVisible ? '10%' : '15%'};
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
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
`;

const Subtitle = styled.Text`
    font-size: 16px;
    color: #666;
    text-align: center;
`;

const FormContainer = styled(ScrollView)`
    flex: 1;
    padding: 20px;
    background-color: ${Colors.background.bg};
`;

const StepContainer = styled.View`
    margin-bottom: 24px;
    padding-top: 6px;
`;

const StepHeader = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
`;

const StepNumber = styled.View`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${Colors.primary};
    justify-content: center;
    align-items: center;
    margin-right: 8px;
`;

const StepNumberText = styled.Text`
    color: white;
    font-size: 14px;
    font-weight: 600;
`;

const StepTitle = styled.Text`
    font-size: 16px;
    font-weight: 500;
    color: #333;
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

const GenderContainer = styled.View`
    flex-direction: row;
    gap: 12px;
`;

const GenderButton = styled(TouchableOpacity)`
    flex: 1;
    height: 50px;
    border: 1px solid ${Colors.primary};
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#DEF3FB' : 'white'};
`;

const GenderText = styled.Text`
    font-size: 16px;
    font-weight: 500;
    color: black;
`;

const SubmitButton = styled(TouchableOpacity)`
    background-color: ${Colors.primary};
    height: 50px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    margin: 20px;
    margin-top: 40px;
    margin-bottom: ${Platform.OS === 'android' ? '40px' : '20px'};
`;

const SubmitButtonText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: 600;
`;

const Bold = styled.Text`
    font-weight: 700;
`;

const RegisterScreen = ({ navigation }) => {
    const [selectedGender, setSelectedGender] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { enableFullScreen, disableFullScreen } = useFullScreen();

    // 랜덤 숫자 생성 함수 (6자리)
    const generateRandomNumber = () => {
        return Math.floor(100000 + Math.random() * 900000); // 100000~999999
    };

    useEffect(() => {
        // 풀스크린 활성화
        enableFullScreen();

        // 키보드 이벤트 리스너
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

    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert('알림', '이름을 입력해주세요.');
            return;
        }
        if (!selectedGender) {
            Alert.alert('알림', '성별을 선택해주세요.');
            return;
        }
        if (!age.trim()) {
            Alert.alert('알림', '나이를 입력해주세요.');
            return;
        }
        if (!phone.trim()) {
            Alert.alert('알림', '전화번호를 입력해주세요.');
            return;
        }

        const randomNum = generateRandomNumber();
        const autoId = `test${randomNum}`;
        const autoPassword = `test${randomNum}`;

        const genderValue = selectedGender === '남자' ? 'male' : 'female';

        setLoading(true);

        try {
            const result = await register(autoId, autoPassword, name.trim(), parseInt(age), genderValue, phone.trim());
            console.log('회원가입 성공:', result);
            Alert.alert(
                '회원가입 완료!',
                `ID: ${autoId}\nPassword: ${autoPassword}\n\n위 정보로 로그인하세요!`,
                [
                    {
                        text: '확인',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );

        } catch (error) {
            console.error('회원가입 에러:', error);
            Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeView edges={[]}>
            <Container>
                <Top keyboardVisible={keyboardVisible}>
                    <Back navigation={navigation} />
                    <Gradient />
                    <Title>회원가입</Title>
                    {!keyboardVisible && (
                        <Subtitle>회원가입으로 필요한 정보를 얻을 수 있어요 !</Subtitle>
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
                        <StepContainer>
                            <StepHeader>
                                <StepNumber>
                                    <StepNumberText>1</StepNumberText>
                                </StepNumber>
                                <StepTitle><Bold>성함</Bold>을 알려주세요</StepTitle>
                            </StepHeader>
                            <Input
                                placeholder="이름을 입력해주세요"
                                value={name}
                                onChangeText={setName}
                                returnKeyType="next"
                            />
                        </StepContainer>

                        <StepContainer>
                            <StepHeader>
                                <StepNumber>
                                    <StepNumberText>2</StepNumberText>
                                </StepNumber>
                                <StepTitle><Bold>성별</Bold>을 알려주세요</StepTitle>
                            </StepHeader>
                            <GenderContainer>
                                <GenderButton
                                    selected={selectedGender === '남자'}
                                    onPress={() => setSelectedGender('남자')}
                                >
                                    <GenderText selected={selectedGender === '남자'}>
                                        남자
                                    </GenderText>
                                </GenderButton>
                                <GenderButton
                                    selected={selectedGender === '여자'}
                                    onPress={() => setSelectedGender('여자')}
                                >
                                    <GenderText selected={selectedGender === '여자'}>
                                        여자
                                    </GenderText>
                                </GenderButton>
                            </GenderContainer>
                        </StepContainer>

                        <StepContainer>
                            <StepHeader>
                                <StepNumber>
                                    <StepNumberText>3</StepNumberText>
                                </StepNumber>
                                <StepTitle><Bold>나이</Bold>를 알려주세요</StepTitle>
                            </StepHeader>
                            <Input
                                placeholder="나이를 입력해주세요"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                returnKeyType="next"
                            />
                        </StepContainer>

                        <StepContainer>
                            <StepHeader>
                                <StepNumber>
                                    <StepNumberText>4</StepNumberText>
                                </StepNumber>
                                <StepTitle><Bold>전화번호</Bold>를 알려주세요</StepTitle>
                            </StepHeader>
                            <Input
                                placeholder="전화번호를 입력해주세요"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                returnKeyType="done"
                            />
                        </StepContainer>

                        <SubmitButton onPress={handleRegister} disabled={loading}>
                            <SubmitButtonText>
                                {loading ? '처리중...' : '다음'}
                            </SubmitButtonText>
                        </SubmitButton>
                    </FormContainer>
                </KeyboardAvoidingView>
            </Container>
        </SafeView>
    );
};

export default RegisterScreen;
