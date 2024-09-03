import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import { textVariants } from '../../../../theme/StyleVarients'
import dimensions from '../../../../theme/Dimensions'
import DailyUpdateItems from './DailyUpdateItems'
import { Background } from '../../../../theme/CongfigrationStyle'

const DailyMenuUpdate = () => {
  return (
    // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <LinearHeader />
      <View style={{ marginHorizontal: 1, marginTop: dimensions.vh * 5, flex: 1 }}>

        {/* Order Details with status */}
        <View style={styles.mainView}>
          <Text style={[
            textVariants.textSubHeading,
            { textAlign: 'center', paddingVertical: 10 }
          ]}>Restaurant Daily Stock Update</Text>
          <DailyUpdateItems />
        </View>

      </View>
    </ImageBackground>
    // </ScrollView>
  )
}

export default DailyMenuUpdate

const styles = StyleSheet.create({})