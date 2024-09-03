import * as React from 'react';
import { useEffect, useState } from 'react';
import Navigation from './src/navigation/Index';
import Toast from 'react-native-toast-message';
import { getToken, handleBackgroundMessages, handleForegroundMessages, requestUserPermission } from './messaging';

import messaging from '@react-native-firebase/messaging';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import { Background, Logos } from './src/theme/ConfigrationStyle';
import { Colors } from './src/theme/Colors';

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    requestUserPermission();
    getToken();
    const unsubscribeForeground = handleForegroundMessages();
    handleBackgroundMessages();

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      // Handle other FCM messages if needed
    });

    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000); // 2000 milliseconds = 2 seconds

    return () => {
      unsubscribeForeground(); // Clean up foreground message listener
      unsubscribeOnMessage(); // Clean up onMessage listener
      clearTimeout(splashTimer); // Clear the timer on unmount
    };
  }, []);

  if (isSplashVisible) {
    return (
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={styles.loadingContainer}
      >
        <Image
          source={Logos.jjLogo}
          style={{ height: 275, width: 228 }}
        />
      </ImageBackground>
    );
  }

  return (
    <>
      <Navigation />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});
