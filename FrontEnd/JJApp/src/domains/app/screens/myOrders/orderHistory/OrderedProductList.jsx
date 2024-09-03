import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import CCard from '../../../../../components/CCard';
import { textVariants } from '../../../../../theme/StyleVarients';
import { Colors } from '../../../../../theme/Colors';
import CButton from '../../../../../components/CButton';
import dimensions from '../../../../../theme/Dimensions';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useProductFeedbackMutation } from './apis/productFeedback';
import { useAppSelector } from '../../../../../store/hooks';
import * as yup from 'yup';
import { useOrderProductListMutation } from './apis/orderProductList';
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { DemoImages } from '../../../../../theme/ConfigrationStyle';

const feedbackSchema = yup.object().shape({
  feedback: yup.string().required('Feedback is required').min(5, 'Feedback must be at least 10 characters'),
  rating: yup.number().required('Rating is required').min(1, 'Rating must be at least 1 star'),
});

const OrderedProductList = ({ orderId }) => {
  const [feedbackVisibility, setFeedbackVisibility] = useState();
  const [dialogOpened, setDialogOpened] = useState(false);

  const [feedbacks, setFeedbacks] = useState({});
  const [ratings, setRatings] = useState({});
  const [errors, setErrors] = useState({});
  const [allProducts, setAllProducts] = useState([])
  const [orderStatus, setOrderStatus] = useState()

  const navigation = useNavigation();
  const [productFeedback, { isLoading, isError, isSuccess, error }] = useProductFeedbackMutation();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id

  const [orderProductList, { isLoading: productIsLoading, isSuccess: productIsSuccess, isError: productIsError, error: productError, }] = useOrderProductListMutation();

  const goToCart = () => {
    navigation.navigate('MyCart');
  };


  const handleOrderProductList = async () => {
    try {
      const response = await orderProductList({
        userId: userId,
        orderId: orderId,
      }).unwrap();
      // console.log(response, "-----------------------------");
      if (response) {
        setAllProducts(response?.products);
        setOrderStatus(response?.state)
      }

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: `${err.message}`,
        text2: `${err.status}`,
      });
      console.log('Error', err || 'An error occurred');
    }
  };

  useEffect(() => {
    handleOrderProductList();
  }, []);


  const handleSubmit = async (id, index) => {
    if (!dialogOpened) {
      setDialogOpened(true);
      setFeedbackVisibility(index);
    } else {
      const feedbackData = {
        userId: userId,
        itemId: id,
        feedback: feedbacks[index],
        rating: ratings[index],
        orderId: orderId,
      };

      // Validate feedback data
      try {
        await feedbackSchema.validate(feedbackData, { abortEarly: false });
        setErrors({}); // Clear previous errors

        try {
          const response = await productFeedback(feedbackData).unwrap();
          setAllProducts(response.products);
          setDialogOpened(false);
          setFeedbackVisibility(null);
        } catch (error) {
          console.error('Error submitting feedback:', error);
          Toast.show({
            type: 'error',
            text1: `${error.message.message}`,
            text2: `${error.message.statusCode}`,
          });
        }
      } catch (validationErrors) {
        // Collect validation errors
        const formattedErrors = {};
        validationErrors.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [index]: formattedErrors,
        }));
        // Ensure the feedback section remains open if validation fails
        setDialogOpened(true);
        setFeedbackVisibility(index);
      }
    }
  };

  const handleFeedbackChange = (index, text) => {
    setFeedbacks((prevFeedbacks) => ({
      ...prevFeedbacks,
      [index]: text,
    }));
  };

  const handleRatingChange = (index, rating) => {
    setRatings({ ...ratings, [index]: rating })
  };

  if (isLoading || productIsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={Colors.primary} size={25} />
      </View>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <CCard style={{ marginHorizontal: 0, padding: 0 }}>
        <View>
          {/* Card with Image and details of item */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              resizeMode='contain'
              source={item.item_image_url
                ? { uri: item.item_image_url }
                : DemoImages.productDemo
              }
              style={styles.image} />
            <View style={{ flex: 1, marginEnd: 20 }}>
              <View style={styles.detailsView}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.black, paddingBottom: 6 }]}>
                  {item?.details?.itemname}
                </Text>
              </View>
              <View style={styles.detailsView}>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.gray }]}>₹ {item?.price}</Text>
                <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>Quantity: {item?.quantity}</Text>
              </View>
            </View>
          </View>

          {/* Rating feedback Input Box */}
          {item?.details?.rating ? (
            <View style={{ marginHorizontal: 26, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>You rated</Text>

              <View style={{ flexDirection: 'row', borderRadius: 10, marginStart: 8, backgroundColor: Colors.primary2, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[textVariants.buttonTextHeading, { paddingStart: 10 }]}>{item?.details?.rating}</Text>
                <StarRatingDisplay
                  rating={item?.details?.rating}
                  maxStars={1}
                  color={Colors.white}
                  starSize={dimensions.vw * 4.5}
                  style={{ padding: 3 }}
                />
              </View>
            </View>
          ) : (
            <View>

              {orderStatus == 'completed' &&
                <View style={styles.ratingView}>
                  <View>
                    <StarRating
                      onChange={(rating) => handleRatingChange(index, rating)}
                      maxStars={5}
                      starSize={dimensions.vw * 7}
                      rating={ratings[index]}
                      color='#EFB23D'
                    />
                    {errors[index]?.rating && (
                      <Text style={styles.errorText}>{errors[index].rating}</Text>
                    )}
                  </View>
                  <TouchableOpacity style={styles.button} onPress={() => handleSubmit(item.itemId, index)}>
                    <Text style={styles.buttonText}>{feedbackVisibility == index ? "Send Feedback" : "Write Feedback"}</Text>
                  </TouchableOpacity>

                </View>
              }

              {feedbackVisibility == index && (
                <View style={{ marginHorizontal: 11, marginBottom: 16 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Write Feedback"
                    placeholderTextColor="gray"
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(text) => handleFeedbackChange(index, text)}
                    value={feedbacks[index]}
                  />

                  {errors[index]?.feedback && (
                    <Text style={styles.errorText}>{errors[index].feedback}</Text>
                  )}

                </View>
              )}
            </View>
          )}
        </View>
      </CCard>
    );
  };

  return (
    <FlatList
      data={allProducts}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );
};

export default OrderedProductList;

const styles = StyleSheet.create({
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ratingView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 20
  },
  orderAgainButton: {
    borderTopWidth: 1.2,
    borderTopColor: Colors.gray,
    borderStyle: 'dashed',
    paddingVertical: 5
  },
  image: {
    width: dimensions.vw * 17.2,
    height: dimensions.vw * 17.2,
    borderRadius: 10,
    margin: 20,
  },
  button: {
    backgroundColor: Colors.secondary2,
    borderColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: dimensions.vw * 3.3,
    color: Colors.primary,
    fontFamily: "Montserrat Medium",
    fontWeight: "500",
    textAlign: 'center'
  },
  input: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 14,
    textAlignVertical: 'top',
    color: Colors.gray,
    fontSize: dimensions.vw * 3.3,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },
  errorText: {
    color: 'red',
    fontSize: dimensions.vw * 3,
    marginTop: 5,
    paddingStart: 10
  },
});
