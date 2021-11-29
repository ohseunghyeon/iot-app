import React, { useState } from "react"
import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator } from "react-native"
import { Device } from "./Device";

import request from '../../util/axios';

export default function DeviceDetail(param: any) {
  const device: Device = param.route?.params?.item;
  const [openPercent, setOpenPercent] = useState(device.state.openPercent);
  const [loading, setLoading] = useState(false);

  const setWindowOpenPercent = async (openPercent: number) => {
    try {
      setLoading(true);
      setOpenPercent(openPercent);
      await request({
        method: 'PUT',
        url: `/users/devices/state`,
        data: {
          device,
          state: { openPercent }
        }
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text>MAC address {device.macAddress}</Text>
        <Text>Type: {device.type === 0 ? 'Window' : 'unknown'}</Text>
      </View>
      <Text style={{ textAlign: "center", marginBottom: 10 }}>Command</Text>
      <View style={{ flexDirection: 'row', marginBottom: 50, justifyContent: 'space-around' }}>
        <Button color="black" title="Open" onPress={setWindowOpenPercent.bind(null, 100)} />
        <Button color="black" title="Close" onPress={setWindowOpenPercent.bind(null, 0)} />
      </View>
      <Text style={{ textAlign: "center", marginBottom: 10 }}>Set Open Percent from 0 to 100</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TextInput
          style={styles.inputBox}
          textAlign="right"
          onChangeText={(input) => {
            let numberedInput = Number(input);
            if (numberedInput < 0) numberedInput = 0;
            if (numberedInput > 100) numberedInput = 100;
            device.state.openPercent = numberedInput;
          }}
          value={openPercent.toString()}
          keyboardType={"number-pad"}
        />
        <Button color="black" title="Set" onPress={setWindowOpenPercent.bind(null, openPercent)} />
      </View>
      <ActivityIndicator animating={loading} color="black" />
    </View>
  )
}

const styles = StyleSheet.create({
  inputBox: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    width: 50,
    padding: 10
  },
});