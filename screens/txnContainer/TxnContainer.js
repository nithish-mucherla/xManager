import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, Image} from 'react-native';
import TxnItem from './txnItem/TxnItem';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const TxnContainer = ({navigation}) => {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let user = firebase.auth().currentUser.uid;
    const subscriber = firestore()
      .collection('transactions')
      .doc(user)
      .collection('txns')
      .onSnapshot(querySnapshot => {
        let txns = [];
        querySnapshot.forEach(doc => {
          txns.push({
            ...doc.data(),
            key: doc.id,
          });
        });
        setTxns(txns);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  if (loading)
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../loader.gif')}
          style={{width: 40, height: 40}}
        />
      </View>
    );
  else if (txns.length > 0) {
    return (
      <View style={{paddingTop: 70}}>
        <FlatList
          data={txns}
          renderItem={({item}) => (
            <TxnItem id={item.key} navigation={navigation} txnDetails={item} />
          )}
        />
      </View>
    );
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'white'}}>No Transactions</Text>
    </View>
  );
};

export default TxnContainer;
