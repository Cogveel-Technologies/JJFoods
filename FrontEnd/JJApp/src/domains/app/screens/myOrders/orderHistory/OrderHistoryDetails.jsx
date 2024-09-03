import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import dimensions from '../../../../../theme/Dimensions'
import OrderedProductList from './OrderedProductList'
import { Background } from '../../../../../theme/ConfigrationStyle'

const OrderHistoryDetails = ({ route }) => {
  const { item } = route.params;

  useEffect(() => {
    // console.log(item, 'oooooooooooooooooooooooooooooooooooooooo')
    // console.log(item._id, 'oooooooooooooooooooooooooooooooooooooooo')
  }, [item])

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, marginVertical: dimensions.vh * 5, marginHorizontal: 16 }}>
          <OrderedProductList orderId={item._id} />
        </View>
      </ImageBackground>
    </ScrollView>
  )
}

export default OrderHistoryDetails

const styles = StyleSheet.create({})