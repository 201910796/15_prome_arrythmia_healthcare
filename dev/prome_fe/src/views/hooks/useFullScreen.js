import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';

const useFullScreen = () => {
  useEffect(() => {
    console.log('useFullScreen: Platform.OS =', Platform.OS);
    if (Platform.OS === 'android') {
      console.log('useFullScreen: Setting up Android StatusBar');
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('dark-content');
      console.log('useFullScreen: Android StatusBar setup complete');
    }
  }, []);

  const enableFullScreen = () => {
    console.log('useFullScreen: enableFullScreen called');
    if (Platform.OS === 'android') {
      console.log('useFullScreen: Enabling fullscreen for Android');
      StatusBar.setHidden(false);
    }
  };

  const disableFullScreen = () => {
    console.log('useFullScreen: disableFullScreen called');
    if (Platform.OS === 'android') {
      StatusBar.setHidden(false);
    }
  };

  return {
    enableFullScreen,
    disableFullScreen,
  };
};

export default useFullScreen;
