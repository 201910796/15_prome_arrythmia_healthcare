import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../views/screens/auth/LoginScreen';
import RegisterScreen from '../views/screens/auth/RegisterScreen';
import OKScreen from '../views/screens/auth/OKScreen';

import ChatRoomScreen from '../views/screens/chat/ChatRoomScreen';
import ChatPeriodSelectScreen from '../views/screens/chat/ChatPeriodSelectScreen';
import ChatMostScreen from '../views/screens/chat/ChatMostScreen';
import ChatRoomHistoryScreen from '../views/screens/chat/ChatRoomHistoryScreen';

import DiagScreen from '../views/screens/diag/DiagScreen';
import DiagResultHistoryScreen from '../views/screens/diag/DiagResultHistoryScreen';

import DescriptionScreen from '../views/screens/etc/DescriptionScreen';
import MainScreen from '../views/screens/etc/MainScreen';
import MapScreen from '../views/screens/etc/MapScreen';

import CalendarScreen from '../views/screens/calendar/CalendarScreen';
import CallScreen from '../views/screens/hospital/CallScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login"
                component={LoginScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Register"
                component={RegisterScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="OK"
                component={OKScreen}
                options={{headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Chat"
                component={ChatRoomScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="ChatPeriod"
                component={ChatPeriodSelectScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="ChatMost"
                component={ChatMostScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="ChatHistory"
                component={ChatRoomHistoryScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Diag"
                component={DiagScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="DiagResult"
                component={DiagResultHistoryScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Description"
                component={DescriptionScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Main"
                component={MainScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Map"
                component={MapScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Calendar"
                component={CalendarScreen}
                options={{ headerShown: false, animation: 'none'}}
            />
            <Stack.Screen name="Call"
                component={CallScreen}
                options={{ headerShown: false, animation: 'none' }}
            />
        </Stack.Navigator>
    );
};

export default StackNavigator;
