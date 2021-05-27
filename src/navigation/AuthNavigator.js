
import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {Intro} from "../screens/Intro";
import {Login} from "../screens/Login";
import {EnterPhone} from "../screens/EnterPhone";
import {SignUp} from "../screens/SignUp";
import {VerifyPhone} from "../screens/VerifyPhone";
import {NewPassword} from "../screens/NewPassword";

import { defaultNavigationOptions } from "./options";
import { BackButton, Button, Container, TextField } from "../components";

const Stack = createStackNavigator();


export default class authNavigator extends Component {

  constructor(props) {
      super(props);
      
  }

  render() {
      return (
            <Stack.Navigator headerMode = "screen" screenOptions = {defaultNavigationOptions}>
                <Stack.Screen name = "Intro" component = {Intro} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "Login" component = {Login} options = { ({navigation, route}) => ({headerLeft: () => (<BackButton onPress={() => navigation.goBack()}/>)})}/>
                <Stack.Screen name = "EnterPhone" component = {EnterPhone} options = { ({navigation, route}) => ({headerLeft: () => (<BackButton onPress={() => navigation.goBack()}/>)})}/>
                <Stack.Screen name = "SignUp" component = {SignUp} options = { ({navigation, route}) => ({headerLeft: () => (<BackButton onPress={() => navigation.goBack()}/>)})}/>
                <Stack.Screen name = "VerifyPhone" component = {VerifyPhone} options = { ({navigation, route}) => ({headerLeft: () => (<BackButton onPress={() => navigation.goBack()}/>)})}/>
                <Stack.Screen name = "NewPassword" component = {NewPassword} options = { ({navigation, route}) => ({headerLeft: () => (<BackButton onPress={() => navigation.goBack()}/>)})}/>
            </Stack.Navigator>
      );
  }
}
