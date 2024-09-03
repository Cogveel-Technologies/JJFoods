import { ImageBackground, Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { Background } from '../../../../theme/CongfigrationStyle'

const AboutUs = () => {
  const openURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${url}`);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const openEmail = async (email) => {
    const mailtoLink = `mailto:${email}`;
    await openURL(mailtoLink);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ marginTop: 40, marginHorizontal: 19, flex: 1 }}>
          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>
            About Us
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            At JJ Foods , we believe in creating a dining experience that tantalizes your taste buds and leaves you craving for more. Our chefs craft each dish with passion and precision, using the freshest ingredients to ensure the highest quality and taste. Whether you’re here for a quick bite or a leisurely meal, we promise an unforgettable culinary journey.
          </Text>
          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>
            Our Story
          </Text>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 5 }]}>
            We are in the Traditional profession of Wazwan which dates back to the le century when the Mongol ruler Timur invaded India in 1348 during the reign of Nasiruddin Muhammad of Tughlaq dynasty who brought various skilled persons including cooks from Samarkand to Kashmir.{'\n'}
            Our ancestors left this legacy of Kashmiriyat behind , so we decided to keep it alive we truly believe in quality and augmented services, Our main focus is to satisfy the needs of customer, we not only connect people to Wazwan but its essence and cultural importance.{'\n'}
            Let's keep this legacy of authentic Wazwan alive We have started online Wazwan service with the aim that people should order this authentic mouthwatering delicacy from the comforts of their home.
          </Text>
          <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>
            Our Services
          </Text>
          <View style={styles.servicesContainer}>
            <Text style={styles.serviceBox}>
              Fresh {'\n'}Healthy Food
            </Text>
            <Text style={styles.serviceBox}>
              Fast{'\n'} Home Delivery
            </Text>
            <Text style={styles.serviceBox}>
              Discount {'\n'}Vouchers
            </Text>
          </View>
          <Text style={[textVariants.textMainHeading, { paddingVertical: 10 }]}>
            Timing
          </Text>
          <Text style={styles.serviceBox}>
            11:00 AM to 11:00 PM{'\n'}
            Monday to Sunday
          </Text>
          <Text style={[textVariants.textMainHeading, { paddingVertical: 10 }]}>
            Contact Us
          </Text>
          <Text style={[styles.serviceBox, { marginBottom: 10 }]}>
            Junaid Jamshed Foods Private Limited,{'\n'}Wazapora SR Gunj, near Mufti Manzil Srinagar.
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textMainHeading, { paddingBottom: 10, paddingEnd: 5 }]}>
              Phone:
            </Text>
            <Text style={[textVariants.textMainHeading, { paddingBottom: 10 }]}>
              +91 9622208209
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textMainHeading, { paddingBottom: 10, paddingEnd: 5 }]}>
              Email:
            </Text>
            <CButton label='jjFoods19@gmail.com' mode='text' onPress={() => openEmail('jjFoods19@gmail.com')} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textMainHeading, { paddingBottom: 10, paddingEnd: 5 }]}>
              Facebook:
            </Text>
            <CButton label='jjFoods Facebook' mode='text' onPress={() => openURL('https://www.facebook.com/jjstoresrinagar')} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textMainHeading, { paddingBottom: 10, paddingEnd: 5 }]}>
              Instagram:
            </Text>
            <CButton label='jjFoods Instagram' mode='text' onPress={() => openURL('https://www.instagram.com/jj_foods_sgr/')} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textMainHeading, { paddingBottom: 10, paddingEnd: 5 }]}>
              Twitter:
            </Text>
            <CButton label='jjFoods Twitter' mode='text' onPress={() => openURL('https://x.com/JJFoods2?mx=2')} />
          </View>
        </View>
      </ImageBackground>
    </ScrollView >
  )
}

export default AboutUs

const styles = StyleSheet.create({
  servicesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  serviceBox: {
    ...textVariants.headingSecondary,
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.gray,
    padding: 5,
  }
})
