import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../theme/Colors';
import { moderateScale } from 'react-native-size-matters';
import MyOrders from '../domains/app/screens/myOrders/MyOrders';
import OrderHistory from '../domains/app/screens/myOrders/orderHistory/OrderHistory';


const Tab = createMaterialTopTabNavigator();
const OrdersNavigator = () => {
  return (
    <Tab.Navigator
      style={{ marginTop: 28 }}
      screenOptions={() => ({
        tabBarIndicatorStyle: { backgroundColor: Colors.primary },
        tabBarLabelStyle: styles.tabBarLabelStyel,
        tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
      })}
      initialRouteName='Running'
    >
      <Tab.Screen name="Running" component={MyOrders} />
      <Tab.Screen name="History" component={OrderHistory} />
    </Tab.Navigator>
  )
}

export default OrdersNavigator

const styles = StyleSheet.create({

  tabBarLabelStyel: {
    color: Colors.gray,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat SemiBold',
    textTransform: 'none',
  }
})