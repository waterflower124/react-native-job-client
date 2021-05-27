import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Text
} from "react-native";
import { icons, fonts } from "../assets";
import { colors } from "../constants";
import { strings } from "../strings";
import { hScale, vScale, fScale, sWidth } from "step-scale";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from "step-react-redux";

import { CommonActions } from "@react-navigation/native";

class TabBarComponent extends Component {
  render() {
    const {
      mainContainer,
      background,
      textStyle,
      buttonStyle,
      buttonContainer,
      contentContainerStyle
    } = styles;
    const { navigation, user, descriptors, state } = this.props;

    const focusedOptios = descriptors[state.routes[state.index].key].options;
    if(focusedOptios.tabBarVisible === false) {
      return null;
    }
    
    return (
      <SafeAreaView style={mainContainer} edges = {['right', 'bottom', 'left']} mode = "margin">
        <View style={background} />
        <FlatList
          data={tabs}
          horizontal
          extraData={this.props}
          contentContainerStyle={contentContainerStyle}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const isActive = state.index == index;
            const { icon, screen, name, iconStyle } = item;
            
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate(state.routes[index])
                }}
                activeOpacity={1}
                style={buttonContainer}
              >
                <View style={buttonStyle}>
                  <Image
                    resizeMode={"contain"}
                    source={icon}
                    style={[
                      iconStyle,
                      isActive && { tintColor: colors.second }
                    ]}
                  />
                </View>
                <Text numberOfLines={1} style={textStyle}>
                  {name()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: sWidth,
    height: hScale(82.6),
    position: "absolute",
    bottom: 0,
  },
  background: {
    width: sWidth,
    height: vScale(61),
    position: "absolute",
    bottom: 0
  },
  buttonStyle: {
    width: hScale(42.7),
    height: hScale(42.7),
    marginTop: vScale(10),
    marginBottom: vScale(6.1),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hScale(21.35),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.22)",
    shadowOffset: {
      width: 0,
      height: vScale(3)
    },
    shadowRadius: hScale(5),
    shadowOpacity: 1,
    elevation: 10
  },
  textStyle: {
    fontSize: fScale(11),
    color: colors.mainText,
    fontFamily: fonts.arial
  },
  buttonContainer: {
    width: hScale(60),
    height: vScale(60),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: hScale(12),
  },
  contentContainerStyle: {
    width: sWidth,
    justifyContent: "center",
  }
});

const tabs = [
  {
    screen: "ServicesTab",
    name: () => strings.Services,
    icon: icons.service,
    iconStyle: {
      width: hScale(14.7),
      height: hScale(14.7),
      tintColor: colors.tab_icon
    }
  },
  {
    screen: "RequestTab",
    name: () => strings.requests,
    icon: icons.clientdrawer,
    iconStyle: {
      width: hScale(11.7),
      height: vScale(13.2),
      tintColor: colors.tab_icon
    }
  },
  {
    screen: "ChatTab",
    name: () => strings.chat,
    icon: icons.chatImage,
    iconStyle: {
      width: hScale(12.2),
      height: hScale(12.2),
      tintColor: colors.tab_icon
    }
  },
  // {
  //   screen: "MyProfileTab",
  //   name: () => strings.myprofile,
  //   icon: icons.myprofile,
  //   iconStyle: {
  //     width: hScale(12.2),
  //     height: hScale(12.2),
  //     tintColor: colors.tab_icon
  //   }
  // },
  {
    screen: "NotificationsTab",
    name: () => strings.notification,
    icon: icons.notify,
    iconStyle: {
      width: hScale(12.5),
      height: vScale(15.6),
      tintColor: colors.tab_icon
    }
  }
];

export const TabBar = connect(TabBarComponent);
