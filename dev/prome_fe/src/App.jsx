import React, { useState, createContext, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { StatusBar, Animated } from 'react-native';
import Colors from './views/styles/Colors';
import StartScreen from './views/screens/auth/StartScreen';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [mainFadeAnim] = useState(new Animated.Value(0));

  const handleSplashFinish = () => {
    Animated.timing(mainFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSplash(false);
      setTimeout(() => {
        setIsAppReady(true);
      }, 100);
    });
  };

  return (
    <AppStateContext.Provider value={{ isAppReady }}>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor={Colors.background.bg}
          barStyle="dark-content"
        />

        <Animated.View
          style={{
            flex: 1,
            opacity: showSplash ? mainFadeAnim : 1,
            backgroundColor: Colors.background.bg,
          }}
        >
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </Animated.View>

        {showSplash && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: fadeAnim,
              backgroundColor: Colors.background.bg,
            }}
          >
            <StartScreen onFinish={handleSplashFinish} />
          </Animated.View>
        )}
      </SafeAreaProvider>
    </AppStateContext.Provider>
  );
};

export default App;
