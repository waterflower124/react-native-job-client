
import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultNavigationOptions } from "./options";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import authNavigator from "./AuthNavigator";
import rootDrawerNavigator from "./RootDrawerNavigator";

import {navigationRef} from '../global/ReactNavigation';

const Stack = createStackNavigator();


export default class AppNavigator extends Component {

  constructor(props) {
      super(props);
      
  }

  render() {
      return (
          <NavigationContainer ref = {navigationRef}>
                <Stack.Navigator headerMode = "none" screenOptions = {{gestureEnabled: false}}>
                    <Stack.Screen name = "authNavigator" component = {authNavigator}/>
                    <Stack.Screen name = "rootDrawerNavigator" component = {rootDrawerNavigator}/>
                </Stack.Navigator>
          </NavigationContainer>
      );
  }
}
