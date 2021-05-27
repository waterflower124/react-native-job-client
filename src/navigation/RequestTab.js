import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { defaultNavigationOptions,whiteHeaderOptions } from "./options";
import { BackButton } from "../components/";
import { strings } from "../strings";

import { YourRequests} from "../screens/YourRequests";
import { RequestDetails } from "../screens/RequestDetails";
import { Messages } from "../screens/Messages";
import { Chat } from "../screens/Chat";

const Stack = createStackNavigator();

export default class RequestTab extends Component {

  constructor(props) {
      super(props);
      
  }

  render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "YourRequests">
                <Stack.Screen name = "YourRequests" component = {YourRequests} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "RequestDetails" component = {RequestDetails} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "Messages" component = {Messages} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "Chat" component = {Chat} options = {defaultNavigationOptions}/>
            </Stack.Navigator>
      );
  }
}

