import React, { useState } from 'react';
import { TouchableOpacity, Image, Alert, PermissionsAndroid, Platform, Modal, TextInput } from 'react-native';
import styled from 'styled-components/native';
import Colors from '../../styles/Colors';
import { launchImageLibrary } from 'react-native-image-picker';

const Container = styled.View`
    flex: 1;
    background-color: ${Colors.background.bg};
    padding: 20px;
`;

const ImageUploadContainer = styled(TouchableOpacity)`
    width: 100%;
    height: 200px;
    background-color: #f5f5f5;
    border: 2px dashed #ddd;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
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
    background-color: #ddd;
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
    const [selectedImage, setSelectedImage] = useState(null);
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

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);

                return (
                    granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const showImagePicker = () => {
        Alert.alert(
            '이미지 선택',
            '심전도 분석 결과를 올려주세요!',
            [
                { text: '취소', style: 'cancel' },
                { text: '선택', onPress: selectFromGallery },
            ]
        );
    };

    const selectFromGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
            return;
        }

        const options = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1000,
            maxHeight: 1000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel || response.error) {
                return;
            }

            if (response.assets && response.assets[0]) {
                setSelectedImage(response.assets[0]);
            }
        });
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
        if (!selectedImage) {
            Alert.alert('알림', '심전도 이미지를 업로드해주세요.');
            return;
        }

        if (!temperature) {
            Alert.alert('알림', '체온을 입력해주세요.');
            return;
        }

        if (!ecgResult) {
            Alert.alert('알림', '심전도 검사 결과를 선택해주세요.');
            return;
        }

        navigation.navigate('Chat');

        console.log('검사결과 제출:', { selectedImage, temperature, ecgResult });
        Alert.alert(
            '제출 완료',
            '검사결과가 성공적으로 제출되었습니다.',
            [{ text: '확인', onPress: closeModal }]
        );
    };

    return (
        <Container>
            <ImageUploadContainer onPress={showImagePicker}>
                {selectedImage ? (
                    <UploadedImage source={{ uri: selectedImage.uri }} />
                ) : (
                    <>
                        <CameraIcon>
                            <CameraIconImage source={require('../../../assets/camera.png')} />
                        </CameraIcon>
                        <UploadText>파일 사진을 업로드해주세요</UploadText>
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
