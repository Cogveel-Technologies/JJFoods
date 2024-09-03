import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import { textVariants } from '../../../../theme/StyleVarients'
import dimensions from '../../../../theme/Dimensions'
import { Background } from '../../../../theme/CongfigrationStyle'

const PrivacyPolicy = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ marginTop: 40, marginHorizontal: 19, flex: 1 }}>
          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>Privacy Policy</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            Effective Date: 01-07-2024
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>1. Introduction</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            Welcome to JJFoods ("we," "our," or "us"). This Privacy Policy explains how we collect, use, and share your personal information when you use our mobile application ("App").
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>2. Information We Collect</Text>
          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>2.1 Information You Provide</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Account Information: When you create an account, we may collect your name, email address, phone number, and other contact details.
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Profile Information: You may provide additional information such as a profile picture, bio, and other details.
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Payment Information: If you make purchases through the App, we collect payment details necessary to process your transaction.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>2.2 Information We Collect Automatically</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Device Information: We collect information about your device, including device model, operating system, unique device identifiers, and mobile network information.
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Usage Data: We collect information about how you use our App, such as the features you use and the time you spend on the App.
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Location Data: We may collect your location information if you grant us permission to do so.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>2.3 Information from Third Parties</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Social Media: If you link your account to social media services, we may collect information from your social media profile.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>3. How We Use Your Information</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            We use the information we collect to:
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Provide, maintain, and improve our App
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Process transactions and send related information
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Communicate with you, including sending updates and promotional materials
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Personalize your experience on our App
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Monitor and analyze trends, usage, and activities
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Detect, investigate, and prevent fraudulent transactions and other illegal activities
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Comply with legal obligations
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>4. Sharing Your Information</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            We do not share your personal information with third parties except in the following cases:
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - With your consent: We may share your information if you give us explicit consent.
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Service Providers: We may share your information with vendors and service providers who perform services on our behalf.
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Legal Requirements: We may disclose your information to comply with legal obligations or respond to lawful requests from public authorities.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>5. Data Security</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            We implement appropriate security measures to protect your personal information from unauthorized access, use, or disclosure. However, no internet-based service can be completely secure, and we cannot guarantee the absolute security of your data.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>6. Your Rights</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            You have certain rights regarding your personal information, including the right to access, correct, or delete your data. You may also object to the processing of your information or request the restriction of processing. To exercise these rights, please contact us at jjfoods@gmail.com.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>7. Children's Privacy</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            Our App is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>8. Changes to This Privacy Policy</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.
          </Text>

          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>9. Contact Us</Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Email:jjfoods@gmail.com
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            - Address:srinager j&k.
          </Text>
        </View>
      </ImageBackground>
    </ScrollView >
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({})