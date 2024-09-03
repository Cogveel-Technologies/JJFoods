import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients';
import { Icon } from 'react-native-paper';
import CCard from '../../../../components/CCard';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';

const Icon1 = require('../../../../../assets/images/ordersIcon.png');
const Icon2 = require('../../../../../assets/images/revenueIcon.png');
const Icon3 = require('../../../../../assets/images/customersIcon.png');
const Icon4 = require('../../../../../assets/images/completedOrdersIcon.png');

const getIcon = (id) => {
  switch (id) {
    case 0:
      return Icon1;
    case 1:
      return Icon2;
    case 2:
      return Icon3;
    case 3:
      return Icon4;

  }
};

const MainCards = ({ item }) => (

  <CCard
    // onPress={() => console.log('pressed', item.id)}
    padding={12}
    secondaryBackground
    style={styles.mainCard}
  >

    <View style={styles.headingIconView}>
      <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8, textAlign: 'center' }]}> {item.title}</Text>
      <Icon
        source={getIcon(item.id)}
        size={dimensions.vw * 9.5}
      />
    </View>


    <Text style={[textVariants.textSubHeading,
    {
      fontSize: dimensions.vw * 8.5,
      color: Colors.primary,
      textAlign: 'center',
      paddingTop: 23
    },]}>
      {item.id == '1' ? Number(item.data).toFixed(1) + 'K' : item.data}
    </Text>

    <Text style={[textVariants.textSubHeading, {
      fontSize: dimensions.vw * 3,
      paddingTop: 25,
      textAlign: 'center'
    }]}>Updated every  minutes</Text>

  </CCard>
);

export default MainCards

const styles = StyleSheet.create({

  mainCard: {
    height: dimensions.vw * 44,
    width: dimensions.vw * 44,
    marginRight: 8,
    marginLeft: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  headingIconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

})