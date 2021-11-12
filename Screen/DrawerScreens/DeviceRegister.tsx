import React, { useEffect } from 'react';
import { manager } from '../../util/bleManager';

import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DeviceRegister() {
  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      console.log('error', error, 'device', device?.id, device?.name, device?.serviceUUIDs);
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'TI BLE Sensor Tag' ||
        device.name === 'SensorTag') {

        // Stop scanning as it's not necessary if you are scanning for one device.
        manager.stopDeviceScan();

        // Proceed with connection.
      }
    });
  };

  useEffect(() => {
    console.log('start scanning');
    scanAndConnect();
  }, []);
  // 블루투스 모듈로 기기 찾기

  // 그리고 리스트 뿌려주기

  // 그리고 등록 시 지금 로그인 된 유저의 기기로 등록하기

  // 그리고 블루투스 통신으로 와이파이 정보 보내주기
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>123</Text>
    </SafeAreaView>
  )
}