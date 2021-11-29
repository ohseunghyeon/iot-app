import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';

import request from '../../util/axios';
import { Device, DeviceType } from './Device';

interface DeviceFromServer {
  id: number;
  mac_address: string;
  type: DeviceType;
  state: Object
}

const DevicesScreen = (props) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRefreshing(true);
    getDevices().finally(() => { setRefreshing(false); });
  }, []);

  const getDevices = async () => {
    console.log('Fetch user devices');
    try {
      const devices: DeviceFromServer[] = await request({
        method: 'GET',
        url: '/users/devices',
      });
      console.log(devices)
      setDevices(devices.map(device => new Device({
        id: device.id,
        macAddress: device.mac_address,
        type: device.type,
        state: device.state,
      })));
    } catch (e) {
      console.log(e?.response.data);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDevices().finally(() => { setRefreshing(false); });
  }, []);

  const openDeviceDetail = async (item: Device) => {
    await getDevices();
    props.navigation.push('DeviceDetail', { item })
  }

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
              renderItem={({ item }: { item: Device }) => {
                switch (item?.type) {
                  case DeviceType.slidingWindow: return (
                    <TouchableOpacity
                      style={styles.deviceView}
                      onPress={openDeviceDetail.bind(null, item)}
                    >
                      <Image
                        source={require('../../assets/window.png')}
                        style={styles.deviceImage}
                      />
                      <Text style={styles.deviceType}>Sliding Window</Text>
                      <Text style={styles.deviceName}>{item.macAddress}</Text>
                    </TouchableOpacity >
                  )
                  default: return <Text>Unknown</Text>;
                }
              }}
              keyExtractor={(item) => item.macAddress}
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
});
