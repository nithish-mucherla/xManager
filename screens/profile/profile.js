import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import globalStyles from '../../App.component.styles';
import auth, {firebase} from '@react-native-firebase/auth';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const signOut = async () => {
    setLoading(true);
    await firebase.auth().signOut();
  };
  return (
    <View style={globalStyles.mainContainer}>
      <ScrollView>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.headerText}>
            {firebase.auth().currentUser.email}
          </Text>
        </View>
        {loading ? (
          <Image
            source={require('../loader.gif')}
            style={{height: 20, width: 20, alignSelf: 'center'}}
          />
        ) : (
          <TouchableOpacity onPress={signOut}>
            <Text style={{color: 'white', alignSelf: 'center'}}>Logout</Text>
          </TouchableOpacity>
        )}
        <Text></Text>
      </ScrollView>
    </View>
  );
};

export default Profile;
