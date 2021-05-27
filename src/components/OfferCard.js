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
import StarRating from "react-native-star-rating";
import { fScale, hScale, vScale } from "step-scale";
import { colors } from "../constants";
import { strings } from "../strings";
import { fonts, icons } from "../assets";

export const OfferCard = props => {
  const { item, onPress, onRejectPress, loading, rejectLoading, bid_accepted } = props;
  const { note, price, employee, status } = item;
  const {
    container,
    imageStyle,
    textStyle,
    nameImageContainer,
    detailsContainer,
    costTextStyle,
    buttonStyle
  } = styles;
  const { isRTL } = I18nManager;
  const disabled = loading || rejectLoading;
  const isRejected = status == 2;
  const isAccepted = bid_accepted && status == 1;
  return (
    <View style={container}>
      <View style={nameImageContainer}>
        <Image
          source={
            employee.avatar ? { uri: employee.avatar } : icons.userPlaceholder
          }
          resizeMode={"cover"}
          style={imageStyle}
        />
        {/* <Text
          numberOfLines={1}
          style={[textStyle, isRTL && { textAlign: "left" }]}
        >
          {employee.first_name + " " + employee.last_name}
        </Text> */}
        <StarRating
          containerStyle={{ width: hScale(40), alignSelf: "center", marginTop: 5}}
          disabled
          emptyStar={icons.inActiveStar}
          fullStar={icons.activeStar}
          maxStars={5}
          rating={employee.rate}
          halfStar={icons.halfStar}
          starStyle={{ width: hScale(8), height: hScale(8) }}
        />
      </View>
      <View style={detailsContainer}>
        <Text
          numberOfLines={1}
          style={[textStyle, {marginBottom: 5}, isRTL && { textAlign: "left" }]}
        >
          {employee.first_name + " " + employee.last_name}
        </Text>
        <Text style={[costTextStyle, isRTL && { textAlign: "left" }]}>
          {price} {strings.currency}
        </Text>
        <Text
          numberOfLines={2}
          style={[textStyle, isRTL && { textAlign: "left" }]}
        >
          {note}
        </Text>
      </View>
      {isAccepted ? (
        <Text style={[textStyle, { color: colors.red }]}>
          {strings.offerAccepted}
        </Text>
      ) : isRejected ? (
        <Text style={[textStyle, { color: colors.red }]}>
          {strings.offerRejected}
        </Text>
      ) : (bid_accepted && status != 1) ? (
        <View/>
      ) : (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            disabled={disabled}
            style={[buttonStyle, { marginHorizontal: hScale(5) }]}
            onPress={onRejectPress}
          >
            {rejectLoading ? (
              <ActivityIndicator size={"small"} color={colors.red} />
            ) : (
              <Text style={[textStyle, { color: colors.red }]}>
                {strings.reject}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disabled}
            style={buttonStyle}
            onPress={onPress}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={colors.second} />
            ) : (
              <Text style={textStyle}>{strings.accept}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: hScale(352),
    height: vScale(70),
    borderRadius: hScale(5),
    paddingStart: hScale(15),
    paddingEnd: hScale(12.7),
    marginBottom: vScale(9),
    alignItems: "center",
    flexDirection: "row",
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
  imageStyle: {
    width: hScale(28),
    height: hScale(28),
    borderRadius: hScale(14)
  },
  textStyle: {
    color: colors.mainText,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  },
  nameImageContainer: {
    width: hScale(50),
    justifyContent: "center",
    alignItems: "center",
    marginEnd: hScale(8.9)
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    marginEnd: hScale(5.5)
  },
  costTextStyle: {
    color: colors.first,
    fontSize: fScale(13),
    marginBottom: vScale(2.5),
    fontFamily: fonts.arial
  },
  buttonStyle: {
    width: hScale(66.9),
    height: vScale(27.1),
    borderRadius: hScale(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  }
});
