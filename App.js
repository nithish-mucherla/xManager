import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthScreen from './screens/login/login.js';
import auth from '@react-native-firebase/auth';
import HomeScreenStack from './screens/home/home';
import {createStackNavigator} from '@react-navigation/stack';
import SuccessScreen from './screens/successScreen.js';

const HomeStack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true); //represents the period where firebase is being initialized in the app

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('./screens/loader.gif')}
          style={{height: 40, width: 40}}
        />
      </View>
    );
  else if (user === null)
    return (
      <NavigationContainer>
        <AuthScreen />
      </NavigationContainer>
    );
  return (
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName="Home">
        <HomeStack.Screen
          name="Home"
          component={HomeScreenStack}
          options={{headerShown: false}}
        />
        <HomeStack.Screen
          name="TxnSuccess"
          component={SuccessScreen}
          options={{headerShown: false}}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

/*
  state = {
    type: tab,
    routeNames: [Home, TxnForm, Profile],
    routes: [
      {
        name:Home,
        state: {
          routeNames: [XM],
          routes: [{
            name:XM
          }]
        }
      },
      {
        name:TxnForm,
        state: {
          routeName:['Add Transaction', 'Transaction Success' ],
          routes:[
            { name: 'Add Transaction' },
            { name: 'Transaction Success'}
          ]
        }
      },
      {
        name:'Profile'
      }
    ]
  }

  Home
    - XM
  TxnForm
    - Add Transaction
    - Transaction Success
  Profile
*/
