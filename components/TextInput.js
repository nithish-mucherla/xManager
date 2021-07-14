import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TextField = ({
  helperText = '',
  placeholder = '',
  placeholderTextColor = 'gray',
  onChangeTextHandler,
  value,
  errorText = '',
  keyboardType = 'default',
  helperIcon = null,
  secureTextEntry = false,
  children,
}) => {
  return (
    <View style={styles.textBoxContainer}>
      <Text style={styles.helperText}>{helperText}</Text>
      <View style={[styles.textBox, {flexDirection: 'row'}]}>
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeTextHandler}
          value={value}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
        {helperIcon}
      </View>
      <Text
        style={[
          styles.errorText,
          {display: errorText === '' ? 'none' : 'flex'},
        ]}>
        <MaterialIcons name="error" size={14} color="red" /> {errorText}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  textBox: {
    paddingHorizontal: 20,
    backgroundColor: '#212121',
    borderRadius: 5,
  },
  inputText: {flex: 1, color: 'white', fontSize: 16},
  helperText: {
    color: 'gray',
    paddingVertical: 3,
  },
  errorText: {
    color: 'red',
    paddingVertical: 3,
    letterSpacing: 0.7,
  },
  textBoxContainer: {
    paddingVertical: 5,
  },
});

export default TextField;
