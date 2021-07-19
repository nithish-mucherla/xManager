import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FlashText = ({text, isVisible}) => {
  return isVisible ? (
    <View style={styles.flashTextContainer}>
      <Text style={styles.flashText}>{text}</Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  flashTextContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#f8f8ff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'center',
  },
  flashText: {
    textAlign: 'center',
  },
});

export default FlashText;
