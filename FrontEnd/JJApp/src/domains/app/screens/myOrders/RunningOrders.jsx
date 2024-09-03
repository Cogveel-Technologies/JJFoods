import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import dimensions from '../../../../theme/Dimensions';
import { Colors } from '../../../../theme/Colors';
import { DemoImages } from '../../../../theme/ConfigrationStyle';

const RunningOrders = ({ data }) => {
  const [productDetails, setProductDetails] = useState([])

  useEffect(() => {
    // console.log(data, "Running orders ===============================")
    setProductDetails(data)
  }, [data])


  return (
    <>
      {data.products.map((item) => {

        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
            <Image
              resizeMode='contain'
              source={item.item_image_url
                ? { uri: item.item_image_url }
                : DemoImages.productDemo
              }

              style={{
                width: dimensions.vw * 17.5, height: dimensions.vw * 17.5, marginRight: 10, borderRadius: 10
              }} />

            <View style={{ flex: 1, }}>

              <View style={{ justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6.6, }}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.black, width: dimensions.vw * 45 }]}>{item.details.itemname}</Text>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.primary, textAlignVertical: 'auto' }]}>Quantity: {item.quantity}</Text>
              </View>

              <Text style={[textVariants.buttonTextHeading, { color: Colors.gray }]}>{item.price}</Text>
            </View>

          </View>
        )
      })}
    </>
  );
}

export default RunningOrders

const styles = StyleSheet.create({})