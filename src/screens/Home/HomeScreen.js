import strings from './strings';
import styles from './styles';
import React, {Component} from 'react';
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
import {createStackNavigator} from '@react-navigation/stack';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

import Spinner from 'react-native-spinkit'; // for showing a spinner when loading something

export async function requestLocationCoarsePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'StrongBo needs access to your location ' + 'for diagnosing devices.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location sensing');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

if (Platform.OS === 'android' && Platform.Version >= 23) {
  PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ).then(result => {
    if (!result) {
      PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (!result) {
          Alert.alert(
            'You need to give access to coarse location to use this app.',
          );
        }
      });
    }
  });
}

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      is_scanning: false, // whether the app is currently scanning for peripherals or not
      peripherals: null, // the peripherals detected
      connected_peripheral: null, // the currently connected peripheral
      values: {},
    };

    this.sensors = {
      '00002a1b-0000-1000-8000-00805f9b34fb': 'Battery Level State',
      '00002a1a-0000-1000-8000-00805f9b34fb': 'Battery Power Source',
      '247e76c8-9dd4-412d-a75b-5244ad4cb8f4': 'RSSI Signal Strength',
    };

    this.peripherals = []; // temporary storage for the detected peripherals

    this.startScan = this.startScan.bind(this); // function for scanning for peripherals
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  };

  serviceUUID() {
    return '5c1b9a0d-b5be-4a40-8f7a-66b36d0a5176';
  }

  notifyUUID(num) {
    return num;
  }

  // next: add code componentWillMount()

  UNSAFE_componentWillMount() {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth is already enabled');
      })
      .catch(error => {
        Alert.alert('You need to enable bluetooth to use this app.');
      });

    // initialize the BLE module
    BleManager.start({showAlert: false}).then(() => {
      console.log('Module initialized');
    });

    // next: add code for checking coarse location
  }

  componentDidMount() {
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        var peripherals = this.peripherals; // get the peripherals
        // check if the peripheral already exists
        var el = peripherals.filter(el => {
          return el.id === peripheral.id;
        });
        if (!el.length) {
          peripherals.push({
            id: peripheral.id, // mac address of the peripheral
            name: peripheral.name, // descriptive name given to the peripheral
          });
          this.peripherals = peripherals; // update the array of peripherals
        }
      },
    );
    // next: add code for listening for when the peripheral scan has stopped
    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      console.log(this.peripherals);
      console.log('scan stopped');
      if (this.peripherals.length === 0) {
        Alert.alert('Nothing found', 'Sorry, no peripherals were found');
      }
      this.setState({
        is_scanning: false,
        peripherals: this.peripherals,
      });
    });
  }

  startScan() {
    this.peripherals = [];
    this.setState({
      is_scanning: true,
    });

    BleManager.scan([], 2).then(() => {
      console.log('scan started');
    });
  }

  renderItem({item}) {
    if (item.full_name) {
      return (
        <View style={styles.list_item} key={item.id}>
          <Text style={styles.list_item_text}>{item.full_name}</Text>
          <Text style={styles.list_item_text}>{item.time_entered}</Text>
        </View>
      );
    }

    if (item.name === null) {
      return (
        <View style={styles.list_item} key={item.id}>
          <Text style={styles.list_item_text}>{item.id}</Text>
          <Button
            title="Connect"
            color="#1491ee"
            style={styles.list_item_button}
            onPress={this.props.navigation.navigate('Device', {
              connected_peripheral: item.id,
            })}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.list_item} key={item.id}>
          <Text style={styles.list_item_text}>{item.name}</Text>
          <Button
            title="Connect"
            color="#1491ee"
            style={styles.list_item_button}
            onPress={this.props.navigation.navigate('Device', {
              connected_peripheral: item.id,
            })}
          />
        </View>
      );
    }
  }

  connect(peripheral_id) {
    console.log('Trying to connect to peripheral');
    BleManager.connect(peripheral_id)
      .then(() => {
        this.setState({
          connected_peripheral: peripheral_id,
        });

        Alert.alert(
          'Connected!',
          'You are now connected to the peripheral.' + peripheral_id,
        );
        console.log('Connected');
        // retrieve the services advertised by this peripheral
        BleManager.retrieveServices(peripheral_id).then(peripheralInfo => {
          console.log('Peripheral info:', peripheralInfo);
        });
      })
      .catch(error => {
        Alert.alert('Err..', 'Something went wrong while trying to connect.');
        BleManager.disconnect(peripheral_id);
      });
  }

  disconnect(device) {
    console.log('Trying to disconnect from peripheral');
    BleManager.disconnect(device)
      .then(() => {
        // Success code
        console.log('Disconnected');
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
          <View style={styles.app_title}>
            <Text style={styles.header_text}>BLE Diagnostics Application</Text>
          </View>
          <View style={styles.header_button_container}>
            {!this.state.connected_peripheral && (
              <Button title="Scan" color="#1491ee" onPress={this.startScan} />
            )}
          </View>
        </View>

        <View style={styles.body}>
          <Spinner
            size={50}
            type={'WanderingCubes'}
            color={'#6097FC'}
            isVisible={this.state.is_scanning}
            style={styles.spinner}
          />
          {!this.state.connected_peripheral && (
            <FlatList
              data={this.state.peripherals}
              renderItem={this.renderItem.bind(this)}
            />
          )}
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('pusherBLEAttendance', () => HomeScreen);
