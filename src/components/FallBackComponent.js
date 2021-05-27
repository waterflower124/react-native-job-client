import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { fScale, hScale, vScale, sWidth } from "step-scale";
import { images, fonts } from "../assets";
import { strings } from "../strings";
import { colors } from "../constants";
import { Button } from "./common";

export const FallbackComponent = props => {
  const {
    introTextStyle,
    loginImageStyle,
    buttonStyle,
    titleStyle,
    fullImageStyle
  } = styles;
  const { onPressReset, onPressIamDev } = props;
  return (
    <ImageBackground
      resizeMode={"cover"}
      source={images.mainImage}
      style={fullImageStyle}
    >
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={20000}
        onLongPress={onPressIamDev}
      >
        <Image
          source={images.loginImage}
          resizeMode={"contain"}
          style={loginImageStyle}
        />
      </TouchableOpacity>

      <Text style={introTextStyle}>{strings.somethingWentWrong}</Text>
      <View>
        <View>
          <Button
            title={strings.tryAgain}
            style={buttonStyle}
            hideIcon
            titleStyle={titleStyle}
            onPress={onPressReset}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loginImageStyle: {
    width: hScale(116),
    height: vScale(119),
    marginTop: vScale(150),
    marginBottom: vScale(48)
  },
  introTextStyle: {
    width: hScale(262),
    fontSize: fScale(22),
    fontFamily: fonts.arial,
    lineHeight: vScale(29),
    marginBottom: vScale(100),
    textAlign: "center",
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.13)",
    textShadowOffset: {
      width: 0,
      height: vScale(3)
    },
    textShadowRadius: 0
  },
  buttonsContainer: {
    marginTop: vScale(80),
    alignItems: "center"
  },
  buttonStyle: {
    width: hScale(297.5),
    height: vScale(43.2),
    marginBottom: vScale(28.2)
  },
  titleStyle: {
    textAlign: "center",
    fontSize: fScale(17),
    fontFamily: fonts.arial
  },
  fullImageStyle: {
    flex: 1,
    width: sWidth,
    alignItems: "center"
  }
});
