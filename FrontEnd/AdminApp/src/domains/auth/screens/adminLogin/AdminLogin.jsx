import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { moderateScale } from 'react-native-size-matters';
import * as Yup from 'yup';
import CInput from '../../../../components/CInput';
import CButton from '../../../../components/CButton';
import { useAppDispatch } from '../../../../store/hooks';
import { setToken } from '../../slices/authSlice';
import { useAdminLoginMutation } from '../../api/adminLogin';
import LottieView from 'lottie-react-native';
import { textVariants } from '../../../../theme/StyleVarients';
import { setuserDetailsSlice } from '../../slices/userDetailsSlice';
import Toast from 'react-native-toast-message';

const SpacedInput = ({ children }) => (
  <View style={styles.spacedInput}>{children}</View>
);

const validationSchema = Yup.object().shape({
  emailId: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const AdminLogin = () => {

  const [formData, setFormData] = useState({
    emailId: '',
    password: '',
  });

  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({});

  const handleTextChange = (key, value) => {
    const updatedValue = typeof value === 'string' ? (value.trim() !== '' ? value : '') : '';
    setFormData((prevData) => ({
      ...prevData,
      [key]: updatedValue,
    }));
  };

  const [adminLogin, { isLoading, isSuccess, isError, error }] = useAdminLoginMutation();

  const handleSubmit = async () => {
    console.log('Admin LogIn Called ');
    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      const response = await adminLogin({
        emailId: formData.emailId,
        password: formData.password,
        deviceToken: 'eUHDR9BrSkm4eQocCE-aY6:APA91bHsKGAjgDQIfMefuZHwu0iLMQjmtgs7XGIO290LZKUuRzTMrhels1rNTg3pueqpiJj-JsEMfhV1amyjEz_VXHfuDQk5YCHZ9g4FZjxSeaAHI2zfrxaamdPs_ytaktNNZfoJs6Qw'

      }).unwrap();
      // console.log(response, '------------Admin Login Response-----------------');
      dispatch(setuserDetailsSlice(response.adminDetails));
      dispatch(setToken({
        token: response.token,
        isAuthenticated: true,
        role: response.adminDetails.role
      }));

    } catch (error) {
      if (error.inner) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${error.status},${error.message}`,
        });
        // Handle validation errors
        const formattedErrors = error.inner.reduce((acc, err) => {
          // console.log(err.message);
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      } else if (error.data && error.data.message) {
        // Handle backend errors
        setErrors({ password: error.data.message });
        console.log('API Error:', error.data.message);
      } else {
        setErrors({ password: error.error })
        console.log('Unexpected Error:', error);
      }
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center', }}
        />
      </View>
    )
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.form}>
          <SpacedInput>
            <CInput
              type="text"
              mode="flat"
              keyboardType="email-address"
              label="Email ID"
              onChangeText={(text) => handleTextChange('emailId', text)}
              value={formData.emailId}
            />
            {errors.emailId && <Text style={styles.errorText}>{errors.emailId}</Text>}
          </SpacedInput>

          <SpacedInput>
            <CInput
              type="password"
              mode="flat"
              keyboardType="default"
              label="Password"
              onChangeText={(text) => handleTextChange('password', text)}
              value={formData.password}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </SpacedInput>
        </View>
        <View style={styles.buttonContainer}>
          <CButton
            label="Log In"
            mode="contained"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminLogin;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    margin: moderateScale(20),
  },
  spacedInput: {
    marginBottom: moderateScale(20),
  },
  buttonContainer: {
    margin: moderateScale(20),
  },
  errorText: {
    color: 'red',
    marginTop: moderateScale(1),
  },
});
