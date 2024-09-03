import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import dimensions from '../../../../theme/Dimensions';
import { Colors } from '../../../../theme/Colors';
import { textVariants } from '../../../../theme/StyleVarients';
import { IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const minusIcon = require('../../../../../assets/images/minusIcon.png');
const deleteIcon = require('../../../../../assets/images/deleteIcon.png');
const addIcon = require('../../../../../assets/images/addProductIcon.png');

const GuestOrderDetails = ({ data }) => {
  // const [guestCart, setGuestCart] = useState([]);

  // useEffect(() => {
  //   if (JSON.stringify(data) !== JSON.stringify(guestCart)) {
  //     setGuestCart(data);
  //     console.log(data, '--------------guest Cart ----------');
  //   }
  // }, [data]);


  const [guestCartItems, setGuestCartItems] = useState([]);

  const getGuestCart = async () => {
    try {
      const guestCart = await AsyncStorage.getItem('guestCart');
      if (guestCart) {
        const finalCart = JSON.parse(guestCart);
        // console.log(finalCart, '==================')
        setGuestCartItems(finalCart);
      }
    } catch (error) {
      console.error('Error retrieving guest cart:', error);
    }
  };

  const updateGuestCartInStorage = async (updatedCart) => {
    try {
      await AsyncStorage.setItem('guestCart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating guest cart in local storage:', error);
    }
  };

  useEffect(() => {
    getGuestCart(); // Fetch guest cart items
    // console.log(guestCartItems, '-------------')
  }, []);


  useFocusEffect(
    useCallback(() => {
      getGuestCart();
    }, [])
  );

  const handleAddPress = (itemid) => {
    setGuestCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.itemid === itemid) {
          // Check if the quantity is already at 5
          if (item.quantity < 5) {
            const newQuantity = item.quantity + 1;
            const newTotalPrice = newQuantity * item.price;
            return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
          } else {
            // Show a toast if the quantity is already 5
            Toast.show({
              type: 'info',
              text1: 'Limit Reached',
              text2: 'You cannot add more than 5 items Please Login First .',
            });
            return item; // Return the item as is if the quantity is already 5
          }
        }
        return item;
      });
      updateGuestCartInStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleMinusPress = (itemid) => {
    const updatedCart = guestCartItems
      .map((item) => {
        if (item.itemid === itemid) {
          const newQuantity = item.quantity - 1;
          if (newQuantity > 0) {
            const newTotalPrice = newQuantity * item.price;
            return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
          } else {
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);
    setGuestCartItems(updatedCart);
    updateGuestCartInStorage(updatedCart);
  };

  const renderItem = ({ item }) => (
    <View style={{ marginHorizontal: 8, borderBottomWidth: 1, borderBottomColor: Colors?.grayDim, marginBottom: 12 }}>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4.5 }]}>{item.itemname}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <View style={styles.addMinusIcon}>
          <IconButton
            icon={item.quantity > 1 ? minusIcon : deleteIcon}
            size={dimensions.vw * 3.5}
            iconColor={Colors.primary}
            onPress={() => handleMinusPress(item.itemid)}
          />
          <Text style={[textVariants.textSubHeading, { textAlignVertical: 'center' }]}>{item.quantity}</Text>
          <IconButton
            icon={addIcon}
            size={dimensions.vw * 3.5}
            iconColor={Colors.primary}
            onPress={() => handleAddPress(item.itemid)}
          />
        </View>
        <Text style={textVariants.textHeading}>₹ {item.price * item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={guestCartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemid}
      />
    </>
  );
};

export default GuestOrderDetails;

const styles = StyleSheet.create({
  addMinusIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#f4dab5',
    height: dimensions.vh * 4,
    marginBottom: 9,
  },
});
