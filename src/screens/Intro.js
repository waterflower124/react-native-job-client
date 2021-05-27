import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Linking,
  Alert
} from "react-native";
import { fScale, hScale, vScale, sWidth } from "step-scale";
// import StepOneSignal from "step-onesignal";
import { images, fonts, icons } from "../assets";
import { colors } from "../constants";
import { strings } from "../strings";
import { Button } from "../components";
import { connect } from "step-react-redux";
import Step_API_Client from "step-api-client";
import { CrashCatcherMethods } from "step-crash-catcher";
import { actions, languageSwitcher } from "../helpers";
import AsyncStorage from '@react-native-community/async-storage';
import VersionCheck from 'react-native-version-check';

class IntroScreen extends Component {
  state = { screenLoading: true, langCode: null };

  static navigationOptions = () => ({
    headerStyle: {
      height: 0
    }
  });

  async componentDidMount() {
    const { navigation } = this.props;
    const user_str = await AsyncStorage.getItem("user");
    var user = null;
    if(user_str != null && user_str != "") {
      user = JSON.parse(user_str);
      
    } 
    

    Step_API_Client.onUnauthorized = () => {
      actions.removeUserData();
      navigation.navigate("Intro");
    };
    const langCode = await languageSwitcher.getCurrentLanguageCode();
    await languageSwitcher.switchTo(langCode);
    Step_API_Client.appendHeader("lang", langCode);

    await this.loadData();

    let updateNeeded = await VersionCheck.needUpdate();
    console.log(JSON.stringify(updateNeeded))
    if(updateNeeded && updateNeeded.isNeeded) {
      Alert.alert(strings.pls_update, strings.update_message,
        [
          {
            text: strings.ok,
            onPress: async() => {
              Linking.openURL(updateNeeded.storeUrl);
            }
          }
        ]
      );
      actions.removeUserData();
      this.setState({ screenLoading: false });
      return;
    }

    if(user == null) {
      this.setState({ screenLoading: false });
      return;
    }

    const { data, loggedIn } = user;
    const accessToken = await AsyncStorage.getItem("userToken");

    if (loggedIn) {
      try {
        
        Step_API_Client.appendHeader("Authorization", "Bearer " + accessToken);

        this.setState({ langCode });
        try {
          await actions.updateUser({ lang: langCode });
        } catch (error) {
          console.log("update profile error ", error.message)
        }

        const isEmployee = data.type == "employee";
        
        if (isEmployee) {
          await actions.refreshWalletBalance();
        }

        actions.setUserData({
          data: data,
          userToken: accessToken
        });

        navigation.navigate("rootDrawerNavigator", {screen: 'Home', params: {user: data}});
        // StepOneSignal.onOpened = ()=> {
        //   navigation.navigate("Notification")
        // }
      } catch (error) {
        console.log("main catch::" + error.message)
      }
    }
    this.setState({ screenLoading: false });
  }

  async loadData() {
    try {
      const { refreshBanks, refreshCities, refreshCategories } = actions;
      await refreshCategories();
      await refreshCities();
      await refreshBanks();
    } catch (error) {
      CrashCatcherMethods.setAppError(error.message);
      // this.setState({ screenLoading: false });
      console.log("---------------------------")
      console.log(error.message)
    }
  }

  async loginasclient() {
    const user = { 
      id: -1,
      first_name: 'Guest',
      last_name: "",
      type: "client"
    };
    actions.setUserData({
      data: user,
      userToken: ""
    });
    AsyncStorage.setItem("user", JSON.stringify(user));
    AsyncStorage.setItem("userToken", "");
    this.props.navigation.navigate("rootDrawerNavigator", {screen: 'Home', params: {user: user}});
  }
  
  render() {
    const {
      introTextStyle,
      loginImageStyle,
      buttonStyle,
      titleStyle,
      registerContainer,
      registerTextStyle,
      fullImageStyle,
      buttonSwitcher,
      imageLanguage,
      languageText
    } = styles;
    const { navigation } = this.props;
    const { screenLoading } = this.state;
    return (
      <ImageBackground
        resizeMode={"cover"}
        source={images.mainImage}
        style={fullImageStyle}
      >
        <View style={{ flex: 1, width: sWidth }}>
          {screenLoading ? (
            <ActivityIndicator
              style={{ flex: 1 }}
              size={"large"}
              color={colors.white}
            />
          ) : (
              <View>
                <TouchableOpacity
                  onPress={() => languageSwitcher.toggleLanguages()}
                  style={buttonSwitcher}
                >
                  <Text style={languageText}>{strings.changeLangIntro}</Text>
                  <Image
                    source={icons.world}
                    resizeMode={"contain"}
                    style={imageLanguage}
                  />
                </TouchableOpacity>
                <Image
                  source={images.loginImage}
                  resizeMode={"contain"}
                  style={loginImageStyle}
                />
                <Text style={introTextStyle}>{strings.introText}</Text>
                <Button
                  title={strings.login}
                  style={buttonStyle}
                  hideIcon
                  titleStyle={titleStyle}
                  onPress={() => navigation.navigate("Login")}
                />
                <TouchableOpacity
                  style={registerContainer}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  <Text style={registerTextStyle}>{strings.register}</Text>
                </TouchableOpacity>
                <View style = {{width: '100%', height: vScale(38.4), marginTop: vScale(10), justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity style = {{borderBottomColor: '#ffffff', borderBottomWidth: 1, paddingBottom: 5, paddingHorizontal: 5}} onPress={() => this.loginasclient()}>
                    <Text style = {[styles.titleStyle, {color: '#ffffff'}]}>{strings.skip}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  loginImageStyle: {
    width: hScale(116),
    height: vScale(119),
    marginTop: vScale(150),
    marginBottom: vScale(48),
    alignSelf: "center"
  },
  introTextStyle: {
    width: hScale(262),
    fontSize: fScale(22),
    fontFamily: fonts.arial,
    lineHeight: vScale(29),
    marginBottom: vScale(20),
    textAlign: "center",
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.13)",
    textShadowOffset: {
      width: 0,
      height: vScale(3)
    },
    textShadowRadius: 0,
    alignSelf: "center"
  },
  buttonsContainer: {
    marginTop: vScale(80),
    alignItems: "center"
  },
  buttonStyle: {
    width: hScale(297.5),
    height: vScale(43.2),
    marginTop: vScale(20),
    alignSelf: "center"
  },
  registerContainer: {
    width: hScale(297.5),
    height: vScale(43.2),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  titleStyle: {
    textAlign: "center",
    fontSize: fScale(17),
    fontFamily: fonts.arial
  },
  registerTextStyle: {
    fontSize: fScale(17),
    color: colors.white,
    fontFamily: fonts.arial
  },
  fullImageStyle: {
    flex: 1,
    width: sWidth,
    alignItems: "center"
  },
  buttonSwitcher: {
    height: hScale(40),
    width: vScale(120),
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: vScale(100),
    right: hScale(10),
    borderRadius: hScale(20),
    paddingHorizontal: hScale(8)
  },
  languageText: {
    fontSize: fScale(13),
    color: colors.first,
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.arial
  },
  imageLanguage: {
    width: hScale(16),
    height: hScale(16),
    marginStart: hScale(5),
    tintColor: colors.second
  }
});

export const Intro = connect(IntroScreen);
