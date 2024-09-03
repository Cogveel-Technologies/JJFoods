import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useReservedAdminMenuItemsQuery } from './apis/reservedAdminmenuitems';
import CButton from '../../../../../components/CButton';
import { Colors } from '../../../../../theme/Colors';
import { moderateScale } from 'react-native-size-matters';
import { textVariants } from '../../../../../theme/StyleVarients';
import dimensions from '../../../../../theme/Dimensions';
import { useUpdateReservedAMenuMutation } from './apis/updatedReservedmenu';
import { useUpdateReservedBMenuMutation } from './apis/updateReservedB';
import { useAppSelector } from '../../../../../store/hooks';
import Toast from 'react-native-toast-message';

const UpdateMenuItem = () => {
  const { data, error, isLoading, refetch } = useReservedAdminMenuItemsQuery();
  const { role } = useAppSelector((store) => store.persistedReducer.authSlice)

  const [updateReservedAMenu, { isLoading: isUpdateALoading }] = useUpdateReservedAMenuMutation();
  const [updateReservedBMenu, { isLoading: isUpdateBLoading }] = useUpdateReservedBMenuMutation();

  const [productList, setProductList] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (data) {
      setProductList(data);
      const initialQuantities = data.reduce((acc, item) => {
        acc[item.itemId] = {
          name: item.name,
          quantity: role === 'reservedAdminB' ? item.actualQuantity.toString() : item.quantity.toString(),
        };
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [data, role]);

  const transformQuantities = (quantities) => {
    return Object.entries(quantities).map(([itemId, { name, quantity }]) => ({
      itemId,
      name,
      quantity: Number(quantity),
    }));
  };

  const handleUpdateReservedMenu = async () => {
    try {
      let items = transformQuantities(quantities);
      if (role === 'reservedAdminB') {
        // Transform quantities to actualQuantity for reservedAdminB
        items = items.map(item => ({
          ...item,
          actualQuantity: item.quantity,
          quantity: undefined, // Remove quantity to avoid confusion
        }));
      }

      let response;
      if (role === 'reservedAdminA') {
        response = await updateReservedAMenu(items).unwrap();
      } else if (role === 'reservedAdminB') {
        response = await updateReservedBMenu(items).unwrap();
      } else {
        throw new Error('Invalid role');
      }

      // console.log('Update successful:', response);
      Toast.show({
        type: 'success',
        text1: 'Stock Updated Successfully ',
        text2: "Success"
      });
      refetch(); // Refetch all items after updating
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${err.message}, Status: ${err.status}`
      });
      console.error('Update failed:', err);
    }
  };

  const renderItem = ({ item }) => (
    <RenderItem
      role={role}
      itemId={item.itemId}
      itemname={item.name}
      quantity={quantities[item.itemId]?.quantity}
      setQuantity={(newQuantity) =>
        setQuantities((prev) => ({ ...prev, [item.itemId]: { ...prev[item.itemId], quantity: newQuantity } }))
      }
      updateReservedAMenu={updateReservedAMenu}
      updateReservedBMenu={updateReservedBMenu}
      refetch={refetch}
    />
  );

  if (isLoading || isUpdateALoading || isUpdateBLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: moderateScale(18), marginVertical: 20 }}>
        <CButton label='Update All' mode='contained' onPress={handleUpdateReservedMenu} />
      </View>

      <FlatList
        data={productList}
        keyExtractor={(item) => item.itemId}
        renderItem={renderItem}
        showsVerticalScrollIndicator
      />
    </View>
  );
};

const RenderItem = ({ role, itemId, itemname, quantity, setQuantity, updateReservedAMenu, updateReservedBMenu, refetch }) => {
  const handleUpdate = async () => {
    try {
      const updatedItem1 = {
        itemId: itemId,
        name: itemname,
        quantity: Number(quantity),
      }

      const updatedItem2 = {
        itemId: itemId,
        name: itemname,
        actualQuantity: Number(quantity),
      }

      let response;
      if (role === 'reservedAdminA') {
        response = await updateReservedAMenu([updatedItem1]).unwrap();
      } else {
        response = await updateReservedBMenu([updatedItem2]).unwrap();
      }
      // console.log('Update successful:', response);
      Toast.show({
        type: 'success',
        text1: 'Item Updated Successfully!',
        text2: 'Done'
      });
      refetch();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${err.message}, Status: ${err.status}`
      });
      console.error('Update failed:', err);
    }
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, width: dimensions.vw * 40 }]}>{itemname}</Text>
      <TextInput
        style={styles.input}
        keyboardType='number-pad'
        value={quantity}
        onChangeText={setQuantity}
      />
      <TouchableOpacity
        style={styles.statusView}
        onPress={handleUpdate}
      >
        <Text style={[textVariants.buttonTextHeading, { fontSize: dimensions.vw * 2.6, textAlign: 'center' }]}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateMenuItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  input: {
    width: dimensions.vw * 20,
    height: dimensions.vh * 4,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    textAlign: 'center',
    color: Colors.gray,
    fontSize: dimensions.vw * 5,
  },
  statusView: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: dimensions.vh * 4,
    width: dimensions.vw * 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
