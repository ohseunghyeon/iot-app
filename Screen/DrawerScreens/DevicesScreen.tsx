import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useIsFocused } from "@react-navigation/native";

import request from '../../util/axios';
import { Device, DeviceType, WindowState, WindowMeta } from './Device';

interface DeviceFromServer {
  id: number;
  mac_address: string;
  type: DeviceType;
  state: WindowState;
  meta: WindowMeta;
}

const DevicesScreen = (props) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setRefreshing(true);
    getDevices().finally(() => { setRefreshing(false); });
  }, [isFocused]);

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
        meta: device.meta,
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
              data={devices.sort((a, b) => {
                if (a.meta?.name < b.meta?.name) return -1;
                if (a.meta?.name > b.meta?.name) return 1;
                return 0;
              })}
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
                      <Text style={styles.deviceName}>{item.meta.name ?? item.macAddress}</Text>
                      <Text style={styles.deviceState}>{item.state.openPercent} %</Text>
                      {/* <Text style={styles.deviceType}>Sliding Window</Text> */}
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
    // justifyContent: 's',
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
    marginLeft: 10,
    marginRight: 20,
  },
  deviceType: {
    fontSize: 9,
    textAlignVertical: 'center',
  },
  deviceState: {
    fontSize: 18,
    textAlignVertical: 'center',
    textAlign: 'right',
  },
  deviceName: {
    fontSize: 18,
    textAlignVertical: 'center',
    width: 230
  },
});
