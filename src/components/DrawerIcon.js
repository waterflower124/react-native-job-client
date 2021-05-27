import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { hScale, vScale } from "step-scale";
import { icons } from "../assets";

export const DrawerIcon = props => {
  const { container, defaultImageStyle } = styles;
  const { onPress, containerStyle, imageStyle } = props;

  return (
    <TouchableOpacity style={[container, containerStyle]} onPress={onPress}>
      <Image
        source={icons.drawer}
        resizeMode={"contain"}
        style={[defaultImageStyle, imageStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginEnd: hScale(17.9),
    width: hScale(25),
    height: vScale(18),
    justifyContent: "center",
    alignItems: "center",
  },
  defaultImageStyle: {
    width: hScale(21.7),
    height: vScale(15.3)
  }
});
