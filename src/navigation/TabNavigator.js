import React, { Component } from "react";
import { TabBar } from "../components";
import NotificationsTab from "./NotificationsTab";
import ServicesTab from "./ServicesTab";
import RequestTab from "./RequestTab";
import MyProfileTab from "./MyProfileTab";
import ChatTab from "./ChatTab";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default class tabNavigation extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            
        }
    }

    render() {
        const user = this.props.route.params && this.props.route.params.user;

        return (
            <Tab.Navigator tabBar = {(props) => <TabBar {...props}/>} initialRouteName = {"ServicesTab"}>
                <Tab.Screen name = "ServicesTab" component = {ServicesTab}
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                />
                <Tab.Screen name = "RequestTab" component = {RequestTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            routes[0].params.refreshRequests();
                        },
                    })}
                />
                <Tab.Screen name = "ChatTab" component = {ChatTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            // routes[0].params.refreshChatList();
                            route[0].params({task_id: null})
                        },
                    })}
                />
                {/* <Tab.Screen name = "MyProfileTab" component = {MyProfileTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            routes[0].params.refreshOrders();
                        },
                    })}
                /> */}
                <Tab.Screen name = "NotificationsTab" component = {NotificationsTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            routes[0].params.refreshNotifications();
                        },
                    })}
                />
            </Tab.Navigator>
        );
    }
}

// const isTabBarVisible = (route) =>
//   route.state.index == 0;
