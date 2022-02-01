import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: 'https://iot-server.bsassassincat.duckdns.org/',
  // baseURL: 'http://192.168.50.167:3000',
});

export default async function request(options: AxiosRequestConfig) {
  const accessToken = await AsyncStorage.getItem('access_token');

  if (accessToken) {
    Object.assign(options, { headers: { Authorization: `Bearer ${accessToken}` }, })
  }

  const res = await instance.request(options);

  return res.data;
};