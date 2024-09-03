import { Alert, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CCard from '../../../../components/CCard'
import { ActivityIndicator, Avatar, Text } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import CButton from '../../../../components/CButton'
import LinearHeader from '../../../../components/LinearHeader'
import { useNavigation } from '@react-navigation/native'
import ButtonList from './ButtonList'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { logout, setToken } from '../../../auth/slices/authSlice';
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setuserDetailsSlice } from '../../../auth/slices/userDetailsSlice'
import { setCartItems } from '../cart/slices/cartItemsSlice'
import LottieView from 'lottie-react-native'
import { Background } from '../../../../theme/ConfigrationStyle'


const MenuScreen = () => {
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    navigation.navigate('MyProfile');
  }

  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);

  const showAlert = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: handleLogout }
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userDetails');
      dispatch(setuserDetailsSlice(null));
      dispatch(setCartItems([]));
      dispatch(logout())
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  const data = [
    { id: 1, title: 'Places You’ve Added', screen: 'AddedPlaces' },
    { id: 2, title: 'Collected Coupons', screen: 'CollectedCoupons' },
    // { id: 3, title: 'Live Chat', screen: 'LiveChat' },
    { id: 4, title: 'Account Settings', screen: 'AccountSetting' },
    { id: 5, title: 'App Feedback', screen: 'Feedback' },
    { id: 6, title: 'About Us', screen: 'AboutUs' },
    { id: 7, title: 'Terms & Conditions', screen: 'TermsAndConditions' },
    { id: 8, title: 'Privacy Policy', screen: 'PrivacyPolicy' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ flex: 1, marginHorizontal: 16.5, marginTop: 24 }}>

          {/* Profile Card and Edit-Button */}
          <CCard style={{ marginHorizontal: 0 }}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', marginHorizontal: 20 }}>

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Image
                  size={dimensions.vw * 13}
                  source={userDetails?.imageUrl ? { uri: userDetails.imageUrl } : demoprofilePic}
                  style={{ marginEnd: 18 }} />

                <View>
                  <Text style={[textVariants.textMainHeading, { width: dimensions.vw * 40 }]}>{userDetails?.name}</Text>
                  <Text style={textVariants.textSubHeading}>{userDetails?.phoneNumber}</Text>
                </View>

              </View>

              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={handleEdit}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>

            </View>
          </CCard>

          {/* option list and Logout Button  */}
          <CCard style={{ marginHorizontal: 0 }}>
            <View >
              <ButtonList data={data} />
              <CButton
                onPress={showAlert}
                label='LogOut'
                mode='text'
                fontsize={20}
                style={{ alignSelf: 'flex-start', marginStart: 25, marginTop: 15 }} />
            </View>
          </CCard>
        </View>
      </ImageBackground>
    </ScrollView>

  )
}

export default MenuScreen
const styles = StyleSheet.create({
  editButton: {
    color: Colors.primary,
    fontSize: dimensions.vw * 3.5,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

