import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid } from "react-native";
import Toast from "react-native-toast-message";
import { useLazyGetPlacesDetailsQuery } from "../domains/app/screens/map/apis/getPlaceName";


export const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'App Location Permission',
        message: 'JJ Foods needs your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};



export const getCurrentLocation = async (setPlaceName) => {
  const [trigger, { data, isLoading }] = useLazyGetPlacesDetailsQuery();
  Geolocation.getCurrentPosition(async (info) => {
    const { latitude, longitude } = info.coords;
    try {
      // const placeDetails = await trigger({ latitude, longitude }).unwrap();
      // console.log(placeDetails, '----------------------------------------------');
      // if (placeDetails.results?.length) {
      //   setPlaceName(placeDetails.results[0].formatted_address);
      // }
    } catch (err) {
      console.error('Error fetching place details:', err);
      Toast.show({
        type: 'error',
        text1: 'Error fetching address',
        text2: err.message,
      });
    }
  });
};

