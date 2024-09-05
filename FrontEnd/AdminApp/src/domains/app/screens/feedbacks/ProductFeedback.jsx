import { ImageBackground, ScrollView, Text, View, FlatList } from 'react-native';
import React from 'react';
import LinearHeader from '../../../../components/LinearHeader';
import CCard from '../../../../components/CCard';
import { useGetAllProductFeedbackQuery } from './apis/getAllProductFeedbacks';
import { textVariants } from '../../../../theme/StyleVarients';
import LottieView from 'lottie-react-native';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { Background } from '../../../../theme/CongfigrationStyle';

const ProductFeedback = () => {
  const { data, error, isLoading, isError, refetch } = useGetAllProductFeedbackQuery();
  console.log(data, '---------feedback----------')


  const renderFeedbackItem = ({ item }) => (
    <CCard style={{ margin: 0, padding: 16, borderRadius: 30, }}>

      <Text style={[textVariants.textSubHeading, { textAlign: "center", fontFamily: 'serif', fontStyle: 'italic', fontSize: dimensions.vw * 5, paddingVertical: 10 }]}>Customer Review</Text>
      <View style={{ borderWidth: 0.3, borderColor: Colors.gray, marginBottom: 5 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <View style={{ width: 40, height: 40, borderRadius: 100, backgroundColor: '#f76c6c', justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 18 }}>
            {item?.user?.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={{ marginLeft: 8 }}>
          <Text style={[textVariants.textSubHeading, { color: Colors.primary }]}>{item?.user?.name}</Text>
        </View>

      </View>


      <View style={{ marginStart: 50 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <Text style={textVariants.textSubHeading}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {'⭐'.repeat(item?.rating)}
            </Text>
          </Text>

        </View>

        <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.5, marginBottom: 10, textAlign: 'left' }]}>
          {item?.feedback}
        </Text>
        <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3, paddingStart: 10 }]}>{new Date(item.updatedAt).toLocaleString()}</Text>

      </View>

      <View style={{ borderWidth: 0.3, borderColor: Colors.gray }} />

      <View style={{ justifyContent: 'center', alignItems: 'center', }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {'⭐'.repeat(item?.rating)}
        </Text>
        <Text style={textVariants.textSubHeading}>
          ({item?.rating}/5)
        </Text>
      </View>

    </CCard>

  );

  if (isLoading) {
    return (
      <View>
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
    return (
      <View>
        <Text style={textVariants.textSubHeading}>Failed to load feedbacks. Please try again.</Text>
      </View>
    );
  }

  const handleRefresh = async () => {
    try {
      await refetch().unwrap();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Reverse the data each time it is fetched/refetched
  const reversedData = data ? [...data].reverse() : [];


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        {/* <View style={{ flex: 1, marginTop: 35 }}> */}
        <FlatList
          data={reversedData}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item._id}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          style={{ flex: 1, marginTop: 35, marginBottom: 10 }}
        />
        {/* </View> */}
      </ImageBackground>
    </ScrollView>
  );
};

export default ProductFeedback;
