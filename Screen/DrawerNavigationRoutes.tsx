// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React, { useState, useEffect } from 'react';

// Import Navigators from React Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import Screens
import DeviceScreen from './DrawerScreens/DevicesScreen';
import DeviceRegister from './DrawerScreens/DeviceRegister'
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';
import DeviceRegisterHeader from './Components/DeviceRegisterHeader';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const devicesStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Devices">
      <Stack.Screen
        name="Devices"
        component={DeviceScreen}
        options={{
          title: 'Devices', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerRight: () => (
            <DeviceRegisterHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#d2d2d2', //Set Header color
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="DeviceRegister"
        component={DeviceRegister}
        options={{
          title: 'Register Device',
          headerStyle: {
            backgroundColor: '#d2d2d2', //Set Header color
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={CustomSidebarMenu}
    >
      <Drawer.Screen
        name="devicesStack"
        options={{
          drawerLabel: 'Devices',
          drawerActiveBackgroundColor: '#c2c2c2',
          drawerActiveTintColor: 'black'
        }}
        component={devicesStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;