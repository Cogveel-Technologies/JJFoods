import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-native-element-dropdown';
import { Icon, useTheme } from 'react-native-paper';
import { Colors } from '../theme/Colors';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

type DropdownTypeProps = {
  data: { [key: string]: any }[];
  value: string;
  search?: boolean;
  onChange: (value: any) => void;
  labelField: string;
  valueField: string;
  style?: StyleProp<ViewStyle>;
  icon: IconSource;
  iconSize: number;
  iconColor: string;
  placeholder: string;
};

const CDropDown = ({ data, value, search, onChange, style, icon, iconColor, iconSize, placeholder }: DropdownTypeProps) => {
  const theme = useTheme();
  useEffect(() => {
    console.log(value, 'drop');
  }, [value]);
  return (
    <Dropdown
      style={[styles.dropdown, style]}
      placeholderStyle={[
        styles.placeholderStyle, style
      ]}
      selectedTextStyle={[
        styles.placeholderStyle, style
      ]}
      iconStyle={styles.iconStyle}
      containerStyle={{ borderRadius: 10 }}
      itemContainerStyle={{ borderRadius: 10 }}
      iconColor={Colors.gray}
      itemTextStyle={{ color: Colors.black, fontSize: 12, margin: -10 }}
      activeColor={Colors.grayDim}
      data={data}
      search={search}
      maxHeight={250}
      placeholder={placeholder}
      searchPlaceholder="Search..."
      value={value}
      onChange={onChange}
      labelField={'name'}
      valueField={'id'}

      renderLeftIcon={() => (
        <Icon
          source={icon}
          color={iconColor}
          size={iconSize}
        />
      )}
    />
  );
};

CDropDown.propTypes = {
  data: PropTypes.array.isRequired,
  // value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CDropDown;

const styles = StyleSheet.create({
  dropdown: {
    // padding: 15,
    // height: 27,
    // width: 77,
    // borderBottomWidth: 1,
    borderBottomColor: "transparent",
    borderRadius: 10,
    // marginTop: 5,
    backgroundColor: '#F2F2F2',
    fontFamily: 'Montserrat Medium'
  },
  icon: {
    // marginRight: 5,
  },
  placeholderStyle: {
    paddingStart: 10,
    fontSize: 12,
    color: Colors.gray,
    fontFamily: 'Montserrat Medium',
    fontWeight: '500'
  },
  selectedTextStyle: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'Montserrat Medium'
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  // listItem: {
  //   color: 'red',
  // },
});