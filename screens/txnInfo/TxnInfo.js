import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import globalStyles from '../../App.component.styles';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TxnInfo = ({route, navigation}) => {
  const [loading, setLoading] = useState(true);
  const [txnDetails, setTxnDetails] = useState({
    title: '',
    category: '',
    amount: '',
    to: '',
    from: '',
  });
  useEffect(() => {
    try {
      let uid = firebase.auth().currentUser.uid;
      (async () => {
        let txnResponse = await firestore()
          .collection('transactions')
          .doc(uid)
          .collection('txns')
          .doc(route.params?.txnId)
          .get();
        let data = txnResponse._data;
        if (data) {
          let txnDetails = {
            title: '',
            category: '',
            amount: '',
            to: '',
            from: '',
          };

          if (data.category === 'Transfer') {
            txnDetails.to = data.to;
            txnDetails.from = data.from;
          }
          txnDetails.title = data.title;
          txnDetails.amount = data.amount;
          txnDetails.category = data.category;
          setTxnDetails(txnDetails);
          setLoading(false);
        }
      })();
    } catch (err) {
      console.log(err);
    }
  }, [route.params?.txnId]);

  const deleteTxn = async () => {
    let uid = firebase.auth().currentUser.uid;
    try {
      await firestore()
        .collection('transactions')
        .doc(uid)
        .collection('txns')
        .doc(route.params?.txnId)
        .delete();
      navigation.navigate('TxnList', {
        flashText: 'Deleted',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = () => {
    Alert.alert('', 'Delete the transaction?', [
      {text: 'Cancel', style: 'cancel', onPress: () => {}},
      {
        text: 'OK',
        onPress: deleteTxn,
      },
    ]);
  };

  return (
    <View style={globalStyles.mainContainer}>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../loader.gif')}
            style={{width: 40, height: 40}}
          />
        </View>
      ) : (
        <>
          <View style={styles.txnInfo}>
            <View
              style={[
                styles.titleContainer,
                {
                  backgroundColor:
                    txnDetails.category === 'Income' ? 'green' : 'red',
                },
              ]}>
              <Text style={[globalStyles.headerText, {fontSize: 24}]}>
                {txnDetails.title}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <ScrollView
                contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}>
                <Text style={globalStyles.subText}>{txnDetails.category}</Text>
                {txnDetails.category === 'Transfer' && (
                  <>
                    <Text style={globalStyles.subText}>
                      From: {txnDetails.from}
                      {'  '}
                      <Text style={globalStyles.subText}>
                        To: {txnDetails.to}
                      </Text>
                    </Text>
                  </>
                )}
                <Text style={globalStyles.headerText}>
                  &#x20b9; {txnDetails.amount}
                </Text>
              </ScrollView>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() =>
                navigation.navigate('EditTxn', {txnId: route.params?.txnId})
              }>
              <MaterialIcons color="white" name="edit" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={confirmDelete}>
              <MaterialIcons color="white" name="delete" size={20} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  txnInfo: {
    flex: 1,
    margin: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  detailsContainer: {
    flex: 2,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#212121',
  },
});

export default TxnInfo;
