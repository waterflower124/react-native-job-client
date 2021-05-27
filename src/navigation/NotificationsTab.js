import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';

import { defaultNavigationOptions, whiteHeaderOptions } from "./options";
import { BackButton } from "../components";
import { strings } from "../strings";

// import { AddOffer } from "../screens/AddOffer";
import { Notification } from "../screens/Notification";
import { TaskDetails } from "../screens/TaskDetails";
import { Chat } from "../screens/Chat";
import { Messages } from "../screens/Messages";
import { PaymentWebview } from "../screens/PaymentWebview";
import { RequestDetails } from "../screens/RequestDetails";

const Stack = createStackNavigator();

export default class NotificationsTab extends Component {

  constructor(props) {
      super(props);
      
  }

    render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "Notification">
                <Stack.Screen name = "Notification" component = {Notification} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "TaskDetails" component = {TaskDetails} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "Chat" component = {Chat} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "Messages" component = {Messages} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "PaymentWebview" component = {PaymentWebview} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "RequestDetails" component = {RequestDetails} options = {defaultNavigationOptions}/>
            </Stack.Navigator>
        );
    }
}
