import { Alert, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../../theme/StyleVarients'
import CButton from '../../../../../components/CButton'
import { logout } from '../../../../auth/slices/authSlice'
import { useDispatch } from 'react-redux'
import CCard from '../../../../../components/CCard'
import LinearHeader from '../../../../../components/LinearHeader'
import { setuserDetailsSlice } from '../../../../auth/slices/userDetailsSlice'
import { useAppSelector } from '../../../../../store/hooks'
import { Colors } from '../../../../../theme/Colors'
import dimensions from '../../../../../theme/Dimensions'
import { Background } from '../../../../../theme/CongfigrationStyle'

const MenuScreen = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, role, token } = useAppSelector((store) => store.persistedReducer.authSlice)

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

  const handleLogout = () => {
    // console.warn("Logout Pressed")
    dispatch(setuserDetailsSlice([]));
    dispatch(logout())
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ flex: 1, marginHorizontal: 16.5, marginTop: 40 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[textVariants.textSubHeading, { color: Colors.black }]}>Your Role: </Text>
            <Text style={[textVariants.textSubHeading, { width: dimensions.vw * 56 }]}>{role}</Text>
          </View>

          <CCard style={{ marginHorizontal: 0, }}>
            <View >
              <CButton
                onPress={showAlert}
                label='LogOut'
                mode='text'
                fontsize={20}
                style={{ alignSelf: 'flex-start', marginStart: 10, }}
              />
            </View>
          </CCard>
        </View>
      </ImageBackground>
    </ScrollView>
  )
}

export default MenuScreen

const styles = StyleSheet.create({})