import { StyleSheet } from 'react-native';
import React, { useCallback, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLazyGetPlacesDetailsQuery } from './apis/getPlaceName';
import Toast from 'react-native-toast-message';

const MapComponent = ({ latitude, longitude, setPlaceName, setDisplayAddress, placeName }) => {
  const [trigger, { data, isLoading }] = useLazyGetPlacesDetailsQuery();

  // Debouced fucntion for delayig the api call for 3 seconds
  const handleRegionChangeComplete = async (newRegion) => {
    const { latitude, longitude } = newRegion;
    try {
      // console.log(newRegion, "Region changed");
      const placeDetails = await trigger({ latitude, longitude }).unwrap();
      // console.log(placeDetails, 'Place details');
      if (placeDetails.results?.length) {
        setPlaceName(placeDetails.results[1].formatted_address);
        // setDisplayAddress(placeDetails.results[1].formatted_address.split(',').slice(1, 2).join(','))
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error fetching address',
        text2: error.message,
      });
    }
  };

  // Use the custom debounce function
  const debouncedHandleRegionChangeComplete = useDebounce(handleRegionChangeComplete, 2000);

  return (
    // <MapView
    //   provider={PROVIDER_GOOGLE}
    //   style={styles.map}
    //   region={{
    //     latitude: latitude,
    //     longitude: longitude,
    //     latitudeDelta: 0.015,
    //     longitudeDelta: 0.0121,
    //   }}
    // // onRegionChangeComplete={(newRegion) => {
    // //   debouncedHandleRegionChangeComplete(newRegion);
    // // }}
    // />

    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
      scrollEnabled={false}  // Disable map scrolling
      // zoomEnabled={false}    // Disable map zooming
      rotateEnabled={false}  // Disable map rotation
    >
      <Marker
        coordinate={{ latitude, longitude }}
      // title={placeName}
      />
    </MapView>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  map: {
    height: 700,
    width: '100%',
    position: "absolute",
    zIndex: -999,
  },
});

// Custom debounce hook
const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
};
