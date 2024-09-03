import { Alert, FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import CCard from '../../../../components/CCard'
import { Icon, Modal, Portal, RadioButton } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import dimensions from '../../../../theme/Dimensions'
import CButton from '../../../../components/CButton'
import { moderateScale } from 'react-native-size-matters'
import { useDeleteUserAccountMutation } from './apis/deleteUserAccount'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setuserDetailsSlice } from '../../../auth/slices/userDetailsSlice'
import { setCartItems } from '../cart/slices/cartItemsSlice'
import { setToken } from '../../../auth/slices/authSlice'
import LottieView from 'lottie-react-native'
import Toast from 'react-native-toast-message'
import { Background } from '../../../../theme/ConfigrationStyle'


const AccountSetting = () => {
  const [showModel, setshowModel] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const options = [
    { id: '1', text: 'I am using a different account' },
    { id: '2', text: 'I’m worried about my privacy' },
    { id: '3', text: 'Receiving too many notifications ' },
    { id: '4', text: 'Other' },
  ];

  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;

  const handleRadioButtonPress = (itemId, itemText) => {
    setSelectedId(itemId);
    setSelectedText(itemText);
  };
  const dispatch = useAppDispatch()
  const [deleteUserAccount, { isLoading, isError, data, error }] = useDeleteUserAccountMutation();

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUserAccount({ userId, reason: selectedText }).unwrap();
      console.log('Account deleted successfully:', response);
      await AsyncStorage.removeItem('userDetails');
      dispatch(setuserDetailsSlice(null));
      dispatch(setCartItems([]));
      dispatch(setToken({
        token: '',
        isAuthenticated: false,
        isGuest: false
      }));
      setshowModel(false);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${err.message}, Status: ${err.status}`
      });
      console.error('Failed to delete account:', err);
    }
  };

  const renderItem = ({ item }) => {
    const checked = selectedId === item.id;
    return (
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
          <Text
            style={[textVariants.SecondaryHeading, { color: checked ? Colors.primary : Colors.gray }]}
          >
            {item.text}
          </Text>
        </View>
        <RadioButton
          value={item.id}
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButtonPress(item.id, item.text)}
        />
      </TouchableOpacity>
    );
  };

  const handleDeletePress = () => {

    if (!selectedText) {
      Alert.alert(
        'No Reason Selected',
        'Please select a reason before deleting your account.'
      );
      return;
    }
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setshowModel(false) },
        {
          text: 'Delete', onPress: () => {
            handleDeleteAccount();
            setshowModel(false);
          }
        },
      ],
      { cancelable: false }
    );
  };


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }

  return (
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />

      <View style={{ marginTop: 38, marginHorizontal: 24, flex: 1 }}>
        {/* Delete account button */}
        <CCard style={{ marginHorizontal: 0, marginTop: 5 }}>
          <TouchableOpacity
            style={styles.buttonstyle}
            onPress={() => setshowModel(true)}>
            <Text
              style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4.6, color: Colors.primary }]}
            >
              Delete Account
            </Text>
          </TouchableOpacity>
        </CCard>
        {/* Model for Options */}
        <Portal>
          <Modal
            visible={showModel}
            onDismiss={() => setshowModel(false)}
            contentContainerStyle={styles.containerStyle}>
            <View style={{ marginTop: 20 }}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
              />
            </View>
            <View style={{ margin: moderateScale(23) }}>
              <CButton label='Delete' mode='contained' onPress={handleDeletePress} />
            </View>
          </Modal>
        </Portal>
      </View>
    </ImageBackground>
  )
}

export default AccountSetting

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  buttonstyle: {
    marginHorizontal: 18,
    marginVertical: 12,
  },
  containerStyle: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    margin: 17
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    marginHorizontal: 25,
  },
});
