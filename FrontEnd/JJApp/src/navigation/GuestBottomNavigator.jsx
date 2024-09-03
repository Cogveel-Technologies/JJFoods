import { StyleSheet, Image, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import WishList from '../domains/app/screens/wishList/WishList';
import HomeScreen from '../domains/app/screens/home/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme/Colors';
import GuestCart from '../domains/auth/screens/guestCart/GuestCart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Badge } from 'react-native-paper';

const GuestBottomNavigator = () => {
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await AsyncStorage.getItem('guestCart');
        if (cart !== null) {
          const parsedCart = JSON.parse(cart);
          setGuestCartItems(parsedCart);
          const totalQty = parsedCart.reduce((sum, item) => sum + item.quantity, 0);
          setTotalQuantity(totalQty);
          setTimeout(() => setTotalQuantity(totalQty), 100); // Force a small re-render
        }
      } catch (error) {
        console.error('Error retrieving guest cart:', error);
      }
    };

    fetchCart();
  }, [guestCartItems]);

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
            case 'GuestCart':
              iconImage = require('../../assets/images/cartIcon2.png');
              break;
            case 'WishList':
              iconImage = require('../../assets/images/wishListIcon.png');
              break;
          }
          return (
            <View style={{ width: iconSize, height: iconSize }}>
              <Image
                source={iconImage}
                style={{ width: iconSize, height: iconSize, tintColor: focused ? Colors.primary : Colors.gray }}
              />
              {route?.name === 'GuestCart' && Array.isArray(guestCartItems) && guestCartItems.length > 0 && (
                <View style={styles.badge}>
                  <Badge style={{ backgroundColor: Colors.primary, color: Colors.white }} size={15}>{totalQuantity}</Badge>
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
        name='GuestCart'
        component={GuestCart}
      />
      <BottomTabs.Screen
        name='WishList'
        component={WishList}
      />
    </BottomTabs.Navigator>
  );
}

export default GuestBottomNavigator;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    color: Colors.white,
    paddingHorizontal: 2,
    fontSize: 10,
    padding: 2,
    fontFamily: "Montserrat Bold",
  },
});
