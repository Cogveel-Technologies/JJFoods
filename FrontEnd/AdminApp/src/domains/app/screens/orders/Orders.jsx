import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import LinearHeader from '../../../../components/LinearHeader';
import ReactNativeSegmentedControlTab from 'react-native-segmented-control-tab';
import { Colors } from '../../../../theme/Colors';
import { textVariants } from '../../../../theme/StyleVarients';
import OrderListWithStatus from './OrderListWithStatus';
import dimensions from '../../../../theme/Dimensions';
import { Icon, RadioButton } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { Background } from '../../../../theme/CongfigrationStyle';
import CCard from '../../../../components/CCard';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const [segmentedButtonIndex, setsegmentedButtonIndex] = useState(0);
  const handlesegmentedButtonIndex = (index) => {
    setsegmentedButtonIndex(index);
  };

  const [orderType, setOrderType] = useState('Normal');

  const handleCardPress = (value) => {
    setOrderType(value);
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        <LinearHeader />
        <View style={{ marginHorizontal: 16, marginTop: dimensions.vh * 5, flex: 1 }}>

          {/* 4 segmented Buttons  */}
          <View>
            <ReactNativeSegmentedControlTab
              values={['Pending', 'Processing', 'OnTheWay', 'Completed', 'Canceled']}
              selectedIndex={segmentedButtonIndex}
              onTabPress={handlesegmentedButtonIndex}
              borderRadius={10}
              tabsContainerStyle={styles.segmentedTabs}
              tabStyle={{
                backgroundColor: Colors.whiteSecondary,
                borderColor: 'transparent',
              }}
              tabTextStyle={[textVariants.buttonTextHeading, { color: Colors.gray }]}
              activeTabStyle={{ backgroundColor: Colors.white, borderRadius: 10 }}
              activeTabTextStyle={{ color: Colors.primary }}
            />
          </View>

          {/* Search Bar */}
          {/* <View style={{ marginBottom: dimensions.vh * 1 }} >
            <CSearchBar
              placeholder="Search"
              onChangeText={handleSearch}
              value={searchQuery}
            />
          </View> */}

          {/* Order Type Selection buttons */}

          <RadioButton.Group
            onValueChange={value => setOrderType(value)}
            value={orderType}
          >
            {/* Orders button */}
            <CCard style={styles.card} onPress={() => handleCardPress('Normal')}>
              <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                  <View style={{ marginHorizontal: 15 }}>
                    <Icon
                      source={require('../../../../../assets/images/orderIconBottom.png')}
                      color={orderType === 'Normal' ? Colors.primary : Colors.gray}
                      size={dimensions.vw * 6}
                    />
                  </View>

                  <Text style={[
                    textVariants.textSubHeading,
                    { fontSize: orderType === 'Normal' ? dimensions.vw * 4.2 : dimensions.vw * 4, color: orderType === 'Normal' ? Colors.primary : Colors.black }
                  ]}>Orders</Text>

                </View>
                <View style={{ marginEnd: 15 }}>
                  <RadioButton value="Normal" />
                </View>
              </View>

            </CCard>

            {/* PreOrders button */}
            <CCard style={styles.card} onPress={() => handleCardPress('PreOrder')}>
              <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <View style={{ marginHorizontal: 15 }}>
                    <Icon
                      source={require('../../../../../assets/images/preOrderIcon.png')}
                      color={orderType === 'PreOrder' ? Colors.primary : Colors.gray}
                      size={dimensions.vw * 7}
                    />
                  </View>
                  <Text style={[
                    textVariants.textSubHeading,
                    { fontSize: orderType === 'PreOrder' ? dimensions.vw * 4.2 : dimensions.vw * 4, color: orderType === 'PreOrder' ? Colors.primary : Colors.black }
                  ]}>PreOrders</Text>
                </View>

                <View style={{ marginEnd: 15 }}>
                  <RadioButton value="PreOrder" />
                </View>

              </View>
            </CCard>
          </RadioButton.Group>


          {/* Order Details with status */}
          <View style={styles.orderStatusView}>
            <OrderListWithStatus
              customStyleIndex={segmentedButtonIndex}
              orderType={orderType}
            />
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

export default Orders;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  logoBackground: {
    flex: 1,
  },
  segmentedTabs: {
    height: dimensions.vh * 6.9,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  searchBar: {
    backgroundColor: Colors.white,
    borderWidth: 0.7,
    borderColor: Colors.grayDim,
    borderRadius: 15,
  },
  orderStatusView: {
    flex: 1,
    marginTop: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.whiteSecondary,
    marginHorizontal: 0,
    padding: 4,
    marginTop: 5,
  }
});
