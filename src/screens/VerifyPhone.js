import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert
} from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { StepRequest } from "step-api-client";
import { actions, languageSwitcher } from "../helpers";
import AsyncStorage from '@react-native-community/async-storage';

export class VerifyPhone extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      headerLeft: () => <BackButton onPress={() => this.props.navigation.goBack()} />
    })

    const userData = this.props.route.params.userData;
    this.state = {
      ...userData,
      ms: 59000,
      code: "",
      error: "",
      validateloading: false,
      resetPassword: this.props.route.params.resetPassword
    };
  }

  componentDidMount() {
    
    this.sendCode()
  }

  startTimer(){
    timeInterval = setInterval(() => {
      const { ms } = this.state;
      if (ms <= 0) {
        clearInterval(timeInterval);
      } else {
        this.setState({ ms: ms - 1000 });
      }
    }, 1000);
  }

  componentWillUnmount(){
    if (typeof timeInterval != 'undefined') {
      clearInterval(timeInterval);
    }
  }

  async sendCode() {
    const { mobile, resetPassword } = this.state
    try {
      var data = null;
      
      if(resetPassword) {
        this.setState({
          mobile: this.props.route.params.mobile
        })
        data = await StepRequest("password/remind", "POST", { mobile: this.props.route.params.mobile });
      } else {
        // data = await StepRequest("otp/send", "POST", { mobile });
        data = {status: 1}
      }
      if(data.status == 0) {
        Alert.alert(data.message);
        this.props.navigation.goBack();
      } else {
        this.startTimer();
      }
    } catch (error) {
      Alert.alert(error.message);
      this.props.navigation.goBack();
    }
  }

  formatCounter() {
    const { ms } = this.state;
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    minutes = minutes < 1 ? "00" : minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 1 ? "00" : seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }

  async validateCode(isEmptyCode, codeError) {
    const { mobile, code } = this.state
    let error = "";
    if ((isEmptyCode, codeError)) {
      error = "code";
    }
    if (error == "") {
      try {
        this.setState({ validateloading: true });
        var data = await StepRequest("otp/verify", "POST", { mobile, otp: code });
        
        this.naivgateToScreen();
      } catch (error) {
        this.setState({ validateloading: false });
        Alert.alert(error.message);
      }
    } else {
      this.setState({ error });
    }
  }

  naivgateToScreen() {
    const { navigation } = this.props;
    const { mobile, resetPassword } = this.state;
    if(resetPassword) {
      navigation.navigate("NewPassword", {
        mobile,
        otp: this.state.code
      });
    } else {
      this.setState({ validateloading: false });
      this.signup();
    }
  }

  async signup() {
    const { navigation } = this.props;
    this.setState({ validateloading: true });
    const {
      selected_city,
      location,
      range_id,
      category_id,
      bank_id,
      bank_no,
      national_iqama_commercial,
      commercial,
      mobile,
      email,
      password,
      first_name,
      last_name,
      avatar,
      temp_latitude,
      temp_longitude,
      isEmployee
    } = this.state;
    const lang = await languageSwitcher.getCurrentLanguageCode();
    const userData = {
      city: selected_city,
      lat: temp_latitude,
      lng: temp_longitude,
      distance: range_id,
      category_id,
      bank_id,
      bank_no,
      national_iqama_commercial,
      commercial,
      mobile,
      password,
      first_name,
      last_name,
      avatar,
      email,
      lang,
      address: location
    };

    if(isEmployee) {
      userData.type = "employee";
    } else {
      userData.type = "client";
    }
    try {
      const data = await StepRequest("register", "POST", userData);
      actions.setUserData({
        data: data.user,
        userToken: data.token
      });
      this.setState({ validateloading: false });
      AsyncStorage.setItem("user", JSON.stringify(data.user));
      AsyncStorage.setItem("userToken", data.token);

      // navigation.navigate("ClientsTab");
      navigation.navigate("rootDrawerNavigator", {screen: 'Home', params: {user: data.user}});
    } catch (error) {
      this.setState({ validateloading: false });
      Alert.alert(error.message);
    }
  }

  render() {
    const { mobile, code, error, ms, validateloading } = this.state;
    const isCodeError = error === "code";
    const codeError = code.length < 6;
    const isEmptyCode = code.length == 0;
    const showCodeError = code.length > 0 || isCodeError;
    const {
      welcomeBackStyle,
      signinToStyle,
      buttonContainer,
      container,
      inputStyle,
      containerStyle,
      phoneIconStyle,
      forgotButtonStyle,
      forgotPasswordStyle
    } = styles;
    const { navigation } = this.props;
    const disableButton = ms == 0;
    return (
      <Container transparentImage style={container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={welcomeBackStyle}>{strings.verifyNum}</Text>
          <Text style={signinToStyle}>
            {strings.enterPin}
            {mobile}
          </Text>
          <TextField
            onChangeText={code => this.setState({ code })}
            value={code}
            errorMessage={codeError && showCodeError && strings.invalidCode}
            label={strings.enterCode}
            authInputs
            maxLength={6}
            keyboardType="numeric"
            customMainContainer={containerStyle}
            inputStyle={inputStyle}
            rightIcon={icons.smartphone}
            rightIconStyle={phoneIconStyle}
          />
          <View style={[buttonContainer, { marginBottom: vScale(67.2) }]}>
            <TouchableOpacity
              disabled={!disableButton}
              onPress={() => {
                this.setState({ ms: 59000 }, ()=> this.sendCode());
              }}
            >
              <Text style={{ fontFamily: fonts.arial }}>
                {strings.resendCode} : {this.formatCounter(ms)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={forgotButtonStyle}
              onPress={() => navigation.goBack()}
            >
              <Text style={forgotPasswordStyle}>{strings.editNum}</Text>
            </TouchableOpacity>
          </View>
          <View style={buttonContainer}>
            <Button
              loading={validateloading}
              title={strings.continue}
              onPress={() => this.validateCode(isEmptyCode, codeError)}
            />
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(107.8)
  },
  inputStyle: {
    fontSize: fScale(14)
  },
  containerStyle: {
    marginStart: hScale(15.1),
    paddingHorizontal: 0
  },
  welcomeBackStyle: {
    fontSize: fScale(19),
    fontFamily: fonts.arial,
    color: colors.welcomeTextColor,
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(8.6)
  },
  signinToStyle: {
    fontSize: fScale(14),
    color: colors.signInTo,
    fontFamily: fonts.arial,
    marginTop: vScale(8.5),
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(40.2)
  },

  inputStyle: {
    fontSize: fScale(14),
    width: hScale(335)
  },
  buttonContainer: {
    width: hScale(320),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginStart: hScale(15.1)
  },
  phoneIconStyle: {
    width: hScale(13),
    height: vScale(17.3)
  },
  forgotButtonStyle: {
    width: hScale(142.3),
    height: vScale(38.4),
    justifyContent: "center",
    alignItems: "center"
  },
  forgotPasswordStyle: {
    fontSize: fScale(14),
    color: colors.second,
    fontFamily: fonts.arial
  }
});
