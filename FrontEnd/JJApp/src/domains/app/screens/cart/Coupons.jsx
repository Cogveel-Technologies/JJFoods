import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CButton from '../../../../components/CButton';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { useGetAvailableCouponsQuery } from './api/availableCoupons';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useApplyCouponMutation } from './api/applyCoupon';
import { setCartItems } from './slices/cartItemsSlice';
import LottieView from 'lottie-react-native';
import { setCoupon } from './slices/appliedCouponId';
import Toast from 'react-native-toast-message';


const renderItem = ({ item, handleApplyCoupon, appliedCouponId }) => {
  return (
    <View style={{ marginHorizontal: 8, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ marginTop: 8, marginBottom: 16, width: dimensions.vw * 58 }}>
        <Text style={[styles.HeadingText, { marginBottom: 6 }]}>{item.title}</Text>
        <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.5 }]}>{item.description}</Text>
        <Text style={[textVariants.buttonTextSubHeading, { color: Colors.ternary }]}>Minimum Order: ₹{item.minimumOrder}</Text>
        <Text style={[textVariants.buttonTextSubHeading, { marginBottom: 6, color: Colors.ternary }]}>Max Order: ₹{item.maximumOrder}</Text>
      </View>
      <CButton
        label={appliedCouponId === item._id ? 'Applied' : 'Apply'}
        mode="text"
        onPress={() => handleApplyCoupon(item)}
        disabled={appliedCouponId === item._id}
      />
    </View>
  );
};

const Coupons = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);

  const { data: coupons, error, isLoading, refetch } = useGetAvailableCouponsQuery({ userId });
  const [availableCoupons, setAvailableCoupons] = useState(coupons?.slice(0, 2));
  const [appliedCouponId, setAppliedCouponId] = useState(null);

  useEffect(() => {
    refetch();
    if (coupons) {
      setAvailableCoupons(coupons.slice(0, 2));
    }
  }, [coupons,]);

  // This useeffect is for changing the applied text button to apply back when ever there is change in cart after applying the coupon
  // useEffect(() => {
  //   if (!cartItems?.appliedCouponId) {
  //     setAppliedCouponId(null);
  //   }
  // }, [cartItems]);


  const [applyCoupon, { isLoading: isApplyCouponLoading, error: applyCouponError, data }] = useApplyCouponMutation();

  const handleApplyCoupon = async (coupon) => {
    try {
      const response = await applyCoupon({ userId, couponId: coupon?._id, price: cartItems?.itemsTotal }).unwrap();
      // console.log(response, '-----------apply--------');

      if (response?.discount === 0) {
        setAppliedCouponId(null);
        Toast.show({
          type: 'error',
          text1: 'Minimum / Maximum order Price not met',
          text2: 'Not Applied !'
        });
      } else {
        dispatch(setCoupon({ appliedCoupon: coupon?._id }));
        dispatch(setCartItems(response));
        setAppliedCouponId(coupon._id);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to apply coupon',
        text2: `${error.message}, Status: ${error.status || 'Unknown'}`
      });
      console.error("Failed to apply coupon:", error.message);
    }
  };


  if (isApplyCouponLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center', }}
        />
      </View>
    );
  }

  if (error) {
    console.log(error);
    let errorMessage = 'An error occurred while fetching the cart items.';

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

  return (
    <FlatList
      data={availableCoupons}
      renderItem={({ item }) => renderItem({ item, handleApplyCoupon, appliedCouponId })}
      keyExtractor={(item) => item._id}
    />
  );
};

export default Coupons;

const styles = StyleSheet.create({
  HeadingText: {
    fontSize: dimensions.vw * 4.3,
    color: Colors.primary,
    fontFamily: "Montserrat Medium",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
