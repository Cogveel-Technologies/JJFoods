import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../theme/Colors";
import { moderateScale, moderateVerticalScale, } from "react-native-size-matters";
import SignInStackNavigator from "./SignInStackNavigator";
import SignUpStackNavigator from "./SignUpStackNavigator";
import { Background, Logos } from "../theme/CongfigrationStyle";



const Tab = createMaterialTopTabNavigator();
const AuthTabNavigator = () => {
  const logo = require("../../assets/images/logo.png")
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <ImageBackground
          source={Background.jjBackground}
          resizeMode="cover"
          style={styles.logoBackground}
        >
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
          <Tab.Screen
            name="LogInNavigator"
            component={SignInStackNavigator}
            // options={{ tabBarLabel: 'Sign In' }}
            options={{ tabBarLabel: 'Log In' }}
          />
          {/* <Tab.Screen
            name="SignUpNavigator"
            component={SignUpStackNavigator}
            options={{ tabBarLabel: 'Sign Up' }}
          /> */}
        </Tab.Navigator>
      </View>
    </View>
  );
};

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

export default AuthTabNavigator;
