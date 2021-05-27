import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { colors } from "../constants";
import { fonts } from "../assets";
import { strings } from "../strings";

export const EmptyScreen = props => {
  const {
    image,
    imageStyle,
    title,
    customContainer,
    onPress,
    hideButton
  } = props;
  const {
    container,
    mainContainerImage,
    imageContainer,
    textStyle,
    buttonContainer,
    buttonTextContainer
  } = styles;
  return (
    <View style={[container, customContainer]}>
      <View style={mainContainerImage}>
        <View style={imageContainer}>
          <Image source={image} resizeMode={"contain"} style={imageStyle} />
        </View>
      </View>
      <Text style={textStyle}>{title}</Text>
      {!hideButton && (
        <TouchableOpacity onPress={onPress} style={buttonContainer}>
          <Text style={buttonTextContainer}>{strings.tryAgain}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: vScale(50)
  },
  mainContainerImage: {
    width: hScale(144),
    height: hScale(144),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vScale(22.9),
    borderRadius: hScale(72),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: {
      width: 0,
      height: vScale(3)
    },
    shadowRadius: hScale(6),
    shadowOpacity: 1,
    elevation: 10
  },
  textStyle: {
    fontSize: fScale(14),
    color: colors.mainText,
    fontFamily: fonts.arial
  },
  imageContainer: {
    width: hScale(108),
    height: hScale(108),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hScale(54),
    backgroundColor: colors.mainBackground,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: {
      width: 0,
      height: vScale(-3)
    },
    shadowRadius: hScale(6),
    shadowOpacity: 1,
    elevation: 10
  },
  buttonContainer: {
    height: vScale(50),
    marginTop: vScale(20),
    justifyContent: "center"
  },
  buttonTextContainer: {
    fontSize: fScale(14),
    color: colors.second,
    fontFamily: fonts.arial
  }
});
