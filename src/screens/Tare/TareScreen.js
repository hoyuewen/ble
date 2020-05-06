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
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

import Spinner from 'react-native-spinkit'; // for showing a spinner when loading something

export default class TareScreen extends Component {}
