import React, { Component } from "react";
import { View } from "react-native";
import { Home } from "../screens/Home";
import { NewRequest } from "../screens/NewRequest";
import { Chat} from "../screens/Chat";
import { Messages } from "../screens/Messages";
import { defaultNavigationOptions,whiteHeaderOptions } from "./options";
import { BackButton } from "../components/";
import { strings } from "../strings";
import { createStackNavigator } from '@react-navigation/stack';

import {
  ChatIcon,
  Container,
  DrawerIcon,
  ServiceCard,
  EmptyScreen,
  HeaderLogo
} from "../components";


const Stack = createStackNavigator();

export default class ServicesTab extends Component {

    constructor(props) {
        super(props);
        
    }

    UNSAFE_componentWillMount() {
        const { user } = this.props;
    }

    render() {
        return (
            <Stack.Navigator initialRouteName = "Home" screenOptions = {defaultNavigationOptions}>
                <Stack.Screen name = "Home" component = {Home} />
                <Stack.Screen name = "NewRequest" component = {NewRequest}/>
                <Stack.Screen name = "Chat" component = {Chat}/>
                <Stack.Screen name = "Messages" component = {Messages}/>
            </Stack.Navigator>
        );
    }
}
