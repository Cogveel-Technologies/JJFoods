import { StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import CCard from '../../../../components/CCard'
import { ViewStyle } from 'react-native-size-matters'
import CsmallButton from '../../../../components/CsmallButton'
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'

type CardProps = {
  title: string;
  quantity: string;
  price?: string;
  onPress?: () => void;
  imageSource?: any;
  style?: StyleProp<ViewStyle>;
  stockquantity: number,
}

const AdditionalThaliCard = ({ title, price, quantity, imageSource, style, onPress, stockquantity }: CardProps) => {
  return (
    <CCard
      onPress={onPress}
      imageBackground={true}
      imageSource={imageSource}
      whiteBackground={false}
      secondaryBackground={false}
      style={{ height: 155, width: 183, backgroundColor: 'transparent', marginBottom: 18, marginHorizontal: 0, marginEnd: 10 }}
    // disabled={stockquantity === 0}
    >
      {/* Overlay for dimming background when out of stock */}
      {stockquantity === 0 && <View style={styles.overlay} />}

      <View style={{ marginTop: 18 }} >
        <Text style={[textVariants.buttonTextHeading, { fontSize: 16, textAlign: 'center' }]}
          numberOfLines={2}
          ellipsizeMode='tail'
        >{title}</Text>

        <Text style={[textVariants.buttonTextSubHeading, { fontSize: 11 }]}>{quantity}</Text>
      </View>

      {stockquantity === 0 && (
        <View style={{ alignItems: 'center', zIndex: 2 }}>
          <Text style={[textVariants.buttonText, { fontSize: 16, textAlign: 'center', backgroundColor: Colors.white, color: Colors.black, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2 }]}>
            Not Available Now
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, justifyContent: 'space-evenly' }}>
        <View>
          <CsmallButton mode='outlined' label={price} icon={require('../../../../../assets/images/rupeeIcon.png')} />
        </View>
        <View>
          <CsmallButton
            label='Add'
            type='leftIcon'
            mode='contained'
            onPress={onPress}
            icon={require('../../../../../assets/images/addIcon.png')}
            disabled={stockquantity === 0}
          />
        </View>
      </View>
    </CCard>
  )
}

export default AdditionalThaliCard

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
})
