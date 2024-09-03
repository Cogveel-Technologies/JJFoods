import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import DemoImage from '../../../../components/DemoImage'
import CCard from '../../../../components/CCard'
import { Colors } from '../../../../theme/Colors'
import dimensions from '../../../../theme/Dimensions'
import { Icon } from 'react-native-paper'
import AddedPlacesCard from './AddedPlacesCard'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useGetAllAddedPlacesQuery } from './apis/getAllAddedPlaces'
import { useAppSelector } from '../../../../store/hooks'
import LottieView from 'lottie-react-native'
import { Background } from '../../../../theme/ConfigrationStyle'

const AddedPlaces = () => {
  const background = require("../../../../../assets/images/fullbackground.png")
  const cartImage = require("../../../../../assets/images/emptyCouponsIcon.png");
  const navigation = useNavigation<any>()
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;

  const { data, isLoading, isError, isSuccess, error, refetch } = useGetAllAddedPlacesQuery({ userId }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
    // console.log(data, 'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHH')
  }, [data])

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const handleAddAddress = () => {
    navigation.navigate('Locationscreen')
  }

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }

  if (isError) {
    console.log(error)
    return (
      <View style={styles.centeredContainer}>
        <Text style={textVariants.textSubHeading}>Failed to load addresses. Please try again </Text>
        <TouchableOpacity onPress={refetch}>
          <Text style={styles.retryButton}>Retry</Text>
        </TouchableOpacity>
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

      <View style={{ flex: 1, marginTop: 28, marginHorizontal: 16, }}>
        {/* Add Address button */}
        <CCard style={{ marginHorizontal: 0, marginTop: 5 }}>
          <TouchableOpacity
            style={styles.buttonstyle}
            onPress={handleAddAddress}
          >
            <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4, color: Colors.primary, padding: 12 }]}>Add New Address</Text>
            <View style={{ paddingEnd: 10 }}>
              <Icon
                source={require("../../../../../assets/images/rightArrow.png")}
                color={Colors.primary}
                size={dimensions.vw * 3.5}
              />
            </View>
          </TouchableOpacity>
        </CCard>
        {isSuccess && data.length > 0 ?
          (<View style={{ flex: 1 }}>
            <Text
              style={[textVariants.textSubHeading,
              { paddingVertical: 16, marginHorizontal: 8 }]}>Saved Addresses</Text>
            <AddedPlacesCard />
          </View>) :
          (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={cartImage} style={styles.logo} resizeMode="contain" />
              <Text style={styles.noOrderText}>No Added Places </Text>
            </View>
          )}


      </View>
    </ImageBackground>
  )
}

export default AddedPlaces

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  buttonstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: 30,
  },
  noOrderText: {
    fontSize: dimensions.vw * 5.6,
    color: Colors.grayDim,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600",
    textAlign: 'center'

  },
  logo: {
    width: dimensions.vw * 28,
    height: dimensions.vw * 32,
    marginBottom: 10,
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


})