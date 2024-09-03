import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import { textVariants } from '../../../../theme/StyleVarients'
import dimensions from '../../../../theme/Dimensions'
import { Background } from '../../../../theme/CongfigrationStyle'

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ marginTop: 40, marginHorizontal: 19, flex: 1 }}>
          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>Terms and Conditions</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            Effective Date: 01-07-2024
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>1. Introduction</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            Welcome to JJFoods ("we," "our," or "us"). These Terms and Conditions govern your use of our mobile application ("App").
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>2. Acceptance of Terms</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            By accessing or using our App, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use the App.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>3. Use of the App</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            You agree to use the App only for lawful purposes and in accordance with these Terms and Conditions.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>4. Changes to Terms</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            We reserve the right to update or modify these Terms and Conditions at any time. Your continued use of the App after any such changes constitutes your acceptance of the new Terms and Conditions.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>5. Contact Us</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            If you have any questions or concerns about these Terms and Conditions, please contact us at:
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Email: jjfoods@gmail.com
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Address: Srinagar, J&K
          </Text>
        </View>
      </ImageBackground>
    </ScrollView >
  )
}

export default TermsAndConditions

const styles = StyleSheet.create({})