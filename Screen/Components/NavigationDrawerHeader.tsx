// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const NavigationDrawerHeader = (props) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={require('../../assets/threeBars.jpg')}
          style={{ width: 50, height: 50, }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default NavigationDrawerHeader;