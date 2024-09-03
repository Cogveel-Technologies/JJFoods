import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Image, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Colors } from '../theme/Colors'
import MenuScreen from '../domains/app/screens/menu/MenuScreen'
import { useNavigation } from '@react-navigation/native'
import BottomTabNavigator from './BottomTabNavigator'
import dimensions from '../theme/Dimensions'
import MenuEditScreen from '../domains/app/screens/productsMenu/MenuEditScreen'
import ProductsMenu from '../domains/app/screens/productsMenu/ProductsMenu'
import MyProfile from '../domains/app/screens/profile/MyProfile'
import OrderDetails from '../domains/app/screens/orders/OrderDetails'
import AboutUs from '../domains/app/screens/aboutUs/AboutUs'
import TermsAndConditions from '../domains/app/screens/termsAndConditions/TermsAndConditions'
import PrivacyPolicy from '../domains/app/screens/privacyPolicy/PrivacyPolicy'
import DailyMenuUpdate from '../domains/app/screens/dailyMenu/DailyMenuUpdate'
import CreateCoupons from '../domains/app/screens/coupons/CreateCoupons'
import AllCoupons from '../domains/app/screens/coupons/AllCoupons'
import UpdateCoupon from '../domains/app/screens/coupons/UpdateCoupon'
import ProductFeedback from '../domains/app/screens/feedbacks/ProductFeedback'
import { Logos } from '../theme/CongfigrationStyle'

// interface stackpararmlist {
//   Home: string,
//   Menu: string
// }

const AppNavigator = () => {
  const LogoImage = require('../../assets/images/headerLogo.png')
  const DrawerIcon = require('../../assets/images/drawericon.png')
  const SearchIcon = require('../../assets/images/searchIcon.png')
  const Bellicon = require('../../assets/images/bellicon.png')


  const Stack = createNativeStackNavigator()

  const navigation = useNavigation<any>()
  const MenuScreenNavigation = () => {
    navigation.navigate('Menu')
  };

  const leftHeaderIcon = () => (
    <IconButton
      icon={DrawerIcon}
      iconColor={Colors.primary}
      size={dimensions.vw * 7.5}
      onPress={MenuScreenNavigation}
    />
  );

  const rightHeaderIcon1 = () => (
    <IconButton
      icon={SearchIcon}
      iconColor={Colors.primary}
      size={dimensions.vw * 5.5}
      onPress={() => console.log('Pressed')}
    />
  );

  const rightHeaderIcon2 = () => (
    <IconButton
      icon={Bellicon}
      iconColor={Colors.primary}
      size={dimensions.vw * 5.5}
      onPress={() => console.log('Pressed')}
    />
  );


  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name='HomeNavigator'
        component={BottomTabNavigator}
        options={{
          headerTitle: () => (
            <Image
              source={Logos.jjHeaderLogo}
              style={styles.headerImage}
            />
          ),
          headerLeft: leftHeaderIcon,
          headerRight: () => (
            <React.Fragment>
              {/* {rightHeaderIcon1()} */}
              {/* {rightHeaderIcon2()} */}
            </React.Fragment>
          )

        }}
      />
      <Stack.Screen
        name='Menu'
        component={MenuScreen}
        options={{ headerShown: true, }}

      />
      <Stack.Screen
        name='ProductsMenu'
        component={ProductsMenu}
        options={{ headerShown: true, }}

      />

      <Stack.Screen
        name='MenuEditScreen'
        component={MenuEditScreen}
        options={{ headerShown: true, title: 'Edit Menu' }}

      />
      <Stack.Screen
        name='MyProfile'
        component={MyProfile}
        options={{ headerShown: true, }}

      />
      <Stack.Screen
        name='OrderDetails'
        component={OrderDetails}
        options={{ headerShown: true, }}

      />
      <Stack.Screen
        name='DailyMenuUpdate'
        component={DailyMenuUpdate}
        options={{ headerShown: true, title: '' }}

      />

      <Stack.Screen
        name='AboutUs'
        component={AboutUs}
      // options={{ headerTitle: 'Address Details' }}
      />

      <Stack.Screen
        name='TermsAndConditions'
        component={TermsAndConditions}
      // options={{ headerTitle: 'Address Details' }}
      />
      <Stack.Screen
        name='PrivacyPolicy'
        component={PrivacyPolicy}
      // options={{ headerTitle: 'Address Details' }}
      />
      <Stack.Screen
        name='CreateCoupons'
        component={CreateCoupons}
        options={{ headerTitle: 'Create Coupon' }}
      />
      <Stack.Screen
        name='AllCoupons'
        component={AllCoupons}
        options={{ headerTitle: 'All Coupons' }}
      />
      <Stack.Screen
        name='UpdateCoupon'
        component={UpdateCoupon}
        options={{ headerTitle: 'Update Coupon' }}
      />
      <Stack.Screen
        name='ProductFeedback'
        component={ProductFeedback}
        options={{ headerTitle: 'Product Feedback' }}
      />

    </Stack.Navigator>
  )
}

export default AppNavigator
const styles = StyleSheet.create({
  headerImage: {
    height: dimensions.vh * 5,
    width: dimensions.vw * 33.5,
    resizeMode: 'contain'
  }
})
