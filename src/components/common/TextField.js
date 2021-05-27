import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  TouchableOpacity,
  I18nManager
} from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { colors } from "../../constants";
import { fonts } from "../../assets";

const { isRTL } = I18nManager;

export class TextField extends Component {
  state = {
    isFocus: false
  };
  render() {
    const {
      errorMessage,
      inputStyle,
      containerStyle,
      customMainContainer,
      label,
      leftIcon,
      leftIcon_2,
      rightIcon,
      errorContainerCustom,
      showCountryCode,
      authInputs,
      leftIconStyle,
      leftIcon_2Style,
      rightIconStyle,
      rightIconContainer,
      leftIconContainer,
      onLeftIconPress,
      onLeftIcon2Press,
      onLeftIcon2Release,
      onRightIconPress,
      labelStyle,
      borderStyle,
      loading,
      enabled,
      disableInput,
    } = this.props;
    const {
      container,
      input,
      errorContainer,
      errorMessageStyle,
      defaultLabelStyle,
      textStyle,
      borderSeparator,
      mainContainer
    } = styles;
    const { isFocus } = this.state;
    const hasLeftIcon = typeof leftIcon != "undefined";
    const hasLeftIcon_2 = typeof leftIcon_2 != "undefined";
    const hasRightIcon = typeof rightIcon != "undefined";
    return (
      <View style={[mainContainer, customMainContainer]}>
        {label && (
          <Text
            style={[
              defaultLabelStyle,
              authInputs && [{ marginBottom: vScale(4.1) }, labelStyle]
            ]}
          >
            {label}
          </Text>
        )}
        <View
          style={[
            container,
            containerStyle,
            isFocus && {
              borderColor: colors.second
            },
            authInputs && {
              borderWidth: 0,
              backgroundColor: "transparent"
            }
          ]}
        >
          {hasLeftIcon && (
            <TouchableWithoutFeedback
              style={leftIconContainer}
              onPress={onLeftIconPress}
            >
              <Image
                source={leftIcon}
                resizeMode={"contain"}
                style={leftIconStyle}
              />
            </TouchableWithoutFeedback>
          )}
          {hasLeftIcon_2 && (
            <TouchableWithoutFeedback
              style={leftIconContainer}
              onPressIn={onLeftIcon2Press}
              onPressOut={onLeftIcon2Release}
            >
              <Image
                source={leftIcon_2}
                resizeMode={"contain"}
                style={leftIcon_2Style}
              />
            </TouchableWithoutFeedback>
          )}
          {/* {showCountryCode && <Text style={textStyle}>{"00966"}</Text>} */}
          <TextInput
            editable={!disableInput}
            style={[input, inputStyle]}
            placeholderTextColor={colors.input}
            onBlur={() => this.setState({ isFocus: false })}
            onFocus={() => this.setState({ isFocus: true })}
            {...this.props}
          />
          {hasRightIcon && (
            <TouchableOpacity
              style={rightIconContainer}
              onPress={onRightIconPress}
              disabled={!enabled}
            >
              {loading ? (
                <ActivityIndicator color={colors.second} />
              ) : (
                <Image
                  source={rightIcon}
                  resizeMode={"contain"}
                  style={[
                    rightIconStyle,
                    (isFocus || this.props.value != "") && {
                      tintColor: colors.second
                    },
                    isRTL && { transform: [{ rotateY: "180deg" }] }
                  ]}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        {authInputs && (
          <View
            style={[
              borderSeparator,
              isFocus && { backgroundColor: colors.second },
              borderStyle
            ]}
          />
        )}
        <View style={[errorContainer, errorContainerCustom]}>
          <Text style={errorMessageStyle}>
            {errorMessage ? errorMessage : ""}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: "center"
  },
  container: {
    width: hScale(332.7),
    height: vScale(35.4),
    borderRadius: hScale(5),
    borderWidth: hScale(1),
    borderColor: "transparent",
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 0,
      height: vScale(1)
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: hScale(11.6),
    elevation: 2
  },
  input: {
    alignItems: "center",
    flex: 1,
    textAlign: isRTL ? "right" : "left",
    minHeight: vScale(35.4),
    fontSize: fScale(12),
    // marginStart: hScale(10),
    fontFamily: fonts.arial,
    padding: 0
  },
  errorMessageStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    fontSize: fScale(10),
    color: colors.error,
    fontFamily: fonts.arial
  },
  errorContainer: {
    height: vScale(15),
    marginTop: vScale(5)
  },
  defaultLabelStyle: {
    fontSize: fScale(14),
    color: colors.mainText,
    marginBottom: vScale(11.2),
    textAlign: "left",
    fontFamily: fonts.arial
  },
  textStyle: {
    color: colors.mainText,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  },
  borderSeparator: {
    width: hScale(332.7),
    height: vScale(1.1),
    backgroundColor: colors.inputBorder
  }
});
