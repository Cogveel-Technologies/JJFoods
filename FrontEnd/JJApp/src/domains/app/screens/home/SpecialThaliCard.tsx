import { StyleProp, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import { Colors } from '../../../../theme/Colors'
import CCard from '../../../../components/CCard'
import { ViewStyle } from 'react-native-size-matters'
import dimensions from '../../../../theme/Dimensions'

type CardProps = {
  title: string;
  price?: string;
  onPress?: () => void;
  imageSource?: any;
  // children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  stockquantity: number;
}

const SpecialThaliCard = ({ title, price, imageSource, style, stockquantity, onPress }: CardProps) => {
  // console.log(stockquantity, '999999999999999999999')
  return (
    <CCard
      onPress={onPress}
      style={styles.maincard}
      disabled={stockquantity === 0}
    >
      <View style={{
        width: 220,
        height: 240,
      }}>
        <Avatar.Image size={164} source={imageSource}
          style={styles.image}
        />
        <View style={styles.textview}>
          <Text
            style={[textVariants.textMainHeading, styles.title, { textAlign: 'center' }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text style={[textVariants.textHeading, { textAlign: 'center', fontSize: 20, }]}> ₹ {price}</Text>
          {stockquantity === 0 && <View style={{ zIndex: 999, backgroundColor: Colors.primary2, borderRadius: 10, alignItems: 'center' }}>
            <Text style={[textVariants.buttonText, { fontSize: 18, color: Colors.black, textAlign: 'center' }]}>Not Available now</Text>
          </View>}
        </View>
      </View>
    </CCard>
  )
}

export default SpecialThaliCard

const styles = StyleSheet.create({
  maincard: {
    marginTop: 44,
    marginHorizontal: 0,
    marginEnd: 6,
    marginBottom: 25
  },
  image: {
    position: 'absolute',
    bottom: 130,
    alignSelf: "center",
  },
  textview: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 23,
    marginTop: 26
  },
  title: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    // marginBottom: 18,
    fontSize: 22,
  },
})