import { Alert, FlatList, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { moderateScale, } from 'react-native-size-matters'
import { Text } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import dimensions from '../../../../theme/Dimensions'
import { textVariants } from '../../../../theme/StyleVarients'
import { useAppSelector } from '../../../../store/hooks'
import CCard from '../../../../components/CCard'
import { useAllRunningOrdersMutation } from './orderHistory/apis/allRunningOrders'
import LottieView from 'lottie-react-native'
import { useCancelOrderMutation } from './orderHistory/apis/cancelOrder'
import Toast from 'react-native-toast-message'
import { Background, DemoImages } from '../../../../theme/ConfigrationStyle'


const MyOrders = () => {
  const cartImage = require("../../../../../assets/images/cartIcon.png");
  const navigation = useNavigation();
  const goToHome = () => {
    navigation.navigate('Home');
  };
  const gotoMapScreen = () => {
    navigation.navigate('Locationscreen');
  };
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id
  const [orderDetails, setOrderDetails] = useState([])

  const [allRunningOrders, { data, error, isLoading, refetch }] = useAllRunningOrdersMutation();
  const [cancelOrder, { isLoading: isCancelOrderLoading, isSuccess: isCancelOrderSuccess, isError: isCancelOrderError, error: cancelOrderError }] = useCancelOrderMutation();

  const state = 'running'
  const fetchOrders = async () => {
    // console.log(userId);
    try {
      // console.log(userId, 'user id ', state, 'state', "------------------------")
      const response = await allRunningOrders({ userId, state });
      // console.log(response, '+++++++++Running Order response++++++++++')
      const sortedOrders = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrderDetails(sortedOrders);
      // console.log(response.data, "RRRRRRRRRRRRRRRRRRRrrr");
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
    // console.log(item, '444444444444444444444444')
    navigation.navigate("FullOrderDetails", { item })
  }

  const handleCancelOrder = async (item) => {
    // console.log(item, '--------------------')
    try {
      const response = await cancelOrder({ orderId: item._id }).unwrap();
      // console.log(response, '++++++++++++++++++++++++++++++++Cancel++++++++++')
      Toast.show({
        type: 'success',
        text1: "Order Cancelled Successfully ",
        text2: "Cancelled",
      });
      fetchOrders()
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: `${err.message.message}`,
        text2: `${err.message.statusCode}`,
      });
      // Handle error (e.g., show an error message)
      console.error('Failed to cancel order: ', err);
    }
  };

  const confirmCancelOrder = (item) => {
    // console.log(item, '8888888888888888888item88888888888888')
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => handleCancelOrder(item)
        }
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => {
    return (
      <CCard style={{ marginHorizontal: 0, padding: 0 }}>
        <TouchableOpacity onPress={() => handleDetails(item)} >
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
              resizeMode='contain'
              source={item.products[0].item_image_url
                ? { uri: item.products[0].item_image_url }
                : DemoImages.productDemo
              } style={styles.image} />

            <View style={{ flex: 1, marginEnd: 20, }}>
              <View >

                {item.products.slice(0, 2).map((product, index) => {
                  const isSecondProduct = index === 1;
                  return (
                    <Text key={product?.details?.itemId}
                      style={[textVariants.buttonTextHeading, { color: Colors.black, paddingBottom: 6 }]}>
                      {product?.details?.itemname}{isSecondProduct && item?.products?.length > 2 ? '.........' : ''}
                    </Text>
                  );
                })}
                <View style={{ flexDirection: 'row', }}>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.black }]}>Your Order is :  </Text>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.primary, }]}>{item?.state}</Text>
                </View>
              </View>
              <View style={styles.detailsView}>
                {/* <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>
                  {item.payment.status === true ? "Paid" : "COD"}
                </Text> */}
                <Text style={[textVariants.buttonTextHeading, { color: Colors.gray, }]}> ₹ {item?.grandTotal}</Text>
              </View>
              {/* Cancel Order Button */}
              {item.state === 'pending' &&
                <TouchableOpacity
                  style={styles.statusView}
                  onPress={() => confirmCancelOrder(item)}>
                  <Text style={[textVariants.buttonTextHeading, { fontSize: dimensions.vw * 2.6, textAlign: 'center', color: Colors.red }]}>Cancel Order</Text>
                </TouchableOpacity>}



            </View>


          </View>
        </TouchableOpacity>
      </CCard>
    )
  };

  if (error) {
    console.log(error);
    let errorMessage = 'An error occurred while fetching the items.';

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
        <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{error.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20, textAlign: 'center' }]}>{errorMessage}</Text>
        <CButton label='Reload' mode='contained' onPress={refetch} />
      </View>
    )
  }

  if (isLoading || isCancelOrderLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        {
          orderDetails && orderDetails.length ? (
            <View style={{ flex: 1, marginHorizontal: 16 }}>

              <FlatList
                data={orderDetails}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
              />
            </View>
          ) : (

            // View for No Order Text 
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={cartImage} style={styles.logo} resizeMode="contain" />
                <Text style={styles.noOrderText}>No orders yet</Text>
              </View>
              <View style={{ margin: moderateScale(20) }}>
                <CButton label="Start Ordering" mode="contained" onPress={goToHome} />
              </View>
            </View>
          )

        }
      </ImageBackground>
    </ScrollView >
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  mainCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayDim,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 24
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed',
  },
  billStatementContainer: {
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed',
  },
  logoBackground: {
    flex: 1,
  },
  logo: {
    width: dimensions.vw * 28,
    height: dimensions.vw * 28,
    margin: 40,
  },
  noOrderText: {
    fontSize: dimensions.vw * 5.6,
    color: Colors.grayDim,
    fontFamily: 'Montserrat SemiBold',
    fontWeight: '600',
    textAlign: 'center',
  },
  image: {
    width: dimensions.vw * 17.2,
    height: dimensions.vw * 17.2,
    borderRadius: 10,
    margin: 20,
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderWidth: 1
  },
  statusView: {
    // backgroundColor: Colors.red,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 10,
    height: dimensions.vh * 3.5,
    width: dimensions.vw * 40,
    justifyContent: 'center',
    marginVertical: 5,
    // marginEnd: 10,
  },

});