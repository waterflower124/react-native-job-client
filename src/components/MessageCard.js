import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  I18nManager
} from "react-native";
import { colors } from "../constants";
import { fonts, icons } from "../assets";
import { vScale, hScale, fScale } from "step-scale";
import moment from "moment";
import { strings } from "../strings";

export const MessageCard = (props) => {
  const { item, onPress } = props;
  const { second, last_message, last, unseen_second_count } = item;
  const myUnseenCount = item.new - unseen_second_count
  const haveNewMessage = myUnseenCount > 0
  const { type, text } = last_message;
  const { first_name, last_name, avatar } = second;
  const isVoiceMessage = type === 2;
  const isPhotoImage = type === 3;
  const {
    itemContainer,
    imageStyle,
    nameStyle,
    discriptionStyle,
    discriptionContainer,
    dateStyle
  } = styles;
  const { isRTL } = I18nManager;
  return (
    <TouchableOpacity style={itemContainer} onPress={onPress}>
      <Image
        source={avatar ? { uri: avatar } : icons.userPlaceholder}
        style={imageStyle}
      />
      <View style={discriptionContainer}>
        <Text
          style={[nameStyle, , isRTL && { textAlign: "left" }]}
          numberOfLines={1}
        >
          {first_name + " " + last_name}
        </Text>
      {
        item.request != null &&      
        <Text
          numberOfLines={1}
          style={[discriptionStyle, {color: '#9b498b'}, isRTL && { textAlign: "left" }]}
        >
          {item.request.requirements}
        </Text>
      }
        <Text
          numberOfLines={2}
          style={[discriptionStyle, isRTL && { textAlign: "left" }]}
        >
          {isVoiceMessage
            ? strings.voiceMassage
            : isPhotoImage
            ? strings.image
            : text}
        </Text>
      </View>
      <View>
        <Text style={dateStyle}>{moment(last).fromNow()}</Text>
        {haveNewMessage && (
          <Text style={[dateStyle, { color: colors.first}]}>
            {" "}
            {myUnseenCount} {strings.newMassage}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: hScale(354.2),
    height: vScale(67.9),
    paddingStart: hScale(15.5),
    paddingEnd: hScale(13.8),
    flexDirection: "row"
  },
  discriptionContainer: {
    flex: 1,
    justifyContent: "center",
    paddingStart: hScale(13.9)
  },
  nameStyle: {
    fontSize: fScale(14),
    color: colors.mainText,
    marginBottom: vScale(3.6),
    fontFamily: fonts.arial
  },
  discriptionStyle: {
    fontSize: fScale(12),
    color: colors.convDiscriptionColor,
    fontFamily: fonts.arial
  },
  dateStyle: {
    fontSize: fScale(10),
    color: colors.convDiscriptionColor,
    marginTop: vScale(10.8),
    width: hScale(100),
    textAlign: "center",
    fontFamily: fonts.arial
  },
  imageStyle: {
    width: hScale(42.2),
    height: hScale(42.2),
    borderRadius: hScale(21.1),
    resizeMode: "cover",
    alignSelf: "center"
  }
});
