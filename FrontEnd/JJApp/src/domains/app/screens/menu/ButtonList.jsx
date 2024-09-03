import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../../theme/Colors';
import { textVariants } from '../../../../theme/StyleVarients';
import dimensions from '../../../../theme/Dimensions';

const ButtonList = ({ data }) => {
  const navigation = useNavigation()
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const ListItem = ({ item, onPress }) => {
    return (
      <TouchableOpacity style={styles.buttonstyle} onPress={onPress}>
        <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4.6 }]}>{item.title}</Text>
        <Icon
          source={require("../../../../../assets/images/rightArrow.png")}
          color={Colors.gray}
          size={dimensions.vw * 3.5}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ListItem item={item} onPress={() => handlePress(item.screen)} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default ButtonList;

const styles = StyleSheet.create({
  buttonstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    marginHorizontal: 24,
    // paddingBottom: 22
  }
});
