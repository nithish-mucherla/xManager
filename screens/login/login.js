import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Register from '../register/Register';
import auth from '@react-native-firebase/auth';
import Button from '../../components/Button';
import globalStyles from '../../App.component.styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomTextInput from '../../components/TextInput';

const AuthStack = createStackNavigator();

const Login = ({navigation}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({email: '', password: ''});
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) console.log(response.user);
    } catch (error) {
      setLoading(false);
      let errorObj = {email: '', password: ''};
      if (error.code === 'auth/user-not-found')
        errorObj.email = `Account doesn't exist with this email`;
      else if (error.code === 'auth/wrong-password')
        errorObj.password = `Email id & password doesn't match`;
      setErrors(errorObj);
    }
  };
  return (
    <View style={globalStyles.mainContainer}>
      <StatusBar backgroundColor="#111111" barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}>
        <View style={{paddingVertical: 20}}>
          <Text style={globalStyles.headerText}>XMANAGER</Text>
        </View>
        <View style={{alignSelf: 'stretch'}}>
          <CustomTextInput
            helperText="Email"
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeTextHandler={txt => {
              setEmail(txt);
              setErrors(err => {
                return {...err, email: ''};
              });
            }}
            errorText={errors.email}
            value={email}
          />
          <CustomTextInput
            helperText="Password"
            placeholder="Password"
            value={password}
            secureTextEntry={!passwordVisibility}
            onChangeTextHandler={txt => {
              setPassword(txt);
              setErrors(err => {
                return {...err, password: ''};
              });
            }}
            helperIcon={
              <TouchableOpacity
                onPress={() => setPasswordVisibility(visible => !visible)}
                style={{alignSelf: 'center', padding: 5}}>
                <Icon
                  name={passwordVisibility ? 'eye' : 'eye-slash'}
                  color="gray"
                  size={20}
                />
              </TouchableOpacity>
            }
            errorText={errors.password}
          />
          <Button
            image={
              loading && (
                <Image
                  source={require('../loader.gif')}
                  style={{height: 20, width: 20}}
                />
              )
            }
            title={!loading && 'Login'}
            onPressHandler={handleLogin}
            disabled={!email || !password || loading}
            loading={loading}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={{color: 'white'}}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default () => {
  return (
    <AuthStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="login">
      <AuthStack.Screen name="login" component={Login} />
      <AuthStack.Screen name="register" component={Register} />
    </AuthStack.Navigator>
  );
};
