import 'react-native-gesture-handler';
import React from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import Button from '../../components/Button';
import globalStyles from '../../App.component.styles';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import CustomTextInput from '../../components/TextInput';
import BottomActionBar from '../../components/BottomActionBar';

const TxnForm = ({route, navigation}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Income');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionBarVisibility, setActionBarVisibility] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    amount: '',
    category: '',
    from: '',
    to: '',
  });

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setFrom('');
    setTo('');
    setCategory('Income');
  };

  const txnCategories = ['Income', 'Expense', 'Transfer'];

  const TransferTxnComponent = () => {
    return (
      <>
        <CustomTextInput
          helperText="From"
          placeholder="From"
          onChangeTextHandler={from => {
            setFrom(from);
            setErrors({...errors, from: ''});
          }}
          value={from}
          errorText={errors.from}
        />
        <CustomTextInput
          helperText="To"
          placeholder="To"
          onChangeTextHandler={to => {
            setTo(to);
            setErrors({...errors, to: ''});
          }}
          value={to}
          errorText={errors.to}
        />
      </>
    );
  };

  const validateForm = () => {
    let errorObj = {title: '', amount: '', category: '', from: '', to: ''};
    if (category === 'Transfer') {
      if (!from) errorObj.from = 'From entity must be provided!';
      if (!to) errorObj.to = 'To entity must be provided!';
    } else if (isNaN(amount)) errorObj.amount = 'Amount must be a number!';
    else if (amount < 0) errorObj.amount = `Amount can'be less than 0`;
    if (
      !errorObj.amount &&
      !errorObj.title &&
      !errorObj.category &&
      !errorObj.from &&
      !errorObj.to
    )
      return [true, errorObj];
    return [false, errorObj];
  };

  const handleCreateTxn = async () => {
    const [isValid, errorObject] = validateForm();
    if (isValid) {
      setLoading(true);
      let uid = firebase.auth().currentUser.uid;
      try {
        let response;
        if (category === 'Transfer')
          response = await firestore()
            .collection('transactions')
            .doc(uid)
            .collection('txns')
            .add({
              title: title,
              category: category,
              from: from,
              to: to,
              amount: amount,
            });
        else
          response = await firestore()
            .collection('transactions')
            .doc(uid)
            .collection('txns')
            .add({
              title: title,
              category: category,
              amount: amount,
            });
        if (response) {
          resetForm();
          navigation.navigate('TxnSuccess', {
            successMessage: 'Transaction Added Successfully',
          });
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    } else setErrors(errorObject);
  };

  return (
    <View style={globalStyles.mainContainer}>
      <ScrollView>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.headerText}>Add Transaction</Text>
          <Text style={globalStyles.subText}>
            A transaction can be an expense, income or a transfer. Add and track
            all your transactions!
          </Text>
        </View>
        <View style={{alignSelf: 'stretch'}}>
          <CustomTextInput
            helperText="Title"
            placeholder="Title"
            errorText={errors.title}
            value={title}
            onChangeTextHandler={text => {
              setTitle(text);
              setErrors({...errors, title: ''});
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text style={{color: 'white', fontSize: 14}}>Category</Text>
            </View>
            <TouchableOpacity
              style={{paddingVertical: 20}}
              onPress={() => {
                navigation.setOptions({tabBarVisible: false});
                setActionBarVisibility(true);
              }}>
              <View>
                <Text style={{color: 'gray', fontSize: 14}}>
                  {category} {'>'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {
            {
              Transfer: TransferTxnComponent(),
            }[category]
          }
          <CustomTextInput
            helperText={'Amount in Rs'}
            placeholder="Amount"
            errorText={errors.amount}
            value={amount.toString()}
            keyboardType="numeric"
            onChangeTextHandler={amount => {
              setAmount(amount);
              setErrors({...errors, amount: ''});
            }}
          />
          <Button
            image={
              loading && (
                <Image
                  source={require('../loader.gif')}
                  style={{width: 20, height: 20}}
                />
              )
            }
            title={!loading && 'ADD'}
            disabled={(() => {
              let basicCheck =
                !title.trim() || !title.trim().length > 0 || !amount || loading;
              return category === 'Transfer'
                ? basicCheck || !from || !to
                : basicCheck;
            })()}
            loading={loading}
            onPressHandler={handleCreateTxn}
          />
        </View>
      </ScrollView>
      <BottomActionBar
        visibility={actionBarVisibility}
        backdropPressHandler={() => {
          navigation.setOptions({tabBarVisible: true});
          setActionBarVisibility(false);
        }}>
        {txnCategories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categories]}
            onPress={() => {
              setCategory(cat);
              navigation.setOptions({tabBarVisible: true});
              setActionBarVisibility(false);
            }}>
            <Text
              style={[
                {textAlign: 'center'},
                cat === category && styles.selectedCategory,
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
  categories: {
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  selectedCategory: {
    fontWeight: 'bold',
  },
});

export default TxnForm;
