import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearHeader from '../../../../components/LinearHeader';
import CCard from '../../../../components/CCard';
import dimensions from '../../../../theme/Dimensions';
import CInput from '../../../../components/CInput';
import CButton from '../../../../components/CButton';
import { RadioButton } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as yup from 'yup';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import { useCreateCouponMutation } from './apis/createCoupon';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetCouponByIdQuery } from './apis/getCouponById';
import { useUpdateCouponMutation } from './apis/updateCoupon';
import { Background } from '../../../../theme/CongfigrationStyle';

const SpacedInput = ({ children }) => (
  <View style={{ marginBottom: moderateScale(20) }}>{children}</View>
);

const UpdateCoupon = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const { couponId } = route.params || {};
  const [createCoupon, { isLoading, isSuccess, isError, error }] = useCreateCouponMutation();
  const { data, isLoading: isCouponByIdLoading } = useGetCouponByIdQuery({ id: couponId });
  const [updateCoupon, { isError: isUpdateError, isLoading: isUpdateLoading, }] = useUpdateCouponMutation();

  const [coupon, setCoupon] = useState({
    code: '',
    title: '',
    description: '',
    discountAmount: '',
    usageLimit: '',
    minimumOrder: '',
    maximumOrder: '',
    validFrom: '',
    validTo: '',
    isPercent: false,
    isActive: false
  });

  const [displayDates, setDisplayDates] = useState({
    validFrom: '',
    validTo: ''
  });

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState('');
  const [errors, setErrors] = useState({});

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (data) {
      setCoupon({
        code: data.code || '',
        title: data.title || '',
        description: data.description || '',
        discountAmount: data.discountAmount?.toString() || '',
        usageLimit: data.usageLimit?.toString() || '',
        minimumOrder: data.minimumOrder?.toString() || '',
        maximumOrder: data.maximumOrder?.toString() || '',
        validFrom: data.validFrom || '',
        validTo: data.validTo || '',
        isPercent: data.isPercent || false,
        isActive: data.isActive || false
      });
      setDisplayDates({
        validFrom: formatDate(new Date(data.validFrom)),
        validTo: formatDate(new Date(data.validTo))
      });
    }
  }, [data]);

  const couponSchema = yup.object().shape({
    code: yup.string().required('Code is required'),
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    discountAmount: yup.string().required('Discount Amount is required'),
    usageLimit: yup.string().required('Usage Limit is required'),
    minimumOrder: yup.string().required('Minimum Order is required'),
    maximumOrder: yup.string().required('Maximum Order is required'),
    validFrom: yup.string().required('Start Date is required'),
    validTo: yup.string().required('End Date is required'),
  });

  const handleTextChange = (key, value) => {
    setCoupon((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleDisplayDateChange = (key, value) => {
    setDisplayDates((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleUpdateCouponButton = async () => {
    try {
      // Validate coupon data
      await couponSchema.validate(coupon, { abortEarly: false });
      // Convert string values to integers
      const couponData = {
        ...coupon,
        discountAmount: parseInt(coupon.discountAmount, 10),
        usageLimit: parseInt(coupon.usageLimit, 10),
        minimumOrder: parseInt(coupon.minimumOrder, 10),
        maximumOrder: parseInt(coupon.maximumOrder, 10),
      };

      const { id, ...body } = couponData;
      // Call the API to update the coupon
      const result = await updateCoupon({ id: couponId, ...body }).unwrap();
      // console.log(result, "--==============")
      Toast.show({
        type: 'success',
        text1: 'Coupon Details Updated ',
        text2: 'Updated  Successfully '
      });
      setCoupon({
        code: '',
        title: '',
        description: '',
        discountAmount: '',
        validFrom: '',
        validTo: '',
        usageLimit: '',
        minimumOrder: '',
        maximumOrder: '',
        isPercent: false,
        isActive: false
      });

      // Optionally clear errors if any
      setErrors({});
      navigation.navigate('AllCoupons')
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors
        const errorMessages = {};
        error.inner.forEach((err) => {
          errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages);
      } else {
        console.log(error)
        // Handle API errors
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${error.message}, Status: ${error.status || 'Unknown'}`,
        });
      }
    }
  };

  const handleDateConfirm = (selectedDate) => {
    let fullDate;
    if (datePickerType === 'validFrom') {
      fullDate = new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString();
    } else if (datePickerType === 'validTo') {
      fullDate = new Date(selectedDate.setHours(23, 59, 59, 999)).toISOString();
    }

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const simpleDate = selectedDate.toLocaleDateString('en-GB', options);

    if (datePickerType === 'validFrom') {
      handleTextChange('validFrom', fullDate);
      handleDisplayDateChange('validFrom', simpleDate);
    } else if (datePickerType === 'validTo') {
      handleTextChange('validTo', fullDate);
      handleDisplayDateChange('validTo', simpleDate);
    }
    setDatePickerVisible(false);
  };

  const showDatePicker = (type) => {
    setDatePickerType(type);
    setDatePickerVisible(true);
  };

  if (isLoading || isUpdateLoading || isCouponByIdLoading) {
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ flex: 1, marginTop: 30 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CCard style={{ width: "95%", height: 'auto' }}>
              <View style={{ margin: dimensions.vh * 2 }}>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode='flat'
                    keyboardType="default"
                    label="Code"
                    onChangeText={(text) => handleTextChange('code', text)}
                    value={coupon.code}
                  />
                  {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="default"
                    label="Title"
                    onChangeText={(text) => handleTextChange('title', text)}
                    value={coupon.title}
                  />
                  {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="default"
                    label="Description"
                    onChangeText={(text) => handleTextChange('description', text)}
                    value={coupon.description}
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="numeric"
                    label="Discount Amount"
                    onChangeText={(text) => handleTextChange('discountAmount', text)}
                    value={coupon.discountAmount}
                  />
                  {errors.discountAmount && <Text style={styles.errorText}>{errors.discountAmount}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="numeric"
                    label="Usage Limit"
                    onChangeText={(text) => handleTextChange('usageLimit', text)}
                    value={coupon.usageLimit}
                  />
                  {errors.usageLimit && <Text style={styles.errorText}>{errors.usageLimit}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="numeric"
                    label="Minimum Order"
                    onChangeText={(text) => handleTextChange('minimumOrder', text)}
                    value={coupon.minimumOrder}
                  />
                  {errors.minimumOrder && <Text style={styles.errorText}>{errors.minimumOrder}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="numeric"
                    label="Maximum Order"
                    onChangeText={(text) => handleTextChange('maximumOrder', text)}
                    value={coupon.maximumOrder}
                  />
                  {errors.maximumOrder && <Text style={styles.errorText}>{errors.maximumOrder}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="default"
                    label="Valid From"
                    value={displayDates.validFrom}
                    onFocus={() => showDatePicker('validFrom')}
                    editable={false}
                  />
                  {errors.validFrom && <Text style={styles.errorText}>{errors.validFrom}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="default"
                    label="Valid To"
                    value={displayDates.validTo}
                    onFocus={() => showDatePicker('validTo')}
                    editable={false}
                  />
                  {errors.validTo && <Text style={styles.errorText}>{errors.validTo}</Text>}
                </SpacedInput>
                <View style={styles.radioContainer}>
                  <RadioButton
                    value="percent"
                    status={coupon.isPercent ? 'checked' : 'unchecked'}
                    onPress={() => handleTextChange('isPercent', !coupon.isPercent)}
                  />
                  <Text style={textVariants.textSubHeading}>Is Percent</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton
                    value="active"
                    status={coupon.isActive ? 'checked' : 'unchecked'}
                    onPress={() => handleTextChange('isActive', !coupon.isActive)}
                  />
                  <Text style={textVariants.textSubHeading}>Is Active</Text>
                </View>

              </View>
            </CCard>

          </View>
          <View style={{ margin: moderateScale(20) }}>
            <CButton label="Update Coupon" onPress={handleUpdateCouponButton} mode='contained' />
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
          minimumDate={new Date()}
        />
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: moderateScale(12),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },
});

export default UpdateCoupon;
