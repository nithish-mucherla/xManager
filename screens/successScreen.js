import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import {View, Text} from 'react-native';
import globalStyles from '../App.component.styles';
import {useNavigationState} from '@react-navigation/native';

const SuccessScreen = ({route, navigation}) => {
  console.log(route.params);
  const state = useNavigationState(state => state);
  return (
    <View
      style={[
        globalStyles.mainContainer,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      <Ionicons name="checkmark-done-circle-sharp" color="green" size={200} />
      <Text style={globalStyles.headerText}>
        {route.params?.successMessage}
      </Text>
      <Button
        stylesObj={{alignSelf: 'stretch'}}
        title="View Transactions"
        onPressHandler={() => navigation.navigate('TxnList')}
      />
      <Button
        stylesObj={{alignSelf: 'stretch', backgroundColor: '#111111'}}
        title="New Transaction"
        onPressHandler={() => {
          navigation.navigate('TxnForm');
        }}
      />
    </View>
  );
};

export default SuccessScreen;
