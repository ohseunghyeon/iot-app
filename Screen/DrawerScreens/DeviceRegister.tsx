import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Device } from 'react-native-ble-plx';
// import { FlatList } from 'react-native-gesture-handler';
import base64 from 'react-native-base64';

import { manager } from '../../util/bleManager';
import request from '../../util/axios';
import Dialog from 'react-native-dialog';

const WINDOW_SERVICE_UUID = 'ff8b2c15-74a6-468e-a114-6df49275290d';
const WINDOW_CHARACTERISTIC_UUID = 'ff8b2c16-74a6-468e-a114-6df49275290d';

const characteristicByService = new Map();
characteristicByService.set(WINDOW_SERVICE_UUID, WINDOW_CHARACTERISTIC_UUID);

export default function DeviceRegister({ navigation }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const [ssid, setSsid] = useState('');
  const [pw, setPass] = useState('');

  const handleCancel = () => {
    setVisible(false);
  };

  const handleConnect = () => {
    if (!selectedDevice) {
      alert('selected device not found');
      return;
    }

    connectWiFi(selectedDevice, ssid, pw)
    setVisible(false);
  };

  const addDevice = function (device: Device) {
    setDevices(oldDevices => {
      const foundDevice = oldDevices.find(d => d.id === device.id)
      if (foundDevice) {
        if (foundDevice.localName !== device.localName) {
          return [
            ...oldDevices,
            device
          ];
        } else {
          return oldDevices;
        }
      } else {
        return [
          ...oldDevices,
          device
        ];
      }
    });
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
      return;
    }

    // 와이파이 등록 화면으로 이동
    setSelectedDevice(device);
    setVisible(true);
  }

  const connectWiFi = async (device: Device, ssid: string, pw: string) => {
    try {
      const isDeviceConnected = await manager.isDeviceConnected(device.id);
      console.log('isDeviceConnected', isDeviceConnected);
      if (!isDeviceConnected) {
        manager.stopDeviceScan();
        await device.connect();
      }

      const serviceUUID = device?.serviceUUIDs?.[0];
      if (!serviceUUID) {
        throw new Error('Service UUID not found');
      }

      console.log(1);
      await device.discoverAllServicesAndCharacteristics();
      console.log(2);

      const response = await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicByService.get(serviceUUID),
        base64.encode(JSON.stringify({ ssid, pw }))
      );

      console.log('res', response);

    } catch (e) {
      console.log(e);
      alert(e);
    } finally {
      await device.cancelConnection();
      scanAndConnect();
    }
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
      <Dialog.Container visible={visible}>
        <Dialog.Title>Connect your divice({selectedDevice?.localName}) to WiFi</Dialog.Title>
        <Dialog.Input label="ssid"
          onChangeText={(input) => setSsid(input)}
        />
        <Dialog.Input label="password"
          onChangeText={(input) => setPass(input)}
        />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Connect" onPress={handleConnect} />
      </Dialog.Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
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