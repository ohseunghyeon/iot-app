// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      AsyncStorage.getItem('user').then((value) =>
        navigation.replace(
          value === null ? 'Auth' : 'DrawerNavigationRoutes'
        ),
      );
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
      >IoT-App</Text>
      <ActivityIndicator
        animating={animating}
        // color=""
        size="large"
        style={styles.activityIndicator}
      />
    </View >
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 50
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});