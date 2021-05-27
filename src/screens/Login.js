import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Linking
} from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";
import { actions, convertNumbers2English, languageSwitcher } from "../helpers";
import AsyncStorage from '@react-native-community/async-storage';
import VersionCheck from 'react-native-version-check';

class LoginScreen extends Component {
  
  constructor(props) {
    super(props);
    
  }
  state = {
    validateLoading: false,
    error: "",
    mobile: "",
    password: ""
  };

  UNSAFE_componentWillMount() {
    
  }

  async validateInputs(isEmptyPhone, isEmptyPassword, numberError, passwordError) {
    let updateNeeded = await VersionCheck.needUpdate();
    if(updateNeeded && updateNeeded.isNeeded) {
      Alert.alert(strings.pls_update, strings.update_message,
        [
          {
            text: strings.ok,
            onPress: () => {
              Linking.openURL(updateNeeded.storeUrl);
            }
          }
        ]
      );
      return;
    }

    let error = "";
    if ((isEmptyPhone, numberError)) {
      error = "phone";
    } else if ((isEmptyPassword, passwordError)) {
      error = "password";
    }
    if (error == "") {
      this.login();
    } else {
      this.setState({ error });
    }
  }

  async login() {
    
    const { mobile, password } = this.state;
    this.setState({ validateLoading: true });
    const { navigation } = this.props;
    const lang = await languageSwitcher.getCurrentLanguageCode();
    
    const loginData = { mobile, password, lang };
    try {
      const data = await StepRequest("login", "POST", loginData);

      if(data.user.type == "employee") {
        this.setState({ validateLoading: false });
        return;
      }
      
      actions.setUserData({
        data: data.user,
        userToken: data.token
      });

      const user = { data: data.user, loggedIn: true };
      AsyncStorage.setItem("user", JSON.stringify(user));
      AsyncStorage.setItem("userToken", data.token);

      this.setState({ mobile: "", password: "", validateLoading: false });
      const isEmployee = data.user.type == "employee";

      navigation.navigate("rootDrawerNavigator", {screen: 'Home', params: {user: data.user}});

    } catch (error) {
      this.setState({ validateLoading: false });
      console.log(error.message);
      Alert.alert(error.message);
    }
  }

  render() {
    const {
      container,
      containerStyle,
      signUpButtonStyle,
      welcomeBackStyle,
      signinToStyle,
      inputStyle,
      buttonContainer,
      forgotPasswordStyle,
      dontHaveAccountContainer,
      dontHaveAccountStyle,
      phoneIconStyle,
      passwordIconStyle,
      forgotButtonStyle,
      errorContainerCustom
    } = styles;
    const { validateLoading, mobile, password, error } = this.state;
    const { navigation } = this.props;
    const isEmptyPhone = mobile.length == 0;
    const isEmptyPassword = password.length == 0;
    const isPhoneError = error === "phone";
    const isPasswordError = error === "password";
    const phoneError =
      isNaN(mobile) || mobile.length != 10 || !mobile.startsWith(0);
    const showPhoneError = mobile.length > 0 || isPhoneError;
    const passwordError = password.length < 6;
    const showPasswordErrorStatus = password.length > 0 || isPasswordError;

    return (
      <Container transparentImage style={container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView behavior={"position"}>
            <Text style={welcomeBackStyle}>{strings.welcomeBack}</Text>
            <Text style={signinToStyle}>{strings.signinTo}</Text>
            <TextField
              onChangeText={mobile =>
                this.setState({ mobile: convertNumbers2English(mobile) })
              }
              value={mobile}
              errorMessage={
                phoneError && showPhoneError && strings.invalidPhone
              }
              label={strings.yourPhone}
              authInputs
              rightIcon={icons.smartphone}
              rightIconStyle={phoneIconStyle}
              customMainContainer={containerStyle}
              inputStyle={inputStyle}
              keyboardType="numeric"
              customTextStyle={{ color: colors.mainText }}
            />
            <TextField
              onChangeText={password => this.setState({ password })}
              value={password}
              secureTextEntry
              errorMessage={
                passwordError &&
                showPasswordErrorStatus &&
                strings.invalidPassword
              }
              label={strings.yourPassword}
              authInputs
              rightIcon={icons.password}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
            />
            <View style={buttonContainer}>
              <Button
                loading={validateLoading}
                errorContainerCustom={errorContainerCustom}
                title={strings.login}
                onPress={() =>
                  this.validateInputs(
                    isEmptyPhone,
                    isEmptyPassword,
                    phoneError,
                    passwordError
                  )
                }
              />
              <TouchableOpacity
                disabled={validateLoading}
                style={forgotButtonStyle}
                onPress={() => {
                  this.setState({ error: "" }),
                    navigation.navigate("EnterPhone");
                }}
              >
                <Text style={forgotPasswordStyle}>
                  {strings.forgotPassword}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={dontHaveAccountContainer}>
              <Text style={dontHaveAccountStyle}>
                {strings.dontHaveAccount}
              </Text>
              <TouchableOpacity
                disabled={validateLoading}
                style={signUpButtonStyle}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={[dontHaveAccountStyle, { color: colors.first }]}>
                  {strings.signUp}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(112.3)
  },
  containerStyle: {
    marginStart: hScale(15.1),
    paddingHorizontal: 0
  },
  signUpButtonStyle: {
    width: hScale(80),
    justifyContent: "center"
  },
  welcomeBackStyle: {
    fontSize: fScale(19),
    color: colors.welcomeTextColor,
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(8.6),
    fontFamily: fonts.arial
  },
  signinToStyle: {
    fontSize: fScale(14),
    color: colors.signInTo,
    marginTop: vScale(8.5),
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(40.2),
    fontFamily: fonts.arial
  },
  inputStyle: {
    fontSize: fScale(14)
  },
  inputContainer: {
    marginTop: vScale(40),
    marginStart: hScale(15.5)
  },
  buttonContainer: {
    width: hScale(320),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: vScale(33.8),
    marginStart: hScale(15.1)
  },
  forgotPasswordStyle: {
    fontSize: fScale(14),
    color: colors.forgotPass,
    fontFamily: fonts.arial
  },
  dontHaveAccountContainer: {
    flexDirection: "row",
    marginTop: vScale(30.9),
    alignSelf: "center"
  },
  dontHaveAccountStyle: {
    fontSize: fScale(14),
    color: colors.signInTo,
    fontFamily: fonts.arial
  },
  phoneIconStyle: {
    width: hScale(13),
    height: vScale(17.3)
  },
  passwordIconStyle: {
    width: hScale(17.3),
    height: hScale(17.3),
    tintColor: colors.inputInActive
  },
  forgotButtonStyle: {
    width: hScale(142.3),
    height: vScale(38.4),
    justifyContent: "center",
    alignItems: "center"
  },
  errorContainerCustom: {
    marginTop: 0,
    height: 0
  }
});

// LoginScreen.setOptions = ({navigation}) => {
//   return {
//     headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
//     headerRight: () => <BackButton onPress={() => navigation.goBack()} />
//   }
//  }
export const Login = connect(LoginScreen);
