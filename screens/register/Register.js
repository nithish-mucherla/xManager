import React, {useState} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import Button from '../../components/Button';
import globalStyles from '../../App.component.styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import CustomTextInput from '../../components/TextInput';

const Register = ({navigation}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({email: '', password: ''});
  const [loading, setLoading] = useState(false);
  const validPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/;

  const PasswordHint = ({isMatch, condition}) => (
    <View style={{flexDirection: 'row', paddingVertical: 2}}>
      <MatIcon
        name={
          isMatch
            ? 'checkbox-marked-circle-outline'
            : 'checkbox-blank-circle-outline'
        }
        color="green"
        size={20}
      />
      <Text style={{fontSize: 16, color: 'green', paddingLeft: 10}}>
        {condition}
      </Text>
    </View>
  );

  const handleSignUp = async () => {
    setLoading(true);
    //if email already not registered then proceed with further registration else display the problem!
    try {
      let response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      if (response) {
        console.log(response);
        let res = await firestore().collection('users').add({email: email});
      }
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrors(errs => {
          return {...errs, email: 'Email address is already in use!'};
        });
      }

      if (error.code === 'auth/invalid-email') {
        setErrors(errs => {
          return {...errs, email: 'Email address is invalid!'};
        });
      }

      console.error(error);
    }
  };
  return (
    <View style={globalStyles.mainContainer}>
      <ScrollView
        contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}>
        <View style={{paddingVertical: 20}}>
          <Text style={globalStyles.headerText}>SIGN UP</Text>
        </View>
        <View style={{alignSelf: 'stretch'}}>
          <CustomTextInput
            helperText="Email"
            placeholder="Email"
            placeholderTextColor="gray"
            style={globalStyles.textInput}
            value={email}
            onChangeTextHandler={txt => {
              setEmail(txt);
              setErrors(err => {
                return {...err, email: ''};
              });
            }}
            errorText={errors.email}
          />

          <CustomTextInput
            helperText="Password"
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={!passwordVisibility}
            onChangeTextHandler={txt => {
              setPassword(txt);
              setErrors(err => {
                return {...err, password: ''};
              });
            }}
            errorText={errors.password}
            helperIcon={
              <TouchableOpacity
                onPress={() => setPasswordVisibility(visible => !visible)}
                style={{alignSelf: 'center', padding: 5}}>
                <Icon
                  onPress={() => setPasswordVisibility(visible => !visible)}
                  style={{alignSelf: 'center'}}
                  name={passwordVisibility ? 'eye' : 'eye-slash'}
                  color="gray"
                  size={20}
                />
              </TouchableOpacity>
            }>
            <View style={{paddingVertical: 15}}>
              <PasswordHint
                isMatch={password.length > 8}
                condition="Atleast 8 characters"
              />
              <PasswordHint
                isMatch={/[A-Z]/.test(password) && /[a-z]/.test(password)}
                condition="Uppercase and Lowercase letters"
              />
              <PasswordHint
                isMatch={/[\d]/.test(password)}
                condition="Atleast one number"
              />
              <PasswordHint
                isMatch={/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)}
                condition="Atleast one special character"
              />
            </View>
          </CustomTextInput>
          <Button
            image={
              loading && (
                <Image
                  source={require('../loader.gif')}
                  style={{height: 20, width: 20}}
                />
              )
            }
            title={!loading && 'Register'}
            onPressHandler={handleSignUp}
            disabled={
              loading ||
              !email.trim() ||
              !password ||
              !/^[^\s@]+@[^\s@]+$/.test(email) ||
              !validPasswordRegex.test(password)
            }
            loading={loading}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={{color: 'white'}}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
