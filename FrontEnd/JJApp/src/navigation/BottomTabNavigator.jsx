import { StyleSheet, Image, View, Text } from 'react-native';
import React, { useEffect } from 'react';
import WishList from '../domains/app/screens/wishList/WishList';
import HomeScreen from '../domains/app/screens/home/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme/Colors';
import OrdersNavigator from './OrdersNavigator';
import MyCart from '../domains/app/screens/cart/MyCart';
import { useAppSelector } from '../store/hooks';
import { Badge } from 'react-native-paper';


const BottomTabNavigator = () => {
  const { isAuthenticated, isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);

  useEffect(() => {

  }, [cartItems]);

  const BottomTabs = createBottomTabNavigator();
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: () => null,
        headerTitleAlign: 'center',
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        headerTransparent: true,
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconImage;
          let iconSize = size;

          switch (route.name) {
            case 'Home':
              iconImage = require('../../assets/images/homeicon.png');
              iconSize = size * 1.1;
              break;
            case 'MyCart':
              iconImage = require('../../assets/images/cartIcon2.png');
              break;
            case 'WishList':
              iconImage = require('../../assets/images/wishListIcon.png');
              break;
            case 'OrdersNavigator':
              iconImage = require('../../assets/images/DeliveredIcon.png');
              break;
            case 'Demo':
              iconImage = require('../../assets/images/addProductIcon.png');
              break;
          }

          return (
            <View style={{ width: iconSize, height: iconSize }}>
              <Image
                source={iconImage}
                style={{ width: iconSize, height: iconSize, tintColor: focused ? Colors.primary : Colors.gray }}
              />
              {route.name === 'MyCart' && cartItems?.cartLength > 0 && (
                <View style={styles.badge}>
                  <Badge style={{ backgroundColor: Colors.primary, color: Colors.white }} size={15}>{cartItems?.cartLength}</Badge>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <BottomTabs.Screen
        name='Home'
        component={HomeScreen}
      />
      <BottomTabs.Screen
        name='MyCart'
        component={MyCart}
        options={{ headerShown: true }}
      />
      <BottomTabs.Screen
        name='WishList'
        component={WishList}
      />

      {!isGuest &&
        <BottomTabs.Screen
          name='OrdersNavigator'
          component={OrdersNavigator}
        />}
    </BottomTabs.Navigator>
  );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
