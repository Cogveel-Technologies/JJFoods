import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../../theme/StyleVarients'
import LinearHeader from '../../../../../components/LinearHeader'
import dimensions from '../../../../../theme/Dimensions'
import UpdateMenuItem from './UpdateMenuItem'
import { Colors } from '../../../../../theme/Colors'
import { useReservedAdminMenuItemsQuery } from './apis/reservedAdminmenuitems'
import { useUpdateReservedMenuMutation } from './apis/updatedReservedmenu'
import { useAppSelector } from '../../../../../store/hooks'
import { Background } from '../../../../../theme/CongfigrationStyle'

const ReservedAdminHome = () => {
  return (
    // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <LinearHeader />
      <View style={[{ marginHorizontal: 16, marginTop: dimensions.vh * 5, flex: 1, }, styles.mainView]}>

        {/* Order Details with status */}
        {/* <View style={styles.mainView}> */}
        {/* <Text style={[
          textVariants.textSubHeading,
          { textAlign: 'center', paddingVertical: 10 }
        ]}>{role}</Text> */}
        <Text style={[
          textVariants.textSubHeading,
          { textAlign: 'center', marginTop: 10 }
        ]}>Update your daily restaurant stock </Text>
        <UpdateMenuItem />
        {/* </View> */}

      </View>
    </ImageBackground>
    // </ScrollView>
  )
}

export default ReservedAdminHome

const styles = StyleSheet.create({
  mainView: {
    marginBottom: 20,
    borderWidth: 0.5,
    borderBottomColor: Colors.gray,
    borderRadius: 10,

  }
})