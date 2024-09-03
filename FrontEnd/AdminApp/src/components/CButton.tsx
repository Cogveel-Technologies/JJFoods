import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { Button, IconButton } from 'react-native-paper'; // Import IconButton from react-native-paper
import { btnVarients } from '../theme/StyleVarients';
import dimensions from '../theme/Dimensions';

type buttonTypeProps = {
  label: string;
  icon?: string;
  mode: 'contained' | 'outlined' | 'text';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  fontsize?: number;
  labelStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;

};

const CButton = ({
  label,
  icon,
  mode,
  onPress,
  style,
  fontsize,
  labelStyle,
  contentStyle,

}: buttonTypeProps) => {
  return (
    <Button
      icon={icon ? icon : undefined}
      mode={mode}
      onPress={onPress}
      labelStyle={[
        mode === 'contained' ? btnVarients.containedBtn :
          mode === 'outlined' ? btnVarients.outlineBtn :
            [btnVarients.textBtn, { fontSize: fontsize }],
        labelStyle,
      ]}
      contentStyle={[style, contentStyle]}
      style={{
        marginRight: 0,
        ...(icon && { color: 'black' }),
      }}
    >
      {label}
    </Button>
  );
};

export default CButton;
