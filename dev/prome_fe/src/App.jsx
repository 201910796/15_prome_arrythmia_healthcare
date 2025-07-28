import React from 'react';

import { SafeAreaProvider  } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { StatusBar } from 'react-native';
import Colors from './views/styles/Colors';

const App = () => {
  return (
    <SafeAreaProvider>
        <StatusBar
          backgroundColor={Colors.background.bg}
          barStyle="dark-content"
        />
        <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

