import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { textVariants } from '../theme/StyleVarients'
import { Colors } from '../theme/Colors'
import dimensions from '../theme/Dimensions'

const RestaurantClose = () => {
  return (
    <View style={{ width: "100%", height: "100%", flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', position: 'absolute', zIndex: 999 }}>
      <LottieView
        source={require('../../assets/lottieFiles/noInternet.json')}
        autoPlay
        loop={true}
        style={{ width: 150, height: 200, alignSelf: 'center' }}
      />
      <Text style={[textVariants.SecondaryHeading, { color: Colors.red, textAlign: 'center', fontSize: dimensions.vw * 5 }]}>
        We're closed for the day!
      </Text>
      <Text style={[textVariants.textSubHeading, { textAlign: 'center' }]}>
        See you tomorrow
      </Text>
    </View>
  )
}

export default RestaurantClose

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
