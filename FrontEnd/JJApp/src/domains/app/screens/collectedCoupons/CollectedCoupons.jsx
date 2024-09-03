import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, FlatList, StyleSheet, Text, View } from 'react-native';
import { textVariants } from '../../../../theme/StyleVarients';
import LinearHeader from '../../../../components/LinearHeader';
import dimensions from '../../../../theme/Dimensions';
import { Colors } from '../../../../theme/Colors';
import CCard from '../../../../components/CCard';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import CButton from '../../../../components/CButton';
import { useGetAvailableCouponsQuery } from '../cart/api/availableCoupons';
import LottieView from 'lottie-react-native';
import { useApplyCouponMutation } from '../cart/api/applyCoupon';
import { setCartItems } from '../cart/slices/cartItemsSlice';
import Toast from 'react-native-toast-message';
import { Background } from '../../../../theme/ConfigrationStyle';

const CouponItem = ({ data, appliedCouponId, handleApplyCoupon }) => {
  const isApplied = appliedCouponId === data._id;

  return (
    <CCard style={{ marginHorizontal: 0, marginTop: 16 }}>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Image
          source={require('../../../../../assets/images/cashIcon.png')}
          style={{ height: 30, width: 30, marginHorizontal: 15, marginTop: 8 }}
          resizeMode='contain'
        />
        <View >
          <Text style={styles.heading}>{data.title}</Text>
          <Text style={[styles.subHeading, { paddingTop: 5, width: dimensions.vw * 75 }]}>{data.description}</Text>
          <View style={{ borderColor: Colors.gray, borderWidth: 1, borderRadius: 4, marginVertical: 10, alignItems: 'center', width: dimensions.vw * 40 }}>
            <Text style={[styles.subHeading, { color: Colors.gray, padding: 5 }]}>{data.code}</Text>
          </View>
        </View>
      </View>
      <View style={{ borderTopWidth: 1, borderStyle: 'dashed', borderColor: Colors.grayDim, paddingTop: 5 }} />
      <CButton label={isApplied ? 'APPLIED' : 'TAP To APPLY'} mode='text' onPress={() => handleApplyCoupon(data)} disabled={isApplied} />
    </CCard>
  );
};

const CollectedCoupons = () => {
  const cartImage = require("../../../../../assets/images/emptyCouponsIcon.png");
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);
  const { data: coupons, error, isLoading, isError, refetch } = useGetAvailableCouponsQuery({ userId });
  const [applyCoupon, { isLoading: isApplyCouponLoading, error: applyCouponError, data: applyCouponData }] = useApplyCouponMutation();
  const dispatch = useAppDispatch();
  const [appliedCouponId, setAppliedCouponId] = useState(null);

  useEffect(() => {
    refetch();
  }, [coupons]);

  const handleApplyCoupon = async (coupon) => {
    if (cartItems?.itemsTotal === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Cart',
        text2: 'You can\'t apply the coupon on an empty cart'
      });
      return;
    }
    try {
      const response = await applyCoupon({ userId, couponId: coupon?._id, price: cartItems?.itemsTotal }).unwrap();
      if (response?.discount === 0) {
        setAppliedCouponId(null);
        Toast.show({
          type: 'error',
          text1: 'Minimum / Maximum order price not met',
          text2: 'Not Applied!'
        });
      } else {
        dispatch(setCartItems(response));
        setAppliedCouponId(coupon?._id);
        Toast.show({
          type: 'success',
          text1: 'Coupon Applied',
          text2: `You have successfully applied the coupon ${coupon?.code}`
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${err.message}, Status: ${err.status}`
      });
      console.error("Failed to apply coupon:", err.message);
    }
  };

  if (isLoading || isApplyCouponLoading) {
    return (
      <View style={styles.centeredContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    );
  }

  if (isError) {
    console.log(error);
    return (
      <View style={styles.centeredContainer}>
        <Text style={textVariants.textSubHeading}>Failed to load coupons. Please try again.</Text>
      </View>
    );
  }

  if (error || applyCouponError) {
    console.log(error);
    let errorMessage = 'An error occurred while fetching the coupons.';

    if (error.status === 'FETCH_ERROR') {
      errorMessage = 'Network error:\n Please check your internet connection.';
    } else if (error.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (error.originalStatus === 404) {
      errorMessage = 'Coupons not found.';
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
    );
  }

  return (
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />
      <View style={{ flex: 1, marginBottom: 15 }}>
        {coupons?.length ? (
          <View style={{ flex: 1, marginTop: 30, marginHorizontal: 18 }}>
            <Text style={[textVariants.SecondaryHeading, { color: Colors.gray }]}>Best Offers For You</Text>
            <FlatList
              data={coupons}
              renderItem={({ item }) => (
                <CouponItem
                  data={item}
                  appliedCouponId={appliedCouponId}
                  handleApplyCoupon={handleApplyCoupon}
                />
              )}
              keyExtractor={(item) => item._id}
            />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={cartImage} style={styles.logo} resizeMode="contain" />
            <Text style={styles.noOrderText}>No Coupons Yet!</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default CollectedCoupons;

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  logo: {
    width: dimensions.vw * 28,
    height: dimensions.vw * 32,
    margin: 40,
  },
  noOrderText: {
    fontSize: dimensions.vw * 5.6,
    color: Colors.grayDim,
    fontFamily: 'Montserrat SemiBold',
    fontWeight: '600',
    textAlign: 'center',
  },
  heading: {
    fontSize: dimensions.vw * 3.8,
    color: Colors.black,
    fontFamily: "Montserrat Bold",
    fontWeight: "700",
  },
  subHeading: {
    fontSize: dimensions.vw * 3.3,
    color: Colors.primary,
    fontFamily: "Montserrat Medium",
    fontWeight: "500",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
