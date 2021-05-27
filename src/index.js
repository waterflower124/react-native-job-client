import React, { Component } from "react";
import Navigation from "./navigation";
import StepCrashCatcher from "step-crash-catcher";
import RootProvider from "step-react-redux";
import Step_API_Client from "step-api-client";
import { FallbackComponent } from "./components";
import OneSignal from 'react-native-onesignal'; 
import global from './global/global';
import { EventRegister } from 'react-native-event-listeners';
import * as DrawerNavigation from './global/ReactNavigation';
import VersionCheck from 'react-native-version-check';

class App extends Component {
  constructor(props) {
    super(props);
    Step_API_Client.baseURL = "";
    Step_API_Client.defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    
    
    OneSignal.init("");
    
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    OneSignal.inFocusDisplaying(2);
  }

  

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);

    var noti_data = notification.payload.additionalData;
    if(noti_data) {
      if(noti_data.type == "offer_created") {
        EventRegister.emit(global.NOTI_OFFER_CREATED, noti_data.id);
      } else if(noti_data.type == "order_done") {
        EventRegister.emit(global.NOTI_TASK_DONE, '');
      } else if(noti_data.type == "order_review") {
        EventRegister.emit(global.NOTI_TASK_REVIEW, '');
      } else if(noti_data.type == "order_paynow") {
        EventRegister.emit(global.NOTI_TASK_PAYNOW, '');
      } else if(noti_data.type == "request_reset") {
        EventRegister.emit(global.NOTI_REQUEST_RESET, noti_data.id);
      } else {
        EventRegister.emit(global.NOTI_OTHERS, '');
      }
      
    }
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    if(DrawerNavigation.getRootState()) {
      if(DrawerNavigation.getCurrentRoute() == "Intro") {
        return;
      }
      var notification_type = "";
      if(openResult.notification.payload.additionalData != null) {
        notification_type = openResult.notification.payload.additionalData.type;
      }
      if(notification_type == "offer_created" || notification_type == "request_reset") {
        if(DrawerNavigation.getCurrentRoute() == "RequestDetails") {
          EventRegister.emit(global.NOTI_OFFER_CREATED_OPEN, openResult.notification.payload.additionalData.id);
        } else {
          DrawerNavigation.navigate('rootDrawerNavigator', {screen: 'Home', params: {screen: 'RequestTab', params: {screen: 'RequestDetails', params: {id: openResult.notification.payload.additionalData.id}}}});
        }
      } else if(notification_type == "order_done") {
        DrawerNavigation.navigate('rootDrawerNavigator', {screen: 'Home', params: {screen: 'RequestTab', params: {screen: 'YourRequests'}}});
      } else if(notification_type == "order_review") {
        DrawerNavigation.navigate('rootDrawerNavigator', {screen: 'Home', params: {screen: 'NotificationsTab', params: {screen: 'Notification'}}});
      } else if(notification_type == "order_paynow") {
        DrawerNavigation.navigate('rootDrawerNavigator', {screen: 'Home', params: {screen: 'NotificationsTab', params: {screen: 'Notification'}}});
      } else if(notification_type == "notification_created") {
        if(DrawerNavigation.getCurrentRoute() == "Chat" || DrawerNavigation.getCurrentRoute() == "Messages") {
          EventRegister.emit(global.NOTI_CHAT_OPEN, {task_id: openResult.notification.payload.additionalData.id, receiver_id: openResult.notification.payload.additionalData.sender});
        } else {
          global.GOTO_CHAT = true;
          global.GOTO_CHAT_TASK_ID = openResult.notification.payload.additionalData.id;
          global.GOTO_CHAT_RECEIVER_ID = openResult.notification.payload.additionalData.sender;
          DrawerNavigation.navigate('rootDrawerNavigator', {screen: 'Home', params: {screen: 'ChatTab', params: {screen: 'Messages', params: {task_id: openResult.notification.payload.additionalData.id, receiver_id: openResult.notification.payload.additionalData.sender}}}});
        }
      }
    }
  }

  onIds(device) {
    console.log('Device info11111: ', device);
    global.deviceId = device.userId;
  }

  render() {
    return (
      <RootProvider>
        <Navigation/>
      </RootProvider>
    );
  }
}
export default () => (
  <StepCrashCatcher AppRoot={App} FallbackComponent={FallbackComponent} />
);
