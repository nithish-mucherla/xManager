import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import {View, Text} from 'react-native';
import globalStyles from '../App.component.styles';

const SuccessScreen = ({navigation}) => {
  return (
    <View
      style={[
        globalStyles.mainContainer,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      <Ionicons name="checkmark-done-circle-sharp" color="green" size={200} />
      <Text style={globalStyles.headerText}>Transaction Successful</Text>
      <Button
        stylesObj={{alignSelf: 'stretch'}}
        title="View Transactions"
        onPressHandler={() => navigation.navigate('Home', {screen: 'TxnList'})}
      />
      <Button
        stylesObj={{alignSelf: 'stretch', backgroundColor: '#111111'}}
        title="New Transaction"
        onPressHandler={() => navigation.navigate('Home', {screen: 'TxnForm'})}
      />
    </View>
  );
};

export default SuccessScreen;
