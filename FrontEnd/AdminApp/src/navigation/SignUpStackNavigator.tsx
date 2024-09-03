
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SignUpScreen from '../domains/auth/screens/signUpScreen/SignUpScreen'
import OtpScreen from '../domains/auth/screens/otpScreen/OtpScreen'


const SignUpStackNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
    // screenOptions={{ headerTransparent: true, }}
    >
      <Stack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Otp' component={OtpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default SignUpStackNavigator



