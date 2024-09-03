import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '../../../../theme/Colors';
import { PieChart } from 'react-native-gifted-charts';
import { textVariants } from '../../../../theme/StyleVarients';
import dimensions from '../../../../theme/Dimensions';
import OrderDetails from '../orders/OrderDetails';

const DonutChart = ({ donutData }) => {

  // useEffect(() => {

  // }, [OrderDetails])

  // const donutDemo = [
  //   { label: 'On Delivery', value: 25, color: Colors.black },
  //   { label: 'Delivered', value: 30, color: Colors.primary },
  //   { label: 'Canceled', value: 5, color: Colors.grayDim },
  // ];

  const innerRadius = 40;
  const outerRadius = 68;
  const radius = (innerRadius + outerRadius) / 2


  let x = 0;
  if (donutData && donutData.length > 0) {
    for (let i = 0; i < donutData.length; i++) {
      x += donutData[i].value;
    }
  }

  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>

      <View>
        {x > 0 && <PieChart
          donut
          radius={radius}
          data={donutData}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          padAngle={0.04}
          startAngle={-Math.PI / 2}
          endAngle={Math.PI / 2}
        />}
      </View>

      <View style={styles.horizontalBarsContainer}>
        {donutData?.map((bar, index) => (
          <View key={index} style={styles.horizontalBarContainer}>
            <Text style={[textVariants.buttonTextSubHeading, { color: Colors.gray, marginRight: 8, }]}>{bar.label}</Text>
            <View style={styles.barContent}>
              <View style={styles.backgroundBar} />
              <View
                style={[
                  styles.coloredBar,
                  { width: `${bar.value}%`, backgroundColor: bar.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

    </View>
  )
}

export default DonutChart

const styles = StyleSheet.create({

  horizontalBarsContainer: {
    marginStart: 15,
  },
  horizontalBarContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundBar: {
    height: dimensions.vh * 0.8,
    width: dimensions.vw * 32.5,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
  },
  coloredBar: {
    height: dimensions.vh * 0.8,
    borderRadius: 8,
    position: 'absolute',
  },
})