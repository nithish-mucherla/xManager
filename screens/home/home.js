import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import TxnContainer from '../txnContainer/TxnContainer.js';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TxnForm from '../txnForm/TxnForm';
import Profile from '../profile/profile';
import FlashText from '../../components/FlashText';

const Tabs = createBottomTabNavigator();

const TxnList = ({route, navigation}) => {
  const [flashText, setFlashText] = useState({
    text: '',
    isVisible: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.flashText) {
        setFlashText({
          text: route.params?.flashText,
          isVisible: true,
        });
        setTimeout(
          () =>
            setFlashText({
              text: '',
              isVisible: false,
            }),
          3000,
        );
        navigation.setParams({flashText: ''});
      }
    });
    return unsubscribe;
  }, [route.params?.flashText]);

  return (
    <View style={{flex: 1, backgroundColor: '#111111'}}>
      <StatusBar backgroundColor="#111111" barStyle="light-content" />
      <View style={styles.headerView}>
        <Text style={styles.brandText}>XM</Text>
      </View>
      <FlashText text={flashText.text} isVisible={flashText.isVisible} />
      <TxnContainer navigation={navigation} />
    </View>
  );
};

const HomeScreenStack = ({navigation}) => {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: '#111111',
          borderTopColor: '#212121',
        },
        showLabel: false,
        keyboardHidesTabBar: true,
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'TxnList') {
            iconName = focused ? 'home' : 'home-outline';
            return (
              <MaterialCommunityIcons name={iconName} size={28} color="white" />
            );
          } else if (route.name === 'TxnForm') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            return <Ionicons name={iconName} size={28} color="white" />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user-circle' : 'user-circle-o';
            return <FontAwesome name={iconName} size={25} color="white" />;
          }
        },
        tabBarVisible: true,
      })}>
      <Tabs.Screen name="TxnList" component={TxnList} />
      <Tabs.Screen name="TxnForm" component={TxnForm} />
      <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  headerView: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    left: 0,
    backgroundColor: '#111111',
    padding: 15,
    borderBottomColor: '#212121',
    borderBottomWidth: 0.5,
  },
  brandText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
});

export default HomeScreenStack;
