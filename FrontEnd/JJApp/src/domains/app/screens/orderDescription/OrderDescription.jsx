import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import { Avatar, IconButton } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import dimensions from '../../../../theme/Dimensions'
import { useAddCartMutation } from '../../../api/addCart'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message';
import { useAddToWishlistMutation } from '../wishList/apis/addToWishlist'
import { useProductDetailsMutation } from './apis/productDetails'
import { useUpdateWishlistMutation } from '../wishList/apis/updateWishlist'
import { setCartItems } from '../cart/slices/cartItemsSlice'
import LottieView from 'lottie-react-native'
import { Background, DemoImages } from '../../../../theme/ConfigrationStyle'


const OrderDescription = () => {
  const productImage = require("../../../../../assets/images/soanPlateImage.png")
  const minusIcon = require('../../../../../assets/images/minusIcon.png')
  const addIcon = require('../../../../../assets/images/addProductIcon.png')
  const route = useRoute();
  const { item } = route.params;
  const navigation = useNavigation()
  const [quantity, setQuantity] = useState(1);
  const [addCart, { isLoading, isError, isSuccess, isUninitialized }] = useAddCartMutation();
  const [addToWishlist, { isLoading: wishlistLoading, isSuccess: iswishlistSuccess, isError: iswishlistError, error: wishlistError }] = useAddToWishlistMutation();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const isGuest = useAppSelector((state) => state.persistedReducer.authSlice.isGuest)
  const isAuthenticated = useAppSelector((state) => state.persistedReducer.authSlice.isAuthenticated)
  const [isPressed, setIsPressed] = useState(allProductDetails?.isWishlist);
  const [allProductDetails, setAllProductDetails] = useState([])
  const dispatch = useAppDispatch();


  const [productDetails, { data, error: isProductError, isLoading: isProductDetailsLoading, refetch: refetchProducts }] = useProductDetailsMutation();

  const [removeFromWishlist, { isLoading: removeWishlistLoading, isError: removeWishlistIsError, isSuccess: removeWishlistSuccess, error: removeFromWishlistError }] = useUpdateWishlistMutation()


  const fetchProductDetails = async () => {
    try {
      // const response = await productDetails({ userId: userDetails?._id, itemId: item.itemId }).unwrap();

      // For All Categories component 
      const response = await productDetails({ userId: userDetails?._id, itemId: item.itemid }).unwrap();
      // console.log(response, "============Details==============");
      setAllProductDetails(response)
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    }
  };

  // useEffect(() => {
  //   if (item?.itemId) {
  //     fetchProductDetails();
  //   }
  // }, [userDetails?._id, item?.itemId, productDetails,]);


  // For All Categories component 
  useEffect(() => {
    if (item?.itemid) {
      fetchProductDetails();
    }
  }, [userDetails?._id, item?.itemid, productDetails,]);

  const handleWishListButton = async () => {
    if (!isAuthenticated) {
      navigation.navigate('AuthTopTabNavigator');
    } else {
      // if (!isPressed) {
      try {
        if (allProductDetails.isWishlist) {
          // Remove from wishlist
          const response = await removeFromWishlist({ userId: userDetails?._id, itemId: item.itemid }).unwrap();
          setAllProductDetails(response)
          // setIsPressed(false);
          Toast.show({
            type: 'error',
            text1: 'Removed',
            text2: 'Removed from WishList 👋',
          });
        } else {
          // Add to wishlist
          const response = await addToWishlist({ userId: userDetails?._id, itemId: item.itemid }).unwrap();
          setAllProductDetails(response)
          // setIsPressed(true);
          Toast.show({
            type: 'success',
            text1: 'Added',
            text2: 'Added to WishList 👋',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Failed to ${allProductDetails.isWishlist ? 'remove from' : 'add to'} wishlist 👋`,
        });
      }
      // }
    }
  };

  // console.log(allProductDetails, '**********ProductDetails********')

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        // Guest Cart
        const guestCart = await AsyncStorage.getItem('guestCart');
        let cartItems = guestCart ? JSON.parse(guestCart) : [];

        const existingItemIndex = cartItems?.findIndex(
          // ???
          (cartItem) => cartItem.itemId === allProductDetails.itemid
        );

        let totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

        // Check if adding this item would exceed the limit of 5 items
        if (totalItemsInCart + quantity > 5) {
          Toast.show({
            type: 'info',
            text1: 'Limit Reached',
            text2: 'You can only add  5 items in the cart.',
          });
          return;
        }

        if (existingItemIndex > -1) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          let productName = allProductDetails.itemname ? allProductDetails.itemname : 'Unnamed Product';

          const modifiedItem = {
            ...allProductDetails,
            itemname: productName,
            price: parseFloat(allProductDetails.price),
          };
          cartItems.push({ ...modifiedItem, quantity });
        }

        await AsyncStorage.setItem('guestCart', JSON.stringify(cartItems));

        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: 'Added To Cart 👋',
        });

        // LoggedIn User Cart
      } else {
        // For LoggedIN user 
        if (quantity > allProductDetails?.itemstockquantity) {
          Toast.show({
            type: 'info',
            text1: 'Error',
            text2: `Only ${allProductDetails.itemstockquantity} available `,
          });
          return;
        }

        const response = await addCart({
          // product: { itemId: item.itemId },
          product: { itemId: item.itemid },
          userId: userDetails?._id,
          quantity: quantity,
        }).unwrap();

        dispatch(setCartItems(response));
        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: 'Added To Cart 👋',
        });
      }

      navigation.navigate('Home');
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };


  if (isProductDetailsLoading || isLoading) {
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

  if (isProductError) {
    console.log(isProductError);
    let errorMessage = 'An error occurred while fetching the cart items.';

    if (isProductError.status === 'FETCH_ERROR') {
      errorMessage = 'Network error: Please check your internet connection.';
    } else if (isProductError.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (isProductError.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (isProductError.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{isProductError.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20 }]}>{isProductError}</Text>
        <CButton label='Reload' mode='contained' onPress={refetchProducts} />
      </View>
    )
  }


  return (
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />
      <View style={{ flex: 1, }}>

        {/* Image price details, rating and button  */}
        <View style={styles.productImage}>
          <Avatar.Image
            size={dimensions.vw * 55}
            source={allProductDetails?.item_image_url
              ? { uri: allProductDetails.item_image_url }
              : DemoImages.productDemo3}
          />

          {/* source={allProductDetails.item_image_url} /> */}
          <View style={{ flexDirection: "row", alignItems: 'flex-start', marginHorizontal: 10, }}>
            <Text style={[textVariants.textHeading2, { textAlign: 'center', }]}>{allProductDetails?.itemname}</Text>

            {allProductDetails.feedback > 0 &&
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                <Text style={[textVariants.textMainHeading, {}]}> {Number(allProductDetails.feedback).toFixed(1)}</Text>
                <StarRatingDisplay
                  maxStars={1}
                  rating={1}
                  starSize={dimensions.vw * 6}
                  color='#EFB23D'
                />
              </View>
            }

            <View style={{ paddingHorizontal: 5 }} >
              <IconButton
                icon={allProductDetails.isWishlist ? require('../../../../../assets/images/heart.png') : require('../../../../../assets/images/heart2.png')}
                iconColor={allProductDetails.isWishlist ? '#E34F4F' : Colors.gray}
                size={allProductDetails.isWishlist ? dimensions.vw * 6 : dimensions.vw * 5.5}
                onPress={handleWishListButton}
                style={{ margin: -4, }}
              />
            </View>

          </View>

          <Text style={[textVariants.textHeading, { fontFamily: "Montserrat Bold", }]}>₹ {allProductDetails.price}</Text>
        </View>

        {/*  Description  */}
        <View style={styles.description}>
          <View>
            <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 4.2 }]} >Description</Text>
            <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4, marginTop: 6.7 }]}>
              {allProductDetails?.itemdescription}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <View style={styles.addMinusIcon}>
              <IconButton
                icon={minusIcon}
                size={dimensions.vw * 4.3}
                iconColor={Colors.primary}
                onPress={() => setQuantity(quantity - 1)}
                disabled={quantity === 1}
              />
              <Text style={[textVariants.textMainHeading, { color: Colors.gray }]}>{quantity}</Text>
              <IconButton
                icon={addIcon}
                size={dimensions.vw * 4.3}
                iconColor={Colors.primary}
                onPress={() => {
                  if (!isAuthenticated && quantity >= 5) {
                    Toast.show({
                      type: 'info',
                      text1: 'Limit Reached',
                      text2: 'You can only add up to 5 items as a guest.Please Login First',
                    });
                  } else if (quantity < allProductDetails?.itemstockquantity) {
                    setQuantity(quantity + 1);
                  } else {
                    Toast.show({
                      type: 'info',
                      text1: 'Limit Reached',
                      text2: `Only ${allProductDetails.itemstockquantity} items are available.`,
                    });
                  }
                }}
              />
            </View>
            <CButton
              label='Add To Cart'
              mode='contained'
              onPress={handleAddToCart}
              disabled={isLoading === true}

            />


          </View>
        </View>

      </View>

    </ImageBackground>
  )
}

export default OrderDescription

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  productImage: {
    justifyContent: 'center',
    alignItems: "center",
    // marginTop: 30,
    flex: 1,
    borderBottomColor: Colors.grayDim,
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  description: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between'
  },
  addMinusIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: Colors.primary
  },
  buttonsContainer: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-evenly'
  }

})