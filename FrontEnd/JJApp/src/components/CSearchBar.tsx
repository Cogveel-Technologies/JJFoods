import React from 'react';
import { Searchbar } from 'react-native-paper';
import { Colors } from '../theme/Colors';
import { StyleSheet } from 'react-native';

interface CSearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string | undefined;
}

const CSearchBar: React.FC<CSearchBarProps> = ({
  placeholder,
  onChangeText,
  value = '',
}) => {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      iconColor={Colors.gray}
      rippleColor={Colors.primary}
      style={styles.searchBar}
      placeholderTextColor={Colors.gray}
      inputStyle={{ color: Colors.gray }}
    />
  );
};

export default CSearchBar;

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: Colors.white,
    borderWidth: 0.7,
    borderColor: Colors.grayDim,
    marginTop: 18,
    borderRadius: 23,
  },
})