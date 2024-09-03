import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';

const DemoImage = ({ name }) => {
  const initials = name ? name.charAt(0).toUpperCase() : '';

  return (
    <View style={styles.container}>
      <Svg height="100" width="100" style={{}}>
        <Circle cx="50" cy="50" r="50" fill="#E5C19E" />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle" // Center vertically
          fontSize="50"
          fill="#2A1A0B"

        >
          {initials}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DemoImage;
