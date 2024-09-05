import { Alert, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Colors } from '../../../../../theme/Colors'
import CButton from '../../../../../components/CButton'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import dimensions from '../../../../../theme/Dimensions'
import OrderedProductList from './OrderedProductList'
import { useAllRunningOrdersMutation } from './apis/allRunningOrders'
import { useAppSelector } from '../../../../../store/hooks'
import CCard from '../../../../../components/CCard'
import { textVariants } from '../../../../../theme/StyleVarients'
import { useOrderAgainMutation } from './apis/orderAgain'
import Toast from 'react-native-toast-message'
import LottieView from 'lottie-react-native'
import { Background, DemoImages } from '../../../../../theme/ConfigrationStyle'


const cartImage = require("../../../../../../assets/images/cartIcon.png");

const OrderHistory = () => {

  const [allRunningOrders, { data, error, isLoading, refetch }] = useAllRunningOrdersMutation();
  const state = 'history'
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id
  const [orderDetails, setOrderDetails] = useState([])

  const navigation = useNavigation()
  const goToHome = () => {
    navigation.navigate('Home')
  }

  const [orderAgain, { isSuccess, isLoading: isOrderAgainLoading, isError: isOrderAgainError, error: orderAgainError }] = useOrderAgainMutation();


  const fetchOrders = async () => {
    // console.log(userId);
    try {
      const response = await allRunningOrders({ userId, state });
      const sortedOrders = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrderDetails(sortedOrders);
      // console.log(response.data[2].products, "RRRRRRRRRRrrrrrrrrrrrrrrrrRRRRRRRRRrrr");
      // console.log(response.data[19].payment, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh");
    } catch (err) {
      console.error('Failed to fetch running orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, state, allRunningOrders]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const handleDetails = (item) => {
    navigation.navigate("OrderHistoryDetails", { item })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleOrderAgain = async (item) => {

    // checking item stock quantity for adding to cart
    for (let i = 0; i < item.products.length; i++) {
      if (item.products[i].details.itemstockquantity == 0) {
        Toast.show({
          type: 'info',
          text1: 'Not Available ',
          text2: `some items are not available ��`,
        });
        return;
      }

    }

    try {
      const response = await orderAgain({ orderId: item._id });
      // console.log(response, '---------response------------')
      // navigation.navigate('MyCart');
      if (response) {
        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: `${response.data.message}`,
        });
      }

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.status},${error.message}`,
      });
      console.error('Error ordering again:', error);
      // Handle specific errors or show a general error message
    }
  };

  const renderItem = ({ item }) => {
    // console.log(item, '-----+++++++++++++++Item ++++++++++++++++++-----')
    return (
      <CCard style={{ marginHorizontal: 0, padding: 0 }}>
        <TouchableOpacity onPress={() => handleDetails(item)} >
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
              resizeMode='contain'
              source={item.products[0].item_image_url
                ? { uri: item.products[0].item_image_url }
                : DemoImages.productDemo
              }
              style={styles.image} />

            <View style={{ flex: 1, marginEnd: 20, marginTop: 10 }}>
              <View >

                {item.products.slice(0, 2).map((product, index) => {
                  const isSecondProduct = index === 1;
                  return (
                    <Text key={product.details.itemId}
                      style={[textVariants.buttonTextHeading, { color: Colors.black, paddingBottom: 6 }]}>
                      {product.details.itemname}{isSecondProduct && item.products.length > 2 ? '.........' : ''}
                    </Text>
                  );
                })}

                <View style={{ flexDirection: 'row', }}>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.black }]}>Your Order is :  </Text>
                  <Text style={[textVariants.buttonTextHeading, { color: item.state === 'cancelled' ? 'red' : "green", }]}>{item.state}</Text>
                </View>



                {(item.payment.paymentMethod === 'online' && (item.state === 'cancelled' || item.state === 'rejected') && item.payment.status === true) ?
                  (<View>
                    <View style={{ flexDirection: 'row', }}>
                      <Text style={[textVariants.buttonTextHeading, { color: Colors.black }]}>Refund Status :  </Text>
                      <Text style={[textVariants.buttonTextHeading, { color: "green", }]}>{item.payment.refund ? 'Refunded' : 'Under Process'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                      <Text style={[textVariants.buttonTextHeading, { color: Colors.black }]}>Refund date: </Text>
                      <Text style={[textVariants.buttonTextHeading, { color: "green", marginEnd: 10, width: dimensions.vw * 21 }]}>{new Date(item.payment.refundDate * 1000).toLocaleDateString('en-GB')}</Text>

                      <Text style={[textVariants.buttonTextHeading, { color: "green", }]}>{new Date(item.payment.refundDate * 1000).toLocaleTimeString()}</Text>
                    </View>
                  </View>
                  ) : null}

              </View>
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15
              }}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.gray, }]}> ₹ {item.grandTotal}</Text>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.gray, }]}>{formatDate(item.updatedAt)}</Text>
              </View>
            </View>

          </View>
        </TouchableOpacity>
        <CButton
          label='Order Again'
          mode='text'
          labelStyle={{ color: Colors.gray }}
          style={styles.orderAgainButton}
          onPress={() => handleOrderAgain(item)}
        />
      </CCard>
    )
  };


  if (isOrderAgainLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }


  return (

    // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      {/* <LinearHeader /> */}

      {
        orderDetails && orderDetails?.length ?
          (
            <View style={{ flex: 1, marginHorizontal: 16 }}>
              <FlatList
                data={orderDetails}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
              />
              {/* Start ordering button */}
              {/* <View style={{ marginVertical: moderateScale(20) }}>
                <CButton
                  label='Start Ordering'
                  mode='contained'
                  onPress={goToHome}
                />
              </View> */}

            </View>

          ) : (
            // Empty Orders View 
            <View style={{ flex: 1 }}>
              <View style={styles.noOrderView} >
                <Image source={cartImage} style={styles.logo} resizeMode="contain" />
                <Text style={styles.noOrderText}>No orders History</Text>
              </View>
              {/* Start ordering button */}
              <View style={{ margin: moderateScale(20) }}>
                <CButton
                  label='Start Ordering'
                  mode='contained'
                  onPress={goToHome}
                />
              </View>
            </View>)
      }
    </ImageBackground>

    // </ScrollView>
  )
}

export default OrderHistory

const styles = StyleSheet.create({

  logoBackground: {
    flex: 1,
  },
  noOrderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  noOrderText: {
    fontSize: dimensions.vw * 5.6,
    color: Colors.grayDim,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600",
    textAlign: 'center'

  },
  image: {
    width: dimensions.vw * 17.2,
    height: dimensions.vw * 17.2,
    borderRadius: 10,
    margin: 20,
  },
  orderAgainButton: {
    borderTopWidth: 1.2,
    borderTopColor: Colors.gray,
    borderStyle: 'dashed',
    paddingVertical: 5
  },
  logo: {
    width: dimensions.vw * 28,
    height: dimensions.vw * 28,
    margin: 40,
  },
})