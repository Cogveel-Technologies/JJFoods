import { Alert, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import CsmallButton from '../../../../components/CsmallButton'
import { IconButton } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useGetWishlistQuery } from './apis/getWishlist'
import { useAppSelector } from '../../../../store/hooks'
import CButton from '../../../../components/CButton'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { moderateScale } from 'react-native-size-matters'
import { useRemoveItemFromWishlistMutation } from './apis/removeItemFromWishlist'
import { useAddToCartFromWishlistMutation } from './apis/addToCartFromWishlist'
import LottieView from 'lottie-react-native'
import { Background, DemoImages } from '../../../../theme/ConfigrationStyle'


const WishList = () => {
  const navigation = useNavigation()
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const { isAuthenticated, isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);
  const userId = userDetails?._id;

  const { data, isLoading, isError, error, isFetching, isSuccess, refetch } = useGetWishlistQuery({ userId }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [removeItem, { isLoading: removeWishlistLoading, isError: removeWishlistIsError, isSuccess: removeWishlistSuccess, error: removeFromWishlistError }] = useRemoveItemFromWishlistMutation()

  const [addToCartFromWishlist, { isLoading: isaddCartLoading, isError: isCartError, error: addToCartError }] = useAddToCartFromWishlistMutation();


  const emptyCoupon = require("../../../../../assets/images/emptyCouponsIcon.png");
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    // console.log(data, '***************WishList******************')
    if (data) {
      setWishlistItems(data)
    }
    // console.log(wishlistItems, 'wishlist-----------------------')
  }, [data])

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [wishlistItems])
  );

  const handleRefresh = async () => {
    try {
      const response = await refetch().unwrap();
      setWishlistItems(response);
      // console.log('Refresh successful:', response);
    } catch (error) {

      console.error('Error refreshing data:', error);
      // Optionally, you can show an error message to the user
    }
  };


  const showAlert = (item) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove item from wishList",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleRemoveWishlistItem(item) }
      ],
      { cancelable: false }
    );
  };

  const handleRemoveWishlistItem = async (item) => {
    try {
      const response = await removeItem({ userId, itemId: item.itemId }).unwrap();
      setWishlistItems(response)
      Toast.show({
        type: 'error',
        text1: 'Removed',
        text2: 'Removed from WishList 👋',
      });
    } catch (error) {
      // Handle the error appropriately
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove item from WishList 😞',
      });
      console.error('Failed to remove item from wishlist', error);
    }
  };

  const handleAddItem = async (item) => {
    // console.log(item, '########################################')
    if (item.itemstockquantity == 0) {
      Toast.show({
        type: 'info',
        text1: 'Error',
        text2: `Item is Out of Stock ��`,
      });
      return;
    }

    try {
      const response = await addToCartFromWishlist({
        userId: userId,
        product: { itemId: item.itemId },
      }).unwrap();
      setWishlistItems(response);
      // console.log(response, 'Success:+++++++++++++++++++++++++++++++++++');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Added To Cart Successfully  👋',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed to add to cart ��',
        text2: `${err}`,
      })
      console.error('Failed to add to cart:', err.message);
    }
  };

  const ProductCard = ({ item }) => {
    const { item_image_url, itemname, rating, price } = item.itemDetails;

    return (
      <ImageBackground
        source={item?.item_image_url
          ? { uri: item.item_image_url }
          : DemoImages.productDemo3}
        resizeMode='cover'
        style={{
          height: dimensions.vw * 37, borderRadius: 16, overflow: 'hidden', marginVertical: 9,
          borderWidth: 1, borderColor: Colors.grayDim
        }} >

        <View style={{ marginHorizontal: 17, marginVertical: 14, flex: 1, justifyContent: 'space-between' }} >
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={textVariants.buttonTextHeading}>{itemname}</Text>
              <IconButton
                icon={require('../../../../../assets/images/wishListIcon.png')}
                iconColor={'#E34F4F'}
                size={dimensions.vw * 5}
                onPress={() => showAlert(item)}
                style={{ margin: -5 }}
              />
            </View>
            {rating > 0 &&
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Text style={[textVariants.buttonTextSubHeading, { paddingEnd: 5 }]}>{quantity}</Text> */}
                <Text style={[textVariants.buttonTextHeading, { paddingStart: 5, borderLeftWidth: 2, borderColor: Colors.white }]}>{Number(rating).toFixed(1)}</Text>
                <StarRatingDisplay
                  maxStars={1}
                  rating={rating}
                  starSize={dimensions.vw * 6}
                  color='#EFB23D'
                  style={{ margin: -5 }}
                />
              </View>
            }
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <Text style={[textVariants.buttonTextHeading, {
              borderWidth: 1, borderColor: Colors.white,
              width: dimensions.vw * 16, borderRadius: 8, textAlign: 'center', textAlignVertical: 'center',
            }]}>₹ {price}</Text>

            <CsmallButton icon={require('../../../../../assets/images/addIcon.png')} label='Add' mode='contained' type='leftIcon' onPress={() => handleAddItem(item)} />
          </View>

        </View>
      </ImageBackground>
    );
  };


  if (isAuthenticated) {

    if (error) {
      console.log(error);
      let errorMessage = 'An error occurred while fetching the  items.';

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

  } else {
    return (
      <View style={styles.centeredContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/noAccess.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 200, alignSelf: 'center', }}
        />
        <Text style={[textVariants.textHeading, { paddingBottom: 10, color: Colors.primary }]}>Sorry</Text>
        <Text style={[styles.noOrderText, { margin: 10, marginTop: 0, fontSize: dimensions.vw * 4 }]}>You are not loggedIn</Text>
        <CButton label="Login to Continue " mode="contained" onPress={() => navigation.navigate("AuthTopTabNavigator")} />
      </View>
    );
  }

  if (isLoading || isaddCartLoading || removeWishlistLoading) {
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
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <LinearHeader />
      {wishlistItems.length > 0 ?
        (<View style={{ marginHorizontal: 16, marginVertical: 25 }}>
          <FlatList
            data={wishlistItems}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.itemDetails?.itemid}
            onRefresh={handleRefresh}
            refreshing={isLoading}
          />
        </View>
        ) :
        (<View style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={emptyCoupon} style={styles.logo} resizeMode="contain" />
            <Text style={styles.noOrderText}>Your Wishlist is Empty</Text>
          </View>
          <View style={{ margin: moderateScale(20) }}>
            <CButton label="Start Ordering" mode="contained" onPress={() => navigation.navigate("Home")} />
          </View>
        </View>
        )

      }
    </ImageBackground>
  )
}

export default WishList

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    color: Colors.primary,
    marginTop: 10,
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
})