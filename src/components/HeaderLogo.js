import React from "react";
import { Image, StyleSheet } from "react-native";
import { hScale, vScale } from "step-scale";
import { icons } from "../assets";

export const HeaderLogo = props => {
  const { imageStyle } = styles;
  return (
    <Image source={icons.homelogo} resizeMode={"contain"} style={imageStyle} />
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: hScale(37.7),
    height: vScale(39.7),
    marginStart: hScale(20.9)
  }
});
