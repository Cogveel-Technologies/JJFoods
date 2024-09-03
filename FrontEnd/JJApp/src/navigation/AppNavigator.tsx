
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BottomTabNavigator from './BottomTabNavigator'
import OrderDescription from '../domains/app/screens/orderDescription/OrderDescription'
import MenuScreen from '../domains/app/screens/menu/MenuScreen'
import OrdersNavigator from './OrdersNavigator'
import Locationscreen from '../domains/app/screens/map/LocationScreen'
import AddedPlaces from '../domains/app/screens/addedPlaces/AddedPlaces'
import Feedback from '../domains/app/screens/feedback/Feedback'
import AccountSetting from '../domains/app/screens/accountSetting/AccountSetting'
import CollectedCoupons from '../domains/app/screens/collectedCoupons/CollectedCoupons'
import ManualLocationScreen from '../domains/app/screens/manualLocation/ManualLocationScreen'
import AddressDetails from '../domains/app/screens/addressDetails/AddressDetails'
import MyProfile from '../domains/app/screens/profile/MyProfile'
import UpdateAddress from '../domains/app/screens/addressDetails/UpdateAddress'
import FullOrderDetails from '../domains/app/screens/myOrders/FullOrderDetails'
import OrderHistoryDetails from '../domains/app/screens/myOrders/orderHistory/OrderHistoryDetails'
import SearchResults from '../domains/app/screens/home/SearchResults'
import AboutUs from '../domains/app/screens/aboutUs/AboutUs'
import TermsAndConditions from '../domains/app/screens/termsAndConditions/TermsAndConditions'
import PrivacyPolicy from '../domains/app/screens/privacyPolicy/PrivacyPolicy'
import AddMapAddress from '../domains/app/screens/map/AddMapAddress'

const AppNavigator = () => {

  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName="HomeNavigator"
      screenOptions={{
        headerTitleAlign: 'center',
        // headerStyle: { backgroundColor: '' },
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name='HomeNavigator'
        component={BottomTabNavigator}
        options={{ headerShown: false, }} />

      <Stack.Screen
        name='MyProfile'
        component={MyProfile} />

      <Stack.Screen
        name='OrderDescription'
        component={OrderDescription}
        options={{ headerTitle: '' }}
      />

      <Stack.Screen
        name='MenuScreen'
        component={MenuScreen}
        options={{ headerTitle: '' }}
      />

      <Stack.Screen
        name='MyOrders'
        component={OrdersNavigator}
      />
      <Stack.Screen
        name='Locationscreen'
        component={Locationscreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name='AddMapAddress'
        component={AddMapAddress}
      // options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name='AddedPlaces'
        component={AddedPlaces}
        options={{ headerTitle: 'Added Places ' }}
      />
      <Stack.Screen
        name='Feedback'
        component={Feedback}
      />
      <Stack.Screen
        name='AccountSetting'
        component={AccountSetting}
        options={{ headerTitle: 'Account Setting' }}
      />
      <Stack.Screen
        name='CollectedCoupons'
        component={CollectedCoupons}
        options={{ headerTitle: 'Collected Coupons' }}
      />
      <Stack.Screen
        name='ManualLocationScreen'
        component={ManualLocationScreen}
        options={{ headerTitle: 'Saved places' }}
      />

      <Stack.Screen
        name='AddressDetails'
        component={AddressDetails}
        options={{ headerTitle: 'Address Details' }}
      />

      <Stack.Screen
        name='UpdateAddress'
        component={UpdateAddress}
        options={{ headerTitle: 'Update Address' }}
      />
      <Stack.Screen
        name='FullOrderDetails'
        component={FullOrderDetails}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name='OrderHistoryDetails'
        component={OrderHistoryDetails}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name='SearchResults'
        component={SearchResults}
        options={{ headerShown: false, }}
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

    </Stack.Navigator>

  )

}

export default AppNavigator