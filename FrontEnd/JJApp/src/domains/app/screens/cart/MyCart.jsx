import { Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { textVariants } from '../../../../theme/StyleVarients';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearHeader from '../../../../components/LinearHeader';
import { Colors } from '../../../../theme/Colors';
import CCard from '../../../../components/CCard';
import CButton from '../../../../components/CButton';
import OrderPreference from './OrderPreference';
import Coupons from './Coupons';
import BillStatement from './BillStatement';
import OrderDetails from './OrderDetails';
import dimensions from '../../../../theme/Dimensions';
import { useGetCartItemsQuery } from '../../../api/cartItems';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Icon, Modal, Portal, RadioButton, } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { setCartItems } from './slices/cartItemsSlice';
import { useCreateOrderMutation } from './api/createOrder';
import LottieView from 'lottie-react-native';
import RazorpayCheckout from 'react-native-razorpay'
import { useRazorPayConfirmationMutation } from './api/razorPayConfirmation';
import Toast from 'react-native-toast-message';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as yup from 'yup';
import { useRazorPayFailureMutation } from './api/razorPayFailure';
import { setCoupon } from './slices/appliedCouponId';
import { setOrderPreference } from './slices/orderPreferenceSlice';
import { Background } from '../../../../theme/ConfigrationStyle';
import { useGetRestaurantStatusQuery } from '../../../../apis/getRestaurantStatus';
import messaging from '@react-native-firebase/messaging';
import RestaurantClose from '../../../../components/RestaurantClose';


const MyCart = () => {
  const cartImage = require("../../../../../assets/images/cartIcon.png");
  const addIcon = require('../../../../../assets/images/addProductIcon.png');
  const arrowIcon = require('../../../../../assets/images/rightArrow.png');
  const navigation = useNavigation();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const appliedCoupon = useAppSelector((state) => state.persistedReducer.appliedCouponId.appliedCoupon)
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);
  const deliveryAddressId = useAppSelector((state) => state.persistedReducer.deliveryAddressIdSlice.deliveryAddressId)
  const orderPreference = useAppSelector((state) => state.persistedReducer.orderPreferenceSlice.orderPreference)
  const isGuest = useAppSelector((state) => state.persistedReducer.authSlice.isGuest)
  const dispatch = useAppDispatch();
  const userId = userDetails?._id;


  // Api for Cart details
  const { data, error: cartError, isLoading: cartIsLoading, refetch } = useGetCartItemsQuery({ userId }, {
    refetchOnMountOrArgChange: true, // Automatically refetch on component mount or when arguments change
    refetchOnReconnect: true, // Automatically refetch on reconnect
    refetchOnFocus: true, // Automatically refetch on focus
  });
  // console.log(data, '-----------Cart ITems----------')


  // Api for creating new order
  const [createOrder, { isLoading: createOrderLoading, isError: createOrderIsError, isSuccess: createOrderSuccess, error: createOrderError }] = useCreateOrderMutation();

  // Api for restaurnat status
  const { data: restaurantStatus, error: restaurantStatusError, isLoading: isRestaurantStatusLoading, refetch: restaurantStatusRefetch } = useGetRestaurantStatusQuery();

  // Razor pay confirmation and failure api 
  const [razorPayConfirmation, { isLoading, razorPayResponse, error }] = useRazorPayConfirmationMutation();
  const [razorPayFailure, { isLoading: isLoadingFailure, error: FailureError }] = useRazorPayFailureMutation();

  const [visible, setVisible] = useState(false)
  const [preOrderModel, setPreOrderModel] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [errors, setErrors] = useState({ date: '', time: '' });
  const [showRestaurantClose, setShowRestaurantClose] = useState(false);

  // for getting latest restaurant status
  useEffect(() => {
    restaurantStatusRefetch();
  }, [restaurantStatus]);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification?.body === 'close') {
        setShowRestaurantClose(true);
      } else if (remoteMessage.notification?.body === 'open') {
        setShowRestaurantClose(false);
      }
      restaurantStatusRefetch();
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  // Validation for Acception date for PreOrder type 
  const validationSchema = yup.object().shape({
    date: yup.string().required('Date is required'),
    time: yup.string().required('Time is required'),
  });

  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate.toISOString().split('T')[0]);
    setDatePickerVisible(false);
  };

  const handleTimeConfirm = (selectedTime) => {
    setTime(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setTimePickerVisible(false);
  };

  const previousDataRef = useRef(data);

  // Getting the Latest Cart items on Focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetch();
        if (data && data !== previousDataRef.current) {
          dispatch(setCartItems(data));
          dispatch(setCoupon({ appliedCoupon: '' }));
        }
        previousDataRef.current = data;
      }
    }, [userId, data])
  );

  const handleAddMoreItems = () => {
    navigation.navigate('Home');
  };

  const handleMoreCouponsButton = () => {
    navigation.navigate('CollectedCoupons');
  }

  const handleCODPress = () => {
    setSelectedPaymentMethod('COD');
  };

  const handlePayNowButtonPress = () => {
    setSelectedPaymentMethod('online');
  };

  const handleCreateOrder = async (orderData) => {
    try {
      // console.log('CreateOrder Called ---------', orderData)
      const response = await createOrder(orderData).unwrap();
      // console.log(response, '----------------------------')
      setSelectedPaymentMethod('')
      dispatch(setOrderPreference({ id: '', orderPreference: '' }));
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        navigation.navigate('OrdersNavigator');
      }, 1500);
      // Refetch data after order creation is successful
      try {
        const refetchResponse = await refetch().unwrap();
        console.log(refetchResponse);
      } catch (refetchError) {
        console.error('Failed to refetch data:', refetchError);
      }
    } catch (error) {
      dispatch(setOrderPreference({ id: '', orderPreference: '' }));
      setSelectedPaymentMethod('')
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.message}, Status: ${error.status}`
      });
      console.error('Failed to create order:', error);
    }
  }

  const handleRazorPay = async (orderData) => {
    try {
      // Creating Order First  
      const response = await createOrder(orderData).unwrap();
      const options = { ...response, theme: { color: Colors.primary } };
      // Calling RazorPay Gateway 
      RazorpayCheckout.open(options).then(async (data) => {
        // console.log(data, '---------------------RazorPay Success------------')
        // Ensure razorpay_payment_id is defined
        const razorpay_payment_id = data.razorpay_payment_id;
        if (!razorpay_payment_id) {
          throw new Error('razorpay_payment_id is missing');
        }
        // Calling Confirmation API 
        const result = await razorPayConfirmation({
          orderId: response?.order,
          rPaymentId: razorpay_payment_id,
          rSignature: data.razorpay_signature,
          rOrderId: data.razorpay_order_id,
        }).unwrap();

        // console.log(result, "Confirmation Result ---------------------------------");
        setSelectedPaymentMethod('');
        dispatch(setOrderPreference({ id: '', orderPreference: '' }));
        setTime('')
        setDate('')
        setVisible(true);
        setTimeout(() => {
          setVisible(false);
          navigation.navigate('OrdersNavigator');
        }, 1500);

        try {
          const refetchResponse = await refetch().unwrap();
          console.log(refetchResponse);
        } catch (refetchError) {
          console.error('Failed to refetch data:', refetchError);
        }

      }).catch(async (error) => {
        // console.log(error, "Razorpay Error ---------------------------------");
        const result = await razorPayFailure({
          orderId: response?.order,
          rPaymentId: error.error?.metadata?.payment_id,
          rSignature: '',
          rOrderId: error.error?.metadata?.order_id || '',
          reason: error.error?.reason,
        }).unwrap();
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: `Error: ${error.code} | ${error.description}`,
        });
        setSelectedPaymentMethod('');
        dispatch(setOrderPreference({ id: '', orderPreference: '' }));
      });
    } catch (error) {
      dispatch(setOrderPreference({ id: '', orderPreference: '' }));
      setSelectedPaymentMethod('')
      console.log('Error', error.message);
      Toast.show({
        type: 'error',
        text1: 'Order Creation Failed',
        text2: `Error: ${error.message}, Status: ${error.status}`
      });
    }
  };

  const handleProceed = async () => {

    if (!selectedPaymentMethod || !orderPreference) {
      alert('Please select Order preference and Payment Option.');
      return;
    }
    const orderData = {
      userId,
      orderPreference,
      discount: { couponId: appliedCoupon },
      preOrder: {
        type: false,
        orderDate: '',
        orderTime: ''
      },
      address: orderPreference === 'Deliver to my Address' ? deliveryAddressId : '',
      payment: {
        paymentId: '',
        paymentMethod: selectedPaymentMethod === "COD" ? "COD" : "online"
      },
    };
    try {
      if (selectedPaymentMethod === 'online') {
        await handleRazorPay(orderData);
      } else {
        await handleCreateOrder(orderData)
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.message}, Status: ${error.status}`
      });
      console.error('Failed to create order:', error);
    }
  };

  const handlePreOrder = async () => {
    if (!orderPreference || !selectedPaymentMethod) {
      alert('Please select Order preference and Payment Option.');
      return;
    }
    setPreOrderModel(true)
  }

  const handleSubmit = async () => {
    const orderData = {
      userId,
      orderPreference,
      discount: { couponId: appliedCoupon },
      preOrder: {
        type: true,
        orderDate: date,
        orderTime: time,
      },
      address: orderPreference === 'Deliver to my Address' ? deliveryAddressId : '',
      payment: {
        paymentId: '',
        paymentMethod: selectedPaymentMethod === "COD" ? "COD" : "online"
      },
    };
    try {
      await validationSchema.validate({ date, time }, { abortEarly: false });
      setErrors({ date: '', time: '' });
      setPreOrderModel(false)
      if (selectedPaymentMethod === 'online') {
        await handleRazorPay(orderData);
      } else {
        await handleCreateOrder(orderData)
      }
      // proceedPreOrder()
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${err.message}, Status: ${err.status}`
      });
      console.error('Failed to create order:', err);
    }
  };


  if (cartError) {
    console.log(cartError);
    let errorMessage = 'An error occurred while fetching the cart items.';

    if (cartError.status === 'FETCH_ERROR') {
      errorMessage = 'Network error:\n Please check your internet connection.';
    } else if (cartError.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (cartError.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (cartError.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {cartError.status === 'FETCH_ERROR' &&
          <LottieView
            source={require('../../../../../assets/lottieFiles/noInternet.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 200, alignSelf: 'center' }}
          />
        }
        <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{cartError.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20, textAlign: 'center' }]}>{errorMessage}</Text>
        <CButton label='Reload' mode='contained' onPress={refetch} />
      </View>
    )
  }

  if (createOrderLoading || isLoading || cartIsLoading || isRestaurantStatusLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* <ActivityIndicator animating={true} color={Colors.primary} size={25} /> */}
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center', }}
        />
      </View>
    )
  }

  // Component if Restaurant is closed
  // if (showRestaurantClose || !restaurantStatus?.state) {
  //   return <RestaurantClose />;
  // }



  return (
    <>
      {/* Restaurant Close View */}
      {(showRestaurantClose || !restaurantStatus?.state) ? (<RestaurantClose />) : null}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground source={Background.jjBackground} resizeMode="cover" style={{ flex: 1 }}>
          <LinearHeader />
          <View style={styles.mainContainer}>
            {/* No Order Text */}
            {(cartItems?.itemsTotal === 0) ? (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={cartImage} style={styles.logo} resizeMode="contain" />
                  <Text style={styles.noOrderText}>Your Cart is Empty</Text>
                </View>
                <View style={{ margin: moderateScale(20) }}>
                  <CButton label="Start Ordering" mode="contained" onPress={handleAddMoreItems} />
                </View>
              </View>
            ) : (
              <View style={styles.mainContainer}>
                {/* <Text style={[textVariants.textHeading2, { fontSize: 17, textAlign: 'center' }]}>Yay! You Saved ₹50 with FREE delivery</Text> */}

                {/* Order Details  */}
                <View style={{ marginTop: 10 }}>
                  <Text style={textVariants.textHeading}>Order Basket</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18 }}>
                    {/* <OrderDetails data={guestCartItems} /> */}
                    <OrderDetails />
                    <CButton
                      label="Add More Items"
                      icon={addIcon}
                      iconSize={dimensions.vw * 4.4}
                      mode="text"
                      labelStyle={[textVariants.textSubHeading, { fontSize: 18 }]}
                      contentStyle={{ flexDirection: 'row-reverse' }}
                      onPress={handleAddMoreItems}
                    />
                  </CCard>
                </View>

                {/* Coupons */}
                <View style={{ marginTop: 36 }}>
                  <Text style={textVariants.textHeading}>Offers And Benefits</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 17 }}>
                    <Coupons />
                    <CButton
                      label="View Coupons"
                      icon={arrowIcon}
                      iconSize={dimensions.vw * 4.4}
                      mode="text"
                      labelStyle={[textVariants.textSubHeading, { fontSize: 18 }]}
                      contentStyle={{ flexDirection: 'row-reverse' }}
                      onPress={handleMoreCouponsButton}
                    />
                  </CCard>
                </View>

                {/* Order Preferance */}
                <View style={{ marginTop: 36 }}>
                  <Text style={textVariants.textHeading}>Order Preference</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18 }}>
                    <OrderPreference />
                  </CCard>
                </View>

                {/* Bill Statement */}
                <View style={{ marginTop: 36 }}>
                  <Text style={textVariants.textHeading}>Bill Statement</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18, marginBottom: 20 }}>
                    <BillStatement data={cartItems} />
                  </CCard>
                </View>

                {/* COD Button  */}
                <View>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.9 }]}>Pay on Delivery</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 8, marginBottom: 20, padding: 0 }}>
                    <TouchableOpacity style={styles.itemContainer} onPress={handleCODPress}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginEnd: 15 }}>
                          <Icon
                            source={require('../../../../../assets/images/cashIcon.png')}
                            color={selectedPaymentMethod === 'COD' ? Colors.primary : Colors.black}
                            size={dimensions.vw * 7}
                          />
                        </View>
                        <Text style={[textVariants.textSubHeading, { color: selectedPaymentMethod === 'COD' ? Colors.primary : Colors.black }]}>
                          Cash on Delivery
                        </Text>
                      </View>
                      <RadioButton
                        value="cashOnDelivery"
                        status={selectedPaymentMethod === 'COD' ? 'checked' : 'unchecked'}
                        onPress={handleCODPress}
                        color={Colors.primary}
                        uncheckedColor={Colors.gray}
                      />
                    </TouchableOpacity>
                  </CCard>
                </View>

                {/* Pay Now Button */}
                <View>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.9 }]}>Pay Now</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 8, padding: 0 }}>
                    <TouchableOpacity style={styles.itemContainer} onPress={handlePayNowButtonPress}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginEnd: 15 }}>
                          <Icon
                            source={require('../../../../../assets/images/rupeeIcon.png')}
                            color={selectedPaymentMethod === 'online' ? Colors.primary : Colors.black}
                            size={dimensions.vw * 3.8}
                          />
                        </View>
                        <Text style={[textVariants.textSubHeading, { color: selectedPaymentMethod === 'online' ? Colors.primary : Colors.black }]}>
                          Pay Now</Text>
                      </View>
                      <RadioButton
                        value="payNow"
                        status={selectedPaymentMethod === 'online' ? 'checked' : 'unchecked'}
                        onPress={handlePayNowButtonPress}
                        color={Colors.primary}
                        uncheckedColor={Colors.gray}
                      />
                    </TouchableOpacity>
                  </CCard>
                </View>

                {/* Order Buttons  */}
                <View style={styles.orderButtonsContainer}>
                  <CButton
                    label={"Pre Order"}
                    mode="contained"
                    onPress={handlePreOrder}
                    disabled={showRestaurantClose || !restaurantStatus?.state}
                  />
                  <CButton
                    label={selectedPaymentMethod === 'COD' ? "Order Now " : "Proceed"}
                    mode="contained"
                    onPress={handleProceed}
                    disabled={showRestaurantClose || !restaurantStatus?.state}
                  />
                </View>

                {/* Model for Confirmation of Order */}
                <Portal>
                  <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={[styles.model, { width: 200 }]}>
                    <LottieView
                      source={require('../../../../../assets/lottieFiles/success.json')}
                      autoPlay
                      loop={true}
                      style={{ width: 150, height: 150, alignSelf: 'center' }}
                    />
                    <Text style={[textVariants.textSubHeading, { textAlign: 'center' }]}>Order is done!</Text>
                  </Modal>
                </Portal>

                {/* Date and time model for PreOrder*/}
                <Portal>
                  <Modal
                    visible={preOrderModel}
                    onDismiss={() => setPreOrderModel(false)}
                    contentContainerStyle={styles.model}
                  >
                    <Text style={textVariants.textHeading}>Order Date :</Text>
                    <TextInput
                      style={styles.input}
                      value={date}
                      placeholder="Select Order Date"
                      placeholderTextColor={Colors.grayDim}
                      onFocus={() => setDatePickerVisible(true)}
                    />
                    {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleDateConfirm}
                      onCancel={() => setDatePickerVisible(false)}
                      minimumDate={new Date()} // Set minimum date to today
                    />
                    <Text style={textVariants.textHeading}>Order Time :</Text>
                    <TextInput
                      style={styles.input}
                      value={time}
                      placeholder="Select Order Time"
                      placeholderTextColor={Colors.grayDim}
                      onFocus={() => setTimePickerVisible(true)}
                    />
                    {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
                    <DateTimePickerModal
                      isVisible={isTimePickerVisible}
                      mode="time"
                      onConfirm={handleTimeConfirm}
                      onCancel={() => setTimePickerVisible(false)}

                    />
                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                      <CButton label='Order Now' mode='contained' onPress={handleSubmit} />
                    </View>
                  </Modal>
                </Portal>

              </View>
            )}
          </View>
        </ImageBackground>
      </ScrollView >
    </>
  );
};

export default MyCart;

const styles = StyleSheet.create({
  input: {
    margin: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grayDim,
    color: Colors.gray,
    fontSize: 20,
    textAlign: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10
  },
  TopText: {
    ...textVariants.SecondaryHeading,
    color: Colors.green,
    marginVertical: moderateScale(20),
  },
  logo: {
    width: dimensions.vw * 20,
    height: dimensions.vw * 20,
  },
  noOrderText: {
    // fontSize: 24,
    fontSize: dimensions.vw * 5.6,
    color: Colors.gray,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600",
    marginTop: 40
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  model: {
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    width: 300,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    paddingStart: 15
  },
  orderButtonsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  }
});
