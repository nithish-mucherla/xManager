import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

//stylesObj -> to override default styles or to provide new styles
const Button = ({
  title,
  image = null,
  onPressHandler,
  stylesObj,
  disabled = false,
  loading = false,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      {
        backgroundColor: loading
          ? 'dodgerblue'
          : disabled
          ? 'powderblue'
          : 'dodgerblue',
      },
      stylesObj,
    ]}
    onPress={onPressHandler}
    disabled={disabled}>
    {title ? <Text style={styles.buttonLabel}>{title}</Text> : image}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button;
