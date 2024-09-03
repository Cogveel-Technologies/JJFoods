import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import dimensions from '../../../../theme/Dimensions'
import CSearchBar from '../../../../components/CSearchBar'
import CustomeMenuCard from './CustomeMenuCard'
import { Background } from '../../../../theme/CongfigrationStyle'


export interface ProductMenuitem {
  id: number;
  title: string;
  price: string;
  image: any; // Update the type based on the actual type of your image data
}

export default function ProductsMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };


  const wazwanMenuItems: ProductMenuitem[] = [
    { id: 1, title: 'Rista', price: '₹ 100', image: require('../../../../../assets/images/AabGosh.png') },
    { id: 2, title: 'Gushtaba', price: '₹ 120', image: require('../../../../../assets/images/soanPlateImage.png') },
    { id: 3, title: 'Kabab', price: '₹ 120', image: require('../../../../../assets/images/soanPlateImage.png') },
    { id: 4, title: 'RoganJosh', price: '₹ 120', image: require('../../../../../assets/images/soanPlateImage.png') },
    { id: 5, title: 'AabGosh', price: '₹ 120', image: require('../../../../../assets/images/soanPlateImage.png') },
  ];


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={Background.jjBackground}
          resizeMode="cover"
          style={{ flex: 1, }}
        >
          <LinearHeader />

          {/* Main Container */}
          <View style={styles.mainContainer}>

            {/* Search  Bar  */}
            <CSearchBar
              placeholder="Search"
              onChangeText={handleSearch}
              value={searchQuery}
            />

            {/* Wazwan Catogary Card */}
            <CustomeMenuCard heading="Wazwan" data={wazwanMenuItems} />
            {/* Special thali's Card */}
            <CustomeMenuCard heading="Special Thali's" data={wazwanMenuItems} />
            {/* Additional Popular Dishes Card */}
            <CustomeMenuCard heading="Additional-Popular Dishes" data={wazwanMenuItems} />
            {/* DDesserts Card */}
            <CustomeMenuCard heading="Desserts" data={wazwanMenuItems} />


          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: dimensions.vh * 5.5,
    marginBottom: dimensions.vh * 2.5
  }
})