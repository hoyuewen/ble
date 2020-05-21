import strings from './strings';
import styles from './styles';
import React, {Component, useState} from 'react';
import {Icon} from 'react-native-vector-icons/FontAwesome';
import {
  AppRegistry,
  Platform,
  PermissionsAndroid, // for checking if certain android permissions are enabled
  Text,
  View,
  NativeEventEmitter, // for emitting events for the BLE manager
  NativeModules, // for getting an instance of the BLE manager module
  Button,
  FlatList, // for creating lists
  Alert,
  TextInput,
} from 'react-native';
import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
import {Buffer} from 'buffer';
// Import/require in the beginning of the file
import {stringToBytes, bytesToString} from 'convert-string';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

import Spinner from 'react-native-spinkit'; // for showing a spinner when loading something

export default class TareScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      is_scanning: false, // whether the app is currently scanning for peripherals or not
      peripherals: null, // the peripherals detected
      connected_peripheral: props.route.params.connected_peripheral, // the currently connected peripheral
      values: {},
    };

    this.sensors = {
      'af840765-bd3f-4a73-8319-0cc7edac6d58': 'Read Frequency',
      '785ecf18-15d3-4097-b5fa-a876c34d71d3': 'Write Frequency',
    };
  }

  static navigationOptions = {
    drawerLabel: 'Tare',
  };

  serviceUUID() {
    return '5c1b9a0d-b5be-4a40-8f7a-66b36d0a5176';
  }

  read(deviceID) {
    var readCharacteristic = 'af840765-bd3f-4a73-8319-0cc7edac6d58';
    BleManager.read(
      this.state.connected_peripheral,
      this.serviceUUID(),
      readCharacteristic,
    )
      .then(readData => {
        // Success code
        console.log('Read before buffer: ' + readData);

        //   //const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
        //   //const sensorData = buffer.readUInt8(1, true);
        // console.log('sensor data: ' + sensorData);
        const buffer = bytesToString(readData);
        console.log('Read after buffer: ' + buffer);
        this.setState({
          values: {...this.state.values, [readCharacteristic]: buffer},
        });
        console.log(this.state.values);
        return buffer;
      })
      // This method uses buffer
      // .then(readData => {
      //   // Success code
      //   console.log('Read: ' + readData);

      //   const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
      //   const sensorData = buffer.readUInt8(0, true);
      //   this.setState({
      //     values: {...this.state.values, [readCharacteristic]: sensorData},
      //   });
      //   console.log(this.state.values);
      //   return sensorData;
      // })
      .catch(error => {
        // Failure code
        console.log(error);
      });
  }

  write() {
    var writeCharacteristics = '785ecf18-15d3-4097-b5fa-a876c34d71d3';
    console.log(this.state.values);
    console.log('string data: ' + this.state.values[writeCharacteristics]);
    // Convert data to byte array before write/writeWithoutResponse
    const data = stringToBytes(this.state.values[writeCharacteristics]);
    // var toBuffer = require('typedarray-to-buffer');

    // var arr = new Uint8Array([1, 2, 3]);
    // arr = toBuffer(arr);

    // // arr is a buffer now!

    // arr.toString(); // '\u0001\u0002\u0003'
    // arr.readUInt16BE(0); // 258
    BleManager.writeWithoutResponse(
      this.state.connected_peripheral,
      this.serviceUUID(),
      writeCharacteristics,
      data,
    )
      .then(() => {
        // Success code
        console.log('Writed: ' + data);
      })
      .catch(error => {
        // Failure code
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.notification}>Notification</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.app_title}>
            <Text style={styles.header_text}>TARE/ ZERO SCALE</Text>
          </View>
          <View style={styles.warning_container}>
            <Text style={styles.warning}>
              Ensure that no weight is on scale
            </Text>
          </View>
          <View style={styles.weight_box}>
            <Text style={styles.measure_title}>Measured Weight</Text>
            <View style={styles.weight}>
              <Text style={styles.weigh_counter}>
                {this.state.values['af840765-bd3f-4a73-8319-0cc7edac6d58']}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.ack_container}>
            <Text style={styles.ack}>
              Save tare value, app will lock until device acknowledges
            </Text>
            <TextInput
              placeholder="Type here to translate!"
              onChangeText={text => {
                this.setState({
                  values: {
                    ...this.state.values,
                    ['785ecf18-15d3-4097-b5fa-a876c34d71d3']: text,
                  },
                });
              }}
              defaultValue={''}
            />
          </View>
          <View style={styles.button_container}>
            <Button
              title="Read Value"
              onPress={() => {
                this.read(this.state.connected_peripheral);
              }}
            />
            <Button
              title="Save"
              onPress={() => {
                this.write();
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}
