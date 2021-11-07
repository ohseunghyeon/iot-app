import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomSidebarLoggedInUser() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(userStringified => {
        if (userStringified) {
          setUser(JSON.parse(userStringified));
        }
      })
      .catch(e => {
        console.error('Error occured while reading user profile. ' + e.message);
      });
  }, []);

  return (
    <View style={stylesSidebar.profileHeader}>
      <View style={stylesSidebar.profileHeaderPicCircle}>
        <Text style={{ fontSize: 25, color: 'black' }}>
          {user?.email?.charAt(0)?.toUpperCase()}
        </Text>
      </View>
      <Text style={stylesSidebar.profileHeaderText}>
        {user?.email}
      </Text>
    </View>
  )
}
const stylesSidebar = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: '#eee',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'black',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
});