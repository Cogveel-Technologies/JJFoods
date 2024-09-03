import { ImageBackground, StyleSheet, Text, TextInput, View, } from 'react-native'
import React, { useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { moderateScale } from 'react-native-size-matters'
import { useAppFeedbackMutation } from './apis/appFeedback'
import { useAppSelector } from '../../../../store/hooks'
import LottieView from 'lottie-react-native'
import { Modal, Portal } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import * as Yup from 'yup'
import Toast from 'react-native-toast-message'
import { Background } from '../../../../theme/ConfigrationStyle'

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const [appFeedback, { isLoading, isError, error: apiError, isSuccess }] = useAppFeedbackMutation();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;
  const navigation = useNavigation()
  const [visible, setVisible] = useState(false)

  const feedbackSchema = Yup.object().shape({
    feedback: Yup.string()
      .min(10, 'Feedback must be at least 10 characters')
      .required('Feedback is required'),
  });

  const handleSubmit = async () => {
    try {
      setError(null); // Reset error state
      await feedbackSchema.validate({ feedback });

      const response = await appFeedback({ user: userId, review: feedback }).unwrap();
      console.log(response)
      setFeedback('')
      setVisible(true); // Show success modal on successful order creation
      setTimeout(() => {
        setVisible(false);
        navigation.navigate('Home');
      }, 1500);

    } catch (err) {
      if (err.name === 'ValidationError') {
        setError(err.message);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${err.message}, Status: ${err.status}`
        });
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        />
      </View>
    )
  }

  if (isError) {
    console.log(error)
    return (
      <View style={styles.centeredContainer}>
        <Text style={textVariants.textSubHeading}>Failed to load. Please try again </Text>
      </View>
    )
  }

  return (
    <ImageBackground
      source={Background.jjBackground}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />
      <View style={{ marginTop: 40, marginHorizontal: 19, flex: 1 }}>
        <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>
          Tell us what you enjoy about the app, or let us know how we can improve it.
        </Text>

        <View style={{ marginTop: 12, flex: 1, justifyContent: 'space-between' }}>
          <View>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter text here..."
              placeholderTextColor={error ? 'red' : 'gray'}
              multiline={true}
              numberOfLines={8}
              onChangeText={(text) => { setFeedback(text) }}
              value={feedback}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={{ margin: moderateScale(20) }}>
            <CButton
              label='Submit Feedback'
              mode='contained'
              onPress={handleSubmit}
            />
          </View>
        </View>

        <Portal>
          <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, width: 250, borderRadius: 20, alignSelf: 'center' }}>
            <LottieView
              source={require('../../../../../assets/lottieFiles/success.json')}
              autoPlay
              loop={true}
              style={{ width: 200, height: 200, alignSelf: 'center' }}
            />
            <Text style={[textVariants.textSubHeading, { textAlign: 'center' }]}>Thank You For Your Feedback !</Text>
          </Modal>
        </Portal>
      </View>
    </ImageBackground>
  )
}

export default Feedback

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    textAlignVertical: 'top',
    color: Colors.gray,
    fontSize: dimensions.vw * 3.3,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
