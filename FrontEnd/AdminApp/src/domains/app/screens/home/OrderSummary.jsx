import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CCard from '../../../../components/CCard';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { ActivityIndicator, Icon } from 'react-native-paper';
import OrderSummaryCard from './OrderSummaryCard';
import DonutChart from './DonutChart';
import { useNavigation } from '@react-navigation/native';
import dimensions from '../../../../theme/Dimensions';
import { useOrderSummaryQuery } from './apis/orderSummary';
import LottieView from 'lottie-react-native';
import CButton from '../../../../components/CButton';

const OrderSummary = ({ data1 }) => {
  const navigation = useNavigation();
  const icon = require("../../../../../assets/images/rightArrow.png");
  const [customStyleIndex, setCustomStyleIndex] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
  const periods = ['today', 'week', 'month',];
  const period = periods[customStyleIndex];

  const { data, error, isLoading, isError, refetch } = useOrderSummaryQuery({ period });

  // useEffect(() => {
  //   if (data1) {
  //     setOrderDetails(data1);
  //     console.log(data1, 'Initial data received');
  //   }
  // }, [data1]);

  useEffect(() => {
    refetch();
  }, [customStyleIndex, refetch]);

  // useEffect(() => {
  //   if (data) {
  //     // setOrderDetails(data?.data || []);
  //     console.log(data?.data, 'Updated order details');
  //   }
  // }, [data]);

  useEffect(() => {
    if (isError) {
      console.error(error, 'Error fetching order summary');
    }
  }, [isError, error]);

  const handleCustomIndexSelect = (index) => {
    setCustomStyleIndex(index);
    console.log(`Segmented button selected: ${index}`);
  };

  const OrdersScreenNavigation = () => {
    navigation.navigate('Orders');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center', }}
        />
      </View>
    )
  }

  if (isError) {
    console.log(error, "===========");
    let errorMessage = 'An error occurred while fetching  items.';

    if (error.status === 'FETCH_ERROR') {
      errorMessage = 'Network error:\n Please check your internet connection.';
    } else if (error.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (error.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (error.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {error.status === 'FETCH_ERROR' &&
          <LottieView
            source={require('../../../../../assets/lottieFiles/noInternet.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 200, alignSelf: 'center' }}
          />
        }
        <Text style={[textVariants.textHeading, { paddingBottom: 10 }]}>{error.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20, textAlign: 'center' }]}>{errorMessage}</Text>
        <CButton label='Reload' mode='contained' onPress={refetch} />
      </View>
    )
  }
  let x = 0;
  if (data?.data && data.data.length > 0) {
    for (let i = 0; i < data.data.length; i++) {
      x += data.data[i].value;
    }
  }

  return (
    <CCard secondaryBackground style={styles.cardStyle}>
      <View>
        <View style={styles.ordersummaryView}>
          <View style={{ marginStart: 14 }}>
            <Text style={[textVariants.buttonTextHeading, { color: Colors.black }]}>Order Summary</Text>
            <Text style={styles.subheding}>Order Summary based on Time </Text>
          </View>
          <SegmentedControlTab
            values={['today', 'week', 'month',]}
            selectedIndex={customStyleIndex}
            onTabPress={handleCustomIndexSelect}
            borderRadius={10}
            tabsContainerStyle={styles.segmentedTabs}
            tabStyle={{
              backgroundColor: Colors.btnBackground,
              borderColor: 'transparent',
            }}
            tabTextStyle={[textVariants.textSubHeading, { fontSize: dimensions.vw * 2.9 }]}
            activeTabStyle={{ backgroundColor: Colors.white, borderRadius: 10, margin: 3 }}
            activeTabTextStyle={{ color: Colors.gray }}
          />
        </View>

        <TouchableOpacity onPress={OrdersScreenNavigation} style={styles.orderbuttonStyle}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginStart: 7 }}>
            <View style={styles.ordercount}>
              <Text style={[styles.neworderText, { color: Colors.primary }]}>{data?.todaysOrders}</Text>
            </View>
            <Text style={styles.neworderText}>New Orders</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginEnd: 12 }}>
            <Text style={[textVariants.buttonTextHeading, { color: Colors.whiteSecondary, paddingEnd: 4 }]}>Manage Orders</Text>
            <Icon source={icon} color={Colors.white} size={dimensions.vw * 2.8} />
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <OrderSummaryCard data={data?.data} />
        </View>

        <DonutChart donutData={data?.data} />
      </View>
    </CCard>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({
  cardStyle: {
    marginStart: 0,
    marginEnd: 0,
    paddingStart: 0,
    marginBottom: 24,
    overflow: 'hidden',
  },
  subheding: {
    fontSize: dimensions.vw * 2.9,
    color: Colors.gray,
    fontFamily: 'Montserrat Regular',
    fontWeight: '400',
    paddingTop: 6,
  },
  ordersummaryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  segmentedTabs: {
    height: dimensions.vh * 4,
    width: dimensions.vw * 36,
    backgroundColor: Colors.btnBackground,
    borderRadius: 10,
  },
  neworderText: {
    fontSize: dimensions.vw * 3.9,
    color: Colors.whiteSecondary,
    fontFamily: 'Montserrat Bold',
    fontWeight: '700',
  },
  orderbuttonStyle: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: dimensions.vh * 5.5,
    marginEnd: 0,
    marginHorizontal: 12.5,
    marginTop: 16,
  },
  ordercount: {
    backgroundColor: Colors.whiteSecondary,
    height: dimensions.vh * 4,
    width: dimensions.vw * 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
