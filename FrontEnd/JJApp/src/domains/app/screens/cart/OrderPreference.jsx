import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton, Icon, ActivityIndicator } from 'react-native-paper';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setOrderPreference } from './slices/orderPreferenceSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLazyGetAllAddedPlacesQuery } from '../addedPlaces/apis/getAllAddedPlaces';
import Toast from 'react-native-toast-message';

const OrderPreference = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const data = [
    { id: '1', icon: require('../../../../../assets/images/plateIcon.png'), text: 'Eat at Restaurant' },
    { id: '2', icon: require('../../../../../assets/images/pickupIcon.png'), text: 'Pick up from Restaurant' },
    { id: '3', icon: require('../../../../../assets/images/deliveryIcon.png'), text: 'Deliver to my Address' },
  ];

  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;

  // API for getting default address 
  const [trigger, { data: SavedAddresses, isFetching, isLoading }] = useLazyGetAllAddedPlacesQuery();

  const [defaultAddress, setDefaultAddress] = useState({
    address1: '',
    address2: '',
    phoneNumber: '',
    pinCode: '',
  });

  const [selectedId, setSelectedId] = useState(null);
  const [selectedText, setSelectedText] = useState('');

  const handleRadioButtonPress = async (itemId, itemText) => {
    dispatch(setOrderPreference({ id: itemId, orderPreference: itemText }));
    setSelectedId(itemId);
    setSelectedText(itemText);

    if (itemId === '3') {
      navigation.navigate('ManualLocationScreen');
    }
  };

  // Calling the defauld address api 
  useFocusEffect(
    useCallback(() => {
      const fetchDefaultAddress = async () => {
        try {
          const { data } = await trigger({ userId });
          if (data && data.length > 0) {
            const defaultAddr = data.find((address) => address.isDefault === true);
            if (defaultAddr) {
              setDefaultAddress({
                address1: defaultAddr.address1,
                address2: defaultAddr.address2,
                phoneNumber: defaultAddr.phoneNumber,
                pinCode: defaultAddr.pinCode,
              });
            }
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `${error.message}, Status: ${error.status}`
          });
          console.error('Failed to fetch saved addresses on focus:', error);
        }
      };

      fetchDefaultAddress();
    }, [userId, trigger])
  );

  const renderItem = ({ item }) => {
    const checked = selectedId === item.id;

    return (
      <>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleRadioButtonPress(item.id, item.text)}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginEnd: 15 }}>
              <Icon
                source={item.icon}
                color={checked ? Colors.primary : Colors.gray}
                size={dimensions.vw * 7}
              />
            </View>
            <Text style={[textVariants.textSubHeading, { color: checked ? Colors.primary : Colors.gray }]}>
              {item.text}
            </Text>
          </View>
          <RadioButton
            value={item.id}
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => handleRadioButtonPress(item.id, item.text)}
          />
        </TouchableOpacity>

        {item.id === '3' && checked ? (
          isFetching ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={[textVariants.textSubHeading, { color: Colors.primary, fontSize: 10, paddingStart: 60 }]}>
              {defaultAddress.address1}, {defaultAddress.address2} {defaultAddress.phoneNumber}
            </Text>
          )
        ) : null}
      </>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
  },
});

export default OrderPreference;
