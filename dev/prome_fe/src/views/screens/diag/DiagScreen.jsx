import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Keyboard, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Back from '../../common/Back';
import useFullScreen from '../../hooks/useFullScreen';
import useModal from '../../hooks/useModal';
import DiagResultScreen from './DiagResultScreen';
import Fontsizes from '../../styles/fontsizes';

const SafeView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Container = styled.View`
    flex: 1;
    background-color: ${Colors.background.bg};
`;

const Top = styled.View`
    height: ${props => props.keyboardVisible ? '10%' : '20%'};
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: ${Colors.background.bg};
    margin-bottom: -25px;
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

const TopText = styled.Text`
    font-size: ${Fontsizes.mm};
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
`;

const ChatScrollView = styled(ScrollView)`
    flex: 1;
    padding: 20px;
    padding-bottom: 100px;
`;

const KongContainer = styled.View`
    align-items: center;
    justify-content: center;
    margin: 5px 0 15px 0;
`;

const LargeKongIcon = styled.View`
    width: 80px;
    height: 80px;
    border-radius: 40px;
    background-color: #DEF3FB;
    border: 3px solid ${Colors.primary};
    justify-content: center;
    align-items: center;
`;

const LargeKongImage = styled(Image)`
    width: 60px;
    height: 60px;
    resize-mode: contain;
`;

const WelcomeMessage = styled.Text`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    color: #333;
    margin: 20px 0;
`;

const ChatMessage = styled.View`
    border: 2px solid ${Colors.primary};
    border-radius: 20px;
    background-color: white;
    padding: 12px 16px;
    margin: 8px 0;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
    align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
    width: 95%;
    align-self: center;
`;

const ChatText = styled.Text`
    font-size: 12px;
    color: #333;
    line-height: 20px;
`;

const Bold = styled.Text`
    font-weight: 600;
`;

const BottomSection = styled.View`
    position: absolute;
    bottom: -20;
    left: 0;
    right: 0;
    padding: 30px;
`;

const DiagButton = styled(TouchableOpacity)`
    background-color: #FF5757;
    border-radius: 8px;
    padding: 16px;
    align-items: center;
    justify-content: center;
`;

const DiagButtonText = styled.Text`
    color: white;
    font-size: 16px;
    font-weight: 600;
`;

const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(31, 31, 31, 0.3);
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.View`
    width: 90%;
    height: 80%;
    background-color: ${Colors.background.bg};
    border-radius: 15px;
    overflow: hidden;
`;

const ModalHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
`;

const ModalTitle = styled.Text`
    font-size: 18px;
    font-weight: 600;
    color: #333;
`;

const CloseButton = styled(TouchableOpacity)`
    padding: 5px;
`;

const CloseButtonText = styled.Text`
    font-size: 16px;
    color: #666;
`;

const ModalContent = styled.View`
    flex: 1;
`;

const DiagScreen = ({ navigation }) => {
    const { enableFullScreen, disableFullScreen } = useFullScreen();
    const { isModalVisible, openModal, closeModal } = useModal();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

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

    const [messages, setMessages] = useState([]);

    const [frequentQuestions] = useState([
        '양쪽 팔꿈치 안쪽에 전극패치를 부착해주세요',
        '오른쪽 복숭아 뼈 안쪽 아래에 부착해주세요',
        '양 팔을 다리 위에 올린 뒤 편하게 기다려 주세요',
        '측정 시작하기를 눌러주세요',
        '검사가 완료되면 결과를 확인해 주세요',
    ]);

    const scrollViewRef = useRef(null);

    const handleDiagButtonPress = () => {
        openModal();
    };

    return (
        <SafeView edges={[]}>
            <Container>
                <Top keyboardVisible={keyboardVisible}>
                    <Back navigation={navigation} />
                    <Gradient />
                    <TopText>콩콩봇</TopText>
                </Top>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ChatScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        ref={scrollViewRef}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <KongContainer>
                            <LargeKongIcon>
                                <LargeKongImage source={require('../../../assets/kong.png')} />
                            </LargeKongIcon>
                        </KongContainer>

                        <WelcomeMessage>심전도 검사를 도와드릴게요 !</WelcomeMessage>

                        {messages.map((message) => (
                            <ChatMessage key={message.id} isUser={message.isUser}>
                                <ChatText>{message.text}</ChatText>
                            </ChatMessage>
                        ))}

                        {messages.length === 0 && frequentQuestions.map((question, index) => (
                            <ChatMessage key={index} isUser={false}>
                                <ChatText>
                                    <Bold>Step {index + 1}.</Bold> {question}
                                </ChatText>
                            </ChatMessage>
                        ))}
                    </ChatScrollView>

                    <BottomSection>
                        <DiagButton onPress={handleDiagButtonPress}>
                            <DiagButtonText>검사결과 입력하기</DiagButtonText>
                        </DiagButton>
                    </BottomSection>
                </KeyboardAvoidingView>

                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <ModalOverlay>
                        <ModalContainer>
                            <ModalHeader>
                                <ModalTitle>검사결과 입력</ModalTitle>
                                <CloseButton onPress={closeModal}>
                                    <CloseButtonText>✕</CloseButtonText>
                                </CloseButton>
                            </ModalHeader>
                            <ModalContent>
                                <DiagResultScreen navigation={navigation} closeModal={closeModal} />
                            </ModalContent>
                        </ModalContainer>
                    </ModalOverlay>
                </Modal>
            </Container>
        </SafeView>
    );
};

export default DiagScreen;
