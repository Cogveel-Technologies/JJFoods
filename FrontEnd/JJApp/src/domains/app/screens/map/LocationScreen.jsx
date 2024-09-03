import React, { useCallback, useEffect, useState } from 'react';
import {
  ImageBackground,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { textVariants } from '../../../../theme/StyleVarients';
import LinearHeader from '../../../../components/LinearHeader';
import { Colors } from '../../../../theme/Colors';
import CButton from '../../../../components/CButton';
import dimensions from '../../../../theme/Dimensions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import { Background } from '../../../../theme/ConfigrationStyle';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLazyGetPlacesDetailsQuery } from './apis/getPlaceName';
import MapComponent from './MapComponent';
import { requestPermission } from '../../../../utils/locationUtils';
import { GOOGLE_MAP_API } from '@env';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

const Locationscreen = ({ coords }) => {
  const navigation = useNavigation();
  const [location, setLocation] = useState({ latitude: 34.083656, longitude: 74.797371 });
  const [loader, setLoader] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [displayAddress, setDisplayAddress] = useState('');
  const [deviceLocation, setDeviceLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const [getPlaceName, { data, isLoading }] = useLazyGetPlacesDetailsQuery();

  useEffect(() => {
    handleLocationAccess();
  }, []);

  const handleLocationAccess = async () => {
    try {
      await handleEnabledPressed();
      await handleCheckPressed();
      fetchLocation();
      // if (deviceLocation) {
      //   fetchLocation();
      // }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to access location services.',
      });
    }
  };

  async function handleEnabledPressed() {
    if (Platform.OS === 'android') {
      try {
        await promptForEnableLocationIfNeeded();
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to enable location services.',
        });
      }
    }
  }

  async function handleCheckPressed() {
    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
      setDeviceLocation(checkEnabled);
      if (!checkEnabled) {
        Toast.show({
          type: 'error',
          text1: 'Location Disabled',
          text2: 'Please enable location services to continue.',
        });
      }
    }
  }

  const navigateToManualLocationScreen = () => {
    navigation.navigate('AddressDetails');
  };

  const handleConfirmLocation = () => {
    navigation.navigate('AddMapAddress', { placeId, placeName });
  };

  const fetchLocation = async () => {
    const hasPermission = await requestPermission();
    setLocationPermission(hasPermission)

    if (!hasPermission) {
      Alert.alert(
        'Location Permission Required',
        'Please enable location permissions in your settings to continue.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
        { cancelable: true }
      );
    }

    if (hasPermission) {
      setLoader(true);
      Geolocation.getCurrentPosition(
        async (info) => {
          const { latitude, longitude } = info.coords;
          setLocation({ latitude, longitude });
          try {
            const placeDetails = await getPlaceName({ latitude, longitude }).unwrap();
            if (placeDetails.results?.length) {
              setPlaceName(placeDetails.results[0].formatted_address);
              setPlaceId(placeDetails.results[0].place_id);
              setDisplayAddress(placeDetails.results[0].formatted_address.split(',').slice(1, 2).join(','));
            }
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: 'Error fetching address',
              text2: err.message,
            });
          } finally {
            setLoader(false);
          }
        },
        (error) => {
          Toast.show({
            type: 'error',
            text1: 'Error fetching location',
            text2: error.message,
          });
          setLoader(false);
        }
      );
    }
  };

  const getCoordinates = async (placeId) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAP_API}`);
      const data = await response.json();
      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        setLocation({ latitude: lat, longitude: lng });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No coordinates found.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching coordinates',
        text2: error.message,
      });
    }
  };

  return (
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Select delivery location</Text>

          <GooglePlacesAutocomplete
            placeholder="Search for a building, street name or area"
            onPress={(data, details = null) => {
              getCoordinates(data.place_id);
              setPlaceName(data.description);
            }}
            query={{
              key: GOOGLE_MAP_API,
              language: 'en',
            }}
            styles={styles.placesAutocomplete}
            textInputProps={styles.textInputProps}
          />
        </View>

        <MapComponent
          latitude={location.latitude}
          longitude={location.longitude}
          setPlaceName={setPlaceName}
          setDisplayAddress={setDisplayAddress}
          placeName={placeName}
        />

        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            {loader ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <View style={styles.infoContent}>
                <View style={styles.addressRow}>
                  <Icon name="location-on" size={dimensions.vw * 5} color={Colors.primary} />
                  <Text style={[styles.displayAddress, { width: dimensions.vw * 90 }]}>
                    {placeName ? placeName : 'Address Not Available'}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.buttonsContainer}>
              <View style={{ marginBottom: 5 }}>
                <CButton
                  label={deviceLocation && locationPermission ? 'Confirm Location' : 'Turn on Location'}
                  mode="contained"
                  onPress={deviceLocation && locationPermission ? handleConfirmLocation : handleLocationAccess}
                />
              </View>

              <CButton
                label="Enter Location Manually"
                mode="outlined"
                onPress={navigateToManualLocationScreen}
              />
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Locationscreen;

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: Colors.white,
  },
  headerText: {
    ...textVariants.buttonText,
    color: Colors.black,
    paddingBottom: 2,
    textAlign: 'center',
  },
  placesAutocomplete: {
    container: { flex: 0, marginTop: 15 },
    textInputContainer: { width: '95%', alignSelf: 'center' },
    description: { color: 'black' },
    predefinedPlacesDescription: { color: 'black' },
    textInput: { color: Colors.gray },
  },
  textInputProps: {
    placeholderTextColor: Colors.gray,
    borderWidth: 1,
    borderColor: Colors.grayDim,
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: dimensions.vh * 1,
    marginBottom: dimensions.vh * 1,
    backgroundColor: Colors.white,
  },
  infoContent: {
    marginBottom: dimensions.vh * 1,
    marginHorizontal: 10,
  },
  addressRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  displayAddress: {
    ...textVariants.buttonText,
    color: Colors.black,
    paddingBottom: 2,
    paddingStart: 5,
    fontSize: dimensions.vw * 5,
  },
  buttonsContainer: {
    marginBottom: 10,
  },
});
