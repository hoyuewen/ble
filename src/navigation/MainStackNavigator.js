import HomeScreen from '../screens/Home/HomeScreen';
import DeviceScreen from '../screens/Device/DeviceScreen';
import TareScreen from '../screens/Tare/TareScreen';
import CalibrationScreen from '../screens/Calibration/CalibrationScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';

const stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName="Home">
        <stack.Screen name="Home" component={HomeScreen} />
        <stack.Screen name="Device" component={DeviceScreen} />
        <stack.Screen name="Tare" component={TareScreen} />
        <stack.Screen name="Calibration" component={CalibrationScreen} />
      </stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator();
