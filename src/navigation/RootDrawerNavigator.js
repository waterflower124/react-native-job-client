
import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultNavigationOptions } from "./options";
import { I18nManager } from 'react-native'
import { drawerOptions } from "./options";
import { SideMenu } from "../components";
import { createDrawerNavigator } from '@react-navigation/drawer';


import tabNavigation from "./TabNavigator";
import YourRequests from "./RequestTab";
import Notification from "./NotificationsTab";
import EditClientProfile from "./MyProfileTab";

import { vScale, hScale, } from "step-scale";

const { isRTL } = I18nManager;

const Drawer = createDrawerNavigator();

export default class rootDrawerNavigator extends Component {

    constructor(props) {
        super(props);
        
    }
  
    render() {
        return (
            <Drawer.Navigator drawerContent = {(props) => <SideMenu {...props} />} drawerPosition =  {isRTL ? "left" : "right"} drawerStyle = {{drawerBackgroundColor: "transparent", width: hScale(243.1),}}>
                <Drawer.Screen name = "NewTasks" component = {tabNavigation}/>
                <Drawer.Screen name = "Home" component = {tabNavigation}/>
                <Drawer.Screen name = "YourRequests" component = {YourRequests}/>
                <Drawer.Screen name = "Notification" component = {Notification}/>
                <Drawer.Screen name = "EditClientProfile" component = {EditClientProfile}/>
            </Drawer.Navigator>
        );
    }
}

