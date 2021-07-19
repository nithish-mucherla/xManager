import 'react-native-gesture-handler';
import React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import globalStyles from '../App.component.styles';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import CustomTextInput from '../components/TextInput';
import BottomActionBar from '../components/BottomActionBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TxnForm = ({route, navigation}) => {
  const [txnDetails, setTxnDetails] = useState({
    title: '',
    amount: '',
    category: 'Income',
    from: '',
    to: '',
  });
  const [errors, setErrors] = useState({
    title: '',
    amount: '',
    category: '',
    from: '',
    to: '',
  });
  const [contentLoading, setContentLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [actionBarVisibility, setActionBarVisibility] = useState(false);

  const resetForm = () => {
    setTxnDetails({
      title: '',
      amount: '',
      category: 'Income',
      from: '',
      to: '',
    });
  };

  const txnCategories = ['Income', 'Expense', 'Transfer'];

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
        let txnDetails = {
          title: '',
          amount: '',
          category: '',
          from: '',
          to: '',
        };
        if (data) {
          if (data.category === 'Transfer') {
            txnDetails.from = data.from;
            txnDetails.to = data.to;
          }
          txnDetails.title = data.title;
          txnDetails.amount = data.amount;
          txnDetails.category = data.category;
          setTxnDetails(txnDetails);
          setContentLoading(false);
        }
      })();
    } catch (err) {
      console.log(err);
    }
  }, [route.params]);

  const handleTxnSubmit = async () => {
    let errorObj = {title: '', amount: '', category: '', from: '', to: ''};
    if (!txnDetails.title) errorObj.title = 'Title must be provided';
    if (!txnDetails.amount) errorObj.amount = 'Amount must be provided';
    if (txnDetails.category === 'Transfer') {
      if (!txnDetails.from) errorObj.from = 'From entity must be provided!';
      if (!txnDetails.to) errorObj.to = 'To entity must be provided!';
    } else if (isNaN(txnDetails.amount))
      errorObj.amount = 'Amount must be a number!';
    else if (txnDetails.amount < 0)
      errorObj.amount = `Amount can'be less than 0`;
    if (
      !errorObj.amount &&
      !errorObj.title &&
      !errorObj.category &&
      !errorObj.from &&
      !errorObj.to
    ) {
      setLoading(true);
      try {
        let uid = firebase.auth().currentUser.uid;
        let txn = {};
        if (txnDetails.category === 'Transfer') {
          txn.from = txnDetails.from;
          txn.to = txnDetails.to;
        }
        txn.title = txnDetails.title;
        txn.category = txnDetails.category;
        txn.amount = txnDetails.amount;
        await firestore()
          .collection('transactions')
          .doc(uid)
          .collection('txns')
          .doc(route.params?.txnId)
          .set(txn);
        navigation.navigate('TxnSuccess', {
          successMessage: 'Transaction Update Successful',
        });
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    } else setErrors(errorObj);
  };

  const TransferTxnComponent = () => {
    return (
      <>
        <CustomTextInput
          helperText="From"
          placeholder="From"
          onChangeTextHandler={from => {
            setTxnDetails(txn => {
              return {...txn, from: from};
            });
            setErrors({...errors, from: ''});
          }}
          value={txnDetails.from}
          errorText={errors.from}
        />
        <CustomTextInput
          helperText="To"
          placeholder="To"
          onChangeTextHandler={to => {
            setTxnDetails(txn => {
              return {...txn, to: to};
            });
            setErrors({...errors, to: ''});
          }}
          value={txnDetails.to}
          errorText={errors.to}
        />
      </>
    );
  };

  const cancelEdit = () => {
    Alert.alert('', 'Discard changes?', [
      {text: 'Cancel', style: 'cancel', onPress: () => {}},
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <View style={globalStyles.mainContainer}>
      <ScrollView>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={cancelEdit}>
            <Ionicons name="md-close" color="white" size={30} />
          </TouchableOpacity>
          <View style={styles.headerBarCenter}>
            <Text style={styles.headerBarTitle}>Edit Transaction</Text>
          </View>
          <TouchableOpacity onPress={handleTxnSubmit}>
            {loading ? (
              <Image
                source={require('./loader.gif')}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Ionicons
                name="md-checkmark-sharp"
                color="dodgerblue"
                size={30}
              />
            )}
          </TouchableOpacity>
        </View>
        {contentLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('./loader.gif')}
              style={{height: 40, width: 40}}
            />
          </View>
        ) : (
          <View style={{alignSelf: 'stretch', paddingTop: 20}}>
            <CustomTextInput
              helperText="Title"
              placeholder="Title"
              errorText={errors.title}
              value={txnDetails.title}
              onChangeTextHandler={text => {
                setTxnDetails(txn => {
                  return {
                    ...txn,
                    title: text,
                  };
                });
                setErrors({...errors, title: ''});
              }}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                <Text style={{color: 'white', fontSize: 14}}>Category</Text>
              </View>
              <TouchableOpacity
                style={{paddingVertical: 20}}
                onPress={() => setActionBarVisibility(true)}>
                <View>
                  <Text style={{color: 'gray', fontSize: 14}}>
                    {txnDetails.category} {'>'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {
              {
                Transfer: TransferTxnComponent(),
              }[txnDetails.category]
            }
            <CustomTextInput
              helperText={'Amount in Rs'}
              placeholder="Amount"
              errorText={errors.amount}
              value={txnDetails.amount.toString()}
              keyboardType="numeric"
              onChangeTextHandler={amount => {
                setTxnDetails(txn => {
                  return {...txn, amount: amount};
                });
                setErrors({...errors, amount: ''});
              }}
            />
          </View>
        )}
      </ScrollView>
      <BottomActionBar
        visibility={actionBarVisibility}
        backdropPressHandler={() => setActionBarVisibility(false)}>
        {txnCategories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categories]}
            onPress={() => {
              setTxnDetails(txn => {
                return {
                  ...txn,
                  category: cat,
                };
              });
              setActionBarVisibility(false);
            }}>
            <Text
              style={[
                {textAlign: 'center'},
                cat === txnDetails.category && styles.selectedCategory,
              ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </BottomActionBar>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBarCenter: {
    flex: 1,
  },
  headerBarTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  categories: {
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  selectedCategory: {
    fontWeight: 'bold',
  },
});

export default TxnForm;
