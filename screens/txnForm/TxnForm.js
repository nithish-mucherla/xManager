import 'react-native-gesture-handler';
import React from 'react';
import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import Button from '../../components/Button';
import globalStyles from '../../App.component.styles';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import CustomTextInput from '../../components/TextInput';

const TxnForm = ({route, navigation}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Income');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const windowHeight = Dimensions.get('window').height;
  const backdropTop = useRef(new Animated.Value(windowHeight)).current;
  const actionbarTop = useRef(new Animated.Value(windowHeight)).current;

  // useEffect(() => {
  //     setContentLoading(true);
  //     (async () => {
  //       try {
  //         const currentUser = await firebase.auth().currentUser.uid;
  //         const txnDetails = await firestore()
  //           .collection('transactions')
  //           .doc(currentUser)
  //           .collection('txns')
  //           .doc(route.params?.txnId)
  //           .get();
  //         if (txnDetails) {
  //           const data = txnDetails._data;
  //           if (data.category === 'Transfer') {
  //             setFrom(data.from);
  //             setTo(data.to);
  //           }
  //           setTitle(data.title);
  //           setAmount(data.amount);
  //           setCategory(data.category);
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //       setContentLoading(false);
  //     })();
  //   }, []);

  const [errors, setErrors] = useState({
    title: '',
    amount: '',
    category: '',
    from: '',
    to: '',
  });

  const handleActionbarClose = () => {
    navigation.setOptions({tabBarVisible: true});
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
    navigation.setOptions({tabBarVisible: false});
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

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setFrom('');
    setTo('');
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

  const handleTxnSubmit = async () => {
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
    ) {
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
          navigation.navigate('TxnSuccess');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    } else setErrors(errorObj);
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
        {contentLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../loader.gif')}
              style={{height: 40, width: 40}}
            />
          </View>
        ) : (
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
                onPress={handleActionbarOpen}>
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
              helperText="Amount in $"
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
                  !title.trim() ||
                  !title.trim().length > 0 ||
                  !amount ||
                  loading;
                return category === 'Transfer'
                  ? basicCheck || !from || !to
                  : basicCheck;
              })()}
              loading={loading}
              onPressHandler={handleTxnSubmit}
            />
          </View>
        )}
      </ScrollView>

      <TouchableWithoutFeedback onPress={handleActionbarClose}>
        <Animated.View style={[styles.backdrop, {top: backdropTop}]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.bottomActionBarContainer,
          {
            top: actionbarTop,
          },
        ]}>
        {txnCategories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categories]}
            onPress={() => {
              setCategory(cat);
              handleActionbarClose();
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
      </Animated.View>
    </View>
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
  categories: {
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  selectedCategory: {
    fontWeight: 'bold',
  },
});

export default TxnForm;
