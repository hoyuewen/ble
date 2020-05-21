import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomButton = (props) => {
	return (
		<TouchableOpacity
			onPress={props.onPress}
			title={props.title}
			style={styles.outsideButton}
		>
			<View style={styles.button}>
				<Text style={styles.buttonText}>{props.title}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	outsideButton: {
		paddingVertical: 5,
		paddingHorizontal: 5,
	},
	button: {
		backgroundColor: "#6C9A55",
		paddingVertical: 12,
		paddingHorizontal: 5,
		borderRadius: 10,
	},
	buttonText: {
		color: "white",
		fontSize: 18,
		textAlign: "center",
		paddingHorizontal: 5,
	},
});

export default CustomButton;
