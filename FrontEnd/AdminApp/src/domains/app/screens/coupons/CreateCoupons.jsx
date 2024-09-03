import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Background } from '../../../../theme/CongfigrationStyle';

const SpacedInput = ({ children }) => (
  <View style={{ marginBottom: moderateScale(20) }}>{children}</View>
);

const CreateCoupons = () => {
  const [createCoupon, { isLoading, isSuccess, isError, error }] = useCreateCouponMutation();

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
    isActive: false,
  });

  const [displayDates, setDisplayDates] = useState({
    validFrom: '',
    validTo: ''
  });

  const navigation = useNavigation()
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState('');
  const [errors, setErrors] = useState({});

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

  const handleAddCouponButton = async () => {
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

      // Call the API to create the coupon
      const result = await createCoupon(couponData).unwrap();
      // console.log(result, '-----------------------------------------------------------------------')
      Toast.show({
        type: 'success',
        text1: 'Added New Coupon',
        text2: 'New Coupon Added Successfully '
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
        isActive: false,
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
        // Handle API errors
        console.log(error)
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* <ActivityIndicator animating={true} color={Colors.primary} size={25} /> */}
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
                    label="Description"
                    keyboardType="default"
                    onChangeText={(text) => handleTextChange('description', text)}
                    value={coupon.description}
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    label="Discount Amount"
                    keyboardType="number-pad"
                    onChangeText={(text) => handleTextChange('discountAmount', text)}
                    value={coupon.discountAmount}
                  />
                  {errors.discountAmount && <Text style={styles.errorText}>{errors.discountAmount}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    label="Usage Limit"
                    keyboardType="number-pad"
                    onChangeText={(text) => handleTextChange('usageLimit', text)}
                    value={coupon.usageLimit}
                  />
                  {errors.usageLimit && <Text style={styles.errorText}>{errors.usageLimit}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    label="Minimum Order Amount"
                    keyboardType="number-pad"
                    onChangeText={(text) => handleTextChange('minimumOrder', text)}
                    value={coupon.minimumOrder}
                  />
                  {errors.minimumOrder && <Text style={styles.errorText}>{errors.minimumOrder}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    label="Maximum Order Amount"
                    keyboardType="number-pad"
                    onChangeText={(text) => handleTextChange('maximumOrder', text)}
                    value={coupon.maximumOrder}
                  />
                  {errors.maximumOrder && <Text style={styles.errorText}>{errors.maximumOrder}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    label="Start Date"
                    value={displayDates.validFrom}
                    onFocus={() => showDatePicker('validFrom')}
                  />
                  {errors.validFrom && <Text style={styles.errorText}>{errors.validFrom}</Text>}
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    label="End Date"
                    value={displayDates.validTo}
                    onFocus={() => showDatePicker('validTo')}
                  />
                  {errors.validTo && <Text style={styles.errorText}>{errors.validTo}</Text>}
                </SpacedInput>
                <SpacedInput>

                  <View style={styles.radioContainer}>
                    <RadioButton
                      value="percentage"
                      status={coupon.isPercent ? 'checked' : 'unchecked'}
                      onPress={() => handleTextChange('isPercent', !coupon.isPercent)}
                    />
                    <Text style={[textVariants.textSubHeading, { color: coupon.isPercent ? Colors.primary : Colors.gray }]}>Percentage Type Coupon</Text>
                  </View>

                  <View style={styles.radioContainer}>
                    <RadioButton
                      value="active"
                      status={coupon.isActive ? 'checked' : 'unchecked'}
                      onPress={() => handleTextChange('isActive', !coupon.isActive)}
                    />

                    <Text style={[textVariants.textSubHeading, { color: coupon.isActive ? Colors.primary : Colors.gray }]}>Is Active</Text>
                  </View>

                </SpacedInput>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={() => setDatePickerVisible(false)}
                  minimumDate={new Date()}
                />
              </View>
            </CCard>
          </View>
          <View style={{ margin: moderateScale(20) }}>
            <CButton label="Add" onPress={handleAddCouponButton} mode='contained' />
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    marginTop: 2,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CreateCoupons;
