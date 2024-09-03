import { StyleSheet, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from '../theme/Colors'
import Home from '../domains/app/screens/home/Home'
import Orders from '../domains/app/screens/orders/Orders'
import ChatScreen from '../domains/app/screens/chat/ChatScreen'
import ProductsMenu from '../domains/app/screens/productsMenu/ProductsMenu'



const BottomTabNavigator = () => {
  const BottomTabs = createBottomTabNavigator()
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: () => null,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconImage;
          switch (route.name) {
            case 'Home':
              iconImage = require('../../assets/images/homeIcon.png');
              break;
            case 'Orders':
              iconImage = require('../../assets/images/orderIconBottom.png');
              break;
            case 'ProductsMenu':
              iconImage = require('../../assets/images/dineInIcon.png');
              break;
            case 'Chat':
              iconImage = require('../../assets/images/chatIcon.png');
              break;
          }

          return (
            <Image
              source={iconImage}
              style={{ width: size, height: size, tintColor: focused ? Colors.primary : Colors.gray }}
            />)
        },

      })}
    >
      <BottomTabs.Screen
        name='Home'
        component={Home}
      // options={{ headerShown: false, }}
      />

      <BottomTabs.Screen
        name='Orders'
        component={Orders}
      // options={{ headerShown: false, }}
      />

      <BottomTabs.Screen
        name='ProductsMenu'
        component={ProductsMenu}
      // options={{ headerShown: false, }}
      />

      {/* <BottomTabs.Screen
        name='Chat'
        component={ChatScreen}
      // options={{ headerShown: false, }}
      /> */}


    </BottomTabs.Navigator>
  )
}

export default BottomTabNavigator

const styles = StyleSheet.create({})
