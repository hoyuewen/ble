import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	container: {
		flex: 12,
		alignSelf: "stretch",
		backgroundColor: "#F5FCFF",
	},
	button: {
		flex: 1,
		justifyContent: "center",
		paddingRight: 5,
	},
	read_values: {
		textAlign: "center",
		fontSize: 25,
	},
	body_text: {
		textAlign: "center",
		fontSize: 25,
		paddingVertical: 25,
	},
	cal_status: {
		flex: 2,
		borderColor: "#668657",
		borderWidth: 5,
		borderRadius: 15,
		margin: 15,
	},
	body: {
		flex: 4,
	},
	footer: {
		padding: 10,
	},
});

export default styles;
