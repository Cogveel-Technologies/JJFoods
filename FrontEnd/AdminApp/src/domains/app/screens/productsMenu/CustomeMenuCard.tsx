import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import CCard from '../../../../components/CCard';
import { Icon, IconButton, Modal, Portal, } from 'react-native-paper';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { textVariants } from '../../../../theme/StyleVarients';
import { ProductMenuitem, } from './ProductsMenu';
import CInput from '../../../../components/CInput';
import ImageCropPicker from 'react-native-image-crop-picker';
import CButton from '../../../../components/CButton';
import ProductMenuList from './ProductMenuList';


interface CustomeMenuCardProps {
  heading: string;
  data: ProductMenuitem[];
}

const CustomeMenuCard: React.FC<CustomeMenuCardProps> = ({ heading, data }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dishName: '',
    price: '',
    quantity: '',
    imagePath: '',
  });
  const [showModel, setshowModel] = useState(false)

  const handleAddPress = () => {
    setShowForm(true);
  };

  const handleSavePress = () => {
    console.log('Form data:', formData);
    setFormData({
      dishName: '',
      price: '',
      quantity: '',
      imagePath: '',
    });
    setShowForm(false);
  };

  const handleTextChange = (key: string, text: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: text
    }));
  };

  const selectFromStorage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(image => {
      setFormData((prevData) => ({
        ...prevData,
        imagePath: image.path,
      }));
      // console.log('Image path:', image.path);
    });
    setshowModel(false)
  }

  const handleCamera = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(image => {
      setFormData((prevData) => ({
        ...prevData,
        imagePath: image.path,
      }));
      console.log('Image path:', image.path);
    });
    setshowModel(false)

  };

  return (
    <CCard style={styles.mainCard}>
      <ProductMenuList heading={heading} data={data} />

      {!showForm && (
        <TouchableOpacity
          style={styles.Button}
          onPress={handleAddPress}
        >
          <Icon
            source={require('../../../../../assets/images/addProductIcon.png')}
            color={Colors.primary}
            size={dimensions.vw * 3}
          />
          <Text style={[textVariants.buttonTextHeading, styles.addButtonLabel]}>Add</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.formView}>

          <CInput
            type="text"
            mode="flat"
            keyboardType="default"
            label="Name of Dish"
            onChangeText={(text) => handleTextChange('dishName', text)}
            value={formData.dishName}
            PlaceholderTextcolor={Colors.black}

          />
          <View style={styles.formSubView}>
            <CInput
              type="text"
              mode="flat"
              keyboardType="number-pad"
              label="Price"
              onChangeText={(text) => handleTextChange('price', text)}
              value={formData.price}
              style={{ marginHorizontal: 5 }}
              PlaceholderTextcolor={Colors.black}
            />
            <CInput
              type="text"
              mode="flat"
              keyboardType="phone-pad"
              label="Quantity"
              onChangeText={(text) => handleTextChange('quantity', text)}
              value={formData.quantity}
              style={{ marginHorizontal: 5 }}
              PlaceholderTextcolor={Colors.black}
            />
          </View>

          <View style={styles.addPictureView}>

            <Text style={[textVariants.buttonTextHeading, { color: Colors.black, paddingHorizontal: 5 }]}>Add Picture</Text>
            <IconButton
              icon={require('../../../../../assets/images/cameraIcon.png')}
              iconColor={Colors.grayDim}
              size={dimensions.vw * 4.5}
              onPress={() => setshowModel(true)}
            />

          </View>

          {/* Model for 2 buttons */}

          <Portal>
            <Modal
              visible={showModel}
              onDismiss={() => setshowModel(false)}
              contentContainerStyle={styles.model}>

              <CButton label='Camera' mode='text' onPress={handleCamera} style={{ borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: Colors.gray, marginBottom: 5, }} fontsize={21} />
              <CButton label='Select from Gallery' mode='text' onPress={selectFromStorage} fontsize={21} />

            </Modal>
          </Portal>

          <TouchableOpacity
            style={styles.Button}
            onPress={handleSavePress}>
            <Text style={[textVariants.buttonTextHeading, { color: Colors.primary, paddingEnd: 5 }]}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </CCard>
  );
};

export default CustomeMenuCard;

const styles = StyleSheet.create({
  mainCard: {
    marginHorizontal: 0,
    paddingVertical: 18,
    paddingHorizontal: 18
  },
  Button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  addButtonLabel: {
    color: Colors.primary,
    paddingStart: 6,
    paddingEnd: 18
  },
  formView: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    borderStyle: 'dashed',
    paddingTop: 10
  },
  formSubView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  addPictureView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginStart: 5
  },
  model: {
    backgroundColor: Colors.whiteSecondary,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  }

});
