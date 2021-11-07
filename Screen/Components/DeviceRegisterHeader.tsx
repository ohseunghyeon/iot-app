import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

const DeviceRegisterModal = (props) => {
  const openDeviceRegister = () => {
    console.log(1234);
    props.navigationProps.push('DeviceRegister')
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={openDeviceRegister}>
        {/** 여기 터쳐블 클릭 시 모달 열어야지 */}
        <Image
          source={require('../../assets/plus.png')}
          style={{ width: 20, height: 20, }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default DeviceRegisterModal;