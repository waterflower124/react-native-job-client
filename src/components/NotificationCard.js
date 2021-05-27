import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  I18nManager
} from "react-native";
import { fScale, hScale, vScale, crScale } from "step-scale";
import { icons, fonts } from "../assets";
import { colors } from "../constants";
import { strings } from "../strings";
import moment from "moment";

export const NotificationCard = props => {
  const { item, onPress, onPressDelete, isDeleting, loading } = props;
  const { message, type, created_at, moreData } = item;
  const { price, requirements, budget, lastMessage, note } = moreData || {};
  const isVoiceMessage = lastMessage && lastMessage.type === 2;
  const isPhotoImage = lastMessage && lastMessage.type === 3;
  const {
    container,
    textStyle,
    imageContainer,
    detailsContainer,
    costTextStyle,
    buttonStyle,
    notificationStyle,
    msgNotificationStyle,
    dateTimeContainer,
    dateTimeTextStyle
  } = styles;
  const { isRTL } = I18nManager;
  const typesValues = {
    NewRequestEmployee: {
      showCost: true,
      showButton: true,
      disableButton: false,
      offerAgreed: false,
      backgroundColor: colors.notifyNewTask,
      image: icons.notification,
      imageStyle: notificationStyle,
      text: message,
      buttonText: strings.view,
      numOfLines: 1,
      textNumOfLines: 1
    },
    NewOfferClient: {
      showCost: true,
      showButton: true,
      disableButton: true,
      offerAgreed: false,
      backgroundColor: colors.notifyNewTask,
      image: icons.notification,
      imageStyle: notificationStyle,
      text: message,
      buttonText: strings.view,
      numOfLines: 2,
      textNumOfLines: 1
    },
    AcceptOfferEmployee: {
      showCost: true,
      showButton: true,
      disableButton: false,
      offerAgreed: true,
      backgroundColor: colors.offerAgreed,
      image: icons.msgNotification,
      imageStyle: msgNotificationStyle,
      text: message,
      buttonText: strings.view,
      numOfLines: 2,
      textNumOfLines: 1
    },
    NewMessage: {
      showCost: false,
      showButton: false,
      disableButton: false,
      offerAgreed: false,
      backgroundColor: colors.newMessageBackground,
      image: icons.msgNotification,
      imageStyle: msgNotificationStyle,
      text: message,
      numOfLines: 2,
      textNumOfLines: 1
    },
    OrderUnderPaymentEmployee: {
      showCost: false,
      showButton: true,
      disableButton: true,
      offerAgreed: false,
      backgroundColor: colors.waiting,
      image: icons.notification,
      imageStyle: notificationStyle,
      text: message,
      buttonText: strings.view,
      numOfLines: 2,
      textNumOfLines: 2
    },
    OrderUnderPaymentClient: {
      showCost: false,
      showButton: false,
      disableButton: true,
      offerAgreed: false,
      backgroundColor: colors.waiting,
      image: icons.msgNotification,
      imageStyle: msgNotificationStyle,
      text: message,
      numOfLines: 2,
      textNumOfLines: 2
    },
    PaymentOnlineLink: {
      showCost: false,
      showButton: false,
      disableButton: false,
      offerAgreed: false,
      backgroundColor: colors.waiting,
      image: icons.msgNotification,
      imageStyle: msgNotificationStyle,
      text: message,
      numOfLines: 2,
      textNumOfLines: 2
    },
    OrderInProgressClient: {
      showCost: false,
      showButton: false,
      disableButton: true,
      offerAgreed: true,
      backgroundColor: colors.waiting,
      image: icons.msgNotification,
      imageStyle: msgNotificationStyle,
      text: message,
      numOfLines: 2,
      textNumOfLines: 2
    },
    OrderDoneClient: {
      showCost: true,
      showButton: false,
      disableButton: true,
      offerAgreed: true,
      backgroundColor: colors.offerAgreed,
      image: icons.msgNotification,
      imageStyle: msgNotificationStyle,
      text: message,
      numOfLines: 2,
      textNumOfLines: 2
    },
    RejectOfferEmployee: {
      showCost: false,
      showButton: false,
      disableButton: true,
      offerAgreed: false,
      backgroundColor: colors.red,
      image: icons.notification,
      imageStyle: notificationStyle,
      text: message,
      numOfLines: 2,
      textNumOfLines: 2
    },
    ReviewOrder: {
      showCost: false,
      showButton: false,
      disableButton: false,
      offerAgreed: false,
      backgroundColor: colors.offerAgreed,
      image: icons.notification,
      imageStyle: notificationStyle,
      text: message,
      numOfLines: 2,
      textNumOfLines: 2
    },
  };
  const { showCost, showButton, offerAgreed, disableButton } = typesValues[
    type
  ];
  return (
    <TouchableOpacity
      style={container}
      onPress={onPress}
      disabled={disableButton || loading}
      activeOpacity={1}
    >
      {/* <TouchableOpacity onPress={onPressDelete} style={{ position: "absolute", top: vScale(-5), left: hScale(-5), zIndex: 2, elevation: 2, backgroundColor: "white", ...crScale(isDeleting ?25: 15) }}>
        {isDeleting ? <ActivityIndicator color={colors.red} size={"small"} style={crScale(10)} /> :
          <Image source={icons.xClose} style={[crScale(10), { tintColor: colors.red }]} resizeMode="contain" />
        }
      </TouchableOpacity> */}
      <View
        style={[
          imageContainer,
          {
            backgroundColor: typesValues[type].backgroundColor
          }
        ]}
      >
        <Image
          resizeMode={"contain"}
          source={typesValues[type].image}
          style={typesValues[type].imageStyle}
        />
      </View>
      <View style={detailsContainer}>
        <Text
          numberOfLines={typesValues[type].textNumOfLines}
          style={[
            textStyle,
            { marginBottom: vScale(3.3) },
            isRTL && { textAlign: "left" }
          ]}
        >
          {typesValues[type].text}
        </Text>
        {showCost && (
          <Text
            style={[costTextStyle, isRTL && { textAlign: "left" }]}
            numberOfLines={1}
          >
            {price ? price : budget} {strings.currency}
          </Text>
        )}
        {offerAgreed ? (
          <View style={dateTimeContainer}>
            <Text style={dateTimeTextStyle}>
              {strings.date} : {moment(created_at).format("YYYY/MM/DD")}
            </Text>
            <Text numberOfLines={1} style={dateTimeTextStyle}>
              {strings.time} : {moment(created_at).format("hh:mm")}
            </Text>
          </View>
        ) : (
            <Text
              numberOfLines={typesValues[type].numOfLines}
              style={[dateTimeTextStyle, isRTL && { textAlign: "left" }]}
            >
              {lastMessage ? ""
                // ? isVoiceMessage
                //   ? strings.voiceMassage
                // : isPhotoImage
                //   ? strings.image
                //   : lastMessage.text
                : requirements || note}
            </Text>
          )}
      </View>
      {showButton && (
        <TouchableOpacity style={buttonStyle} activeOpacity={1} onPress={onPress}>
          {loading ? (
            <ActivityIndicator color={colors.second} size={"small"} />
          ) : (
              <Text style={textStyle}>{typesValues[type].buttonText}</Text>
            )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: hScale(351.3),
    height: vScale(63),
    borderRadius: hScale(5),
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
  imageContainer: {
    width: hScale(52.6),
    height: vScale(63),
    justifyContent: "center",
    alignItems: "center",
    marginEnd: hScale(11.1),
    borderTopLeftRadius: hScale(5),
    borderBottomLeftRadius: hScale(5)
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    marginEnd: hScale(3.5)
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
  },
  notificationStyle: {
    width: hScale(22.2),
    height: vScale(24.4)
  },
  msgNotificationStyle: {
    width: hScale(24.4),
    height: hScale(24.4)
  },
  dateTimeContainer: {
    width: hScale(200),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dateTimeTextStyle: {
    color: colors.mainText,
    fontSize: fScale(11),
    fontFamily: fonts.arial
  }
});
