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

export default class CalibrationScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      is_scanning: false, // whether the app is currently scanning for peripherals or not
      peripherals: null, // the peripherals detected
      connected_peripheral: props.route.params.connected_peripheral, // the currently connected peripheral
      values: {},
    };

    this.sensors = {
      '0f22202b-1d12-49ed-89b3-1c96bebd7542': 'Read Zero Scale',
      '54be66f0-2ec3-40cf-a4df-64d4c10cd9f5': 'Write Zero Scale',
      'af840765-bd3f-4a73-8319-0cc7edac6d58': 'Read Weight',
      '785ecf18-15d3-4097-b5fa-a876c34d71d3': 'Write Weight',
    };
  }

  static navigationOptions = {
    drawerLabel: 'Calibration',
  };

  componentDidMount() {
    this.readWeight(this.state.connected_peripheral);
  }

  serviceUUID() {
    return '5c1b9a0d-b5be-4a40-8f7a-66b36d0a5176';
  }

  readWeight(deviceID) {
    var readCharacteristic = 'af840765-bd3f-4a73-8319-0cc7edac6d58';
    BleManager.read(
      this.state.connected_peripheral,
      this.serviceUUID(),
      readCharacteristic,
    )
      .then(readData => {
        // Success code
        console.log('Read before buffer: ' + readData);
        // const buffer = bytesToString(readData);
        const buffer = Buffer.from(readData);
        const sensorData = buffer.readUInt8(0, true);
        console.log('Read after buffer: ' + sensorData);
        this.setState({
          values: {...this.state.values, [readCharacteristic]: sensorData},
        });
        console.log(this.state.values);
        return sensorData;
      })
      .catch(error => {
        // Failure code
        console.log(error);
      });
  }

  readZero(deviceID) {
    var readZeroCharacteristic = '0f22202b-1d12-49ed-89b3-1c96bebd7542';
    BleManager.read(
      this.state.connected_peripheral,
      this.serviceUUID(),
      readZeroCharacteristic,
    )
      .then(readData => {
        // Success code
        console.log('Read before buffer: ' + readData);
        // const buffer = bytesToString(readData);
        const buffer = Buffer.from(readData);
        const sensorData = buffer.readUInt8(0, true);
        console.log('Read after buffer: ' + sensorData);
        this.setState({
          values: {...this.state.values, [readZeroCharacteristic]: sensorData},
        });
        console.log(this.state.values);
        if (sensorData === 1) {
          console.log('Zero Scale = TRUE');
        } else {
          console.log('Zero scale = FALSE');
        }
        return sensorData;
      })
      .catch(error => {
        // Failure code
        console.log(error);
      });
  }

  writeWeight(num) {
    var writeCharacteristics = '785ecf18-15d3-4097-b5fa-a876c34d71d3';
    console.log(this.state.values);
    console.log('string data: ' + this.state.values[writeCharacteristics]);
    // Convert data to byte array before write/writeWithoutResponse
    const data = stringToBytes(this.state.values[writeCharacteristics]);
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

  writeZero() {
    var writeCharacteristics = '54be66f0-2ec3-40cf-a4df-64d4c10cd9f5';
    console.log(this.state.values);
    console.log('Zero Scale data: ' + this.state.values[writeCharacteristics]);
    // Convert data to byte array before write/writeWithoutResponse
    const data = stringToBytes(this.state.values[writeCharacteristics]);
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
          <Text style={styles.header_text}>Load Cell Calibration</Text>
        </View>
        <View style={styles.body}>
          <Text>
            {'SET_ZERO_SCALE = ' +
              this.state.values['0f22202b-1d12-49ed-89b3-1c96bebd7542']}
          </Text>
          <Button
            title="Read SET_ZERO_SCALE"
            onPress={() => {
              this.readZero(this.state.connected_peripheral);
            }}
          />
          <Button
            title="+"
            onPress={() => {
              this.setState({
                values: {
                  ...this.state.values,
                  ['785ecf18-15d3-4097-b5fa-a876c34d71d3']: '1',
                },
              });
              this.writeWeight();
            }}
          />
          <Text>
            {'Average Measured Weight: ' +
              this.readWeight(this.state.connected_peripheral)}
          </Text>
          <Button
            title="-"
            onPress={() => {
              this.setState({
                values: {
                  ...this.state.values,
                  ['785ecf18-15d3-4097-b5fa-a876c34d71d3']: '2',
                },
              });
              this.writeWeight();
            }}
          />
          <Button
            title="Save"
            onPress={() => {
              this.setState({
                values: {
                  ...this.state.values,
                  ['54be66f0-2ec3-40cf-a4df-64d4c10cd9f5']: '1',
                },
              });
              this.writeZero();
            }}
          />
        </View>
      </View>
    );
  }
}
