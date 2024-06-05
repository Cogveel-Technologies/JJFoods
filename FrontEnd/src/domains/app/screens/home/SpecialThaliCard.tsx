import { StyleProp, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import { Colors } from '../../../../theme/Colors'
import CCard from '../../../../components/CCard'
import { ViewStyle } from 'react-native-size-matters'

type CardProps = {
  title: string;
  price?: string;
  onPress?: () => void;
  imageSource?: any;
  // children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SpecialThaliCard = ({ title, price, imageSource, style, onPress }: CardProps) => {
  return (
    <CCard onPress={onPress} style={styles.maincard} >
      <View style={{
        width: 220,
        height: 240,
      }}>
        <Avatar.Image size={164} source={imageSource}
          style={styles.image}
        />
        <View style={styles.textview}>
          <Text style={[textVariants.textMainHeading, styles.title]}>{title}</Text>
          <Text style={[textVariants.textHeading, { textAlign: 'center', fontSize: 20, }]}>{price}</Text>
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
    marginBottom: 18,
    fontSize: 22,
  }

})