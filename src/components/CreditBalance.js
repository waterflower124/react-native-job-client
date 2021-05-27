import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { colors } from "../constants";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";
import { actions } from "../helpers";

class CreditBalanceComponent extends React.PureComponent {
  async componentDidMount() {
    await actions.refreshWalletBalance();
  }
  render() {
    const { userWallet, onPress } = this.props;
    const { container, imageStyle, textStyle } = styles;

    return (
      <TouchableOpacity style={container} onPress={onPress}>
        <Image
          source={icons.transaction}
          resizeMode={"contain"}
          style={imageStyle}
        />
        <Text numberOfLines={1} style={textStyle}>
          {userWallet}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginEnd: hScale(12.7),
    height: vScale(29.3),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: hScale(12),
    backgroundColor: colors.white,
    borderRadius: hScale(5)
  },
  imageStyle: {
    width: hScale(12.3),
    height: vScale(14.3),
    marginEnd: hScale(9)
  },
  textStyle: {
    color: colors.transactionText,
    fontSize: fScale(14),
    textAlign: "left",
    flex: 1,
    fontFamily: fonts.arial
  }
});

export const CreditBalance = connect(CreditBalanceComponent);
