import { Alert, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CCard from '../../../../components/CCard'
import { Avatar, Switch, Text } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import CButton from '../../../../components/CButton'
import LinearHeader from '../../../../components/LinearHeader'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import ButtonList from './ButtonList'
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import { useDispatch } from 'react-redux'
import { logout, setToken } from '../../../auth/slices/authSlice'
import { useAppSelector } from '../../../../store/hooks'
import { useRestaurantStatusQuery } from './apis/restaurantStatus'
import { useUpdateRestaurantStatusMutation } from './apis/updateRestaurantStatus'
import LottieView from 'lottie-react-native'
import { setuserDetailsSlice } from '../../../auth/slices/userDetailsSlice'
import { useUpdateRestaurantMenuMutation } from './apis/updateRestaurantMenu'
import Toast from 'react-native-toast-message'
import { Background } from '../../../../theme/CongfigrationStyle'



const MenuScreen = () => {
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  const navigation = useNavigation()

  const ProfileScreenNavigation = () => {
    navigation.navigate('MyProfile');
  };
  const dispatch = useDispatch()
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const { data, error, isLoading, isError, refetch } = useRestaurantStatusQuery();
  const [updateStatus, { isLoading: isStatusUpdateLoading, error: statusUpdateError, isError: isRestaurantStatusError }] = useUpdateRestaurantStatusMutation();

  const [updateRestaurantMenu, { isLoading: isMenuUpdateLoading, isError: isMenuUpdateError, error: menuUpdateError }] = useUpdateRestaurantMenuMutation();


  useEffect(() => {
    if (data) {
      setIsSwitchOn(data.state);
    }
  }, [data])

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );


  if (isLoading || isStatusUpdateLoading || isMenuUpdateLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center', }}
        />
      </View>
    )
  }

  if (isError || isRestaurantStatusError) {
    console.log(error, "===========");
    let errorMessage = 'An error occurred while fetching items.';

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

  const onToggleSwitch = async () => {

    try {
      const response = await updateStatus().unwrap();
      setIsSwitchOn(response.state);
      // console.log('Response:-----------', response);
    } catch (error) {
      console.error('Error updating restaurant status:----------------', error);
    }
  };

  const showAlert = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: handleLogout }
      ],
      { cancelable: false }
    );
  };

  const handleLogout = () => {
    dispatch(setuserDetailsSlice([]));
    dispatch(logout())
  }

  const handleUpdateMenu = async () => {
    try {
      const result = await updateRestaurantMenu().unwrap();
      console.log('Success:', result);
      Toast.show({
        type: 'success',
        text1: 'Update Successfully ',
        text2: `Your restaurant is update now `
      });
    } catch (err) {
      console.error('Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${err.message}, Status: ${err.status}`
      });
    }
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ flex: 1, marginHorizontal: 16.5, marginTop: 40 }}>

          {/* Profile Card and Edit-Button */}
          <CCard style={{ marginHorizontal: 0, }}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', marginHorizontal: 24 }}>

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Image
                  source={userDetails?.imageUrl ? { uri: userDetails.imageUrl } : demoprofilePic}
                  style={{ marginEnd: 18 }}
                  size={dimensions.vw * 15}
                />
                <View>
                  <Text style={[textVariants.textMainHeading, {
                    fontSize: dimensions.vw * 4.4, width: dimensions.vw * 40,
                  }]}>{userDetails?.name}</Text>
                  <Text style={textVariants.textSubHeading}>{userDetails?.phoneNumber}</Text>
                </View>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={ProfileScreenNavigation}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>

              </View>

            </View>
          </CCard>

          {/* Other Options */}
          <CCard style={{ marginHorizontal: 0 }}>
            <View >
              <View style={styles.statusView}>
                <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4.6 }]}>
                  {isSwitchOn ? 'Restaurant is Open' : 'Temporarily Closed'}
                </Text>
                <View style={{
                  borderWidth: 1.5,
                  borderRadius: 50,
                  borderColor: isSwitchOn ? Colors.primary : Colors.gray,
                  padding: 1,
                }}>
                  <Switch
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    trackColor={{ false: Colors.white, true: Colors.white }}
                    thumbColor={isSwitchOn ? Colors.primary : Colors.gray}
                  />
                </View>
              </View>
              <ButtonList />
              {/* Update restaurant status button */}
              <CButton
                onPress={handleUpdateMenu}
                label='Update DB Menu (*)'
                mode='text'
                fontsize={20}
                // fontsize={dimensions.vw * 4.8}
                style={{ alignSelf: 'flex-start', marginTop: 15, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, paddingHorizontal: 40, marginStart: -15 }} />

              <CButton
                onPress={showAlert}
                label='LogOut'
                mode='text'
                fontsize={20}
                // fontsize={dimensions.vw * 4.8}
                style={{ alignSelf: 'flex-start', marginStart: 25, marginTop: 15 }} />
            </View>
          </CCard>
        </View>
      </ImageBackground>
    </ScrollView>

  )
}

export default MenuScreen

const styles = StyleSheet.create({
  editButton: {
    color: Colors.primary,
    fontSize: dimensions.vw * 4,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    paddingBottom: 22,
    paddingTop: 25,
    paddingStart: 10
  },

})

