import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

// Request permission to receive notifications
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

// Get the FCM token
export async function getToken() {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      // console.log('Your Firebase Cloud Messaging token is:', fcmToken);
      await AsyncStorage.setItem("deviceToken", fcmToken);
    } else {
      console.log('Failed to get FCM token');
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
  }
}

// Handle foreground messages
export function handleForegroundMessages() {
  return messaging().onMessage(async remoteMessage => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    Toast.show({
      type: "info",
      text1: remoteMessage.notification.title,
      text2: remoteMessage.notification.body,
      visibilityTime: 10000
    })
  });
}

// Handle background messages
export function handleBackgroundMessages() {
  return messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
}