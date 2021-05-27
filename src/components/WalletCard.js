import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { colors } from "../constants";
import { strings } from "../strings";
import moment from "moment";

export const WalletCard = props => {
  const { item } = props;
  const { in: inn, out, note, created_at } = item;
  const isPositive = out == 0;
  const value = isPositive ? inn : out;
  const {
    container,
    transactionContainer,
    noteContainer,
    borderStyle,
    calendarStyle,
    calenderContainer,
    textStyle,
    transactionStyle
  } = styles;
  return (
    <View style={container}>
      <View style={[transactionContainer,isPositive && {backgroundColor:colors.second}]}>
        <Text style={transactionStyle}>{value}</Text>
      </View>
      <View style={noteContainer}>
        <View style={calenderContainer}>
          <Text style={[textStyle, { fontSize: fScale(14) }]} numberOfLines={3}>
            {note}
          </Text>
        </View>
        <View style={borderStyle} />
        <View style={calenderContainer}>
          <Image
            source={icons.calendar}
            resizeMode={"contain"}
            style={calendarStyle}
          />
          <Text style={textStyle}>
            {strings.date} :{moment(created_at).format("YYYY/MM/DD")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: vScale(10),
    width: hScale(350.6),
    height: vScale(76.7),
    borderRadius: hScale(5),
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  },
  transactionContainer: {
    width: hScale(60),
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: hScale(5),
    borderBottomLeftRadius: hScale(5),
    backgroundColor: colors.red
  },
  noteContainer: {
    width: hScale(273.7),
    height: vScale(77),
    paddingEnd: hScale(12.7),
    paddingStart: hScale(6.7),
    justifyContent: "space-around",
    paddingVertical: vScale(6)
  },
  borderStyle: {
    width: hScale(250.7),
    height: vScale(0.5),
    backgroundColor: colors.mainBorder
  },
  calenderContainer: {
    width: hScale(273.7),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: hScale(5)
  },
  calendarStyle: {
    width: hScale(9.6),
    height: vScale(10.6),
    marginEnd: hScale(7.4)
  },
  textStyle: {
    color: colors.mainText,
    fontSize: hScale(10),
    fontFamily: fonts.arial
  },
  transactionStyle: {
    color: colors.white,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  }
});
