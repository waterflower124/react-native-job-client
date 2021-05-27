import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { defaultNavigationOptions, whiteHeaderOptions } from './options'
import { BackButton } from "../components";
import { strings } from "../strings";

import { EditClientProfile } from "../screens/EditClientProfile";
import { Messages } from "../screens/Messages";
import { Chat } from "../screens/Chat";

const Stack = createStackNavigator();

export default class MyProfileTab extends Component {

  constructor(props) {
      super(props);
      
  }

    render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "EditClientProfile" screenOptions = {defaultNavigationOptions}>
                <Stack.Screen name = "EditClientProfile" component = {EditClientProfile}/>
                <Stack.Screen name = "Messages" component = {Messages}/>
                <Stack.Screen name = "Chat" component = {Chat}/>
            </Stack.Navigator>
        );
    }
}

