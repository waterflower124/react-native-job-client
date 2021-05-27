import React, { Component } from "react";
import { StyleSheet, Text, ScrollView, Alert } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { StepRequest } from "step-api-client";
import { actions, languageSwitcher } from "../helpers";

export class NewPassword extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      mobile: this.props.route.params.mobile, 
      otp: this.props.route.params.otp,
      validateloading: false,
      error: "",
      password: "",
      confirmPassword: ""
    };
  }
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });

  validateInputs(
    isEmptyPassword,
    isEmptyConfirmPassword,
    passwordError,
    confirmPasswordError
  ) {
    let error = "";
    if ((isEmptyPassword, passwordError)) {
      error = "password";
    } else if ((isEmptyConfirmPassword, confirmPasswordError)) {
      error = "confirmPassword";
    }
    if (error == "") {
      this.setNewPassword();
    } else {
      this.setState({ error });
    }
  }

  async setNewPassword() {
    const { navigation, } = this.props;
    const { mobile, otp, password } = this.state;
    this.setState({ validateloading: true });
    
    try {
      const data = await StepRequest("password/reset", "POST", {mobile, otp, password});

      navigation.navigate("Login");
      
    } catch (error) {
      console.log(error)
      this.setState({ validateloading: false });
      
      Alert.alert(error.message);
    }
  }

  render() {
    const {
      container,
      containerStyle,
      welcomeBackStyle,
      inputStyle,
      buttonStyle,
      passwordIconStyle
    } = styles;
    const { validateloading, password, confirmPassword, error } = this.state;
    const isEmptyPassword = password.length == 0;
    const isEmptyConfirmPassword = confirmPassword.length == 0;
    const isPasswordError = error === "password";
    const isConfirmPasswordError = error === "confirmPassword";
    const passwordError = password.length < 6;
    const showPasswordErrorStatus = password.length > 0 || isPasswordError;
    const confirmPasswordError =
      confirmPassword.length < 6 || confirmPassword != password;
    const showConfirmPasswordErrorStatus =
      confirmPassword.length > 0 || isConfirmPasswordError;
    return (
      <Container transparentImage style={container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={welcomeBackStyle}>{strings.enterNewPassword}</Text>
          <TextField
            onChangeText={password => this.setState({ password })}
            value={password}
            errorMessage={
              passwordError &&
              showPasswordErrorStatus &&
              strings.invalidPassword
            }
            label={strings.password}
            authInputs
            secureTextEntry
            rightIcon={icons.password}
            rightIconStyle={passwordIconStyle}
            customMainContainer={containerStyle}
            inputStyle={[inputStyle, { marginStart: 0 }]}
          />
          <TextField
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
            value={confirmPassword}
            errorMessage={
              confirmPasswordError &&
              showConfirmPasswordErrorStatus &&
              strings.passwordNotMatch
            }
            label={strings.confirmPassword}
            secureTextEntry
            authInputs
            rightIcon={icons.password}
            rightIconStyle={passwordIconStyle}
            customMainContainer={containerStyle}
            inputStyle={[inputStyle, { marginStart: 0 }]}
          />
          <Button
            loading={validateloading}
            style={buttonStyle}
            title={strings.continue}
            onPress={() =>
              this.validateInputs(
                isEmptyPassword,
                isEmptyConfirmPassword,
                passwordError,
                confirmPasswordError
              )
            }
          />
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(107.5)
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
    marginBottom: vScale(40),
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
  buttonStyle: {
    marginStart: hScale(15.1),
    marginTop: vScale(33.8)
  },
  forgotPasswordStyle: {
    fontSize: fScale(14),
    color: colors.forgotPass,
    fontFamily: fonts.arial
  },
  dontHaveAccountContainer: {
    flexDirection: "row",
    marginTop: vScale(30.9)
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
  }
});
