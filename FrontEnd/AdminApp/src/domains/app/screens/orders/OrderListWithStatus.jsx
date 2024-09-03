import React, { useEffect } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { textVariants } from '../../../../theme/StyleVarients';
import dimensions from '../../../../theme/Dimensions';
import { Icon } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useOrderWithStatusQuery } from './apis/ordersWithStatus';
import LottieView from 'lottie-react-native';
import { useUpdateOrderStatusMutation } from './apis/updateOrderStatus';
import CButton from '../../../../components/CButton';
import Toast from 'react-native-toast-message';
import { useUpdatePendingOrderStatusMutation } from './apis/updatePendingOrderStatus';
const OrderListWithStatus = ({ customStyleIndex, orderType }) => {

  const navigation = useNavigation();
  const statusMapping = {
    0: 'Pending',
    1: 'Processing',
    2: 'OnTheWay',
    3: 'Completed',
    4: 'Cancelled'
  };
  // console.log(orderType, '---------------')

  const { data: productList = [], error, isLoading, isError, isFetching, refetch } = useOrderWithStatusQuery({
    state: statusMapping[customStyleIndex],
    orderType: orderType == 'Normal' ? 'false' : 'true',
  });

  const [updateOrderStatus, { isLoading: isupdateStatusLoading, error: updateStatusError }] = useUpdateOrderStatusMutation();

  const [updatePendingOrderStatus, { isLoading: isupdatePendingStatusLoading, error: updatePendingStatusError }] = useUpdatePendingOrderStatusMutation();

  useEffect(() => {
    refetch();
  }, [customStyleIndex, orderType]);

  const handleDetails = (item) => {
    navigation.navigate('OrderDetails', { item });
  };

  const handleUpdateStatus = async (item) => {
    try {
      const orderId = item._id;
      let state = item.state;

      if (state === 'pending') {
        try {
          await updatePendingOrderStatus({ orderId, state: 'processing' }).unwrap();
          refetch();
          Toast.show({
            type: 'success',
            text1: 'Order State Changed',
            text2: 'Done'
          });
          return;
        } catch (err) {
          Toast.show({
            type: 'error',
            text1: `${err}`,
            text2: 'Failed to update pending order!'
          });
          console.error('Failed to update pending order:', err);
          return;
        }
      }

      if (state === 'processing') {
        state = 'on the way';
      } else if (state === 'on the way') {
        state = 'completed';
      } else {
        console.error('Invalid item state:', item.state);
        return;
      }

      await updateOrderStatus({ orderId, state }).unwrap();
      refetch();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update!'
      });
      console.error('Failed to update order:', err);
    }
  };

  const handleReject = (item) => {
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          onPress: async () => {
            try {
              const orderId = item._id;
              await updatePendingOrderStatus({ orderId, state: 'cancelled' }).unwrap();
              refetch();
              Toast.show({
                type: 'success',
                text1: 'Order State Changed',
                text2: 'Done'
              });

            } catch (err) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update!'
              });
              console.error('Failed to update order:', err);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }

  const renderItem = ({ item, index }) => {
    // console.log(item, '**********************************ITEM*******************************************************')
    const isLastItem = index === productList.length - 1;
    const borderBottomStartRadius = isLastItem ? 10 : 0;
    const borderBottomEndRadius = isLastItem ? 10 : 0;
    const isDisabled = customStyleIndex === 4;

    const statusViewStyle = [
      styles.statusView,
      isDisabled && { backgroundColor: Colors.grayLight },
      customStyleIndex === 3 && { backgroundColor: '#2e892e' }
    ];

    return (
      <View style={[styles.mainView, { borderBottomStartRadius, borderBottomEndRadius }]}>
        <View style={{ marginHorizontal: dimensions.vw * 2 }}>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, width: dimensions.vw * 20, }]}>{item?._id}</Text>
        </View>

        <View style={styles.itemsView}>
          {/* <Image source={item.image} style={styles.productImage} /> */}
          <Image source={require("../../../../../assets/images/soanPlateImage.png")} style={styles.productImage} />
          <View style={styles.innerView}>
            <Text style={[textVariants.buttonTextHeading, { color: Colors.black, width: dimensions.vw * 20, }]}>{item?.products[0]?.details?.itemname}</Text>

            {/* Order Details button */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleDetails(item)}>
              <Text style={styles.detailsButton}>View Details</Text>
              <Icon source={require('../../../../../assets/images/rightArrow.png')} color={Colors.primary} size={dimensions.vw * 3.5} />
            </TouchableOpacity>
          </View>

          <View>
            {/* Reject Button */}
            {item?.state === 'pending' && <TouchableOpacity
              style={[styles.statusView, { backgroundColor: Colors.red, marginBottom: 10 }]}
              onPress={() => handleReject(item)}>
              <Text style={[textVariants.buttonTextHeading, { fontSize: dimensions.vw * 2.6, textAlign: 'center' }]}>Reject </Text>
            </TouchableOpacity>}

            {/* Accept Button */}
            <TouchableOpacity
              disabled={isDisabled}
              style={statusViewStyle}
              onPress={() => handleUpdateStatus(item)}>
              <Text style={[textVariants.buttonTextHeading, { fontSize: dimensions.vw * 2.6, textAlign: 'center' }]}>{item?.state == 'pending' ? 'Accept' : item?.state}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading || isFetching || isupdateStatusLoading || isupdatePendingStatusLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center', }}
        />
      </View>
    )
  }

  if (isError) {
    console.log(error);
    let errorMessage = 'An error occurred while fetching data.';

    if (error.status === 'FETCH_ERROR') {
      errorMessage = 'Network error:\n Please check your internet connection.';
    } else if (error.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (error.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (error.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {error.status === 'FETCH_ERROR' &&
          <LottieView
            source={require('../../../../../assets/lottieFiles/noInternet.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 200, alignSelf: 'center' }}
          />
        }
        <Text style={[textVariants.textHeading, { paddingBottom: 10 }]}>{error.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20, textAlign: 'center' }]}>{errorMessage}</Text>
        <CButton label='Reload' mode='contained' onPress={refetch} />
      </View>
    )
  }

  // Geting Updated Data on refresh 
  const handleRefresh = async () => {
    try {
      const response = await refetch().unwrap();
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Optionally, you can show an error message to the user
    }
  };

  // To Reverse the ProductsList so that new items will come on top of the list 

  const reversedProductList = productList ? [...productList].reverse() : [];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topheading}>
        <Text style={styles.headingText}>Order Code</Text>
        <Text style={styles.headingText}>Menu</Text>
        <Text style={styles.headingText}>Order Status</Text>
      </View>

      <FlatList
        data={reversedProductList}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onRefresh={handleRefresh}
        refreshing={isLoading}
      />
    </View>
  );
};

export default OrderListWithStatus;

const styles = StyleSheet.create({
  topheading: {
    backgroundColor: Colors.whiteSecondary,
    flexDirection: 'row',
    height: 58,
    alignItems: 'center',
    borderColor: Colors.gray,
    borderWidth: 0.5,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    marginBottom: -1,
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.vw * 4
  },
  mainView: {
    borderColor: Colors.gray,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    justifyContent: 'space-around'
  },
  productImage: {
    height: dimensions.vw * 10.5,
    width: dimensions.vw * 10.5,
    borderRadius: 10,
    marginEnd: dimensions.vw * 3
  },
  innerView: {
    alignItems: 'flex-start',
    width: dimensions.vh * 15
  },
  statusView: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: dimensions.vh * 3,
    width: dimensions.vw * 20,
    justifyContent: 'center',
    marginEnd: 18,
  },
  headingText: {
    fontSize: dimensions.vw * 3.6,
    color: Colors.primary,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  detailsButton: {
    color: Colors.primary,
    fontSize: dimensions.vw * 2.9,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  }
});