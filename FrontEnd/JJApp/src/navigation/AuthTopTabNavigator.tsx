import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { Colors } from '../theme/Colors'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SignInStackNavigator from './SignInStackNavigator';
import SignUpStackNavigator from './SignUpStackNavigator';
import { Background, Logos } from '../theme/ConfigrationStyle';

const Tab = createMaterialTopTabNavigator();
const AuthTopTabNavigator = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <ImageBackground
          source={Background.jjBackground}
          resizeMode="cover"
          style={styles.logoBackground}
        >
          {/* <LinearHeader /> */}

          <Image
            source={Logos.jjLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </ImageBackground>
      </View>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: Colors.primary },
            tabBarLabelStyle: styles.tabBarLabelStyel,
            tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
          }}
        >
          <Tab.Screen name="LogIn" component={SignInStackNavigator} />
          <Tab.Screen name="SignUp" component={SignUpStackNavigator} />
        </Tab.Navigator>
      </View>
    </View>
  )
}

export default AuthTopTabNavigator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBackground: {
    aspectRatio: 16 / 9,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: moderateScale(166),
    height: moderateScale(202),
    margin: moderateVerticalScale(50),
  },
  tabsContainer: {
    flex: 1,
    width: "100%",
  },
  tabBarLabelStyel: {
    color: Colors.black,
    fontSize: moderateScale(16),
    fontWeight: '600',
    fontFamily: 'Montserrat SemiBold',
    textTransform: 'none',
  }

});