import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { strings } from "../strings";
import { hScale, vScale, fScale } from "step-scale";
import { colors } from "../constants";
import { fonts } from "../assets";

export class PriceCalculator extends Component {
  state = { isFocus: false };
  render() {
    const { earn, appRatio, errorMessage, disableInput } = this.props;
    const { isFocus } = this.state;
    const {
      container,
      input,
      earnContainer,
      textStyle,
      errorContainer,
      errorMessageStyle
    } = styles;
    return (
      <View style={{ alignSelf: "center", overflow: "hidden" }}>
        <View
          style={[
            container,
            isFocus && {
              borderColor: colors.second
            }
          ]}
        >
          <Text style={[textStyle, { fontSize: fScale(10)}]}>{strings.price}</Text>
          <TextInput
            style={input}
            placeholderTextColor={colors.input}
            onBlur={() => this.setState({ isFocus: false })}
            onFocus={() => this.setState({ isFocus: true })}
            maxLength={10}
            keyboardType={"number-pad"}
            editable={!disableInput}
            {...this.props}
          />
          <View style={earnContainer}>
            <Text style={[textStyle, { color: colors.mainText }]}>
              {strings.earn}{" "}
            </Text>
            <Text
              numberOfLines={1}
              style={[textStyle, { width: hScale(65), textAlign: "center" }]}
            >
              {earn}
            </Text>
            <Text style={[textStyle, { color: colors.second}]}>
              {strings.and} {appRatio || 0}
            </Text>
            <Text style={[textStyle, { color: colors.second, fontSize: fScale(10)}]}>
              {" " + strings.appRatio}
            </Text>
          </View>
        </View>
        <View style={errorContainer}>
          <Text style={errorMessageStyle}>
            {errorMessage ? errorMessage : ""}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: hScale(350.7),
    height: vScale(36.5),
    borderRadius: hScale(5),
    paddingHorizontal: hScale(5),
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden" ,
    backgroundColor: colors.white,
    borderWidth: hScale(1),
    borderColor: "transparent",
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  },
  input: {
    textAlign: "center",
    fontSize: fScale(14),
    fontFamily: fonts.arial,
    width: hScale(70),
    color: colors.mainText,
    height: vScale(36.5)
  },
  earnContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  textStyle: {
    fontSize: fScale(12),
    fontFamily: fonts.arial,
    color: colors.input
  },
  errorMessageStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    fontSize: fScale(10),
    color: "red",
    fontFamily: fonts.arial
  },
  errorContainer: {
    height: vScale(15),
    marginTop: vScale(5)
  }
});
