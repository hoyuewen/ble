import strings from "./strings";
import styles from "./styles";
import React, { Component } from "react";
import { Buffer } from "buffer";
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
			"a4cabb0e-1792-4d88-ada2-f92477bb1c8e": "Battery State",
			"8d3b3544-36ba-4d8b-a156-da0956dab884": "Battery Power Source",
			"247e76c8-9dd4-412d-a75b-5244ad4cb8f4": "RSSI Signal Strength",
			"f2c51a3b-f7d2-4998-999c-e9327f7ea987": "Battery Level",
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
			BleManager.retrieveServices(id).then((peripheralInfo) => {
				// Success code
				console.log("Peripheral info:", peripheralInfo);
			});
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
								`id: ${id}, val: ${value}, data: ${
									value[0]
								}, service: ${service}, peripheral: ${peripheral}, Characteristic: ${characteristic}`
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
						`Could not get characteristics value for ${characteristicN}`
					);
					// BleManager.disconnect(device);
				});
		}
	}

	readCharacteristic(characteristic) {
		console.log(characteristic);
		BleManager.read(
			this.state.connected_peripheral,
			this.serviceUUID(),
			characteristic
		)
			.then((readData) => {
				// Success code
				// console.log("Read before buffer: " + readData);
				// const buffer = bytesToString(readData);
				const buffer = Buffer.from(readData);
				console.log("Read before buffer: " + buffer);
				const sensorData = buffer.readUInt8(0, true);
				console.log("Read after buffer: " + sensorData);
				// this.setState({
				// 	values: {
				// 		...this.state.values,
				// 		[readCharacteristic]: sensorData,
				// 	},
				// });
				// console.log(this.state.values);
				this.updateValue(characteristic, sensorData);
				// return sensorData;
			})
			.catch((error) => {
				// Failure code
				console.log(error);
			});
	}

	async readSensors() {
		for (const id in this.sensors) {
			await BleManager.read(
				this.state.connected_peripheral,
				this.serviceUUID(),
				id
			)
				.then((readData) => {
					// Success code
					// console.log("Read before buffer: " + readData);
					// const buffer = bytesToString(readData);
					const buffer = Buffer.from(readData);
					console.log("Read before buffer: " + buffer);
					const sensorData = buffer.readUInt8(0, true);
					console.log("Read after buffer: " + sensorData);
					// this.setState({
					// 	values: {
					// 		...this.state.values,
					// 		[readCharacteristic]: sensorData,
					// 	},
					// });
					// console.log(this.state.values);
					this.updateValue(id, sensorData);
					// return sensorData;
				})
				.catch((error) => {
					// Failure code
					console.log(error);
				});
		}
	}

	updateValue(key, value) {
		console.log(value);
		var readableData;
		if (key === "a4cabb0e-1792-4d88-ada2-f92477bb1c8e") {
			console.log(key);
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
			} else if (value === "2") {
				console.log("Charging");
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
				readableData = "Signal Unknown";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 1) {
				readableData = "Very Poor";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 2) {
				readableData = "Poor";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 3) {
				readableData = "Fair";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 4) {
				readableData = "Strong";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			} else if (value === 5) {
				readableData = "Very Strong";
				this.setState({
					values: { ...this.state.values, [key]: readableData },
				});
			}
		} else if (key === "8d3b3544-36ba-4d8b-a156-da0956dab884") {
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
		} else if (key === "f2c51a3b-f7d2-4998-999c-e9327f7ea987") {
			console.log(value);
			this.setState({
				values: { ...this.state.values, [key]: `${value}%` },
			});
			// if (value === 0) {
			// 	readableData = "Unknown";
			// 	this.setState({
			// 		values: { ...this.state.values, [key]: readableData },
			// 	});
			// } else if (value === 1) {
			// 	readableData = "Very Low";
			// 	this.setState({
			// 		values: { ...this.state.values, [key]: readableData },
			// 	});
			// } else if (value === 2) {
			// 	readableData = "Power Source USB Host";
			// 	this.setState({
			// 		values: { ...this.state.values, [key]: readableData },
			// 	});
			// } else if (value === 3) {
			// 	readableData = "Power Source USB Adapter";
			// 	this.setState({
			// 		values: { ...this.state.values, [key]: readableData },
			// 	});
			// } else if (value === 4) {
			// 	readableData = "Power Source USB OTG";
			// 	this.setState({
			// 		values: { ...this.state.values, [key]: readableData },
			// 	});
			// } else if (value === 5) {
			// 	readableData = "Power Source Battery";
			// 	this.setState({
			// 		values: { ...this.state.values, [key]: readableData },
			// 	});
			// }
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
				<View style={styles.buttonContainer}>
					<View style={styles.button}>
						<CustomButton
							title="Update Data"
							onPress={() => {
								this.readSensors();
								// setTimeout(
								// 	() =>
								// 		this.readCharacteristic(
								// 			"a4cabb0e-1792-4d88-ada2-f92477bb1c8e"
								// 		),
								// 	0
								// ),
								// 	setTimeout(
								// 		() =>
								// 			this.readCharacteristic(
								// 				"247e76c8-9dd4-412d-a75b-5244ad4cb8f4"
								// 			),
								// 		1000
								// 	),
								// 	setTimeout(
								// 		() =>
								// 			this.readCharacteristic(
								// 				"8d3b3544-36ba-4d8b-a156-da0956dab884"
								// 			),
								// 		1000
								// 	),
								// 	setTimeout(
								// 		() =>
								// 			this.readCharacteristic(
								// 				"f2c51a3b-f7d2-4998-999c-e9327f7ea987"
								// 			),
								// 		1000
								// 	);
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
