import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CInput from '../../../../components/CInput'
import { moderateScale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
import CButton from '../../../../components/CButton'

const SignInScreen = () => {
  const navigation = useNavigation<any>()

  const OtpScreenNavigation = () => {
    navigation.navigate("Otp", { source: "SignIn" });
  }

  const [formData, setFormData] = useState({
    phoneNumber: '',
  });
  const handleTextChange = (key: string, value: string) => {
    const updatedValue = typeof value === 'string' ? (value.trim() !== '' ? value : '') : '';
    setFormData((prevData) => ({
      ...prevData,
      [key]: updatedValue,
    }));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      <View style={{ flex: 1, justifyContent: 'space-between', }}>
        <View style={{ margin: moderateScale(20) }}>
          <CInput
            type="text"
            mode="flat"
            keyboardType="phone-pad"
            label="Enter your phone number"
            onChangeText={(text) => handleTextChange('phoneNumber', text)}
            value={formData.phoneNumber}
          />
        </View>
        <View style={{ margin: moderateScale(20) }}>
          <CButton
            label='Get OTP'
            mode='contained'
            onPress={OtpScreenNavigation}
          />
        </View>


      </View>
    </ScrollView>
  )
}

export default SignInScreen

