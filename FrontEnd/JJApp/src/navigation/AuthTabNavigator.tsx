import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AuthStackParamList } from "./Types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GuestBottomNavigator from "./GuestBottomNavigator";
import MenuScreen from "../domains/app/screens/menu/MenuScreen";
import OrderDescription from "../domains/app/screens/orderDescription/OrderDescription";
import AuthTopTabNavigator from "./AuthTopTabNavigator";
import SearchResults from "../domains/app/screens/home/SearchResults";
import GuestMenuScreen from "../domains/auth/screens/guestMenu/GuestMenuScreen";
import AboutUs from "../domains/app/screens/aboutUs/AboutUs";
import TermsAndConditions from "../domains/app/screens/termsAndConditions/TermsAndConditions";
import PrivacyPolicy from "../domains/app/screens/privacyPolicy/PrivacyPolicy";

const AuthTabNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      // initialRouteName="GuestBottomNavigator"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name='GuestBottomNavigator'
        component={GuestBottomNavigator}
        options={{ headerShown: false, }} />

      <Stack.Screen
        name='AuthTopTabNavigator'
        component={AuthTopTabNavigator}
        options={{ headerShown: false, }} />

      <Stack.Screen
        name='GuestMenuScreen'
        component={GuestMenuScreen}
        options={{ headerTitle: '' }}
      />

      <Stack.Screen
        name='OrderDescription'
        component={OrderDescription}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name='SearchResults'
        component={SearchResults}
        options={{ headerShown: false, }}
      />

      <Stack.Screen
        name='AboutUs'
        component={AboutUs}
      // options={{ headerTitle: 'Address Details' }}
      />

      <Stack.Screen
        name='TermsAndConditions'
        component={TermsAndConditions}
      // options={{ headerTitle: 'Address Details' }}
      />
      <Stack.Screen
        name='PrivacyPolicy'
        component={PrivacyPolicy}
      // options={{ headerTitle: 'Address Details' }}
      />


    </Stack.Navigator>
  );
};



export default AuthTabNavigator;
