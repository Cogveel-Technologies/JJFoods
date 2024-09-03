import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { textVariants } from '../../../../theme/StyleVarients';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearHeader from '../../../../components/LinearHeader';
import { Colors } from '../../../../theme/Colors';
import CCard from '../../../../components/CCard';
import CButton from '../../../../components/CButton';
import dimensions from '../../../../theme/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GuestOrderDetails from './GuestOrderDetails';
import { Background } from '../../../../theme/ConfigrationStyle';

const MyCart = () => {
  const cartImage = require("../../../../../assets/images/cartIcon.png");
  const addIcon = require('../../../../../assets/images/addProductIcon.png');
  const navigation = useNavigation();
  const [guestCartItems, setGuestCartItems] = useState([]);


  useEffect(() => {
    getGuestCart();
  }, [guestCartItems,]);

  useFocusEffect(
    useCallback(() => {
      const fetchCartItems = async () => {
        try {
          const cart = await AsyncStorage.getItem('guestCart');
          if (cart) {
            setGuestCartItems(JSON.parse(cart));
          }
        } catch (error) {
          console.error('Error retrieving guest cart:', error);
        }
      };

      fetchCartItems();
    }, [setGuestCartItems])
  );

  const getGuestCart = async () => {
    try {
      const guestCart = await AsyncStorage.getItem('guestCart');
      if (guestCart) {
        const finalCart = JSON.parse(guestCart);
        setGuestCartItems(finalCart);
      }
    } catch (error) {
      console.error('Error retrieving guest cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    return guestCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleAddMoreItems = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}>
        <LinearHeader />
        <View style={styles.mainContainer}>
          {(!guestCartItems.length > 0) ? (
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

              <View>
                {/* Order Details  */}
                <View style={{ marginTop: 28 }}>
                  <Text style={textVariants.textHeading}>Order Basket</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18 }}>
                    <GuestOrderDetails />
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


                {/* Bill Statement */}
                <View style={{ marginTop: 36 }}>
                  <Text style={textVariants.textHeading}>Bill Statement</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18, marginBottom: 20, }}>
                    <View style={styles.topayView}>
                      <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 4.1 }]}>To Pay</Text>
                      <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>₹ {calculateTotalPrice()}</Text>
                    </View>
                  </CCard>
                </View>
              </View>

              {/* Proceed Button */}
              <View style={{ marginHorizontal: 20, marginBottom: 20, }}>
                <CButton
                  label="Login"
                  mode="contained"
                  onPress={() => navigation.navigate('AuthTopTabNavigator')}
                />
              </View>


            </View>
          )}
        </View>
      </ImageBackground>
    </ScrollView >
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
    marginTop: 10,
    justifyContent: 'space-between'
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
  topayView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    marginHorizontal: 10,
  }
});
