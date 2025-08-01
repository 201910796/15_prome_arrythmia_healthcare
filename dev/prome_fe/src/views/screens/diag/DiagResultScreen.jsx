import React, { useState } from 'react';
import { TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import styled from 'styled-components/native';
import Colors from '../../styles/Colors';

const Container = styled.View`
    flex: 1;
    background-color: ${Colors.background.bg};
    padding: 20px;
`;

const ImageUploadContainer = styled.View`
    width: 100%;
    height: 150px;
    background-color: #f5f5f5;
    border: 2px dashed #ddd;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    margin-bottom: 60px;
`;

const UploadedImage = styled(Image)`
    width: 100%;
    height: 100%;
    border-radius: 10px;
    resize-mode: contain;
`;

const CameraIcon = styled.View`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
`;

const CameraIconImage = styled(Image)`
    width: 30px;
    height: 30px;
    tint-color: #999;
`;

const UploadText = styled.Text`
    font-size: 16px;
    color: #666;
    text-align: center;
`;

const StepContainer = styled.View`
    margin-bottom: 20px;
`;

const StepButton = styled(TouchableOpacity)`
    background-color: white;
    border: 2px solid ${Colors.primary};
    border-radius: 25px;
    padding: 15px 20px;
    margin-bottom: 15px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const StepLeftContent = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

const StepText = styled.Text`
    font-size: 16px;
    color: #333;
    font-weight: 500;
`;

const StepNumber = styled.Text`
    font-weight: 600;
    margin-right: 10px;
`;

const StepValue = styled.Text`
    font-size: 14px;
    color: ${Colors.primary};
    font-weight: 600;
    margin-right: 10px;
`;

const SubmitButton = styled(TouchableOpacity)`
    background-color: #FF5757;
    border-radius: 8px;
    padding: 16px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;

const SubmitButtonText = styled.Text`
    color: white;
    font-size: 16px;
`;

const Bold = styled.Text`
    font-weight: 700;
`;

const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.View`
    width: 85%;
    background-color: white;
    border-radius: 15px;
    padding: 20px;
`;

const ModalTitle = styled.Text`
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
`;

const InputContainer = styled.View`
    margin-bottom: 20px;
`;

const InputLabel = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
`;

const Input = styled(TextInput)`
    border: 2px solid ${Colors.primary};
    border-radius: 8px;
    padding: 15px;
    font-size: 16px;
    background-color: #f9f9f9;
`;

const UnitText = styled.Text`
    font-size: 14px;
    color: #666;
    margin-top: 5px;
`;

const SelectionContainer = styled.View`
    margin-bottom: 20px;
`;

const OptionButton = styled(TouchableOpacity)`
    background-color: ${props => props.selected ? Colors.primary : 'white'};
    border: 2px solid ${Colors.primary};
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
`;

const OptionText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.selected ? 'white' : '#333'};
`;

const ModalButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
`;

const ModalButton = styled(TouchableOpacity)`
    flex: 1;
    padding: 15px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
`;

const CancelButton = styled(ModalButton)`
    background-color: #f5f5f5;
    border: 1px solid #ddd;
`;

const SaveButton = styled(ModalButton)`
    background-color: ${Colors.primary};
`;

const ModalButtonText = styled.Text`
    font-size: 16px;
    font-weight: 600;
`;

const CancelButtonText = styled(ModalButtonText)`
    color: #666;
`;

const SaveButtonText = styled(ModalButtonText)`
    color: white;
`;

const DiagResultScreen = ({ navigation, closeModal }) => {
    const [temperature, setTemperature] = useState('');
    const [ecgResult, setEcgResult] = useState('');

    const [tempModalVisible, setTempModalVisible] = useState(false);
    const [ecgModalVisible, setEcgModalVisible] = useState(false);

    const [tempInput, setTempInput] = useState('');
    const [selectedEcgOption, setSelectedEcgOption] = useState('');

    const ecgOptions = [
        '정상',
        '심방성 부정맥 의심',
        '심실성 부정맥 의심',
        '융합 박동',
        '알 수 없음',
    ];

    const getEcgImage = (ecgR) => {
        const imageMap = {
            '정상': require('../../../assets/diag_0.png'),
            '심방성 부정맥 의심': require('../../../assets/diag_1.png'),
            '심실성 부정맥 의심': require('../../../assets/diag_2.png'),
            '융합 박동': require('../../../assets/diag_3.png'),
            '알 수 없음': require('../../../assets/diag_4.png'),
        };
        return imageMap[ecgR];
    };

    // ECG 결과를 숫자로 변환하는 함수
    const getEcgCode = (ecgR) => {
        const ecgMap = {
            '정상': 0,
            '심방성 부정맥 의심': 1,
            '심실성 부정맥 의심': 2,
            '융합 박동': 3,
            '알 수 없음': 4,
        };
        return ecgMap[ecgR] || 4;
    };

    const openTempModal = () => {
        setTempInput(temperature);
        setTempModalVisible(true);
    };

    const openEcgModal = () => {
        setSelectedEcgOption(ecgResult);
        setEcgModalVisible(true);
    };

    const saveTempValue = () => {
        if (!tempInput.trim()) {
            Alert.alert('알림', '체온을 입력해주세요.');
            return;
        }

        setTemperature(tempInput);
        setTempModalVisible(false);
        setTempInput('');
    };

    const saveEcgValue = () => {
        if (!selectedEcgOption) {
            Alert.alert('알림', '심전도 검사 결과를 선택해주세요.');
            return;
        }

        setEcgResult(selectedEcgOption);
        setEcgModalVisible(false);
        setSelectedEcgOption('');
    };

    const cancelModal = () => {
        setTempModalVisible(false);
        setEcgModalVisible(false);
        setTempInput('');
        setSelectedEcgOption('');
    };

    const handleSubmit = () => {
        if (!temperature) {
            Alert.alert('알림', '체온을 입력해주세요.');
            return;
        }

        if (!ecgResult) {
            Alert.alert('알림', '심전도 검사 결과를 선택해주세요.');
            return;
        }

        const diagnosisData = {
            temp: parseFloat(temperature),
            ecg: getEcgCode(ecgResult),
            content: '내 검사 결과를 바탕으로 날 진단해줘',
        };

        navigation.navigate('Chat', { diagnosisData });

        console.log('검사결과 제출:', { temperature, ecgResult, diagnosisData });
        if (closeModal) {
            closeModal();
        }
    };

    return (
        <Container>
            <ImageUploadContainer>
                {ecgResult ? (
                    <UploadedImage source={getEcgImage(ecgResult)} />
                ) : (
                    <>
                        <CameraIcon>
                            <CameraIconImage source={require('../../../assets/camera.png')} />
                        </CameraIcon>
                        <UploadText>심전도 검사 결과를 선택하면{'\n'}해당 이미지가 표시됩니다</UploadText>
                    </>
                )}
            </ImageUploadContainer>

            <StepContainer>
                <StepButton onPress={openTempModal}>
                    <StepLeftContent>
                        <StepNumber>Step 1.</StepNumber>
                        {temperature ? (
                            <StepValue>{temperature}°C</StepValue>
                        ) : (
                            <StepText>체온 입력</StepText>
                        )}
                    </StepLeftContent>
                </StepButton>

                <StepButton onPress={openEcgModal}>
                    <StepLeftContent>
                        <StepNumber>Step 2.</StepNumber>
                        {ecgResult ? (
                            <StepValue>{ecgResult}</StepValue>
                        ) : (
                            <StepText>심전도 검사 결과 선택</StepText>
                        )}
                    </StepLeftContent>
                </StepButton>
            </StepContainer>

            <SubmitButton onPress={handleSubmit}>
                <SubmitButtonText>검사결과로 <Bold>콩콩봇</Bold>에게 물어보기</SubmitButtonText>
            </SubmitButton>

            <Modal
                visible={tempModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelModal}
            >
                <ModalOverlay>
                    <ModalContainer>
                        <ModalTitle>{temperature ? `${temperature}°C` : '체온 입력'}</ModalTitle>
                        <InputContainer>
                            <InputLabel>체온을 입력해주세요</InputLabel>
                            <Input
                                value={tempInput}
                                onChangeText={setTempInput}
                                placeholder="예: 36.5"
                                keyboardType="decimal-pad"
                                autoFocus={true}
                            />
                            <UnitText>단위: °C (섭씨)</UnitText>
                        </InputContainer>
                        <ModalButtonContainer>
                            <CancelButton onPress={cancelModal}>
                                <CancelButtonText>취소</CancelButtonText>
                            </CancelButton>
                            <SaveButton onPress={saveTempValue}>
                                <SaveButtonText>저장</SaveButtonText>
                            </SaveButton>
                        </ModalButtonContainer>
                    </ModalContainer>
                </ModalOverlay>
            </Modal>

            <Modal
                visible={ecgModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelModal}
            >
                <ModalOverlay>
                    <ModalContainer>
                        <ModalTitle>심전도 검사 결과 선택</ModalTitle>
                        <SelectionContainer>
                            <InputLabel>해당되는 검사 결과를 선택해주세요</InputLabel>
                            {ecgOptions.map((option, index) => (
                                <OptionButton
                                    key={index}
                                    selected={selectedEcgOption === option}
                                    onPress={() => setSelectedEcgOption(option)}
                                >
                                    <OptionText selected={selectedEcgOption === option}>
                                        {option}
                                    </OptionText>
                                </OptionButton>
                            ))}
                        </SelectionContainer>
                        <ModalButtonContainer>
                            <CancelButton onPress={cancelModal}>
                                <CancelButtonText>취소</CancelButtonText>
                            </CancelButton>
                            <SaveButton onPress={saveEcgValue}>
                                <SaveButtonText>저장</SaveButtonText>
                            </SaveButton>
                        </ModalButtonContainer>
                    </ModalContainer>
                </ModalOverlay>
            </Modal>
        </Container>
    );
};

export default DiagResultScreen;
