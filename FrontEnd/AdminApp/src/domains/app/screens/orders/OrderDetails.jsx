import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import CCard from '../../../../components/CCard'
import { textVariants } from '../../../../theme/StyleVarients'
import dimensions from '../../../../theme/Dimensions'
import { useRoute } from '@react-navigation/native'
import { Colors } from '../../../../theme/Colors'
import { Background } from '../../../../theme/CongfigrationStyle'

const OrderDetails = () => {
  const route = useRoute()
  const { item } = route.params
  // console.log(item, '********************OrderDetails******************')
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ flex: 1, }}>
          <View style={{ flex: 1, marginTop: 30, marginBottom: 20 }}>
            <CCard style={{ borderRadius: 25 }}>
              <View>
                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Order No.</Text>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>{item?._id}</Text>
                </View>
                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>CustomerName</Text>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>{item?.user?.name}</Text>
                </View>
                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Contact</Text>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>{item?.user?.phoneNumber}</Text>
                </View>
                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Order Status</Text>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>{item?.state}</Text>
                </View>
                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Order Type</Text>
                  <Text
                    style={[
                      textVariants.textSubHeading,
                      { fontSize: dimensions.vw * 3.3 },
                      item?.preOrder?.type && { color: 'green', fontWeight: "900" },
                    ]}
                  >{item?.preOrder?.type ? 'Pre-Order' : 'Normal Order'}</Text>
                </View>
                {item?.preOrder?.type &&
                  <View>
                    <View style={styles.Content}>
                      <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Order Date</Text>
                      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }, item?.preOrder?.type && { color: 'green', fontWeight: "900" }]}>{item?.preOrder?.orderDate}</Text>
                    </View>

                    <View style={styles.Content}>
                      <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Order Time</Text>
                      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }, item?.preOrder?.type && { color: 'green', fontWeight: "900" }]}>{item?.preOrder?.orderTime}</Text>
                    </View>
                  </View>}

                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Order Menu</Text>
                  <View >
                    {item.products.map((item) => {
                      return (
                        <View style={{ flexDirection: 'row', }}>
                          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 10, width: dimensions.vw * 40, textAlign: "right", paddingEnd: 10 }]}>{item?.details?.itemname}</Text>
                          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>x{item?.quantity}</Text>
                        </View>
                      )
                    })}
                  </View>
                </View>


                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Order Preferance</Text>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>{item?.orderPreference}</Text>
                </View>

                {item?.address && <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>Delivery Location </Text>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, width: dimensions.vw * 40, }]}>
                    {item?.address?.address1},{'\n'}
                    {item?.address?.address2},{'\n'}
                    {item?.address?.address3}
                  </Text>
                </View>}

                <View style={styles.Content}>
                  <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>{item?.payment?.status ? 'Amount Paid' : 'Amount to be paid'}</Text>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, }]}>{item?.grandTotal}</Text>
                    <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, }]}> ({item?.payment?.paymentMethod})</Text>
                  </View>
                </View>
              </View>
            </CCard>
          </View>


        </View>

      </ImageBackground>

    </ScrollView >
  )
}

export default OrderDetails

const styles = StyleSheet.create({
  Content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: Colors.gray,
    marginTop: 30,
    paddingBottom: 20,
    paddingStart: 16,

  }
})