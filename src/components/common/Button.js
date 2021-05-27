import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../../assets";
import { colors } from "../../constants";

const { isRTL } = I18nManager;

export const Button = props => {
  const {
    style,
    title,
    titleStyle,
    onPress,
    loading,
    linearCustomStyle,
    hideIcon,
    whiteBackgroundButton,
    errorContainerCustom,
    errorMessage
  } = props;
  
  const {
    textStyle,
    iconStyle,
    linearGradientStyle,
    mainBtnStyle,
    errorContainer,
    errorMessageStyle,
    titleIconContainer
  } = styles;
  const hasTitle = typeof title == "string";
  return (
    <View>
      <TouchableOpacity
        disabled={loading}
        onPress={onPress}
        style={[mainBtnStyle, style]}
      >
        <LinearGradient
          colors={
            whiteBackgroundButton
              ? [colors.white, colors.white]
              : [colors.first, colors.second]
          }
          style={[linearGradientStyle, linearCustomStyle]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size={"small"} />
          ) : (
            <View style={titleIconContainer}>
              {hasTitle && <Text style={[textStyle, titleStyle]}>{title}</Text>}
              {hideIcon ? null : (
                <Image
                  source={icons.miniArrow}
                  resizeMode={"contain"}
                  style={[
                    iconStyle,
                    isRTL && { transform: [{ rotate: "180deg" }] }
                  ]}
                />
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View style={[errorContainer, errorContainerCustom]}>
        <Text style={errorMessageStyle}>
          {errorMessage ? errorMessage : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: fScale(14),
    color: colors.white,
    flex: 1,
    textAlign: "left",
    fontWeight: "normal",
    fontFamily: fonts.arial
  },
  iconStyle: {
    width: hScale(10.8),
    height: vScale(8.6)
  },
  linearGradientStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hScale(25),
    paddingHorizontal: hScale(11.9)
  },
  mainBtnStyle: {
    width: hScale(142.3),
    height: vScale(38.4),
    borderRadius: hScale(25)
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
  },
  titleIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
