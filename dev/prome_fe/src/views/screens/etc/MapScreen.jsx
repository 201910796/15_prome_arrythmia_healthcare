import React, { useState, useEffect, useCallback } from 'react';
import { View, PermissionsAndroid, Platform, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import Geolocation from '@react-native-community/geolocation';
import Colors from '../../styles/Colors';
import Back from '../../common/Back';
import { totalMap, heartMap } from '../../../models/hospital';

const SafeView = styled(SafeAreaView)`
    flex: 1;
    background-color: white;
`;

const Container = styled.View`
    flex: 1;
    margin-top: -10px;
`;

const MapContainer = styled.View`
    flex: 1;
    margin: 10px;
    border-radius: 12px;
    overflow: hidden;
`;

const LocationButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: white;
    justify-content: center;
    align-items: center;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
`;

const LocationIcon = styled.Text`
    color: ${Colors.primary};
    font-size: 20px;
    font-weight: bold;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const LoadingText = styled.Text`
    font-size: 16px;
    color: ${Colors.primary};
`;

const BackWrapper = styled.View`
    top: 10px;
    left: 10px;
    z-index: 1000;
`;

// 모달 스타일들
const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const ModalContainer = styled.View`
    background-color: white;
    border-radius: 20px;
    padding: 25px;
    width: 90%;
    max-width: 400px;
    shadow-color: #000;
    shadow-offset: 0px 10px;
    shadow-opacity: 0.25;
    shadow-radius: 10px;
    elevation: 10;
`;

const ModalHeader = styled.View`
    border-bottom-width: 1px;
    border-bottom-color: #E5E5E5;
    padding-bottom: 15px;
    margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
`;

const ModalContent = styled.View`
    margin-bottom: 25px;
`;

const InfoRow = styled.View`
    flex-direction: row;
    margin-bottom: 12px;
    align-items: flex-start;
`;

const InfoLabel = styled.Text`
    font-size: 14px;
    font-weight: 600;
    color: ${Colors.primary};
    width: 60px;
    margin-right: 10px;
`;

const InfoText = styled.Text`
    font-size: 14px;
    color: #333;
    flex: 1;
    line-height: 20px;
`;

const ModalButtons = styled.View`
    flex-direction: row;
    justify-content: space-between;
    gap: 15px;
`;

const ModalButton = styled.TouchableOpacity`
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.primary ? Colors.primary : '#F5F5F5'};
`;

const ModalButtonText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.primary ? 'white' : '#666'};
`;

const MapScreen = ({ navigation, route }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapKey, setMapKey] = useState(0);
    const [hospitals, setHospitals] = useState([]);
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [hospitalLoading, setHospitalLoading] = useState(true);
    const [searchCenter, setSearchCenter] = useState(null);
    const [currentCamera, setCurrentCamera] = useState(null);
    
    // 모달 관련 state
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);

    // route params에서 병원 타입 확인
    const { hospitalType = '모든 병원' } = route?.params || {};

    // API에서 병원 데이터 가져오기
    const fetchHospitals = useCallback(async () => {
        try {
            setHospitalLoading(true);
            console.log(`병원 데이터 가져오기 시작 - 타입: ${hospitalType}`);
            
            let response;
            
            if (hospitalType === '심전도 병원') {
                console.log('heartMap() API 호출 중...');
                response = await heartMap();
            } else {
                console.log('totalMap() API 호출 중...');
                response = await totalMap();
            }

            console.log('API 응답 받음:', response ? '성공' : '실패');

            if (!response) {
                console.warn('API 응답이 null 또는 undefined입니다');
                setHospitals([]);
                return;
            }

            let hospitalArray = [];
            if (Array.isArray(response)) {
                hospitalArray = response;
            } else if (response.data && Array.isArray(response.data)) {
                hospitalArray = response.data;
            } else {
                console.warn('예상하지 못한 응답 형태:', response);
                setHospitals([]);
                return;
            }

            console.log(`원본 데이터: ${hospitalArray.length}개`);

            const hospitalData = hospitalArray.map((hospital, index) => {
                const lat = parseFloat(hospital.lat || hospital['좌표(Y)'] || hospital.latitude || 0);
                const long = parseFloat(hospital.long || hospital['좌표(X)'] || hospital.longitude || 0);
                
                return {
                    id: hospital.id || index + 1,
                    name: hospital.name || hospital['요양기관명'] || '이름 없음',
                    address: hospital.address || hospital['주소'] || '주소 없음',
                    telephone: hospital.phone || hospital['전화번호'] || '',
                    post: hospital.post || hospital['우편번호'] || '',
                    latitude: lat,
                    longitude: long,
                    department: hospital.department || '',
                    type: hospital.type || 'general'
                };
            }).filter(hospital => {
                const isValid = hospital.latitude !== 0 && 
                              hospital.longitude !== 0 && 
                              !isNaN(hospital.latitude) && 
                              !isNaN(hospital.longitude) &&
                              hospital.latitude >= -90 && hospital.latitude <= 90 &&
                              hospital.longitude >= -180 && hospital.longitude <= 180;
                
                return isValid;
            });

            setHospitals(hospitalData);
            console.log(`${hospitalData.length}개의 유효한 병원 데이터를 불러왔습니다.`);
            
        } catch (error) {
            console.error('병원 데이터 로딩 실패:', error);
            setHospitals([]);
        } finally {
            setHospitalLoading(false);
            console.log('병원 데이터 로딩 완료');
        }
    }, [hospitalType]);

    // 거리 계산 함수
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // 특정 위치 기준으로 가까운 병원 80개 찾기
    const findNearbyHospitals = useCallback((centerLat, centerLng) => {
        if (hospitals.length === 0) return [];

        console.log(`병원 검색 시작 - 중심: ${centerLat}, ${centerLng}`);
        
        const hospitalsWithDistance = hospitals
            .map(hospital => ({
                ...hospital,
                distance: calculateDistance(centerLat, centerLng, hospital.latitude, hospital.longitude),
                distanceFromUser: currentLocation ? 
                    calculateDistance(currentLocation.latitude, currentLocation.longitude, hospital.latitude, hospital.longitude) : 0
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 80);

        console.log(`가까운 병원 ${hospitalsWithDistance.length}개 찾음`);
        return hospitalsWithDistance;
    }, [hospitals, currentLocation]);

    // 현재 위치 설정시 초기 병원 검색
    useEffect(() => {
        if (currentLocation && hospitals.length > 0) {
            console.log('현재 위치 기준으로 초기 병원 검색');
            setSearchCenter(currentLocation);
            const nearby = findNearbyHospitals(currentLocation.latitude, currentLocation.longitude);
            setNearbyHospitals(nearby);
        }
    }, [currentLocation, hospitals, findNearbyHospitals]);

    // 병원 데이터 로드
    useEffect(() => {
        fetchHospitals();
    }, [fetchHospitals]);

    // 위치 권한 요청
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: '위치 권한 요청',
                        message: '병원 찾기를 위해 현재 위치가 필요합니다.',
                        buttonNeutral: '나중에',
                        buttonNegative: '거부',
                        buttonPositive: '허용',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const getCurrentLocation = () => {
        setIsLoading(true);

        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('위치 가져오기 성공:', latitude, longitude);
                setCurrentLocation({
                    latitude,
                    longitude,
                });
                setIsLoading(false);
            },
            (error) => {
                console.log('위치 가져오기 실패, 기본 위치로 설정:', error);
                setCurrentLocation({
                    latitude: 37.4894725,
                    longitude: 127.0082053,
                });
                setIsLoading(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    // 현재 위치 버튼 클릭 - 현재 카메라 중앙 기준으로 병원 검색
    const moveToCurrentLocation = () => {
        console.log('📍 아이콘 클릭 - 현재 카메라 중앙 기준 병원 검색');
        
        if (mapRef && mapRef.getCameraPosition) {
            mapRef.getCameraPosition().then((camera) => {
                const centerLat = camera.latitude;
                const centerLng = camera.longitude;
                
                console.log('현재 지도 중앙:', centerLat, centerLng);
                
                setSearchCenter({ latitude: centerLat, longitude: centerLng });
                const nearby = findNearbyHospitals(centerLat, centerLng);
                setNearbyHospitals(nearby);
                
                console.log(`지도 중앙 기준 병원 ${nearby.length}개 검색 완료`);
            }).catch((error) => {
                console.error('카메라 위치 가져오기 실패:', error);
                fallbackToCurrentLocation();
            });
        } else if (currentCamera) {
            console.log('currentCamera 사용:', currentCamera);
            const centerLat = currentCamera.latitude;
            const centerLng = currentCamera.longitude;
            
            setSearchCenter({ latitude: centerLat, longitude: centerLng });
            const nearby = findNearbyHospitals(centerLat, centerLng);
            setNearbyHospitals(nearby);
            
            console.log(`카메라 중앙 기준 병원 ${nearby.length}개 검색 완료`);
        } else {
            fallbackToCurrentLocation();
        }
    };

    // 폴백: 현재 위치 기준 검색
    const fallbackToCurrentLocation = () => {
        console.log('폴백: 현재 위치 기준 검색');
        if (currentLocation) {
            setSearchCenter(currentLocation);
            const nearby = findNearbyHospitals(currentLocation.latitude, currentLocation.longitude);
            setNearbyHospitals(nearby);
        }
    };

    // 지도 클릭 시 해당 위치 기준으로 병원 검색
    const handleMapTap = (event) => {
        const { latitude, longitude } = event;
        console.log('지도 클릭:', latitude, longitude);
        
        setSearchCenter({ latitude, longitude });
        const nearby = findNearbyHospitals(latitude, longitude);
        setNearbyHospitals(nearby);
    };

    // 병원 마커 클릭 시 모달 열기
    const handleHospitalMarkerTap = (hospital) => {
        console.log(`${hospital.name} 클릭됨`);
        setSelectedHospital(hospital);
        setModalVisible(true);
    };

    // 전화 걸기 함수
    const makePhoneCall = (phoneNumber) => {
        if (!phoneNumber) {
            console.log('전화번호가 없습니다.');
            return;
        }
        
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (cleanNumber.length === 0) {
            console.log('유효하지 않은 전화번호입니다.');
            return;
        }

        console.log(`전화 걸기: ${cleanNumber}`);
        setModalVisible(false);
    };

    // 모달 닫기
    const closeModal = () => {
        setModalVisible(false);
        setSelectedHospital(null);
    };

    useEffect(() => {
        const initLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                getCurrentLocation();
            } else {
                console.log('위치 권한 없음, 기본 위치로 설정');
                setCurrentLocation({
                    latitude: 37.4894725,
                    longitude: 127.0082053,
                });
                setIsLoading(false);
            }
        };

        initLocation();
    }, []);

    if (isLoading || hospitalLoading || !currentLocation) {
        return (
            <SafeView>
                <LoadingContainer>
                    <LoadingText>
                        {hospitalLoading ? 
                            `${hospitalType} 데이터를 불러오는 중...` : 
                            '지도를 불러오는 중...'
                        }
                    </LoadingText>
                </LoadingContainer>
            </SafeView>
        );
    }

    return (
        <SafeView>
            <BackWrapper>
                <Back navigation={navigation} />
            </BackWrapper>
            <Container>
                <MapContainer>
                    <NaverMapView
                        key={mapKey}
                        ref={setMapRef}
                        style={{ flex: 1 }}
                        initialCamera={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            zoom: 15,
                        }}
                        isShowLocationButton={false}
                        onInitialized={() => {
                            console.log('지도 준비 완료');
                        }}
                        onCameraChanged={(event) => {
                            const { latitude, longitude, zoom } = event;
                            const cameraInfo = { latitude, longitude, zoom };
                            setCurrentCamera(cameraInfo);
                        }}
                        onTap={handleMapTap}
                        onError={(e) => {
                            console.error('네이버 지도 error:', e);
                        }}
                    >
                        {/* 현재 위치 마커 */}
                        <NaverMapMarkerOverlay
                            latitude={currentLocation.latitude}
                            longitude={currentLocation.longitude}
                            anchor={{ x: 0.5, y: 1 }}
                            onTap={() => {
                                console.log('현재 위치 마커 클릭됨');
                            }}
                        />

                        {/* 검색 중심점 마커 (현재 위치와 다를 때만 표시) */}
                        {searchCenter && 
                         (searchCenter.latitude !== currentLocation.latitude || 
                          searchCenter.longitude !== currentLocation.longitude) && (
                            <NaverMapMarkerOverlay
                                latitude={searchCenter.latitude}
                                longitude={searchCenter.longitude}
                                anchor={{ x: 0.5, y: 1 }}
                                onTap={() => {
                                    console.log('검색 중심점 마커 클릭됨');
                                }}
                            >
                                <View style={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: '#FF6B35',
                                    borderRadius: 8,
                                    borderWidth: 2,
                                    borderColor: 'white',
                                }}>
                                </View>
                            </NaverMapMarkerOverlay>
                        )}

                        {/* 병원 마커들 */}
                        {nearbyHospitals.map((hospital) => (
                            <NaverMapMarkerOverlay
                                key={hospital.id}
                                latitude={hospital.latitude}
                                longitude={hospital.longitude}
                                anchor={{ x: 0.5, y: 0.5 }}
                                width={16}
                                height={16}
                                onTap={() => handleHospitalMarkerTap(hospital)}
                            >
                                <View style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: hospitalType === '심전도 병원' ? '#FF4444' : '#FF6B6B',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 1,
                                    elevation: 2,
                                }}>
                                </View>
                            </NaverMapMarkerOverlay>
                        ))}
                    </NaverMapView>

                    <LocationButton onPress={moveToCurrentLocation}>
                        <LocationIcon>📍</LocationIcon>
                    </LocationButton>
                </MapContainer>
            </Container>

            {/* 병원 정보 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <ModalOverlay>
                    <ModalContainer>
                        <ModalHeader>
                            <ModalTitle>{selectedHospital?.name || '병원 정보'}</ModalTitle>
                        </ModalHeader>
                        
                        <ModalContent>
                            <InfoRow>
                                <InfoLabel>주소</InfoLabel>
                                <InfoText>{selectedHospital?.address || '정보 없음'}</InfoText>
                            </InfoRow>
                            
                            <InfoRow>
                                <InfoLabel>전화</InfoLabel>
                                <InfoText>{selectedHospital?.telephone || '정보 없음'}</InfoText>
                            </InfoRow>
                            
                            <InfoRow>
                                <InfoLabel>거리</InfoLabel>
                                <InfoText>
                                    {selectedHospital?.distanceFromUser ? 
                                        `${selectedHospital.distanceFromUser.toFixed(1)}km` : 
                                        '알 수 없음'
                                    }
                                </InfoText>
                            </InfoRow>
                            
                            {selectedHospital?.post && (
                                <InfoRow>
                                    <InfoLabel>우편번호</InfoLabel>
                                    <InfoText>{selectedHospital.post}</InfoText>
                                </InfoRow>
                            )}

                            {selectedHospital?.department && (
                                <InfoRow>
                                    <InfoLabel>진료과목</InfoLabel>
                                    <InfoText>{selectedHospital.department}</InfoText>
                                </InfoRow>
                            )}
                        </ModalContent>
                        
                        <ModalButtons>
                            <ModalButton onPress={closeModal}>
                                <ModalButtonText>닫기</ModalButtonText>
                            </ModalButton>
                            
                            {selectedHospital?.telephone && (
                                <ModalButton 
                                    primary 
                                    onPress={() => makePhoneCall(selectedHospital.telephone)}
                                >
                                    <ModalButtonText primary>전화하기</ModalButtonText>
                                </ModalButton>
                            )}
                        </ModalButtons>
                    </ModalContainer>
                </ModalOverlay>
            </Modal>
        </SafeView>
    );
};

export default MapScreen;
