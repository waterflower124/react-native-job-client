import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { colors } from "../constants";
import { fonts } from "../assets";

export const ServiceCard = props => {
  const { item, onPress } = props;
  const { image, name } = item;
  const { container, imageStyle, textStyle, imageContainer } = styles;
  return (
    <TouchableOpacity style={container} onPress={onPress}>
      <View style={imageContainer}>
        <Image
          source={{ uri: image }}
          style={imageStyle}
          resizeMode={"contain"}
        />
      </View>
      <Text numberOfLines={2} style={textStyle}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: hScale(106.4),
    height: vScale(86.7),
    borderRadius: hScale(5),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: hScale(15),
    marginVertical: vScale(10),
    elevation: 10
  },
  imageContainer: {
    width: hScale(80),
    height: vScale(40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vScale(12.3)
  },
  imageStyle: {
    width: hScale(80),
    height: vScale(40)
  },
  textStyle: {
    textAlign: "center",
    fontSize: fScale(13),
    color: colors.mainText,
    fontFamily: fonts.arial
  }
});
