import React from 'react';
import { Text, View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const CalendarScreen = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View>
                <Text>예약 일정 캘린더들</Text>
            </View>

            <Button icon="camera" mode="contained" onPress={() => {
                Alert.alert('버튼 누름!');
                navigation.navigate('Call'); }}
            />
        </SafeAreaView>
    );
};

export default CalendarScreen;
