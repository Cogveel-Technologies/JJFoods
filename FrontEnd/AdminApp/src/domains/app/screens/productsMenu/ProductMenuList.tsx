import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { textVariants } from '../../../../theme/StyleVarients';
import dimensions from '../../../../theme/Dimensions';
import { Colors } from '../../../../theme/Colors';
import { useNavigation } from '@react-navigation/native';


// Define TypeScript interfaces for your data and components
interface MenuItem {
  id: number;
  title: string;
  price: string;
  image: ImageSourcePropType;
}

interface ItemProps {
  item: MenuItem;
  onPress: () => void;
}



// Define the Item component with TypeScript props
const Item: React.FC<ItemProps> = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    <Image source={item.image} style={styles.itemImage} />
    <Text style={[textVariants.productsHeading, { paddingTop: 7 }]}>{item.title}</Text>
    <Text style={[textVariants.productsHeading, { color: Colors.gray, paddingTop: 4 }]}>{item.price}</Text>
  </TouchableOpacity>
);

interface ProductMenuList {
  data: MenuItem[]; // Data for FlatList
  heading: string; // Heading for the menu
}

// Define the WazwanMenu component with props
const ProductMenuList: React.FC<ProductMenuList> = ({ data, heading }) => {

  const navigation = useNavigation<any>()
  const goToMenuEditScreen = () => {
    navigation.navigate('MenuEditScreen')
  }

  return (
    <View>
      <Text style={textVariants.textHeading}>{heading}</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        renderItem={({ item }) => (
          <Item
            item={item}
            onPress={goToMenuEditScreen}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginHorizontal: 4,
    marginBottom: 5
  },
  itemImage: {
    width: dimensions.vw * 17,
    height: dimensions.vw * 17,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grayDim
  },
});

export default ProductMenuList;
