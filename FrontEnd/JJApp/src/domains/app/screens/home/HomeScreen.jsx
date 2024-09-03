import { FlatList, Image, ImageBackground, PermissionsAndroid, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Avatar, Icon, Searchbar, } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { textVariants } from '../../../../theme/StyleVarients'
import { Colors } from '../../../../theme/Colors'
import LinearHeader from '../../../../components/LinearHeader'
import { CravingsCard } from './CravingsCard'
import SpecialThaliCard from './SpecialThaliCard'
import AdditionalThaliCard from './AdditionalThaliCard'
import dimensions from '../../../../theme/Dimensions'
import { useAppSelector } from '../../../../store/hooks'
import { useGetMenuItemsQuery } from '../../../api/menu'
import CButton from '../../../../components/CButton'
import LottieView from 'lottie-react-native'
import { useGetAvailableCouponsQuery } from '../cart/api/availableCoupons'
import { useGuestOffersQuery } from './apis/guestOffers'
import { skipToken } from '@reduxjs/toolkit/query'
import { Background, DemoImages, Logos, RestaurantName } from '../../../../theme/ConfigrationStyle'
import Geolocation from '@react-native-community/geolocation'
import { useLazyGetPlacesDetailsQuery } from '../map/apis/getPlaceName'
import { requestPermission } from '../../../../utils/locationUtils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { useAddCartMutation } from '../../../api/addCart'
import { useGetPaginatedMenuItemsQuery, useLazyGetPaginatedMenuItemsQuery } from '../../../api/paginatedMenu'



const HomeScreen = () => {
  const navigation = useNavigation()
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const { isAuthenticated, isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);
  const [specialThaliItems, setpecialThaliItems] = useState([]);
  const [additionalDishes, setadditionalDishes] = useState([]);
  const [dessertsdata, setdessertsData] = useState([]);
  const [cravingsdata, setcravingsData] = useState([]);
  const [page, setPage] = useState(1);
  const [paginatedMenuItems, setpaginatedmenuitems] = useState([])
  const [loading, setLoading] = useState(true);
  const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false);




  // const { data: menuItems, isLoading: isMenuLoading, isSuccess, isError, isFetching, error, refetch } = useGetMenuItemsQuery({}, {
  //   refetchOnMountOrArgChange: true, // Automatically refetch on component mount or when arguments change
  //   refetchOnReconnect: true, // Automatically refetch on reconnect
  //   refetchOnFocus: true, // Automatically refetch on focus
  // });

  const { data: paginatedMenu, error: paginatedError, isLoading: paginatedIsLoading, isFetching: paginatedIsFetching, refetch: paginatedRefetch, isError } = useGetPaginatedMenuItemsQuery({ page });


  // console.log(paginatedMenu, '*************************Menu*******************')

  useEffect(() => {

    if (page === 1 && !paginatedIsFetching) {
      if (paginatedMenuItems !== null) {
        setpaginatedmenuitems(paginatedMenu)
      } else {
        // setpaginatedmenuitems([])
      }
    } else if (
      page > 1 && !paginatedIsFetching
    ) {
      setpaginatedmenuitems(prevData => {
        return [...prevData, ...paginatedMenu];
      });
    } else {
      // setpaginatedmenuitems([]);
      setPage(1);
    }

    // if (paginatedMenu) {
    //   setpaginatedmenuitems(prevData => {
    //     return [...prevData, ...paginatedMenu];
    //   });
    // }
  }, [paginatedMenu, page]);


  const loadMoreItems = useCallback(() => {
    if (!paginatedIsFetching && !paginatedIsLoading) {
      setPage(prevPage => {
        const newPage = prevPage + 1;
        console.log(newPage, '----------Page------------------');
        return newPage;
      });
      setonEndReachedCalledDuringMomentum(false);
    }
  }, [paginatedIsFetching, paginatedIsLoading, setonEndReachedCalledDuringMomentum]);


  // console.log(categories, '-------------Categories----------')

  const [addCart, { isLoading: isAddToCartLoading, isError: isAddToCartError, }] = useAddCartMutation();

  const [trigger, { data, isLoading }] = useLazyGetPlacesDetailsQuery();

  const userId = isAuthenticated ? userDetails?._id : null;
  const { data: userOffers, isLoading: isLoadingUserOffers, error: userOffersError, refetch: refetchUserOffers } = useGetAvailableCouponsQuery(userId ? { userId } : skipToken);

  const { data: guestOffers, isLoading: isLoadingGuestOffers, error: guestOffersError, refetch: refetchGuestOffers } = useGuestOffersQuery(isAuthenticated ? skipToken : {});

  const offers = isAuthenticated ? userOffers : guestOffers;
  // offers refetch 
  useEffect(() => {
    if (isAuthenticated) {
      refetchUserOffers();
    } else {
      refetchGuestOffers();
    }
  }, [isAuthenticated, refetchUserOffers, refetchGuestOffers]);

  const [placeName, setPlaceName] = useState('');
  const displayAddress = placeName.split(',').slice(1, 2).join(',');

  // const handleLocationButton = () => {
  //   navigation.navigate('Locationscreen')
  // }

  useEffect(() => {
    fetchLocation()
  }, [])

  // Getting permission and fetching current locaiton of user 
  const fetchLocation = async () => {
    const hasPermission = await requestPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(async (info) => {
        const { latitude, longitude } = info.coords;
        try {
          const placeDetails = await trigger({ latitude, longitude }).unwrap();
          // console.log(placeDetails, '----------------------------------------------');
          if (placeDetails.results?.length) {
            setPlaceName(placeDetails.results[0].formatted_address);
          }
        } catch (err) {
          console.error('Error fetching place details:', err);
          Toast.show({
            type: 'error',
            text1: 'Error fetching address',
            text2: err.message,
          });
        }
      });

    } else {
      Toast.show({
        type: 'error',
        text1: 'Location Permission Denied',
        text2: 'Please enable location permissions in your settings.',
      });
    }
  };

  // Craving Data
  // useEffect(() => {
  //   if (menuItems && menuItems["76239"]?.items) {
  //     const extractedItems = menuItems["76239"]?.items.map((item) => ({
  //       ...item,
  //       itemId: item?.itemid,
  //       name: item?.itemname,
  //       price: item?.price,
  //       description: item?.itemdescription,
  //       image: item?.item_image_url,
  //       category: item?.item_categoryid,
  //     }));
  //     // console.log(extractedItems, '--------------Craving Data--------------')
  //     setcravingsData(extractedItems);
  //     // console.log('Additional dishes :', additionalDishes);
  //   } else {
  //     console.log('No items found in menuItems or menuItems does not exist.');
  //   }
  // }, [menuItems]);

  // Special Thali Data
  // useEffect(() => {
  //   if (menuItems && menuItems["76280"]?.items) {
  //     const extractedItems = menuItems["76280"]?.items.map((item) => ({
  //       ...item,
  //       itemId: item?.itemid,
  //       name: item?.itemname,
  //       price: item?.price,
  //       description: item?.itemdescription,
  //       image: item?.item_image_url,
  //       category: item?.item_categoryid,
  //     }));
  //     setpecialThaliItems(extractedItems);
  //     // console.log('Special Thali Items:', extractedItems);
  //   } else {
  //     console.log('No items found in menuItems or menuItems does not exist.');
  //   }
  // }, [menuItems]);

  // Additional Dishes data
  // useEffect(() => {
  //   if (menuItems && menuItems["76265"]?.items) {
  //     const extractedItems = menuItems["76265"]?.items.map((item) => ({
  //       ...item,
  //       itemId: item?.itemid,
  //       name: item?.itemname,
  //       price: item?.price,
  //       description: item?.itemdescription,
  //       image: item?.item_image_url,
  //       category: item?.item_categoryid,
  //     }));
  //     setadditionalDishes(extractedItems);
  //     // console.log('Additional dishes :', additionalDishes);
  //   } else {
  //     console.log('No items found in menuItems or menuItems does not exist.');
  //   }
  // }, [menuItems]);

  // Desserts Data 
  // useEffect(() => {
  //   if (menuItems && menuItems["76280"]?.items) {
  //     const extractedItems = menuItems["76280"]?.items.map((item) => ({
  //       ...item,
  //       itemId: item?.itemid,
  //       name: item?.itemname,
  //       price: item?.price,
  //       description: item?.itemdescription,
  //       image: item?.item_image_url,
  //       category: item?.item_categoryid,
  //     }));
  //     setdessertsData(extractedItems);
  //     // console.log('Special Thali Items:', dessertsdata);
  //   } else {
  //     console.log('No items found in menuItems or menuItems does not exist.');
  //   }
  // }, [menuItems]);


  const MenuScreenNavigation = () => {
    if (isAuthenticated) {
      navigation.navigate('MenuScreen')
    } else {
      navigation.navigate('GuestMenuScreen')
    }
  };

  const handleProductPress = (item) => {
    navigation.navigate('OrderDescription', { item });
  };


  const handleAddToCart = async (item) => {
    // console.log(item, '88888888888888*********+++++++++++++*********888888888888888')
    try {
      if (!isAuthenticated) {
        // Guest Cart 
        const guestCart = await AsyncStorage.getItem('guestCart');
        let cartItems = guestCart ? JSON.parse(guestCart) : [];
        // const existingItemIndex = cartItems?.findIndex((cartItem) => cartItem.itemId === item.itemId);
        // console.log(cartItems, '-----------------GuestCArt------------------')

        // for All Categories 
        const existingItemIndex = cartItems?.findIndex((cartItem) => cartItem.itemid === item.itemid);

        if (existingItemIndex > -1) {
          // Restrict the quantity to a maximum of quantity of item
          if (cartItems[existingItemIndex].quantity < item.itemstockquantity) {
            cartItems[existingItemIndex].quantity += 1;
            Toast.show({
              type: 'success',
              text1: 'Added',
              text2: 'Added To Cart 👋',
            });
          } else {
            Toast.show({
              type: 'info',
              text1: 'Error',
              text2: `Only ${item.itemstockquantity} items are available ��`,
            });

          }
        } else {
          const productName = item.itemname || item.name;
          const modifiedItem = { ...item, itemname: productName, price: parseFloat(item.price) };
          cartItems.push({ ...item, quantity: 1 }); // Set quantity to 1 for the first time

          Toast.show({
            type: 'success',
            text1: 'Added',
            text2: 'Added To Cart 👋',
          });

          // console.log(modifiedItem, '--------------------ModifiedItems-------------------')
        }

        await AsyncStorage.setItem('guestCart', JSON.stringify(cartItems));
        navigation.navigate('GuestCart')

      } else {
        // call add to cart api when logged in 
        const response = await addCart({
          // product: { itemId: item.itemId },

          // For All Categories
          product: { itemId: item.itemid },
          userId: userDetails?._id,
          quantity: 1, // Set quantity to 1
        }).unwrap();
        // console.log(response, '--------------cart Response ---------------')
        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: 'Added To Cart 👋',
        });
        // }
        navigation.navigate('MyCart');
      }

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Got error while adding to cart ',
        text2: `${err.message}`,
      });
      console.error('Failed to add to cart:', err);
    }
  };


  const cravingrenderItem = ({ item }) => {
    // console.log(item, '=================================================')
    if (!item?.name) {
      return <View style={{ flex: 1 }} />;
    }
    const cardProps = {
      ...item,
      title: item.name,
      description: item.description,
      price: item.price,
      stockquantity: item.itemstockquantity,
      // imageSource: item.imageSource,
      imageSource: require('../../../../../assets/images/wanzwanThali.png'),
      onPress: () => handleAddToCart(item),
      index: item.id,
      // padding: 20,
      marginBottom: 30,
      style: {}
    };
    return (<CravingsCard  {...cardProps} />);
  };

  const specialTramiRender = ({ item }) => {
    // console.log(item, '---------============------------')
    if (!item?.name) {
      return <View style={{ flex: 1, }} />;
    }
    return (
      <SpecialThaliCard
        onPress={() => handleProductPress(item)}
        title={item.name}
        price={item.price}
        // imageSource={item.imageSource}
        imageSource={require('../../../../../assets/images/soanPlateImage.png')}
        stockquantity={item.itemstockquantity}
      />);
  };

  const additionalPropularDishesRender = ({ item }) => {
    if (!item?.name) {
      return <View style={{ flex: 1 }} />;
    }
    return (
      <AdditionalThaliCard
        onPress={() => handleAddToCart(item)}
        title={item.name}
        quantity={item.quantity}
        price={item.price}
        stockquantity={item.itemstockquantity}
        // imageSource={item.imageSource}
        imageSource={require('../../../../../assets/images/rista.png')}
      />);
  };


  if (isLoadingGuestOffers || isLoadingUserOffers || isAddToCartLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }

  if (paginatedIsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader3.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }

  if (isError) {
    console.log(error);
    let errorMessage = 'An error occurred while fetching the menu items.';

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

  const renderCategory = ({ item, index }) => {

    // console.log(item.items, '___________________________________________')
    let CardComponent;
    let cardProps;

    switch (index) {
      case 0:
        CardComponent = CravingsCard;
        break;
      case 1:
        CardComponent = SpecialThaliCard;
        break;
      default:
        CardComponent = AdditionalThaliCard;
        break;
    }

    return (
      <View style={styles.categoryCard}>
        <Text style={[textVariants.textHeading, { marginBottom: 11, marginTop: 24 }]}>{item?.category?.categoryname}</Text>
        <FlatList
          horizontal
          data={item.items}
          keyExtractor={(item) => item._id}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({ item: itemData }) => {
            let cardProps;

            switch (index) {
              case 0:
                cardProps = {
                  ...itemData,
                  itemId: itemData.itemid,
                  title: itemData.itemname,
                  description: itemData.itemdescription,
                  price: itemData.price,
                  stockquantity: itemData.itemstockquantity,
                  imageSource: itemData.item_image_url
                    ? { uri: itemData.item_image_url }
                    : DemoImages.productDemo3,
                  onPress: () => handleAddToCart(itemData),
                  style: {
                    marginBottom: 30,
                    height: 270,
                  },
                };
                break;
              case 1:
                cardProps = {
                  ...itemData,
                  itemId: itemData.itemid,
                  title: itemData.itemname,
                  price: itemData.price,
                  description: itemData.itemdescription,
                  stockquantity: itemData.itemstockquantity,
                  imageSource: itemData.item_image_url
                    ? { uri: itemData.item_image_url }
                    : DemoImages.productDemo3,
                  category: itemData.item_categoryid,
                  onPress: () => handleProductPress(itemData),
                };
                break;
              default:
                cardProps = {
                  title: itemData.itemname,
                  quantity: itemData.quantity,
                  price: itemData.price,
                  stockquantity: itemData.itemstockquantity,
                  imageSource: itemData.item_image_url
                    ? { uri: itemData.item_image_url }
                    : DemoImages.productDemo3,
                  onPress: () => handleAddToCart(itemData),
                };
                break;
            }

            return <CardComponent {...cardProps} />;
          }}
        />

      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View>

        {/*  Location  details and Profile Pic */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                source={require('../../../../../assets/images/loctionPin.png')}
                size={dimensions.vw * 4}
              />
              <Text style={[textVariants.headingSecondary, { fontSize: dimensions.vw * 4.5, paddingStart: 5, width: dimensions.vw * 75 }]}>
                {displayAddress ? displayAddress : 'Location...'}</Text>
            </View>
            <Text style={[textVariants.textSubHeading, { fontSize: 15, color: Colors.grayDim, width: dimensions.vw * 75 }]}>
              {placeName ? placeName : 'your location details'}</Text>
          </View>

          {/* Profile and Menu options */}
          <Pressable onPress={MenuScreenNavigation}>
            <Avatar.Image
              source={userDetails?.imageUrl ? { uri: userDetails.imageUrl } : demoprofilePic}
              // size={46}
              size={dimensions.vw * 10}
            />
          </Pressable>
        </View>

        {/* Search Bar On Top */}
        <TouchableOpacity onPress={() => navigation.navigate('SearchResults')}>
          <Searchbar
            placeholder="Search for ‘Wazwan’"
            iconColor={Colors.gray}
            rippleColor={Colors.primary}
            // traileringIcon={require('../../../../../assets/images/micIcon.png')}
            // trailingIconColor={Colors.primary}
            style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.grayDim, marginTop: 20 }}
            placeholderTextColor={Colors.gray}
            inputStyle={{ color: Colors.gray }}
            editable={false}
            onFocus={() => { }}
          />

        </TouchableOpacity>


        {/* ==============Offers Section============= */}
        {offers && offers.length > 0 && (
          <View style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: dimensions.vw * 75 }}>
              <Text style={[textVariants.headingSecondary, {}]}> {offers[0]?.title}</Text>
              <Text style={[textVariants.bigheading, { width: dimensions.vw * 70 }]} numberOfLines={2} ellipsizeMode='tail'>
                {offers[0]?.description}
              </Text>
              <Text style={[textVariants.textSubHeading, { marginBottom: 20 }]}>
                On order between ₹ {offers[0]?.minimumOrder} and ₹ {offers[0]?.maximumOrder}
              </Text>
            </View>
            <View>
              <Image
                source={require('../../../../../assets/images/giftBox.png')}
                style={{ height: dimensions.vh * 9.5, width: dimensions.vw * 18 }}
              />
            </View>
          </View>
        )}


      </View>
    )
  }

  const emptyRender = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', }}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader3.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, }}
        />
        {/* <Text style={textVariants.textSubHeading}>Loading Items stay connected ..</Text> */}
      </View>
    )
  }

  const handleRefresh = async () => {
    try {
      // Call the refetch function with page 1
      const response = await paginatedRefetch({ page: 1 }).unwrap();
      // Assuming `response` contains the updated data
      // Update the menu items state with the new response data
      setpaginatedmenuitems(response);
      // console.log('Refresh successful:', response);
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Optionally, you can show an error message to the user
    }
  };




  return (
    // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={{ flex: 1, }}
    >
      <LinearHeader />

      {/* Main View of Whole page  */}
      <View style={{ marginHorizontal: 10, flex: 1, }}>


        {/* What are you craving for ? */}
        {/* <Text style={[textVariants.textHeading, { marginTop: 24, }]}>What are you craving for?</Text>
          <View style={{
            height: 314,
            // height: dimensions.vh * 36,
            borderBottomWidth: 1, borderBottomColor: Colors.grayDim
          }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={cravingsdata}
              renderItem={cravingrenderItem}
              keyExtractor={(item) => item.itemId}

            />
          </View> */}

        {/* Special Thali */}
        {/* <Text style={[textVariants.textHeading, { marginTop: 24, }]}>Special Thali’s</Text>
          <View style={{ height: 311, marginTop: 11, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              // data={specialTramidata}
              data={specialThaliItems}
              renderItem={specialTramiRender}
              keyExtractor={(item) => item.itemId}
            />
          </View> */}

        {/* Additional Popular Dishes */}
        {/* <Text style={[textVariants.textHeading, { marginTop: 27, }]}>Additional-Popular Dishes</Text>
          <View style={{ marginTop: 7, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, }} >
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              // data={additionalPropularDishes}
              data={additionalDishes}
              renderItem={additionalPropularDishesRender}
              keyExtractor={(item) => item.itemId}
            />
          </View> */}

        {/* Desserts */}
        {/* <Text style={[textVariants.textHeading, { marginTop: 24, }]}>Desserts</Text>
          <View style={{ marginTop: 11, }} >
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              // data={Desserts}
              data={dessertsdata}
              renderItem={additionalPropularDishesRender}
              keyExtractor={(item) => item.itemId}
            />
          </View> */}

        {/* <View style={{}}> */}
        {/* <FlatList
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCategory}
            /> */}

        {/* {paginatedMenuItems.length === 0 ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <LottieView
            source={require('../../../../../assets/lottieFiles/loader2.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 150, alignSelf: 'center' }}
          />
        </View>) :
          ( */}

        <FlatList
          ListHeaderComponent={renderHeader}
          data={paginatedMenuItems}
          keyExtractor={(item) => item.category._id}
          renderItem={renderCategory}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.3}
          ListFooterComponent={paginatedIsFetching ? <ActivityIndicator size="large" /> : null}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={emptyRender}
          onMomentumScrollBegin={() => {
            setonEndReachedCalledDuringMomentum(false);
          }}
          onRefresh={handleRefresh}
          refreshing={paginatedIsFetching}
        />

        {/* )} */}
        {/* </View> */}




        {/* <FlatList
            data={data}
            extraData={isFetching}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <RenderItem item={item} />}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: 20,
              rowGap: 10,
            }}
            onMomentumScrollBegin={() => {
              setonEndReachedCalledDuringMomentum(false);
            }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.6}
            ListFooterComponent={
              <Footer
                data={data}
                isFetching={isFetching}
                count={notifications?.data?.count}
              />
            }
            refreshing={isFetching && data?.length > 0}
            onRefresh={handleRefresh}
            ListEmptyComponent={<Empty title="No notifications" />}
          /> */}



      </View>

    </ImageBackground>
    // </ScrollView >
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  // container: {
  //   flex: 1,
  // },
  categoryCard: {
    // padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim
  },
})