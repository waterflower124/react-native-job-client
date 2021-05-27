import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, I18nManager } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, images, fonts } from "../assets";
import { colors } from "../constants";

const {isRTL} = I18nManager

export const BackButton = props => {
  const { onPress, backWithTitle, title, hideBack, customContainer } = props;
  const {
    imageContainer,
    backImageStyle,
    container,
    imageStyle,
    textStyle
  } = styles;
  return (
    <TouchableOpacity
      disabled={hideBack}
      style={[backWithTitle ? container : imageContainer, customContainer]}
      onPress={onPress}
    >
      {backWithTitle ? (
        <View style={{ flexDirection: "row" }}>
          {hideBack ? null : (
            <Image
              resizeMode={"contain"}
              source={icons.backButton}
              style={[imageStyle,isRTL && {transform: [{rotate: '180deg'}]}]}
            />
          )}
          <Text style={textStyle}>{title}</Text>
        </View>
      ) : (
        <Image
          source={images.backImage}
          resizeMode={"contain"}
          style={[backImageStyle,isRTL && {transform: [{rotate: '180deg'}]}]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: hScale(44.8),
    height: hScale(44.8),
    marginStart: hScale(5),
    alignItems: "center",
    justifyContent: "center"
  },
  backImageStyle: {
    width: hScale(34.8),
    height: hScale(34.8)
  },
  container: {
    height: vScale(30),
    marginStart: hScale(24.6),
    justifyContent: "center"
  },
  imageStyle: {
    width: hScale(7.9),
    height: vScale(13.1),
    marginEnd: hScale(12.6)
  },
  textStyle: {
    fontSize: fScale(14),
    color: colors.mainText,
    fontFamily: fonts.arial
  }
});
