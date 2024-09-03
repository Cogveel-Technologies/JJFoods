import { Image, ImageBackground, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import { ActivityIndicator, Icon, } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import CSearchBar from '../../../../components/CSearchBar'
import CCard from '../../../../components/CCard'
import dimensions from '../../../../theme/Dimensions'
import CButton from '../../../../components/CButton'
import AddedPlacesCard from '../addedPlaces/AddedPlacesCard'
import { moderateScale } from 'react-native-size-matters'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useAppSelector } from '../../../../store/hooks'
import { useGetAllAddedPlacesQuery } from '../addedPlaces/apis/getAllAddedPlaces'
import LottieView from 'lottie-react-native'
import Geolocation from '@react-native-community/geolocation'
import { Background } from '../../../../theme/ConfigrationStyle'


const ManualLocationScreen = () => {
  const cartImage = require("../../../../../assets/images/emptyCouponsIcon.png");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigation = useNavigation<any>()
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;

  const { data, isLoading, isError, isSuccess, error, refetch } = useGetAllAddedPlacesQuery({ userId }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });



  const handleSearch = (text: any) => {
    setSearchQuery(text);
  };

  const handleSelect = (item: any) => {
    setSelectedId(item.id)
    setSelectedAddress(item)
  };

  const handleDeliveryButton = () => {
    navigation.navigate("MyCart")
  }

  const handleAddaddress = () => {
    navigation.navigate("Locationscreen")
  }

  useEffect(() => {
    // console.log(data, 'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHH')
  }, [data])

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );


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
      {/* Main View */}
      <View style={{ flex: 1, marginHorizontal: 16, marginTop: 12 }}>

        {/* <View >
          <CSearchBar
            placeholder="Search for area, street name..."
            onChangeText={handleSearch}
            value={searchQuery}
          />
        </View> */}

        <CCard style={{ marginHorizontal: 0, marginTop: 30, marginBottom: 16 }}>
          {/* 
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderStyle: 'dashed',
              borderColor: Colors.grayDim
            }}>

            <View style={{ margin: 10, }}>
              <Icon
                source={require('../../../../../assets/images/locationIcon.png')}
                color={Colors.gray}
                // size={16}
                size={dimensions.vw * 3.7}
              />
            </View>

            <View style={{ flex: 1, }}>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[textVariants.SecondaryHeading, { width: dimensions.vw * 50, }]}>Device location not
                  enabled</Text>
                <CButton label='Enable' mode='text' onPress={requestPermission} />
              </View>


              <Text style={[textVariants.textSubHeading, { width: dimensions.vw * 60, fontSize: dimensions.vw * 3.2, paddingTop: 8, paddingBottom: 16 }]}>
                Tap here to enable your device location
                for a better experience
              </Text>

            </View>

          </View> */}

          <TouchableOpacity
            style={styles.buttonstyle}
            onPress={handleAddaddress}
          >

            <Icon
              source={require('../../../../../assets/images/locationIcon.png')}
              color={Colors.gray}
              // size={16}
              size={dimensions.vw * 3.7}
            />

            <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4, color: Colors.black, padding: 12 }]}>Add New Address</Text>
            <View style={{ paddingEnd: 20 }}>
              <Icon
                source={require("../../../../../assets/images/rightArrow.png")}
                color={Colors.primary}
                size={dimensions.vw * 3.5}
              />
            </View>
          </TouchableOpacity>
        </CCard>


        {isSuccess && data.length > 0 ?
          (<>
            <Text
              style={[textVariants.textSubHeading,
              { marginHorizontal: 8, paddingBottom: 16 }]}>Saved Addresses</Text>
            {/* Saved addresses list */}
            <AddedPlacesCard />
            <View style={{ margin: moderateScale(20) }}>
              <CButton
                label='Deliver to this Address'
                mode='contained'
                onPress={handleDeliveryButton}
              />
            </View>
          </>) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={cartImage} style={styles.logo} resizeMode="contain" />
              <Text style={styles.noOrderText}>No Saved Addresses!</Text>
            </View>
          )

        }

      </View>


    </ImageBackground>
  )
}

export default ManualLocationScreen

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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    color: Colors.primary,
    marginTop: 10,
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
})