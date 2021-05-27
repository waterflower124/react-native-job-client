import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image, I18nManager } from "react-native";
import { colors } from "../constants";
import { vScale, hScale, fScale, sqScale } from "step-scale";
import { fonts, icons } from "../assets";
import moment from "moment";

export const ConversationCard = (props) => {
  const {
    item,
    isPlaying,
    onPressPlay,
    onPressImage,
    isOtherUserMsg,
    myAvatar,
    second
  } = props;
  const { created_at, text, type, seen } = item;
  const avatar = isOtherUserMsg ? second.avatar : myAvatar;
  const {
    itemContainer,
    imageContainer,
    dateStyle,
    imageStyle,
    messageContainer,
    textStyle,
    playIconStyle,
    roundedView,
    sentImageStyle
  } = styles;
  const isPhotoImage = type === 3;
  const isVoiceMessage = type === 2;
  return (
    <View style={[itemContainer, !isOtherUserMsg && { flexDirection: "row" }]}>
      <View style={imageContainer}>
        <Image
          resizeMode={"cover"}
          source={avatar ? { uri: avatar } : icons.userPlaceholder}
          style={imageStyle}
        />
        <Text style={dateStyle}>{moment(created_at).fromNow()}</Text>
      </View>
      <View
        style={[
          messageContainer,
          !isOtherUserMsg && { backgroundColor: colors.user_1Back }
        ]}
      >
        {isPhotoImage ? (
          <TouchableOpacity onPress={onPressImage}>
            <Image source={{ uri: text }} style={sentImageStyle} />
          </TouchableOpacity>
          ) : isVoiceMessage ? (
            <TouchableOpacity onPress={onPressPlay} disabled={isPlaying}>
            <Image
              source={icons.play}
              style={[
                playIconStyle,
                isOtherUserMsg && I18nManager.isRTL && { transform: [{ rotate: "0deg" }] },
                !isOtherUserMsg && !I18nManager.isRTL && { transform: [{ rotate: "0deg" }] },
              ]}
            />
          </TouchableOpacity>
        ) : (
          <Text style={[textStyle, !isOtherUserMsg && { color: colors.black }]}>
            {text}
          </Text>
        )}
      </View>
     {!isOtherUserMsg && <Image source={icons.true} style={roundedView} />}
     {!isOtherUserMsg && seen && <Image source={icons.true} style={roundedView} />}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingStart: hScale(8),
    // width: hScale(312.7),
    flexDirection: "row-reverse",
    marginVertical: vScale(10)
  },
  imageContainer: {
    alignItems: "center",
    width: hScale(35)
  },
  imageStyle: {
    width: hScale(27.8),
    height: hScale(27.8),
    borderRadius: hScale(13.9),
    resizeMode: "cover"
  },
  messageContainer: {
    maxWidth: hScale(300),
    borderRadius: hScale(5),
    marginEnd: hScale(5),
    paddingVertical: vScale(5),
    paddingHorizontal: hScale(20),
    backgroundColor: colors.mainText,
    alignItems: "center",
    justifyContent: "center"
  },
  textStyle: {
    fontSize: fScale(10),
    color: colors.white,
    fontFamily: fonts.arial,
    lineHeight: vScale(12)
  },
  dateStyle: {
    fontSize: fScale(9),
    color: colors.convDiscriptionColor,
    marginTop: vScale(3.7),
    fontFamily: fonts.arial,
    textAlign: "center"
  },
  playIconStyle: {
    width: hScale(30),
    height: hScale(30),
    resizeMode: "contain",
    transform: [{ rotate: "180deg" }],
    tintColor: colors.first
  },
  roundedView: {
    ...sqScale(5),
    resizeMode: "contain",
    tintColor: colors.first,
    alignSelf: "flex-end"
  },
  sentImageStyle: {
    width: hScale(100),
    height: vScale(100),
    resizeMode: "contain"
  }
});
