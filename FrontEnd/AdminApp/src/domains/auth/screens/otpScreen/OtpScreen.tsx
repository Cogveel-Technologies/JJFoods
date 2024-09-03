import React, { } from 'react';
import { View, ScrollView } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CButton from '../../../../components/CButton';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '../../../../theme/Colors';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setToken } from '../../slices/authSlice';

// import { useAppDispatch } from '../../../../store/hooks';




const OtpScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute();
  const { source }: any = route.params || {};

  const dispatch = useDispatch()

  const GoBack = () => {
    navigation.navigate(source === "SignUp" ? "SignUp" : "SignIn");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', }}>
        <View style={{ paddingHorizontal: moderateScale(18), marginTop: 5 }}>
          <Text style={{ fontSize: moderateScale(17), fontFamily: 'Montserrat Medium', color: Colors.gray, paddingBottom: moderateScale(17) }}>Enter OTP</Text>
          <Text style={{ fontSize: moderateScale(15), fontFamily: 'Montserrat Medium', color: Colors.gray, lineHeight: 27, paddingBottom: moderateScale(12), fontWeight: 'normal' }}>We have sent a verification code to +91-0123456789</Text>
        </View>
        <View style={{ marginVertical: 10 }}>
          <OtpInput
            numberOfDigits={5}
            focusColor={Colors.primary}
            focusStickBlinkingDuration={500}
            onTextChange={(text) => console.log(text)}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              containerStyle: {},
              inputsContainerStyle: { paddingHorizontal: moderateScale(20) },
              pinCodeContainerStyle: { borderColor: Colors.ternary, width: scale(40), height: verticalScale(39), marginBottom: 0 },
              pinCodeTextStyle: { color: Colors.primary }
            }}
          />
        </View>
        <View style={{ paddingStart: moderateScale(20), paddingEnd: moderateScale(8), flexDirection: 'row', justifyContent: 'space-between', }}>
          <View>
            <Text style={{ fontSize: moderateScale(13.5), fontFamily: 'Montserrat Medium', color: Colors.gray, paddingTop: moderateScale(8) }}>Didn't get the OTP?</Text>
          </View>
          <View style={{}}>
            <CButton label='Resent it(56s)' mode='text' />
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', paddingEnd: moderateScale(14), margin: 0 }}>
          <CButton
            label='Go Back'
            mode='text'
            style={{ padding: moderateScale(0) }}
            onPress={GoBack}
          />
        </View>

        <View style={{ marginTop: verticalScale(92), marginHorizontal: moderateScale(20) }}>
          <CButton
            label='Verify'
            mode='contained'
            onPress={() => {
              dispatch(setToken({
                token: '',
                isAuthenticated: true
              }))
            }}
          />
        </View>
      </View>
    </ScrollView>

  );
};

export default OtpScreen;
