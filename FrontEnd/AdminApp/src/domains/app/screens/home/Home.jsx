import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import MainCards from './MainCards'
import RevenueGraph from './RevenueGraph'
import OrderSummary from './OrderSummary'
import dimensions from '../../../../theme/Dimensions'
import { useHomeScreenDataQuery } from './apis/homeScreendata'
import { ActivityIndicator } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { textVariants } from '../../../../theme/StyleVarients'
import LottieView from 'lottie-react-native'
import { Background } from '../../../../theme/CongfigrationStyle'

const Home = () => {
  const { data, error, isLoading, isError, refetch, isFetching } = useHomeScreenDataQuery();
  const [details, setDetails] = useState()

  useEffect(() => {
    // console.log(data, "---------data------------")
    if (data) {
      setDetails(data)
    }
  }, [data])
  const renderItem = ({ item }) => <MainCards item={item} />;

  if (isLoading || isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../../../../assets/lottieFiles/loader2.json')}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150, alignSelf: 'center', }}
        />
      </View>
    )
  }

  if (isError) {
    console.log(error, "===========");
    let errorMessage = 'An error occurred while fetching the menu items.';

    if (error.status === 'FETCH_ERROR') {
      errorMessage = 'Network error:\n Please check your internet connection.';
    } else if (error.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (error.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (error.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {error.status === 'FETCH_ERROR' &&
          <LottieView
            source={require('../../../../../assets/lottieFiles/noInternet.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 200, alignSelf: 'center' }}
          />
        }
        <Text style={[textVariants.textHeading, { paddingBottom: 10 }]}>{error.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20, textAlign: 'center' }]}>{errorMessage}</Text>
        <CButton label='Reload' mode='contained' onPress={refetch} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={Background.jjBackground}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        <LinearHeader />
        <View style={{ marginHorizontal: 16, marginTop: dimensions.vh * 6, }}>
          {/* Main-Cards  */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <FlatList
              data={details?.orderData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
            />
          </View>

          {/* Revenue Graph */}
          {details?.revenueGraph ? (
            <RevenueGraph data={details.revenueGraph} />
          ) : (
            <>
              <ActivityIndicator animating={true} color={Colors.primary} size={25} />
              <Text style={[textVariants.textSubHeading, { textAlign: 'center' }]}>Loading revenue graph ...</Text>
            </>
          )}

          {/* OrderSummery */}
          <OrderSummary data1={details?.todayData} />
        </View>
        {/* <CButton label='Hello' mode='contained' onPress={MenuScreenNavigation} /> */}
      </ImageBackground>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})