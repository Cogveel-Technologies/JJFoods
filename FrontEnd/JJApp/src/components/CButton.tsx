import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper'; // Import IconButton from react-native-paper
import { btnVarients } from '../theme/StyleVarients';
import { Colors } from '../theme/Colors';

type buttonTypeProps = {
  label: string;
  icon?: string;
  mode: 'contained' | 'outlined' | 'text';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  fontsize?: number;
  labelStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
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
  disabled,
}: buttonTypeProps) => {
  return (
    <Button
      icon={icon ? icon : undefined}
      mode={mode}
      onPress={onPress}
      labelStyle={[
        mode === 'contained' ? btnVarients.containedBtn :
          mode === 'outlined' ? btnVarients.outlineBtn :
            [btnVarients.textBtn, { fontSize: fontsize || 16 }],
        labelStyle,
      ]}
      contentStyle={[
        style,
        contentStyle,
        disabled ? { backgroundColor: Colors.grayLight } : null, // Apply gray background when disabled
      ]}
      style={{
        marginRight: 0,
        ...(icon && { color: 'black' }),
      }}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default CButton;
