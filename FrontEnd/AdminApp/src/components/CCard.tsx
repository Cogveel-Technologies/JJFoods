import React from 'react';
import { View, StyleSheet, Platform, ImageBackground, Pressable, StyleProp, ViewStyle } from 'react-native';

type cardProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  whiteBackground?: boolean;
  secondaryBackground?: boolean;
  padding?: number;
  marginBottom?: number;
  imageBackground?: boolean;
  imageSource?: any;
  children?: React.ReactNode;
};

const CCard = ({
  onPress,
  style,
  whiteBackground,
  secondaryBackground,
  padding,
  marginBottom,
  imageBackground,
  imageSource,
  children,
}: cardProps) => {
  const containerStyle = [
    styles.container,
    whiteBackground
      ? styles.containerWhite
      : secondaryBackground
        ? styles.secondaryBackground
        : null,
    {
      padding: padding !== undefined ? padding : 10,
      marginBottom: marginBottom !== undefined ? marginBottom : 0,
    },
    style,
  ];

  if (imageBackground) {
    return (
      <ImageBackground source={imageSource} style={[containerStyle, {
        overflow: 'hidden',
      }]}>
        {children}
      </ImageBackground>
    );
  }

  return (
    <View style={containerStyle}>
      <Pressable onPress={onPress}>
        {children}
      </Pressable>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    elevation: Platform.OS === 'android' ? 9 : 2,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'android' ? 0.5 : 0.4,
    shadowOffset: Platform.OS === 'android' ? { width: 3, height: 3 } : { width: 0, height: 0 },
    shadowRadius: Platform.OS === 'android' ? 3 : 1,
  },
  containerWhite: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  secondaryBackground: {
    backgroundColor: '#FFFBF5',
    elevation: Platform.OS === 'android' ? 9 : 2,
    shadowOpacity: Platform.OS === 'android' ? 0.5 : 0.4,
    shadowRadius: Platform.OS === 'android' ? 5 : 1,
  },
});

export default CCard;
