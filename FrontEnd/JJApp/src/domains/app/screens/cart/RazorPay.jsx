import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import CCard from '../../../../components/CCard'
import { ActivityIndicator, Icon } from 'react-native-paper'
import dimensions from '../../../../theme/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
import { useAppSelector } from '../../../../store/hooks'
import { useCreateOrderMutation } from './api/createOrder'
import { Colors } from '../../../../theme/Colors'
import RazorpayCheckout from 'react-native-razorpay'
import { useRazorPayConfirmationMutation } from './api/razorPayConfirmation'


// const fetchOrderId = async (amount) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}create-order`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         amount,
//         currency: 'INR',
//         receipt: 'helloThere'
//       }),
//     });

//     const data = await response.json();
//     return data.id;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Failed to create order');
//   }
// };

const RazorPay = () => {

  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const orderPreference = useAppSelector((state) => state.persistedReducer.orderPreferenceSlice.orderPreference)
  const deliveryAddressId = useAppSelector((state) => state.persistedReducer.deliveryAddressIdSlice.deliveryAddressId)
  const userId = userDetails?._id;
  const [createOrder, { isLoading: createOrderLoading, isError: createOrderIsError, isSuccess: createOrderSuccess, error: createOrderError }] = useCreateOrderMutation();

  const [razorPayConfirmation, { isLoading, data, error }] = useRazorPayConfirmationMutation();

  const handlePayNowButtonPress = async () => {
    const orderData = {
      userId: userId,
      orderPreference: orderPreference,
      discount: { couponId: '' },
      address: orderPreference === 'Deliver to my Address' ? deliveryAddressId : '',
      payment: {
        paymentId: '',
        paymentMethod: 'online',
      },
    };

    try {
      // Creating Order First  
      const response = await createOrder(orderData).unwrap();
      const options = { ...response, theme: { color: Colors.primary } };

      // Calling RazorPay Gateway 
      RazorpayCheckout.open(options).then(async (data) => {
        console.log(data, "RazorPay ---------------------------------");

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

        console.log(result, "Confirmation Result ---------------------------------");

      }).catch((error) => {
        console.log(error, "Razorpay Error ---------------------------------");
        // Display Toast for Payment Failed
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: `Error: ${error.code} | ${error.description}`,
        });
      });
    } catch (error) {
      console.log('Error', error.message);
      Toast.show({
        type: 'error',
        text1: 'Order Creation Failed',
        text2: `Error: ${error.message}`,
      });
    }
  };




  if (createOrderLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={Colors.primary} size={50} />
      </View>
    )
  }

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.9 }]}>Pay Now</Text>
      <CCard style={{ marginHorizontal: 0, marginTop: 8, marginBottom: 20 }}>
        <TouchableOpacity style={styles.itemContainer} onPress={handlePayNowButtonPress}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginEnd: 15 }}>
              <Icon
                source={require('../../../../../assets/images/rupeeIcon.png')}
                color={Colors.black}
                size={dimensions.vw * 3.8}
              />
            </View>
            <Text style={[textVariants.textSubHeading, { color: Colors.black, width: dimensions.vw * 65, }]}>Pay Now</Text>
          </View>
          <Icon
            source={require('../../../../../assets/images/rightArrow.png')}
            color={Colors.gray}
            size={dimensions.vw * 3.8}
          />
        </TouchableOpacity>
      </CCard>
    </View>
  )
}

export default RazorPay

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
  },
})