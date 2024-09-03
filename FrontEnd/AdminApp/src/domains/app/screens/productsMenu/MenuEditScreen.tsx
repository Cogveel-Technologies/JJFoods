import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { useNavigation } from '@react-navigation/native'
import CInput from '../../../../components/CInput'
import CCard from '../../../../components/CCard'
import { IconButton, } from 'react-native-paper'
import dimensions from '../../../../theme/Dimensions'
import LinearHeader from '../../../../components/LinearHeader'
import { textVariants } from '../../../../theme/StyleVarients'
import ReactNativeSegmentedControlTab from 'react-native-segmented-control-tab'
import DatePicker from 'react-native-date-picker'
import ImageCropPicker from 'react-native-image-crop-picker'
import { Background } from '../../../../theme/CongfigrationStyle'


const SpacedInput = ({ children }: any) => (
  <View style={{ marginBottom: moderateScale(20) }}>{children}</View>
);

const MenuEditScreen = () => {
  const productImage = require("../../../../../assets/images/AabGosh.png")
  const editCartImage = require('../../../../../assets/images/editProfileIcon.png')
  const [newProductImage, setnewProductImage] = useState('')
  const [segmentedButtonIndex, setSegmentedButtonIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dishName: '',
    price: '',
    quantity: '',
    imagePath: '',
    date: null,
    availabilityStatus: 'Yes',
  });

  const navigation = useNavigation<any>()
  // const goToHome = () => {
  //   navigation.navigate('Home')
  // }

  const selectImageFromStorage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(image => {
      setnewProductImage(image.path)
      setFormData((prevData) => ({
        ...prevData,
        imagePath: image.path,

      }));
      // console.log('Image path:', image.path);
    });
    // setshowModel(false)
  }

  const handleTextChange = (key: string, value: string | Date | null) => {
    let updatedValue: string | Date | null;
    if (typeof value === 'string') {
      updatedValue = value.trim() !== '' ? value : '';
    } else if (value instanceof Date || value === null) {
      updatedValue = value;
    } else {
      updatedValue = null;
    }

    setFormData((prevData) => ({
      ...prevData,
      [key]: updatedValue,
    }));

  };

  const handleSaveButton = () => {
    console.log(formData)
    navigation.navigate('ProductsMenu')
    setFormData({
      dishName: '',
      price: '',
      quantity: '',
      imagePath: '',
      date: null,
      availabilityStatus: '',
    });

  }

  const handleSegmentedButtonIndex = (index: number) => {
    setSegmentedButtonIndex(index);
    if (index === 0) {
      handleTextChange('availabilityStatus', 'Yes');
      handleTextChange('date', null);
    } else if (index === 1) {
      handleTextChange('availabilityStatus', 'No');
      handleTextChange('date', null);
    } else if (index === 2) {
      setOpen(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        <LinearHeader />
        <View style={{ flex: 1, }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <CCard style={{ width: "95%", height: 'auto', }}>
              <View style={styles.ProductImageView}>
                <ImageBackground
                  source={require("../../../../../assets/images/curvedImage.png")}
                  style={styles.backgroundImageView}
                >
                  {/* Product Image  */}
                  <View style={styles.imageContainer}>
                    <Image source={newProductImage ? { uri: newProductImage } : productImage} style={styles.productImage} />
                    <CCard
                      style={styles.editImage}>
                      <IconButton
                        icon={editCartImage}
                        iconColor={Colors.primary}
                        size={dimensions.vw * 4.9}
                        onPress={selectImageFromStorage}
                      />
                    </CCard>
                  </View>
                </ImageBackground>
              </View>
              {/* Inputfields */}
              <View style={{ marginTop: dimensions.vh * 15, marginHorizontal: 24 }}>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="default"
                    label="Name of Dish"
                    onChangeText={(text) => handleTextChange('dishName', text)}
                    value={formData.dishName}
                  />
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="number-pad"
                    label="Price"
                    onChangeText={(text) => handleTextChange('price', text)}
                    value={formData.price}
                  />
                </SpacedInput>
                <SpacedInput>
                  <CInput
                    type="text"
                    mode="flat"
                    keyboardType="default"
                    label="Quantity"
                    onChangeText={(text) => handleTextChange('quantity', text)}
                    value={formData.quantity}
                  />
                </SpacedInput>

                <Text style={[textVariants.textSubHeading, { paddingBottom: 15, paddingStart: 15 }]}>Availability</Text>
                {/* 3 segmented buttons for status and date Picker  */}
                <View>
                  <ReactNativeSegmentedControlTab
                    values={['Yes', 'No', 'CUSTOM↓',]}
                    selectedIndex={segmentedButtonIndex}
                    onTabPress={handleSegmentedButtonIndex}
                    borderRadius={10}
                    tabsContainerStyle={styles.segmentedTabs}
                    tabStyle={{
                      backgroundColor: "#F1DFC4",
                      borderColor: Colors.primary,
                      borderRadius: 10,
                      marginRight: 10
                    }}
                    tabTextStyle={[textVariants.buttonTextHeading, { color: Colors.primary }]}
                    activeTabStyle={{ backgroundColor: Colors.primary, }}
                    activeTabTextStyle={{ color: Colors.white }}
                  />

                  {segmentedButtonIndex === 2 &&
                    <DatePicker
                      modal
                      mode='date'
                      dividerColor='white'
                      open={open}
                      date={formData.date || new Date()}
                      onConfirm={(date) => {
                        setOpen(false);
                        handleTextChange('date', date);
                        handleTextChange('availabilityStatus', date ? 'From this date' : 'Not Available');
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />}

                  <Text
                    style={[textVariants.buttonTextSubHeading, styles.date]}>
                    {formData.date ? formData.date.toDateString() : ''}
                  </Text>
                </View>

              </View>
            </CCard>
          </View>

          <View style={styles.buttons}>
            <CButton
              label='Delete'
              mode='contained'
              onPress={() => console.warn("Deleted")}
              style={{ paddingHorizontal: dimensions.vw * 5 }}
            />
            <CButton
              label='Save'
              mode='contained'
              onPress={handleSaveButton}
              style={{ paddingHorizontal: dimensions.vw * 5 }}
            />
          </View>
        </View>

      </ImageBackground>

    </ScrollView >
  )
}

export default MenuEditScreen

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  logo: {
    width: moderateScale(113),
    height: moderateVerticalScale(98),
    margin: moderateScale(38),
  },
  editImage: {
    height: dimensions.vw * 8,
    width: dimensions.vw * 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 50,
  },
  productImage: {
    width: dimensions.vw * 32,
    height: dimensions.vw * 32,
    borderRadius: dimensions.vw * 50,
    alignSelf: 'center'
  },
  imageContainer: {
    marginTop: 30,
    width: dimensions.vw * 32,
    height: dimensions.vw * 32,
    borderRadius: dimensions.vw * 50,
    alignSelf: 'center',
    borderColor: Colors.grayDim
  },
  buttons: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-evenly'
  },
  segmentedTabs: {
    height: dimensions.vh * 4,
    backgroundColor: "white",
    borderRadius: 10,
  },
  date: {
    color: Colors.gray,
    paddingBottom: 27,
    paddingEnd: 13,
    alignSelf: 'flex-end'
  },
  ProductImageView: {
    width: dimensions.vw * 100,
    height: "100%",
    position: "absolute",
    top: dimensions.vh - 120,
    alignSelf: 'center'
  },
  backgroundImageView: {
    width: dimensions.vw * 70,
    height: dimensions.vh * 20,
    alignSelf: 'center',

  }

});