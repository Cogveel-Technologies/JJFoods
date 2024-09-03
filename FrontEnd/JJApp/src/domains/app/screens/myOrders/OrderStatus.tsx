import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';

interface OrderStatusProps {
  OrderStatus: 'pending' | 'processing' | 'ready' | 'on the way';
}

const OrderStatus: React.FC<OrderStatusProps> = ({ OrderStatus }) => {
  // Function to determine the color of the dot based on the status
  const getDotColor = (targetStatus: string) => {
    if (targetStatus === 'on the way' && OrderStatus === 'on the way') {
      return Colors.green;
    }
    return getStatusColor(targetStatus);
  };

  // Function to determine the color of the line and dots except "on the way"
  const getStatusColor = (targetStatus: string) => {
    switch (OrderStatus) {
      case 'on the way':
        if (targetStatus === 'on the way' || targetStatus === 'ready' || targetStatus === 'processing' || targetStatus === 'pending') {
          return Colors.primary;
        }
        break;
      case 'ready':
        if (targetStatus === 'ready' || targetStatus === 'processing' || targetStatus === 'pending') {
          return Colors.primary;
        }
        break;
      case 'processing':
        if (targetStatus === 'processing' || targetStatus === 'pending') {
          return Colors.primary;
        }
        break;
      case 'pending':
        if (targetStatus === 'pending') {
          return Colors.primary;
        }
        break;
      default:
        return Colors.grayDim;
    }
    return Colors.grayDim;
  };

  const renderStatusText = (displayText: string, active: boolean) => (
    <Text style={[styles.statusText, { color: active ? Colors.black : Colors.grayDim }]}>
      {displayText}
    </Text>
  );

  return (
    <View style={styles.outercontainer}>
      <View style={styles.container}>
        {/* first dot */}
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: getDotColor('pending') }]} />
        </View>

        {/* first line */}
        <View style={[styles.line, { borderTopColor: getStatusColor('processing') }]} />

        {/* second dot */}
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: getDotColor('processing') }]} />
        </View>

        {/* second line */}
        {/* <View style={[styles.line, { borderTopColor: getStatusColor('ready') }]} /> */}

        {/* third dot */}
        {/* <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: getDotColor('ready') }]} />
        </View> */}

        {/* third line */}
        <View style={[styles.line, { borderTopColor: getStatusColor('on the way') }]} />

        {/* fourth dot */}
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: getDotColor('on the way') }]} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {renderStatusText('Pending', OrderStatus === 'pending')}
        {renderStatusText('Processing', OrderStatus === 'processing')}
        {/* {renderStatusText('Ready', OrderStatus === 'ready')} */}
        {renderStatusText('On the way', OrderStatus === 'on the way')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outercontainer: {},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: dimensions.vw * 5.5,
    marginTop: 24,
  },
  dotContainer: {
    alignItems: 'center',
  },
  dot: {
    width: dimensions.vw * 5,
    height: dimensions.vw * 5,
    borderRadius: 50,
    backgroundColor: Colors.grayDim,
    marginHorizontal: 5,
    borderWidth: dimensions.vw * 0.5,
    borderColor: Colors.grayDim,
  },
  line: {
    flex: 1,
    borderStyle: 'dashed',
    borderTopWidth: dimensions.vw * 0.6,
  },
  statusText: {
    marginTop: 6,
    fontSize: dimensions.vw * 3.3,
    fontFamily: 'Montserrat Medium',
    fontWeight: '500',
  },
});

export default OrderStatus;
