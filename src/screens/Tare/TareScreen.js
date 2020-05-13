import strings from './strings';
import styles from './styles';
import React, {Component} from 'react';
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
} from 'react-native';
import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

import Spinner from 'react-native-spinkit'; // for showing a spinner when loading something

function getId({route}) {
  const {itemId} = route.params;
  this.connected_peripheral.setState(itemId);
}

export default class TareScreen extends Component {
  constructor() {
    super();
    this.state = {
      is_scanning: false, // whether the app is currently scanning for peripherals or not
      peripherals: null, // the peripherals detected
      connected_peripheral: getId, // the currently connected peripheral
      values: {},
    };

    this.sensors = {
      '00002a1b-0000-1000-8000-00805f9b34fb': 'Battery Level State',
      '00002a1a-0000-1000-8000-00805f9b34fb': 'Battery Power Source',
      '247e76c8-9dd4-412d-a75b-5244ad4cb8f4': 'RSSI Signal Strength',
    };
  }

  static navigationOptions = {
    drawerLabel: 'Device',
  };

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
              <Text style={styles.weigh_counter}>95KG</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
