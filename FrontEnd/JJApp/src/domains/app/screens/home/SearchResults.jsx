import { FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import CCard from '../../../../components/CCard'
import { Avatar, Icon, Searchbar } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import { useAppSelector } from '../../../../store/hooks'
import dimensions from '../../../../theme/Dimensions'
import { textVariants } from '../../../../theme/StyleVarients'
import { useNavigation } from '@react-navigation/native'
import { useSearchItemsQuery } from './apis/searchItems'
import { Background } from '../../../../theme/ConfigrationStyle'
import Toast from 'react-native-toast-message'
import { requestPermission } from '../../../../utils/locationUtils'
import Geolocation from '@react-native-community/geolocation'
import { useLazyGetPlacesDetailsQuery } from '../map/apis/getPlaceName'
import LottieView from 'lottie-react-native'

const SearchResults = () => {
  const navigation = useNavigation()
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  const { isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [placeShotName, setShotName] = useState('')
  const searchInputRef = useRef(null);

  const { data, error: searchError, isLoading } = useSearchItemsQuery({ q: searchQuery })
  const [trigger, { data: placedetails, isLoading: isplaceDetailsLoading }] = useLazyGetPlacesDetailsQuery();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleProductPress = (item) => {
    const { itemid, ...rest } = item;
    const newItem = { ...rest, itemid: itemid };
    navigation.navigate('OrderDescription', { item: newItem });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        // console.log('Fetching search results...');

        if (!isLoading && data) {
          // console.log('Search results:', data);
        }

        if (searchError) {
          // console.log('Error fetching search results:', searchError);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const MenuScreenNavigation = () => {
    navigation.navigate('MenuScreen');
  };

  const renderItem = ({ item }) => (
    <CCard
      style={{ marginHorizontal: 0, marginBottom: 2, padding: 5, marginTop: 2, }}
      onPress={() => handleProductPress(item)}
    >
      <View style={{ flexDirection: 'row', }}>
        <Text style={[textVariants.SecondaryHeading, { paddingStart: 20, width: dimensions.vw * 75 }]}>{item.itemname}</Text>
        <Text style={[textVariants.textSubHeading, { paddingStart: 0, fontSize: dimensions.vw * 2, textAlignVertical: 'center' }]}>{item.itemstockquantity === 0 ? 'Out of Stock' : ' '}</Text>
      </View>
    </CCard>
  );

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);


  useEffect(() => {
    fetchLocation()
  }, [])

  // Getting the permission from user and fetching his location details from google api 
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
            const extractedvalue = placeDetails?.results[0]?.formatted_address.split(',')[1].trim()
            setShotName(extractedvalue)
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

  // Loader
  if (isplaceDetailsLoading) {
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


  return (
    // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <LinearHeader />
      <View>

        {/* Location and Profile Pic */}
        {/* <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  source={require('../../../../../assets/images/loctionPin.png')}
                  size={dimensions.vw * 4}
                />
                <Text style={[textVariants.headingSecondary, { fontSize: dimensions.vw * 4.8, paddingStart: 5, width: dimensions.vw * 75, }]}>{placeShotName ? placeShotName : 'Location'}</Text>
              </View>
              <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.9, color: Colors.grayDim, width: dimensions.vw * 75 }]}>{placeName ? placeName : 'Finding your location...'}</Text>
            </View>

            
            {!isGuest &&
              <Pressable onPress={MenuScreenNavigation}>
                <Avatar.Image
                  source={userDetails?.imageUrl ? { uri: userDetails.imageUrl } : demoprofilePic}
                  size={dimensions.vw * 10}
                />
              </Pressable>}

          </View> */}
        {/* Search Bar */}
        <Searchbar
          ref={searchInputRef}
          placeholder="Search for ‘Wazwan’"
          onChangeText={handleSearch}
          value={searchQuery}
          iconColor={Colors.gray}
          rippleColor={Colors.primary}
          style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.grayDim, marginTop: 5, marginBottom: 5 }}
          placeholderTextColor={Colors.gray}
          inputStyle={{ color: Colors.gray }}
        />
        {/* Search Bar Results */}
        {data &&
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />}
      </View>
    </ImageBackground>
    // </ScrollView>
  )
}

export default SearchResults

const styles = StyleSheet.create({
  // Add your styles here
})
