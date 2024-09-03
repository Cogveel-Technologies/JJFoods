import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { Button, IconButton } from 'react-native-paper';
import { Colors } from '../theme/Colors';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

type buttonTypeProps = {
  label?: string;
  icon: IconSource;
  mode?: 'contained' | 'outlined' | 'text';
  type?: 'leftIcon' | 'rightIcon';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const CsmallButton = ({
  label,
  icon,
  mode,
  onPress,
  style,
  type,
  disabled
}: buttonTypeProps) => {

  switch (type) {
    case "leftIcon":
      return (
        <Button
          icon={() => (
            <IconButton
              icon={icon}
              size={9}
              style={{ marginTop: 0, marginBottom: 0, marginStart: -20 }}
              iconColor={mode === 'contained' ? Colors.primary : Colors.white}
            />
          )}
          mode={mode}
          onPress={onPress}
          labelStyle={mode === "contained" ? styles.containedBtn : styles.outlineBtn}
          style={[style, {
            backgroundColor: mode === "contained" ? Colors.white : Colors.transparent,
            borderColor: mode === "contained" ? 'transparent' : Colors.white,
            width: 65,
            height: 25,
            borderRadius: 10
          }]}
          disabled={disabled}
        >
          {label}
        </Button>
      );
    case "rightIcon":
      return (
        <Button
          icon={() => (
            <IconButton
              icon={icon}
              size={9}
              style={{ marginTop: 0, marginBottom: 0, marginStart: 0, marginEnd: -20 }}
              iconColor={Colors.white}
            />
          )}
          mode={mode}
          onPress={onPress}
          labelStyle={mode === "contained" ? [styles.containedBtn, { color: Colors.white }] : [styles.outlineBtn, { color: Colors.white }]}
          style={[style, {
            backgroundColor: mode === "contained" ? Colors.primary : Colors.transparent,
            borderColor: mode === "contained" ? 'transparent' : Colors.white,
            width: 65,
            height: 25,
            borderRadius: 10
          }]}
          contentStyle={{ flexDirection: 'row-reverse' }}
          disabled={disabled}
        >
          {label}
        </Button>
      );
    default:
      return (
        <Button
          mode={mode}
          onPress={onPress}
          labelStyle={mode === "contained" ? [styles.containedBtn, { color: Colors.white, }] : [styles.outlineBtn, { color: Colors.white, marginTop: 1 }]}
          style={[style, {
            backgroundColor: mode === "contained" ? Colors.primary : Colors.transparent,
            borderColor: mode === "contained" ? 'transparent' : Colors.white,
            width: 65,
            height: 25,
            borderRadius: 10
          }]}
          disabled={disabled}
        >
          {label}
        </Button>
      );
  }
};

const styles = StyleSheet.create({
  containedBtn: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 11.5,
    fontFamily: 'Montserrat SemiBold',
    marginHorizontal: 10,
    marginVertical: 0,
    textAlign: 'center',
    marginStart: 3,
  },
  outlineBtn: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 11.5,
    fontFamily: 'Montserrat SemiBold',
    marginHorizontal: 10,
    marginVertical: 0,
    textAlign: 'center'
  },
});

export default CsmallButton;
