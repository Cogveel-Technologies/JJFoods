import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CCard from '../../../../components/CCard'
import { LineChart } from 'react-native-gifted-charts'
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import { textVariants } from '../../../../theme/StyleVarients'
import CDropDown from '../../../../components/CDropDown'

const RevenueGraph = ({ data }) => {
  // const data = [
  //   { value: 1, label: 'Jan' },
  //   { value: 5, label: 'Feb' },
  //   { value: 8, label: 'Mar' },
  //   { value: 6, label: 'Apr' },
  //   { value: 10, label: 'May' },
  //   { value: 7, label: 'Jun' },

  // ];

  const dropdowndata = [
    { id: 1, name: 'Monthly' },
    { id: 2, name: 'Weekly' },
    { id: 3, name: 'Daily' },

  ];

  const [selectedValue, setSelectedValue] = useState('');
  const handleDropdownChange = (value) => {
    setSelectedValue(value);
  };
  const formatYLabel = value => `${value}K`;

  return (

    <CCard
      secondaryBackground
      style={styles.cardStyle}
    >
      {/* Heading and Dropdown  */}
      <View style={styles.headingView}>
        <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.3, paddingBottom: 12 }]}>Revenue</Text>
        {/* <CDropDown
          placeholder='Select'
          iconColor={Colors.primary}
          iconSize={20}
          data={dropdowndata}
          value={selectedValue}
          onChange={handleDropdownChange}
          labelField="name"
          valueField="id"
          search={false}
          style={{ width: 90, margin: 0 }}
        /> */}
      </View>

      {/* Revenue Graph */}
      {
        data && (
          <LineChart
            data={data}
            xAxisLabelTextStyle={styles.xaxiesLabels}
            yAxisTextStyle={styles.yaxiesLabels}
            formatYLabel={formatYLabel}
            pointColor={Colors.primary}
            dataPointsColor={Colors.primary}
            curveType="smooth"
            height={dimensions.vh * 22}
            width={dimensions.vw * 75}
            color={Colors.primary}
            areaChart
            startOpacity={100}
            endOpacity={0}
            rulesColor={Colors.gray}
            rulesType="solid"
            initialSpacing={20}

          />)}
    </CCard>
  )
}

export default RevenueGraph

const styles = StyleSheet.create({
  cardStyle: {
    marginStart: 5,
    marginEnd: 5,
    paddingStart: 0,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginHorizontal: 10
  },
  xaxiesLabels: {
    marginHorizontal: 10,
    fontSize: 12,
    color: Colors.gray,
    fontFamily: "Montserrat SemiBold",
  },
  yaxiesLabels: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Montserrat SemiBold",
  }
})