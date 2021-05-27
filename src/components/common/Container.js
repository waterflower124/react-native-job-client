import React from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  View,
  I18nManager
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { hScale, sHeight, sWidth, vScale } from "step-scale";
import { images } from "../../assets";
import { colors } from "../../constants";

const { isRTL } = I18nManager;

export const Container = props => {
  const { style, loading, children, gradientHeader, transparentImage } = props;
  const {
    indicatorContainer,
    gradientImageStyle,
    imageStyle,
    linearStyle
  } = styles;
  const lightStatusBar = gradientHeader;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: gradientHeader ? colors.mainBackground : colors.white,
        alignItems: "center",
        ...style
      }}
    >
      <StatusBar
        backgroundColor={colors.statusBar}
        barStyle={lightStatusBar ? "light-content" : "dark-content"}
      />
      {gradientHeader && (
        <LinearGradient
          colors={[colors.first, colors.second]}
          style={linearStyle}
        >
          <Image source={images.gradientImage} style={gradientImageStyle} />
        </LinearGradient>
      )}
      {transparentImage && (
        <Image
          source={images.roundedImage}
          resizeMode="contain"
          style={[imageStyle, isRTL && { transform: [{ rotateY: "180deg" }] }]}
        />
      )}
      {loading ? (
        <View style={indicatorContainer}>
          <ActivityIndicator color={colors.second} size="large" />
        </View>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  gradientImageStyle: {
    width: sWidth,
    height: vScale(213.9),
    opacity: 0.25,
    resizeMode: "cover",
    position: "absolute"
  },
  imageStyle: {
    width: hScale(185),
    height: vScale(324.3),
    position: "absolute",
    alignSelf: "flex-end"
  },
  linearStyle: {
    width: sWidth,
    height: vScale(213.9),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  }
});
