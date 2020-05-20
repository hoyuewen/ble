import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomButton = (props) => {
	return (
		<TouchableOpacity onPress={props.onPress}>
			<View style={{ ...styles.button, ...props.style }}>
				<Text style={{ ...styles.buttonText, ...props.textStyling }}>
					{props.children}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#6C9A55",
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 25,
	},
	buttonText: {
		color: "white",
		fontSize: 18,
	},
});

export default CustomButton;
