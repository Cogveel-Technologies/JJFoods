import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import dimensions from '../theme/Dimensions'
import LinearGradient from 'react-native-linear-gradient'

const LinearHeader = () => {
  return (


    <LinearGradient
      colors={['#fdebcf', 'rgba(255, 255, 255, 0)']}
      // style={{ height: dimensions.vh * 100 - 850, }}
      style={{ height: 25, }}
    >
    </LinearGradient>
  )
}

export default LinearHeader

const styles = StyleSheet.create({})