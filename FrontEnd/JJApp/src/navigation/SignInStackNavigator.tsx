import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'
import SignInScreen from '../domains/auth/screens/signInScreen/SignInScreen';
import OtpScreen from '../domains/auth/screens/otpScreen/OtpScreen';

const SignInStackNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
    // screenOptions={{ headerTransparent: true, }}
    >
      <Stack.Screen name='SignIn' component={SignInScreen} options={{ headerShown: false, }} />
      <Stack.Screen name='Otp' component={OtpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default SignInStackNavigator



