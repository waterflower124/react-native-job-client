import React, { Component } from "react";
import { StyleSheet, Text, View, I18nManager } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";

export class EnterPhone extends Component {

  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      headerLeft: () => <BackButton onPress={() => this.props.navigation.goBack()} />
    })
  }

  state = { validateLoading: false, error: "", mobile: "" };

  validateInputs(isEmptyPhone, numberError) {
    const { mobile } = this.state;
    let error = "";
    if ((isEmptyPhone, numberError)) {
      error = "phone";
    }
    if (error == "") {
      this.props.navigation.navigate("VerifyPhone", {
        mobile,
        resetPassword: true
      });
    } else {
      this.setState({ error });
    }
  }
  
  render() {
    const {
      welcomeBackStyle,
      signinToStyle,
      buttonContainer,
      container,
      inputStyle,
      containerStyle,
      phoneIconStyle
    } = styles;
    const { error, mobile } = this.state;
    const isEmptyPhone = mobile.length == 0;
    const isPhoneError = error === "phone";
    const phoneError =
      isNaN(mobile) || mobile.length != 10 || !mobile.startsWith(0);
    const showPhoneError = mobile.length > 0 || isPhoneError;
    const { isRTL } = I18nManager;
    return (
      <Container transparentImage style={container}>
        <Text style={welcomeBackStyle}>{strings.enterYourNum}</Text>
        <Text style={[signinToStyle, isRTL && { textAlign: "left" }]}>
          {strings.pleaseEnterYourNum}
        </Text>
        <TextField
          onChangeText={mobile => this.setState({ mobile })}
          value={mobile}
          errorMessage={phoneError && showPhoneError && strings.invalidPhone}
          label={strings.mobileNum}
          authInputs
          showCountryCode
          keyboardType="numeric"
          customMainContainer={containerStyle}
          inputStyle={inputStyle}
          rightIcon={icons.smartphone}
          rightIconStyle={phoneIconStyle}
        />
        <View style={buttonContainer}>
          <Button
            title={strings.continue}
            onPress={() => this.validateInputs(isEmptyPhone, phoneError)}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(107.8)
  },
  containerStyle: {
    marginStart: hScale(15.1),
    paddingHorizontal: 0
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
    fontSize: fScale(14),
    width: hScale(335)
  },
  buttonContainer: {
    width: hScale(320),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: vScale(100)
  },
  phoneIconStyle: {
    width: hScale(13),
    height: vScale(17.3)
  }
});
