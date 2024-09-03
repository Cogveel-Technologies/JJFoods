import React, { useCallback, useEffect, useState } from 'react';
import { ImageBackground, FlatList, StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import LinearHeader from '../../../../components/LinearHeader';
import CCard from '../../../../components/CCard';
import { IconButton, Switch } from 'react-native-paper';
import { textVariants } from '../../../../theme/StyleVarients';
import dimensions from '../../../../theme/Dimensions';
import { Colors } from '../../../../theme/Colors';
import { useAllCouponsQuery } from './apis/allCoupons';
import { useUpdateCouponStatusMutation } from './apis/updateCouponStatus';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDeleteCouponMutation } from './apis/deleteCoupon';
import { Background } from '../../../../theme/CongfigrationStyle';

const AllCoupons = () => {
  const navigation = useNavigation()
  const { data, error, isLoading, isError, refetch } = useAllCouponsQuery();
  const [updateCouponStatus, { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateCouponStatusMutation();

  const [deleteCoupon, { isLoading: isDeleteLoading, isError: isDeleteError, error: deleteError, isSuccess: isDeleteSuccess }] = useDeleteCouponMutation();

  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (data) {
      // Reverse the coupons list to show the latest coupon on top
      const reversedCoupons = [...data].reverse();
      setCoupons(reversedCoupons);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onToggleSwitch = async (id) => {
    try {
      // Optimistically update the local state
      setCoupons(coupons.map(coupon => coupon._id === id ? { ...coupon, isActive: !coupon.isActive } : coupon));
      // Update the status of the specific coupon via API
      const response = await updateCouponStatus({ id }).unwrap();
      setCoupons(coupons.map(coupon => coupon._id === id ? { ...coupon, isActive: response.isActive } : coupon));
      refetch()
    } catch (error) {
      console.error('Error updating coupon status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${err.message}, Status: ${err.status}`
      });

    }
  };

  // Rereshing the list so that get the updated data 
  const handleRefresh = async () => {
    try {
      const response = await refetch().unwrap();
      const reversedCoupons = [...response].reverse();
      setCoupons(reversedCoupons);
      // console.log(reversedCoupons, '------------------------------------')
    } catch (error) {

      console.error('Error refreshing data:', error);
      // Optionally, you can show an error message to the user
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (id) => {
    navigation.navigate('UpdateCoupon', { couponId: id });
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await deleteCoupon({ id }).unwrap();
              // console.log('coupon deleted successfully:-------', response);
              refetch()
              Toast.show({
                type: 'error',
                text1: 'Deleted',
                text2: 'Address Deleted 👋',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${err.message}, Status: ${err.status}`
              });
              console.error('Failed to delete address:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <CCard style={{ marginHorizontal: 0 }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', marginHorizontal: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ width: dimensions.vw * 68 }}>

            {/* <Text style={[textVariants.textMainHeading, { fontSize: dimensions.vw * 4.4, width: dimensions.vw * 40, }]}>
              {item?.title}
            </Text> */}

            <View style={{ flexDirection: 'row', }}>
              <Text style={[textVariants.textSubHeading, { color: Colors.black }]}>Title: </Text>
              <Text style={[textVariants.textSubHeading, { color: Colors.black }]}>{item?.title}</Text>
            </View>

            <View style={{ flexDirection: 'row', }}>
              <Text style={[textVariants.textSubHeading, { color: Colors.black }]}>Code: </Text>
              <Text style={[textVariants.textSubHeading, { color: Colors.primary, fontWeight: '900' }]}>{item?.code}</Text>
            </View>

            <View style={{ flexDirection: 'row', }}>
              <Text style={[textVariants.textSubHeading, { color: Colors.black }]}>Disc: </Text>
              <Text style={[textVariants.textSubHeading, { color: Colors.primary }]}>{item?.description}</Text>
            </View>

            <View style={{ flexDirection: 'row', }}>
              <Text style={[textVariants.textSubHeading, { color: Colors.black }]}>Valid From: </Text>
              <Text style={textVariants.textSubHeading}>{formatDate(item.validTo)}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
              <Text style={[textVariants.textSubHeading, { color: Colors.black }]}>Valid To: </Text>
              <Text style={textVariants.textSubHeading}>{formatDate(item.validTo)}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', }}>
            <View style={{ borderWidth: 1.5, borderRadius: 50, borderColor: item.isActive ? Colors.primary : Colors.gray, width: 50, marginBottom: dimensions.vw * 13, }}>
              <Switch
                value={item?.isActive}
                onValueChange={() => onToggleSwitch(item._id)}
                trackColor={{ false: Colors.white, true: Colors.white }}
                thumbColor={item?.isActive ? Colors.primary : Colors.gray}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}>
              <IconButton
                icon={require('../../../../../assets/images/deleteIcon.png')}
                iconColor={Colors.primary}
                size={dimensions.vw * 5}
                style={{ margin: 0 }}
                onPress={() => handleDelete(item._id)}
              />
              <IconButton
                icon={require('../../../../../assets/images/editIcon.png')}
                iconColor={Colors.primary}
                size={dimensions.vw * 5}
                style={{ margin: 0 }}
                onPress={() => handleEdit(item._id)}
              />
            </View>
          </View>
        </View>
      </View>
    </CCard>
  );

  if (isLoading || isUpdateLoading || isDeleteLoading) {
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground source={Background.jjBackground} resizeMode="cover" style={{ flex: 1 }}>
        <LinearHeader />
        <View style={{ flex: 1, marginHorizontal: 16.5, marginTop: 40 }}>
          <FlatList
            data={coupons}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            onRefresh={handleRefresh}
            refreshing={isLoading}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default AllCoupons;

const styles = StyleSheet.create({
  editButton: {
    color: Colors.primary,
    fontSize: dimensions.vw * 4,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
});
