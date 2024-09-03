import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { useIncreaseCartMutation } from '../../../api/increaseCartItems';
import { useDecreaseCartMutation } from '../../../api/decreaseCartItems';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setCartItems } from './slices/cartItemsSlice';
import Toast from 'react-native-toast-message';
const minusIcon = require('../../../../../assets/images/minusIcon.png');
const deleteIcon = require('../../../../../assets/images/deleteIcon.png')
const addIcon = require('../../../../../assets/images/addProductIcon.png');

const OrderDetails = ({ data }) => {
  const dispatch = useAppDispatch()
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const [increaseCartMutation, { isLoading: increaseIsLoading, isError: increaseIsError, error: increaseError }] = useIncreaseCartMutation();
  const [decreaseCartMutation, { isLoading: decreaseIsLoading, isError: decreaseIsError, error: decreaseError }] = useDecreaseCartMutation();

  useEffect(() => {

  }, [cartItems, data])


  const handleAddPress = async (item) => {
    setLoadingItemId(item.itemid);

    // Check if the current quantity exceeds the available stock then restrict the user adding to cart
    if (item?.quantity >= item?.itemstockquantity) {
      // console.log(item.quantity, '----------Quantity---------')
      // console.log(item?.itemstockquantity, '----------ItemSTockQuantity---------')
      Toast.show({
        type: 'info',
        text1: 'Limited Stock',
        text2: `Only ${item.itemstockquantity} items are available.`,
      });
      setLoadingItemId(null);
      return;
    }

    try {
      const response = await increaseCartMutation({
        userId: userDetails._id,
        product: { itemId: item.itemid },
      });

      dispatch(setCartItems(response.data));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.message}, Status: ${error.status}`
      });
      console.error('Error increasing cart:', error);
    } finally {
      setLoadingItemId(null);
    }
  };


  const handleMinusPress = async (itemId) => {
    setLoadingItemId(itemId);
    try {
      const response = await decreaseCartMutation({
        userId: userDetails._id,
        product: { itemId: itemId },
      });
      dispatch(setCartItems(response.data));
      // console.log('Decreased items', response.data);
      // }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.message}, Status: ${error.status}`
      });
      console.error('Error handling minus press:', error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const renderItem = ({ item }) => (

    <View style={{ marginHorizontal: 8, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, marginBottom: 12 }}>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4.5 }]}>{item.itemname}</Text>
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <View style={styles.addMinusIcon}>

          <IconButton
            icon={item.quantity > 1 ? minusIcon : deleteIcon}
            size={dimensions.vw * 3.5}
            iconColor={Colors.primary}
            onPress={() => handleMinusPress(item.itemid)}
          />

          {loadingItemId === item.itemid ? (
            <ActivityIndicator animating={true} color={Colors.primary} size={15} />
          ) : (
            <Text style={[textVariants.textSubHeading, { textAlignVertical: 'center' }]}>{item.quantity}</Text>
          )}
          <IconButton
            icon={addIcon}
            size={dimensions.vw * 3.5}
            iconColor={Colors.primary}
            onPress={() => handleAddPress(item)}
          />
        </View>
        <Text style={textVariants.textHeading}>₹ {item.totalCost}</Text>
      </View>
    </View>
  );
  return (
    <FlatList
      // data={isGuest ? guestCart : orderData}
      data={cartItems?.newData}
      renderItem={renderItem}
      keyExtractor={(item) => item.itemid}
    />
  )

};

export default OrderDetails;

const styles = StyleSheet.create({
  addMinusIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "#f4dab5",
    height: dimensions.vh * 4,
    marginBottom: 9
  },
});
