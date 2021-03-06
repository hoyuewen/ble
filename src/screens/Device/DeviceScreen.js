import strings from "./strings";
import styles from "./styles";
import React, { Component } from "react";
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
} from "react-native";
import { BackHandler } from "react-native";
import CustomButton from "../../components/CustomButton";

import BleManager from "react-native-ble-manager"; // for talking to BLE peripherals
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

import Spinner from "react-native-spinkit"; // for showing a spinner when loading something

export default class DeviceScreen extends Component {
	constructor(props) {
		super();
		this.state = {
			is_scanning: false, // whether the app is currently scanning for peripherals or not
			peripherals: null, // the peripherals detected
			connected_peripheral: props.route.params.connected_peripheral, // the currently connected peripheral
			values: {},
		};

		this.sensors = {
			"00002a1b-0000-1000-8000-00805f9b34fb": "Battery Level State",
			"00002a1a-0000-1000-8000-00805f9b34fb": "Battery Power Source",
			"247e76c8-9dd4-412d-a75b-5244ad4cb8f4": "RSSI Signal Strength",
		};
	}

	static navigationOptions = {
		drawerLabel: "Device",
	};

	// componentDidMount() {
	// 	this.setupNotifications(this.state.connected_peripheral);
	// }

	disconnect(device) {
		console.log("Trying to disconnect from peripheral");
		BleManager.disconnect(device)
			.then(() => {
				// Success code
				console.log("Disconnected");
			})
			.catch((error) => {
				// Failure code
				console.log(error);
			});
	}

	serviceUUID() {
		return "5c1b9a0d-b5be-4a40-8f7a-66b36d0a5176";
	}

	notifyUUID(num) {
		return num;
	}

	async setupNotifications(device) {
		const service = this.serviceUUID();
		for (const id in this.sensors) {
			//console.log(id);
			const characteristicN = this.notifyUUID(id);
			console.log("characteristic N: " + characteristicN);
			await BleManager.startNotification(device, service, characteristicN)
				.then(() => {
					// Add event listener
					console.log("Notification started");
					bleManagerEmitter.addListener(
						"BleManagerDidUpdateValueForCharacteristic",
						({ value, peripheral, characteristic, service }) => {
							//var string = new TextDecoder('utf-8').decode(value);
							// const data = bytesToString(value);
							console.log(
								"id: " +
									id +
									", val: " +
									value +
									", data: " +
									value[0] +
									", service: " +
									service +
									"peripheral: " +
									peripheral +
									", Characteristic: " +
									characteristic
							);
							const data = value[0];
							// console.log(
							// 	`Received ${data} for characteristic ${characteristic}`
							// );
							// console.log(typeof data);
							this.updateValue(characteristic, data);
							// console.log(this.state.values);
						}
					);
				})
				.catch((error) => {
					Alert.alert(
						"Err..",
						"Could not get characteristics value for ",
						characteristicN
					);
					BleManager.disconnect(device);
				});
		}
	}

	updateValue(key, value) {
		console.log(key);
		console.log(value);
		var readableData;
		if (key === "00002a1b-0000-1000-8000-00805f9b34fb") {
			if (value === 0) {
				readableData = "Battery State Unknown";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
				// this.state.values[key] = readableData;
			} else if (value === 1) {
				readableData = "Battery State Not Charging";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
				// this.state.values[key] = readableData;
			} else if (value === 2) {
				readableData = "Battery State Charging";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
				// this.state.values[key] = readableData;
			} else if (value === 3) {
				readableData = "Battery State Charged";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
				// this.state.values[key] = readableData;
			} else if (value === 4) {
				readableData = "Battery State Discharging";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
				// this.state.values[key] = readableData;
			} else if (value === 5) {
				readableData = "Battery State Fault";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
				// this.state.values[key] = readableData;
			} else if (value === 6) {
				readableData = "Battery State Disconnected";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			}
		} else if (key === "247e76c8-9dd4-412d-a75b-5244ad4cb8f4") {
			if (value === 0) {
				readableData = "RSSI Signal Unknown";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 1) {
				readableData = "Signal Strength Very Poor";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 2) {
				readableData = "Signal Strength Poor";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 3) {
				readableData = "Signal Strength Fair";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 4) {
				readableData = "Signal Strength Strong";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 5) {
				readableData = "Signal Strength Very Strong";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			}
		} else if (key === "00002a1a-0000-1000-8000-00805f9b34fb") {
			if (value === 0) {
				readableData = "Power Source Unknown";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 1) {
				readableData = "Power Source VIN";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 2) {
				readableData = "Power Source USB Host";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 3) {
				readableData = "Power Source USB Adapter";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 4) {
				readableData = "Power Source USB OTG";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 5) {
				readableData = "Power Source Battery";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			}
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.app_title}>
						<Text style={styles.header_text}>
							BLE Diagnostics Application
						</Text>
					</View>
				</View>
				<View style={styles.body}>
					<Text>{this.state.info}</Text>
					{Object.keys(this.sensors).map((key) => {
						return (
							// console.log("this.state.values"),
							console.log(
								"this.state.values : " + this.state.values[key]
							),
							(
								<Text style={styles.text} key={key}>
									{this.sensors[key] +
										": " +
										(this.state.values[key] || "-")}
								</Text>
							)
						);
					})}
				</View>
				{/* <FlatList
					data={this.state.values}
					renderItem={({ item }) => {
						return <Text style={styles.textStyle}>{item.key}</Text>;
					}}
				/> */}
				<View style={styles.buttonContainer}>
					<View style={styles.button}>
						<CustomButton
							title="Update Data"
							onPress={() => {
								this.setupNotifications(
									this.state.connected_peripheral
								);
							}}
						/>
					</View>
					<View style={styles.button}>
						<CustomButton
							title="Go to Calibration Page"
							onPress={() => {
								this.props.navigation.navigate("Calibration", {
									connected_peripheral: this.state
										.connected_peripheral,
								});
							}}
						/>
					</View>
					<View style={styles.button}>
						<CustomButton
							title="Disconnect"
							onPress={() => {
								this.disconnect(
									this.state.connected_peripheral
								);
								this.props.navigation.navigate("Home");
							}}
						/>
					</View>
				</View>
			</View>
		);
	}
}
