import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

import dimensions from '../theme/Dimensions'
import { IconButton } from 'react-native-paper'
import { Colors } from '../theme/Colors'
import MenuScreen from '../domains/app/screens/reservedAdmin/Menu/MenuScreen'
import ReservedAdminHome from '../domains/app/screens/reservedAdmin/reservedHome/Home'


const ReservedAdminNavigator = () => {
  const LogoImage = require('../../assets/images/headerLogo.png')
  const DrawerIcon = require('../../assets/images/drawericon.png')

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
  return (
    <Stack.Navigator
      initialRouteName='RAdmin'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name='RAdmin'
        component={ReservedAdminHome}
        options={{
          headerTitle: () => (
            <Image
              source={LogoImage}
              style={styles.headerImage}
            />
          ),
          headerLeft: leftHeaderIcon,
        }}
      />

      <Stack.Screen
        name='Menu'
        component={MenuScreen}
        options={{ headerShown: true, }}
      />

    </Stack.Navigator>
  )
}

export default ReservedAdminNavigator

const styles = StyleSheet.create({
  headerImage: {
    height: dimensions.vh * 5,
    width: dimensions.vw * 33.5,
    resizeMode: 'contain'
  }
})