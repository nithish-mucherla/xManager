import React, {useEffect, useRef} from 'react';
import {
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';

const BottomActionBar = ({
  children,
  visibility,
  backdropPressHandler = null,
}) => {
  const windowHeight = Dimensions.get('window').height;
  const backdropTop = useRef(new Animated.Value(windowHeight)).current;
  const actionbarTop = useRef(new Animated.Value(windowHeight)).current;

  useEffect(() => {
    if (visibility) handleActionbarOpen();
    else handleActionbarClose();
  }, [visibility]);
  const handleActionbarClose = () => {
    Animated.timing(backdropTop, {
      duration: 200,
      toValue: windowHeight,
      useNativeDriver: false,
    }).start();
    Animated.timing(actionbarTop, {
      duration: 200,
      toValue: windowHeight,
      useNativeDriver: false,
    }).start();
  };

  const handleActionbarOpen = () => {
    Animated.timing(backdropTop, {
      duration: 100,
      toValue: 0,
      useNativeDriver: false,
    }).start();
    Animated.timing(actionbarTop, {
      duration: 100,
      toValue: windowHeight - 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={backdropPressHandler}>
        <Animated.View style={[styles.backdrop, {top: backdropTop}]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.bottomActionBarContainer,
          {
            top: actionbarTop,
          },
        ]}>
        {children}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111111',
    opacity: 0.5,
  },
  bottomActionBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    top: Dimensions.get('window').height - 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
  },
});

export default BottomActionBar;
