import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Device } from 'react-native-ble-plx';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { manager } from '../../util/bleManager';
import request from '../../util/axios';

const WINDOW_SERVICE_UUID = 'ff8b2c15-74a6-468e-a114-6df49275290d';

export default function DeviceRegister() {
  const [devices, setDevices] = useState<Device[]>([]);

  const addDevice = function (device: Device) {
    const existingDevice = devices.find(d => d.id === device.id);
    if (!existingDevice) {
      setDevices([
        ...devices,
        device
      ]);
    }
  }

  const scanAndConnect = () => {
    manager.startDeviceScan(
      [WINDOW_SERVICE_UUID],
      null,
      (error, device) => {
        if (error) return;
        if (device) addDevice(device);
      });
  };

  const askToRegister = (item: Device) => {
    Alert.alert(
      "Register Device",
      "Register this device?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => registerDevice(item, false) }
      ]
    )
  }

  const askToForceRegister = (item: Device) => {
    Alert.alert(
      "Already registered to other user",
      "Will you register this device?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => registerDevice(item, true) }
      ]
    )
  }

  const registerDevice = async (device: Device, force: Boolean) => {
    const res = await request({
      method: 'POST',
      url: '/users/devices',
      data: {
        mac_address: device.localName,
        force
      }
    });

    if (!res.success) {
      if (res.errorCode === 'ERR_REGISTERED_TO_OTHER') {
        askToForceRegister(device);
      }
    }

    // 와이파이 등록 화면으로 이동
  }

  useEffect(() => {
    console.log('start scanning');
    scanAndConnect();

    return () => {
      console.log('close register screen');
      manager.stopDeviceScan();
    }
  }, []);

  // 연결하려는 작업이 등록이고..
  // 연결하려고 하면 mac 어드레스로 등록시키고.
  // 그리고 등록 시 지금 로그인 된 유저의 기기로 등록하기

  // 그리고 블루투스 통신으로 와이파이 정보 보내주기
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={devices}
        renderItem={({ item }: { item: Device }) => {
          switch (item.serviceUUIDs?.[0]) {
            case WINDOW_SERVICE_UUID: return (
              <TouchableOpacity
                style={styles.deviceView}
                onPress={askToRegister.bind(null, item)}
              >
                <Image
                  source={require('../../assets/window.png')}
                  style={styles.deviceImage}
                />
                <Text style={styles.deviceType}>Sliding Window</Text>
                <Text style={styles.deviceName}>{item.localName}</Text>
              </TouchableOpacity >
            )
            default: return;
          }
        }}
        keyExtractor={device => device.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  deviceView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  deviceImage: {
    width: 40,
    height: 40,
  },
  deviceType: {
    fontSize: 18,
    textAlignVertical: 'center',
  },
  deviceName: {
    fontSize: 9,
    textAlignVertical: 'center'
  }
})