import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import CCard from '../../../../components/CCard'
import { Avatar, Text } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import CButton from '../../../../components/CButton'
import { useNavigation } from '@react-navigation/native'
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import LinearHeader from '../../../../components/LinearHeader'
import ButtonList from '../../../app/screens/menu/ButtonList'
import { Background } from '../../../../theme/ConfigrationStyle'


const GuestMenuScreen = () => {
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  const navigation = useNavigation()

  const handleLogin = () => {
    navigation.navigate("AuthTopTabNavigator")
  }

  const guestList = [
    { id: 1, title: 'About Us', screen: 'AboutUs' },
    { id: 2, title: 'Terms & Conditions', screen: 'TermsAndConditions' },
    { id: 3, title: 'Privacy Policy', screen: 'PrivacyPolicy' },
  ];


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
                  source={demoprofilePic}
                  style={{ marginEnd: 18 }} />

                <View>
                  <Text style={[textVariants.textMainHeading, { width: dimensions.vw * 40 }]}>Guest User</Text>
                  <Text style={[textVariants.textSubHeading,]}>Login to get all features</Text>
                </View>
              </View>

            </View>
          </CCard>

          {/* Other Options  and Login Button*/}
          <CCard style={{ marginHorizontal: 0 }}>
            <View >
              <ButtonList data={guestList} />
              <CButton
                onPress={handleLogin}
                label='LogIn'
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

export default GuestMenuScreen
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

