import React from 'react';
import { TouchableOpacity, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import Colors from '../styles/Colors';
import { logout } from '../../models/auth';

const TabBarWrapper = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: white;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-top-width: 1px;
    border-top-color: ${Colors.primary};
    padding-bottom: 20px;
    shadow-color: #000;
    shadow-offset: 0px -2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 5;
`;

const TabButton = styled(TouchableOpacity)`
    flex: 1;
    justify-content: ${props => props.isHome ? 'flex-start' : 'center'};
    align-items: center;
    padding: 8px;
    padding-top: ${props => props.isHome ? '0px' : '20px'};
`;

const TabIcon = styled.View`
    width: ${props => props.isHome ? '56px' : '40px'};
    height: ${props => props.isHome ? '56px' : '40px'};
    border-radius: ${props => props.isHome ? '56px' : '40px'};
    background-color: ${props => props.isActive ? Colors.primary : 'transparent'};
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
    border: 1px solid ${Colors.primary};
    margin-top: ${props => props.isHome ? '0px' : '50px'};
    background-color: white;
`;

const TabIconImage = styled(Image)`
    width: ${props => props.isHome ? '40px' : '24px'};
    height: ${props => props.isHome ? '40px' : '24px'};
    resize-mode: contain;
    tint-color: ${props => props.isActive ? 'white' : `${Colors.primary}`};
`;

const TabLabel = styled.Text`
    font-size: 16px;
    color: ${Colors.primary};
`;

const TabBar = ({ navigation, currentScreen = 'Home' }) => {
    const handleLogout = () => {
        Alert.alert(
            "로그아웃",
            "정말 로그아웃 하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "로그아웃",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout(); // auth.js의 logout 함수 호출
                            navigation.navigate('Login');
                        } catch (error) {
                            console.error('로그아웃 실패:', error);
                            // 로그아웃 실패해도 로그인 화면으로 이동 (토큰은 이미 클리어됨)
                            navigation.navigate('Login');
                        }
                    }
                }
            ]
        );
    };

    const tabs = [
        {
            name: 'Profile',
            label: '',
            icon: require('../../assets/profile.png'),
            action: 'logout', // 특별한 액션 표시
        },
        {
            name: 'Home',
            label: 'Home',
            icon: require('../../assets/home.png'),
            screen: 'Main',
        },
        {
            name: 'Menu',
            label: '',
            icon: require('../../assets/box.png'),
            screen: 'Main',
        },
    ];

    const handleTabPress = (tab) => {
        if (tab.action === 'logout') {
            handleLogout();
        } else if (tab.screen && tab.screen !== currentScreen) {
            navigation.navigate(tab.screen);
        }
    };

    return (
        <TabBarWrapper>
            {tabs.map((tab, index) => {
                const isHome = tab.name === 'Home';
                const isActive = currentScreen === tab.screen;
                return (
                    <TabButton
                        key={index}
                        onPress={() => handleTabPress(tab)}
                        isHome={isHome}
                    >
                        <TabIcon
                            isActive={isActive}
                            isHome={isHome}
                        >
                            <TabIconImage
                                source={tab.icon}
                                isActive={isActive}
                                isHome={isHome}
                            />
                        </TabIcon>
                        {tab.label && (
                            <TabLabel isActive={isActive}>
                                {tab.label}
                            </TabLabel>
                        )}
                    </TabButton>
                );
            })}
        </TabBarWrapper>
    );
};

export default TabBar;
