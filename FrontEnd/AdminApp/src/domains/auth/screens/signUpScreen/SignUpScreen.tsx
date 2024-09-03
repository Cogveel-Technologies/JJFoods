import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { moderateScale, } from 'react-native-size-matters';
import CInput from '../../../../components/CInput';
import { useNavigation } from '@react-navigation/native';
import CButton from '../../../../components/CButton';

const SpacedInput = ({ children }: any) => (
  <View style={{ marginBottom: moderateScale(20) }}>{children}</View>
);

const SignUpScreen = () => {
  const navigation = useNavigation<any>()
  const OtpScreenNavigation = () => {
    navigation.navigate("Otp", { source: "SignUp" });
  }

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
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
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ margin: moderateScale(20) }}>
          <SpacedInput>
            <CInput
              type="text"
              mode="flat"
              keyboardType="default"
              label="Name"
              onChangeText={(text) => handleTextChange('name', text)}
              value={formData.name}
            />
          </SpacedInput>
          {/* <SpacedInput>
            <CInput
              type="text"
              mode="flat"
              keyboardType="default"
              label="Address"
              onChangeText={(text) => handleTextChange('address', text)}
              value={formData.address}
            />
          </SpacedInput> */}
          <SpacedInput>
            <CInput
              type="text"
              mode="flat"
              keyboardType="email-address"
              label="Email ID"
              onChangeText={(text) => handleTextChange('email', text)}
              value={formData.email}
            />
          </SpacedInput>
          <SpacedInput>
            <CInput
              mode="flat"
              label="Phone Number"
              type="text"
              keyboardType="number-pad"
              onChangeText={(text) => handleTextChange('phoneNumber', text)}
              value={formData.phoneNumber}
            />
          </SpacedInput>
        </View>
        <View style={{ margin: moderateScale(20), }}>
          <CButton
            label="Sign Up"
            mode="contained"
            onPress={OtpScreenNavigation}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
