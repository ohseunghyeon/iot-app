import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Text, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DevicesScreen = () => {
  const [devices, setDevices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRefreshing(true);
    getDevices().finally(() => { setRefreshing(false); });
  }, []);

  const getDevices = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      console.log(1);
      const devicesRes = await axios.request({
        method: 'GET',
        url: 'http://192.168.50.167:3000/devices',
        // url: 'https://postercolo.synology.me/auth/login',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(2)
      console.log(devicesRes.data);
    } catch (e) {
      // console.log(e?.response.data);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDevices().finally(() => { setRefreshing(false); });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {
          devices.length
            ? <FlatList
              data={devices}
              renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
            />
            : <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={{
                  fontSize: 20
                }}
              >No Devices Registered</Text>
            </View>
        }
      </ScrollView>
      {/* <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            Example of Splash, Login and Sign Up in React Native
            {'\n\n'}
            This is the Home Screen
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey',
          }}>
          Splash, Login and Register Example{'\n'}React Native
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey',
          }}>
          www.aboutreact.com
        </Text> */}
    </SafeAreaView>
  );
};

export default DevicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});