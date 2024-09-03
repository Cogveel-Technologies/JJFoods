import { StyleSheet, StyleProp, ViewStyle, TouchableOpacity, View, Image } from 'react-native';
import React, { useState } from 'react';
import { IconButton, TextInput, useTheme } from 'react-native-paper';
import { Colors } from '../theme/Colors';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import dimensions from '../theme/Dimensions';

type CustomInputTypeProps = {
  type: 'text' | 'password' | 'select' | 'rightIcon';
  keyboardType: 'email-address' | 'default' | 'phone-pad' | 'number-pad';
  label: string;
  onChangeText: (value: any) => void;
  value: any;
  placeholder?: string;
  data?: [];
  style?: StyleProp<ViewStyle>;
  rightIcon?: IconSource;
  rightIconOnPress?: () => void;
  mode: 'flat' | 'outlined';
  PlaceholderTextcolor?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
};

const CInput = ({
  type,
  keyboardType,
  label,
  placeholder,
  onChangeText,
  value,
  style,
  rightIcon,
  rightIconOnPress,
  mode,
  PlaceholderTextcolor,
  disabled,
  onBlur,
  onFocus
}: CustomInputTypeProps) => {

  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(true);
  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  switch (type) {
    case 'text':
      return (
        <TextInput
          outlineColor={Colors.primary}
          textColor={Colors.black}
          placeholderTextColor={Colors.primary}
          style={[styles.inputstyle, style]}
          onChangeText={onChangeText}
          value={value}
          theme={{ colors: { onSurfaceVariant: PlaceholderTextcolor ? PlaceholderTextcolor : Colors.gray } }}
          mode={mode}
          keyboardType={keyboardType}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      );
    case 'password':
      return (
        <TextInput
          outlineColor={Colors.primary}
          textColor={Colors.black}
          placeholderTextColor={Colors.primary}
          style={[styles.inputstyle, style]}
          onChangeText={onChangeText}
          value={value}
          theme={{ colors: { onSurfaceVariant: PlaceholderTextcolor ? PlaceholderTextcolor : Colors.gray } }}
          mode={mode}
          secureTextEntry={showPassword}
          keyboardType={'default'}
          label={label}
          placeholder={placeholder}
          right={
            <TextInput.Icon
              icon="eye"
              color={Colors.primary}
              onPress={handleShowPassword}
            />
          }
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      );
    case 'rightIcon':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <TextInput
            outlineColor={Colors.primary}
            textColor={Colors.black}
            placeholderTextColor={Colors.primary}
            style={[
              styles.inputstyle,
              style,
            ]}
            onChangeText={onChangeText}
            value={value}
            theme={{ colors: { onSurfaceVariant: PlaceholderTextcolor ? PlaceholderTextcolor : Colors.gray } }}
            mode={mode}
            keyboardType={keyboardType}
            label={label}
            placeholder={placeholder}
            right={<View />}
            disabled={disabled}
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <TouchableOpacity onPress={rightIconOnPress} style={{ marginBottom: -35 }}>
            <Image
              source={rightIcon ? rightIcon : require("../../assets/images/verifyIcon4.png")}
              style={{
                width: dimensions.vw * 13,
                height: dimensions.vh * 6.4,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      );
    default:
      return (
        <TextInput
          textColor={Colors.black}
          style={[styles.inputstyle, style]}
          theme={{ colors: { onSurfaceVariant: PlaceholderTextcolor ? PlaceholderTextcolor : Colors.gray } }}
          mode={mode}
          keyboardType={keyboardType}
          label={label}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      );
  }
};

export default CInput;

const styles = StyleSheet.create({
  inputstyle: {
    flex: 1,
    fontFamily: 'Montserrat Medium',
    backgroundColor: Colors.transparent,
    color: Colors.primary,
    fontSize: dimensions.vw * 4,
  },
});
