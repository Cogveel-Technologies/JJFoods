import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../../theme/Colors';
import { textVariants } from '../../../../theme/StyleVarients';
import dimensions from '../../../../theme/Dimensions';

const OrderSummaryCard = ({ data }) => {

  // const data = [
  //   { id: '1', title: 'On Delivery', content: '25' },
  //   { id: '2', title: 'Delivered', content: '30' },
  //   { id: '3', title: 'Canceled', content: '03' },
  // ];


  const renderItem = ({ item }) => (
    <View style={styles.renderitem}>
      <Text style={[textVariants.headingSecondary, { color: Colors.black, textAlign: 'center', }]}>{item.value}</Text>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3, textAlign: 'center', }]}>{item.label}</Text>
    </View>
  );


  return (

    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  )
}

export default OrderSummaryCard

const styles = StyleSheet.create({
  renderitem: {
    height: dimensions.vh * 5.5,
    width: dimensions.vw * 25,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grayDim,
    borderRadius: 10,
    // marginStart: 20,
    marginVertical: dimensions.vh * 1.5,
    marginHorizontal: dimensions.vw * 2

    // marginTop: 16,
  }
})