import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  I18nManager
} from "react-native";
import StarRating from "react-native-star-rating";
import { fScale, hScale, vScale, crScale } from "step-scale";
import { icons, fonts } from "../assets";
import { colors } from "../constants";
import { strings } from "../strings";
import moment from "moment";

//main card is for orders and requests 
export const MainCard = props => {
  const {
    item,
    currentUserType,
    onPress,
    isTask,
    onPressChat,
    showDeleteButton,
    onPressDelete,
    isDeleting,
    isHistory,
    clientProfile,
    containerStyle,
    taskDetails,
    onPressRate,
    showReview,
    disableTouch
  } = props;

  const {
    category,
    requirements,
    created_at,
    budget,
    OrderStatus,
    status,
    review,
    offersCount,
    employee,
    client,
    price,
    order
  } = item;
  
  const currentUserIsEmployee = currentUserType == "employee";
  const otherUserObject = currentUserIsEmployee ? client : employee;
  const isRTL = I18nManager;
  const {
    container,
    imageContainer,
    imageStyle,
    detailsContainer,
    descriptionTextStyle,
    borderStyle,
    calendarStyle,
    glassStyle,
    flagStyle,
    textStyle,
    timeCostContainer,
    clientImageStyle,
    yourTasksContainer,
    chatButtonStyle,
    chatImageStyle,
    viewTaskButton,
    clientHistoryImageStyle,
    starStyle,
    rateContainer,
    clientNameStyle,
    calenderContainer,
    glassContainer,
    flagContainer,
    addRateStyle,
    statusContainer
  } = styles;

  const noOffers = offersCount === 0;
  const typesValues = {
    InProgress: {
      text: strings.inProgress,
      tintColor: colors.inProgress,
      textColor: colors.inProgress,
      backgroundColor: colors.inProgress,
      clientProfileText: strings.inProgress
    },
    UnderPayment: {
      text: strings.waitingPayment,
      tintColor: colors.waiting,
      textColor: colors.waiting,
      backgroundColor: colors.waiting,
      clientProfileText: strings.underPayment
    },
    Done: {
      text: strings.completed,
      tintColor: colors.completed,
      textColor: colors.completed,
      backgroundColor: colors.completed,
      clientProfileText: strings.done
    },
    Cancelled: {
      text: strings.cancelled,
      tintColor: colors.cancelled,
      textColor: colors.cancelled,
      backgroundColor: colors.cancelled,
      clientProfileText: strings.cancelled
    },
    Waiting: {
      text: strings.waitingOffers,
      tintColor: colors.waitingOffers,
      textColor: colors.mainText,
      backgroundColor: colors.paleGray,
      clientProfileText: noOffers
        ? strings.waitingOffers
        : `${strings.offers} : ${offersCount}`
    }
  };
  
  const isDone = status == "Done";
  const isOrder = status == "Confirmed";
  const componentStatus = isOrder ? OrderStatus : status;
  const disabled = ["Cancelled", "InProgress"].includes(status) || ["Done"].includes(OrderStatus) || isHistory;
  return (
    <TouchableOpacity
      disabled={disabled || disableTouch}
      style={[
        container,
        { height: isTask ? vScale(131.6) : vScale(77) },
        containerStyle
      ]}
      onPress={isDone && clientProfile ? onPressRate : onPress}
      activeOpacity={1}
    >
      {/* <TouchableOpacity onPress={onPressDelete} style={{ display: showDeleteButton ? "flex": "none" , position: "absolute", top: vScale(-5), left: hScale(-5), zIndex: 2, elevation: 2, backgroundColor: "white", ...crScale(isDeleting ?25: 15) }}>
        {isDeleting ? <ActivityIndicator color={colors.red} size={"small"} style={crScale(10)} /> :
          <Image source={icons.xClose} style={[crScale(10), { tintColor: colors.red }]} resizeMode="contain" />
        }
      </TouchableOpacity> */}
      <View
        style={[
          {
            flexDirection: "row",
            height: isTask ? vScale(65.8) : vScale(77)
          }
        ]}
      >
        <View
          style={[
            imageContainer,
            {
              height: isTask ? vScale(65.8) : vScale(77),
              borderBottomLeftRadius: isTask ? 0 : hScale(5),
              backgroundColor:
                isHistory && !clientProfile
                  ? colors.paleGray
                  : typesValues[componentStatus].backgroundColor
            }
          ]}
        >
          <Image
            source={category != null ? { uri: category.image } : {}}
            style={imageStyle}
            resizeMode={"contain"}
          />
        </View>

        <View style={detailsContainer}>
          {isHistory || showReview ? (
            <View style={rateContainer}>
              <Image
                source={
                  otherUserObject.avatar
                    ? { uri: otherUserObject.avatar }
                    : icons.userPlaceholder
                }
                style={clientHistoryImageStyle}
                resizeMode={"cover"}
              />
              <Text numberOfLines={1} style={[textStyle, clientNameStyle]}>
                {otherUserObject.first_name + " " + otherUserObject.last_name}
              </Text>
              {(isDone || isHistory) &&
                (review ? (
                  <View>
                    <StarRating
                      containerStyle={{
                        width: hScale(70),
                        marginBottom: vScale(5),
                        alignSelf: "flex-end"
                      }}
                      disabled
                      emptyStar={icons.inActiveStar}
                      fullStar={icons.activeStar}
                      maxStars={5}
                      rating={review ? review.rate : 0}
                      halfStar={icons.halfStar}
                      starStyle={starStyle}
                    />
                    <Text
                      numberOfLines={2}
                      style={[
                        textStyle,
                        { width: hScale(150), textAlign:"right" }
                      ]}
                    >
                      {review.comment || ""}
                    </Text>
                  </View>
                ) : isDone ? (
                  <Text numberOfLines={1} style={[textStyle, addRateStyle]}>
                    {strings.pleaseAddRate}
                  </Text>
                ) : (
                  <Text numberOfLines={1} style={[textStyle, addRateStyle]}>
                    {strings.noReviewYet}
                  </Text>
                ))}
            </View>
          ) : (
            <Text
              numberOfLines={3}
              style={[descriptionTextStyle, isRTL && { textAlign: "left" }]}
            >
              {requirements}
            </Text>
          )}
          <View style={borderStyle} />
          <View style={timeCostContainer}>
            <View style={calenderContainer}>
              <Image
                source={icons.calendar}
                resizeMode={"contain"}
                style={calendarStyle}
              />
              <Text style={textStyle}>
                {moment(created_at).format("YYYY/MM/DD")}
              </Text>
            </View>
            <View style={glassContainer}>
              <Image
                source={icons.glass}
                resizeMode={"contain"}
                style={glassStyle}
              />
              <Text style={textStyle}>
                {moment(created_at).format("HH:MM")}
              </Text>
            </View>
            <View style={flagContainer}>
              <Image
                source={icons.flag}
                resizeMode={"contain"}
                style={[
                  flagStyle,
                  isHistory && { tintColor: colors.historyColor },
                  clientProfile && {
                    tintColor: typesValues[componentStatus].tintColor
                  }
                ]}
              />
              {clientProfile ? (
                <Text
                  numberOfLines={1}
                  style={[
                    textStyle,
                    { color: typesValues[componentStatus].textColor }
                  ]}
                >
                  {typesValues[componentStatus].clientProfileText}
                </Text>
              ) : (
                <Text
                  numberOfLines={1}
                  style={[
                    textStyle, { fontSize: fScale(12), color:colors.priceC, fontWeight: "900"},
                    isHistory && { color: colors.historyColor }
                  ]}
                >
                  {order ? order.price : price ? price : budget} {strings.currency}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
      {isTask && (
        <View style={yourTasksContainer}>
          <Image
            source={
              client.avatar ? { uri: client.avatar } : icons.userPlaceholder
            }
            resizeMode={"cover"}
            style={clientImageStyle}
          />
          <Text
            style={[
              textStyle,
              { width: hScale(90) },
              isRTL && { textAlign: "left" }
            ]}
            numberOfLines={1}
          >
            {client.first_name + " " + client.last_name}
          </Text>
          <View style={statusContainer}>
            <Text
              style={[
                textStyle,
                { marginBottom: vScale(4) },
                isRTL && { textAlign: "left" }
              ]}
            >
              {strings.status} :
            </Text>
            <Text style={[textStyle, isRTL && { textAlign: "left" }]}>
              {typesValues[componentStatus].text}
            </Text>
          </View>
          <TouchableOpacity style={chatButtonStyle} onPress={onPressChat}>
            <Image
              source={icons.chatImage}
              resizeMode={"contain"}
              style={chatImageStyle}
            />
          </TouchableOpacity>
          {taskDetails ? null : (
            <View style={viewTaskButton}>
              <Text style={[textStyle, { fontSize: fScale(12) }]}>
                {strings.view}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: hScale(352),
    borderRadius: hScale(5),
    marginBottom: vScale(13.8),
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
  imageContainer: {
    width: hScale(52.6),
    // height: vScale(77),
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: hScale(5)
  },
  imageStyle: {
    width: hScale(40),
    height: hScale(40)
  },
  detailsContainer: {
    width: hScale(299.4),
    height: vScale(77),
    paddingStart: hScale(12.7),
    paddingEnd: hScale(6.7),
    justifyContent: "center"
  },
  descriptionTextStyle: {
    color: colors.mainText,
    fontSize: fScale(14),
    width: hScale(267),
    minHeight: vScale(28),
    marginBottom: vScale(5.5),
    fontFamily: fonts.arial
  },
  borderStyle: {
    width: hScale(274.8),
    height: vScale(0.5),
    backgroundColor: colors.mainBorder,
    marginBottom: vScale(5.5)
  },
  calendarStyle: {
    width: hScale(9.6),
    height: vScale(10.6),
    marginEnd: hScale(7.4)
  },
  glassStyle: {
    width: hScale(10.6),
    height: hScale(10.6),
    marginEnd: hScale(7.4)
  },
  flagStyle: {
    width: hScale(8),
    height: vScale(9),
    marginEnd: hScale(7.4)
  },
  textStyle: {
    color: colors.mainText,
    fontSize: fScale(9),
    fontFamily: fonts.arial
  },
  timeCostContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    width: hScale(274.8)
  },
  clientImageStyle: {
    width: hScale(37.1),
    height: hScale(37.1),
    borderRadius: hScale(18.55),
    marginStart: hScale(10.8),
    marginEnd: hScale(11.1)
  },
  yourTasksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: vScale(15.8),
    paddingEnd: hScale(10)
  },
  chatButtonStyle: {
    width: hScale(29.2),
    height: vScale(26),
    borderRadius: hScale(5),
    marginEnd: hScale(10),
    marginStart: hScale(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.chatButtonBackground,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  },
  chatImageStyle: {
    width: hScale(12.2),
    height: vScale(12.2)
  },
  viewTaskButton: {
    width: hScale(68.4),
    height: vScale(26),
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
  clientHistoryImageStyle: {
    width: hScale(28),
    height: hScale(28),
    borderRadius: hScale(14),
    marginEnd: hScale(9)
  },
  starStyle: {
    width: hScale(9.9),
    height: hScale(9.9),
    marginEnd: hScale(4.6)
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: vScale(6.9),
    marginBottom: vScale(10)
  },
  clientNameStyle: {
    fontSize: fScale(14),
    flex: 1,
    textAlign: "left",
    fontFamily: fonts.arial
  },
  calenderContainer: {
    flexDirection: "row",
    marginEnd: hScale(5),
    alignItems: "center"
  },
  glassContainer: {
    flexDirection: "row",
    marginEnd: hScale(8),
    alignItems: "center"
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  addRateStyle: {
    color: colors.completed
  },
  statusContainer: {
    width: hScale(80),
    justifyContent: "center",
    alignItems: "center"
  }
});
