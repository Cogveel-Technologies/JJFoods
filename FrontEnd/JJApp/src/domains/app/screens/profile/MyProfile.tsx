import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { useNavigation, } from '@react-navigation/native'
import CInput from '../../../../components/CInput'
import CCard from '../../../../components/CCard'
import { IconButton, Modal, Portal, } from 'react-native-paper'
import dimensions from '../../../../theme/Dimensions'
import LinearHeader from '../../../../components/LinearHeader'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import * as yup from 'yup';
import { useUpdateProfileMutation } from './apis/updateProfile'
import ImageCropPicker from 'react-native-image-crop-picker'
import { setuserDetailsSlice } from '../../../auth/slices/userDetailsSlice'
import { textVariants } from '../../../../theme/StyleVarients'
import LottieView from 'lottie-react-native'
import { Background } from '../../../../theme/ConfigrationStyle'

// Define Yup schema for validation
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  emailId: yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required')
    .matches(/^\d+$/, 'Phone number must be digits only')
    .min(10, 'phoneNumber must be at least 10 digits')
    .max(10, 'phoneNumber should only be 10 digits'),

});

export const SpacedInput = ({ children }: any) => (
  <View style={{ marginBottom: moderateScale(20) }}>{children}</View>
);

interface UserData {
  name: string;
  emailId: string;
  phoneNumber: string;
}

const MyProfile = () => {
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  const editCartImage = require('../../../../../assets/images/editProfileIcon.png')
  const verifyIcon = require('../../../../../assets/images/verifyIcon4.png')

  const navigation = useNavigation<any>()
  const [updateProfile, { isLoading, isError, data, error }] = useUpdateProfileMutation();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (userDetails) {
      setUpdatedUser({
        name: userDetails.name,
        emailId: userDetails.emailId,
        phoneNumber: userDetails.phoneNumber.toString(),
      });
    }
  }, [userDetails]);

  const [updatedUser, setUpdatedUser] = useState<UserData>({
    name: '',
    emailId: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleTextChange = (key: keyof UserData, value: string) => {
    setUpdatedUser((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await validationSchema.validate(updatedUser, { abortEarly: false });

      const updatedFormData = new FormData();
      updatedFormData.append("name", updatedUser.name);
      updatedFormData.append("emailId", updatedUser.emailId);
      updatedFormData.append("phoneNumber", updatedUser.phoneNumber);
      if (selectedImage) {
        updatedFormData.append("file", {
          uri: selectedImage?.path,
          type: selectedImage?.mime,
          name: selectedImage?.filename || `profile_${Date.now()}.jpg`
        });
      }
      const result = await updateProfile(updatedFormData).unwrap();
      // console.log(result, "-------------------------")
      dispatch(setuserDetailsSlice(result))
      setVisible(true); // Show success modal on successful order creation
      setTimeout(() => {
        setVisible(false);
        navigation.navigate('MenuScreen');
      }, 1500);
    } catch (error) {
      const validationErrors: { [key: string]: string } = {};
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          validationErrors[err.path as keyof typeof updatedUser] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("API Error: ", error);
      }
    }
  };

  const selectImageFromStorage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(image => {
      setSelectedImage(image);
      // console.log('Image path:-------------', image);
    });
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }

  if (error) {
    console.log(error);
    let errorMessage = 'An error occurred while fetching the cart items.';

    if (error.status === 'FETCH_ERROR') {
      errorMessage = 'Network error: Please check your internet connection.';
    } else if (error.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (error.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (error.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {error.status === 'FETCH_ERROR' &&
          <LottieView
            source={require('../../../../../assets/lottieFiles/noInternet.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 200, alignSelf: 'center' }}
          />
        }
        <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{error.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20, textAlign: 'center' }]}>{errorMessage}</Text>
      </View>
    )
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        <LinearHeader />
        <View style={{ flex: 1, }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <CCard style={{ width: "95%", height: 'auto', }}>
              <View style={{
                width: dimensions.vw * 100,
                height: "100%",
                position: "absolute",
                top: dimensions.vh - 120,
                alignSelf: 'center'
              }}>
                <ImageBackground
                  source={require("../../../../../assets/images/curvedImage.png")}
                  style={{
                    width: dimensions.vw * 70,
                    height: dimensions.vh * 20,
                    alignSelf: 'center',

                  }}
                >

                  <View style={styles.profileContainer}>
                    {/* Display selected image if available, else show the current user image */}
                    <Image
                      source={selectedImage ? { uri: selectedImage.path } : (userDetails?.imageUrl ? { uri: userDetails.imageUrl } : demoprofilePic)}
                      style={styles.profilePic}
                    />

                    <CCard
                      style={styles.editImage}>
                      <IconButton
                        icon={editCartImage}
                        iconColor={Colors.primary}
                        size={dimensions.vw * 4.9}
                        onPress={selectImageFromStorage}
                      />
                    </CCard>
                  </View>
                </ImageBackground>
              </View>

              <View style={{ marginTop: dimensions.vh * 15, marginHorizontal: 24 }}>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode='flat'
                    keyboardType="default"
                    label="Name"
                    onChangeText={(text) => handleTextChange('name', text)}
                    value={updatedUser.name}
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="email-address"
                    label="Email ID"
                    onChangeText={(text) => handleTextChange('emailId', text)}
                    value={updatedUser.emailId}
                    disabled={true}

                  />
                  {errors.emailId && <Text style={styles.errorText}>{errors.emailId}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    // rightIcon={verifyIcon}
                    mode="flat"
                    label="Phone Number"
                    keyboardType="number-pad"
                    onChangeText={(text) => handleTextChange('phoneNumber', text)}
                    value={updatedUser.phoneNumber}
                    disabled={true}
                  // rightIconOnPress={ }
                  />
                  {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                </SpacedInput>
              </View>
            </CCard>
          </View>

          <View style={{ margin: moderateScale(20), }}>
            <CButton label='Update Profile' mode='contained' onPress={handleUpdate} />
          </View>

          <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, width: 200, borderRadius: 20, alignSelf: 'center' }}>
              <LottieView
                source={require('../../../../../assets/lottieFiles/success.json')}
                autoPlay
                loop={true}
                style={{ width: 150, height: 150, alignSelf: 'center' }}
              />
              <Text style={[textVariants.textSubHeading, { textAlign: 'center' }]}>Profile Updated Successfully </Text>
            </Modal>
          </Portal>
        </View>

      </ImageBackground>

    </ScrollView >
  )
}

export default MyProfile

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  logo: {
    width: moderateScale(113),
    height: moderateVerticalScale(98),
    margin: moderateScale(38),
  },
  editImage: {
    height: dimensions.vw * 8,
    width: dimensions.vw * 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 50,
  },
  profilePic: {
    width: dimensions.vw * 32,
    height: dimensions.vw * 32,
    borderRadius: dimensions.vw * 50,
    alignSelf: 'center'
  },
  profileContainer: {
    marginTop: 30,
    width: dimensions.vw * 32,
    height: dimensions.vw * 32,
    borderRadius: dimensions.vw * 50,
    alignSelf: 'center',
    borderColor: Colors.grayDim
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },

});