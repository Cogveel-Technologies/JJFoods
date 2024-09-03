import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import dimensions from '../../../../theme/Dimensions'
import { Icon } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import { textVariants } from '../../../../theme/StyleVarients'
import RunningOrders from './RunningOrders'
import BillStatement from '../cart/BillStatement'
import OrderStatus from './OrderStatus'
import CButton from '../../../../components/CButton'
import { Background } from '../../../../theme/ConfigrationStyle'

const FullOrderDetails = ({ route }) => {
  const { item } = route.params;

  // console.log(item, '----------------Details------------')
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, marginVertical: dimensions.vh * 5 }}>

          {/* Timer Heading and icon */}
          <View style={{ marginHorizontal: 64, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Icon
              source={require("../../../../../assets/images/clockicon.png")}
              color={Colors.primary}
              size={dimensions.vw * 4.8}
            />
            <Text style={[textVariants.buttonTextHeading, { color: Colors.black, paddingStart: 10 }]}>Your Order will arrive in 30-34 mins</Text>
          </View>

          {/* Main Card */}
          <View style={styles.mainCard}>

            {/* Order list  */}
            <View style={{ marginHorizontal: 12, marginVertical: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Your Order</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>
                    Payment mode :</Text>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>
                    {item?.payment?.paymentMethod}
                  </Text>
                </View>
              </View>
              <RunningOrders data={item} />
            </View>

            <View style={styles.dashedLine} />
            {/* Bill Statement  */}
            <View style={styles.billStatementContainer}>
              <BillStatement
                data={{
                  cgst: item?.cgst,
                  sgst: item?.sgst,
                  itemsTotal: item?.itemsTotal,
                  deliveryFee: item?.deliveryFee,
                  platformFee: item?.platformFee,
                  discount: item?.discount?.discount,
                  grandTotal: item?.grandTotal,
                  flag: true
                }}
              />
            </View>

            {/* Order Type  */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 12, marginBottom: 5, }}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Order Type : </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>{item?.preOrder?.type ? 'Pre Order' : 'Normal'}</Text>
              </View>
            </View>

            {/* Order Preferance  */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12, marginBottom: 5, }}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Order Preferance : </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>{item?.orderPreference}</Text>
              </View>

            </View>

            {/* Address Details */}

            {item?.orderPreference == 'Deliver to my Address' ? (<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12, marginBottom: 5, }}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Order Address : </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.primary, width: dimensions.vw * 38 }]}>{item?.address?.address1}</Text>
              </View>
            </View>) : null}

            {/* Order Date and Time */}
            {item?.preOrder?.type &&
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12, marginBottom: 5, }}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Order Date :</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>{item?.preOrder?.orderDate} -- </Text>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>{item?.preOrder?.orderTime}</Text>
                </View>
              </View>
            }

            {/* Order Tracking or Order Status */}
            <View style={{ marginHorizontal: 12, marginVertical: 18, }}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Your Order Status :</Text>
              <OrderStatus OrderStatus={item?.state} />
            </View>
          </View>

          {/* Tracking Button */}
          <View style={{ marginHorizontal: 26, marginTop: dimensions.vw * 5 }}>
            <CButton
              label='Track Order'
              mode='contained'
              disabled={item?.state !== 'on the way'}
            // onPress={gotoMapScreen}
            />
          </View>

        </View>
      </ImageBackground>
    </ScrollView>
  )
}

export default FullOrderDetails

const styles = StyleSheet.create({
  mainCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayDim,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 24
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed',

  },
  billStatementContainer: {
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed',
  },
})