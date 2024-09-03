import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import dimensions from '../../../../theme/Dimensions';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import { useReservedAdminMenuItemsQuery } from '../reservedAdmin/reservedHome/apis/reservedAdminmenuitems';
import LottieView from 'lottie-react-native';


const headers = ['Name', 'Quantity', 'Available', 'Actual', 'Discrepancy'];
const DailyUpdateItems = () => {
  const { data, error, isLoading, refetch } = useReservedAdminMenuItemsQuery();
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (data) {
      const initialQuantities = data.reduce((acc, item) => {
        acc[item._id] = item.itemQuantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [data]);

  const renderItem = ({ item }) => (
    <RenderItem
      item={item}
      quantity={quantities[item._id]}
      setQuantity={(newQuantity) =>
        setQuantities((prev) => ({ ...prev, [item._id]: newQuantity }))
      }
    />
  );

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

  return (
    <View style={styles.container}>
      <Header titles={headers} />
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const Header = ({ titles }) => (
  <View style={styles.headerContainer}>
    {titles.map((title, index) => (
      <Text key={index} style={[styles.headerText]}>{title}</Text>
    ))}
  </View>
);

const RenderItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, width: dimensions.vw * 12, }]}>{item?.name}</Text>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, marginStart: dimensions.vw * -5 }]}>{item?.quantity}</Text>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, }]}>{item?.quantity - item?.used}</Text>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, }]}>{item?.actualQuantity}</Text>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, backgroundColor: Colors.ternary, color: 'white', textAlign: 'center', borderRadius: 5, marginEnd: 5, padding: 3 }]}>{item?.discrepancy}</Text>
    </View>
  );
};

export default DailyUpdateItems;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayDim,
    marginHorizontal: 2,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grayDim,
    marginHorizontal: 2
  },
  input: {
    width: dimensions.vw * 15,
    height: dimensions.vh * 4,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    textAlign: 'center',
    color: Colors.gray,
  },
  statusView: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: dimensions.vh * 4,
    width: dimensions.vw * 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    backgroundColor: Colors.grayLight,
  },
  headerText: {
    ...textVariants.textSubHeading,
    fontSize: dimensions.vw * 3.3,
    width: dimensions.vw * 15,
    textAlign: 'center',
    paddingEnd: 1
  },
});
