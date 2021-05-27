import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  I18nManager,
  TextInput,
  ScrollView,
  Platform,
  TouchableOpacity,
  Switch
} from "react-native";
import { fScale, hScale, vScale, sWidth } from "step-scale";
import StarRating from "react-native-star-rating";
import {
  ChatIcon,
  Container,
  DrawerIcon,
  NotificationCard,
  CreditBalance,
  EmptyScreen,
  HeaderLogo,
  ModalContainer,
  Button
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { icons, fonts } from "../assets";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";
import { actions } from "../helpers";
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import global from '../global/global';

const { isRTL } = I18nManager;

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation, user } = this.props;
    navigation.setParams({
      isEmployee: user.data.type == "employee",
      refreshNotifications: () => this.refreshNotifications()
    });

    var isEmployee = false;
    if(this.props.route.params) {
      isEmployee = this.props.route.params.isEmployee;
    }
    this.props.navigation.setOptions({
      headerLeft: () => <HeaderLogo />,
      headerRight: () => 
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <ChatIcon onPress={() => this.props.navigation.navigate("Messages")} /> */}
          <DrawerIcon onPress={() => this.props.navigation.openDrawer()} />
        </View>
    })
  }
  state = {
    deletingItemWithID: null,
    // screenLoading: true,
    data: [],
    pageNo: 1,
    last_page: null,
    confirmLoading: null,
    listLoading: false,
    errors: [],
    rate: 0,
    feedback: "",
    modalVisible: false,
    notification_status: true
  };

  componentDidMount() {
    // this.getNotifications();
    this.getNotificationStatus();
    this.forcusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifications();
    });

    this.notiOfferCreatedListener = EventRegister.addEventListener(global.NOTI_OFFER_CREATED, () => {
      this.getNotifications();
    })
    this.notiTaskDoneListener = EventRegister.addEventListener(global.NOTI_TASK_DONE, () => {
      this.getNotifications();
    })
    this.notiPayNowListener = EventRegister.addEventListener(global.NOTI_TASK_PAYNOW, () => {
      this.getNotifications();
    })
    this.notiTaskReviewListener = EventRegister.addEventListener(global.NOTI_TASK_REVIEW, () => {
      this.getNotifications();
    })
    this.notiOthersListener = EventRegister.addEventListener(global.NOTI_OTHERS, () => {
      this.getNotifications();
    })
    this.notiRequestResetListener = EventRegister.addEventListener(global.NOTI_REQUEST_RESET, () => {
      this.getNotifications();
    })
  }

  async componentWillUnmount() {
    this.forcusListener();
    EventRegister.removeEventListener(this.notiOfferCreatedListener);
    EventRegister.removeEventListener(this.notiTaskDoneListener);
    EventRegister.removeEventListener(this.notiPayNowListener);
    EventRegister.removeEventListener(this.notiTaskReviewListener);
    EventRegister.removeEventListener(this.notiOthersListener);
    EventRegister.removeEventListener(this.notiRequestResetListener);
  }

  async componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    // const oldRefresh = prevProps.navigation.getParam("refresh");
    // const newRefresh = navigation.getParam("refresh");
    const oldRefresh = prevProps.route.refresh;
    const newRefresh = this.props.route.params.refresh;
    if (newRefresh && newRefresh != oldRefresh) {
      navigation.setParams({ refresh: false });
      setTimeout(() => {
        this.getNotifications();
      }, 2000);
    }
  }

  async getNotificationStatus() {
    const response = await StepRequest(`notification-status`);
    if(response != null) {
      if(response.status == 1) {
        this.setState({
          notification_status: true
        })
      } else {
        this.setState({
          notification_status: false
        })
      }
    }
  }

  async notificationSwtichChange() {
    
    var body = null;
    if(this.state.notification_status) {
      body = {
        noti_status: 0
      }
    } else {
      body = {
        noti_status: 1
      }
    }
    this.setState({
      notification_status: !this.state.notification_status
    })
    const data = await StepRequest("notification-status", "POST", body);
    if(data == null) {
      this.setState({
        notification_status: !this.state.notification_status
      })
    }
  }

  async getNotifications() {

    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      this.setState({
        screenLoading: false,
        listLoading: false
      });
      return;
    } 

    const { pageNo, data } = this.state;
    const isFirstPage = pageNo == 1;
    try {
     
      const response = await StepRequest(`notifications?page=${pageNo}`);
      this.setState({
        data: isFirstPage ? response.data : [...data, ...response.data],
        screenLoading: false,
        last_page: response.last_page,
        listLoading: false
      });
      console.log("get notification response", data);
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });

      Alert.alert(error.message);
    }
  }

  openRequestDetails(request_id){
    // this.props.navigation.navigate("RequestDetails", {
    //   item: { id: request_id, offers: [], image: '' },
    //   getData: true
    // });
    this.props.navigation.navigate("RequestDetails", {id: request_id});
  }

  async acceptOffer(selectedItem) {
    this.setState({ confirmLoading: selectedItem.id });
    try {
      const acceptBody = {
        offer_id: selectedItem.id,
        request_id: selectedItem.request_id
      };
      const data = await StepRequest("client-offers", "POST", acceptBody);
      this.setState({ confirmLoading: null, pageNo: 1 }, () =>
        this.getNotifications()
      );
      console.log("accept offer response", data);
    } catch (error) {
      this.setState({ confirmLoading: null });
      Alert.alert(error.message);
    }
  }

  refreshNotifications() {
    this.setState({ pageNo: 1, listLoading: true }, () =>
      this.getNotifications()
    );
  }

  async completeRequest(order_id) {
    this.setState({ confirmLoading: order_id });
    try {
      const data = await StepRequest("employee-orders/statusDone", "POST", {
        order_id
      });
      await actions.refreshWalletBalance();
      this.setState({ confirmLoading: null });
      console.log("completed response", data);
    } catch (error) {
      this.setState({ confirmLoading: null });
      Alert.alert(error.message);
    }
  }
  openTaskDetails(request_id){
    this.props.navigation.navigate("TaskDetails", { id: request_id });
  }

  async addReview() {
    let { rate, feedback, selectedItem } = this.state;
    const body = { rate, comment: feedback, order_id: selectedItem.data };
    feedback = feedback.trim();
    let errors = [];
    if (feedback == "") {
      errors.push("feedback");
    }
    if (rate == 0) {
      errors.push("rate");
    }
    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }
    try {
      this.setState({ errors: [] });
      const data = await StepRequest("order-review", "POST", body);
      console.log("review response", data);
      this.refreshNotifications();
      this.setState({ modalVisible: false, rate: 0, feedback: "" });
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  async deleteNotification({ id }) {
    try {
      this.setState({ deletingItemWithID: id });
      const data = await StepRequest(`notifications/${id}`, "DELETE");
      console.log("delete notification response", data);
      this.refreshNotifications();
    } catch (error) {
      Alert.alert(error.message);
    }
    this.setState({ deletingItemWithID: null });
  }

  

  render() {
    const {
      container,
      textStyle,
      secTitleStyle,
      emptyImageStyle,
      modalButtonStyle,
      modalRateButtonContainer,
      modalTitleStyle,
      serviceRateContainer,
      serviceTextStyle,
      modalStyle,
      starStyle,
      modalInputStyle,
      errorStyle
    } = styles;
    const {
      deletingItemWithID,
      screenLoading,
      data,
      pageNo,
      last_page,
      confirmLoading,
      listLoading,
      modalVisible,
      rate,
      feedback,
      errors
    } = this.state;
    const { navigation } = this.props;
    const noNotifications = data.length == 0;
    const endReached = pageNo == last_page;
    const rateError = errors.includes("rate");
    const feedBackError = errors.includes("feedback");
    return (
      <Container loading={screenLoading} gradientHeader style={container}>
        <ModalContainer
          modalVisible={modalVisible}
          onClose={() => this.setState({ modalVisible: false })}
          style={modalStyle}
        >
          <ScrollView scrollEnabled={false}>
            <View style={modalRateButtonContainer}>
              <View style={serviceRateContainer}>
                <Text style={serviceTextStyle}>{strings.serviceValues}</Text>
                <StarRating
                  selectedStar={rate => this.setState({ rate, errors: [] })}
                  emptyStar={icons.bigInActiveStar}
                  fullStar={icons.bigActiveStar}
                  maxStars={5}
                  rating={rate}
                  starStyle={starStyle}
                />
              </View>
              <Text style={errorStyle}>
                {rateError && strings.rateRequired}
              </Text>
              <TextInput
                onChangeText={feedback =>
                  this.setState({ feedback, errors: [] })
                }
                value={feedback}
                placeholder={strings.yourFeedback}
                style={modalInputStyle}
                multiline
                maxLength={140}
              />
              <Text style={errorStyle}>
                {feedBackError && strings.feedbackRequired}
              </Text>
              <Button
                onPress={() => this.addReview()}
                linearCustomStyle={{ borderRadius: 0 }}
                title={strings.send}
                style={modalButtonStyle}
                titleStyle={modalTitleStyle}
              />
            </View>
          </ScrollView>
        </ModalContainer>
        <Text style={textStyle}>{strings.notifications}</Text>
        <Text style={[textStyle, secTitleStyle]}>
          {strings.chooseServiceAndLetsStart}
        </Text>
        <View style = {{width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20}}>
          <Text style={[ secTitleStyle, {color: colors.white, paddingHorizontal: 0, marginEnd: hScale(15.4), marginBottom: 0}]}>
            {strings.notification_setting}
          </Text>
          <Text style={{fontSize: fScale(15), fontFamily: fonts.arial, color: colors.white, }}>
            {isRTL && Platform.OS == "android" ? strings.on : strings.off}
          </Text>
          <View style = {{paddingHorizontal: hScale(5.4)}}>
            <Switch
                trackColor={{ false: "#767577", true: '#81b0ff' }}
                thumbColor={this.state.notification_status ? "#ffffff" : '#f5dd4b'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.notificationSwtichChange()}
                value={this.state.notification_status}
            />
          </View>
          <Text style={{fontSize: fScale(15), fontFamily: fonts.arial, color: colors.white, }}>
            {isRTL && Platform.OS == "android" ? strings.off : strings.on}
          </Text>
        </View>
        {noNotifications ? (
          <EmptyScreen
            title={strings.noNotifications}
            image={icons.emptyNoNotifications}
            imageStyle={emptyImageStyle}
            onPress={() =>
              this.setState({ screenLoading: true }, () =>
                this.refreshNotifications()
              )
            }
          />
        ) : (
            <SwipeListView
              onRefresh={() => this.refreshNotifications()}
              refreshing={listLoading}
              onEndReachedThreshold={0.5}
              onEndReached={() =>
                !endReached &&
                this.setState({ pageNo: pageNo + 1 }, () =>
                  this.getNotifications()
                )
              }
              data={data}
              extraData={this.state}
              contentContainerStyle={{ alignItems: "center", paddingTop: vScale(10) }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const { type, moreData, data } = item;
                const user = {type: "employee"}
                const onPresses = {
                  NewRequestEmployee: () => navigation.navigate("Home", {screen: "ClientsTab", params: {user: user}}),
                  AcceptOfferEmployee: () => {
                    navigation.navigate("TaskDetails", { id: item.data })
                  },
                  NewMessage: () =>
                    navigation.navigate("Chat", {
                      receiver_id: moreData.second.id,
                      avatar: moreData.second.avatar,
                      task_id: item.request_id
                    }),
                  PaymentOnlineLink: () => navigation.navigate("PaymentWebview", { uri: data }),
                  NewOfferClient: async () => {
                    this.openRequestDetails(item.moreData.request_id);
                  },
                  OrderUnderPaymentEmployee: async () => {
                    this.openTaskDetails(moreData.request_id)

                  },
                  ReviewOrder: async () => {
                    this.setState({
                      modalVisible: true,
                      selectedItem: item,
                      order_id: item.id
                    });
                  }
                };
                return (
                  <NotificationCard
                    loading={(item.moreData == null || item.moreData.id == null) ? false : confirmLoading === item.moreData.id}
                    onPress={onPresses[type]}
                    onPressDelete={() => this.deleteNotification(item)}
                    isDeleting={deletingItemWithID == item.id}
                    item={item}
                  />
                );
              }}
              renderHiddenItem = {({item, rowMap}) => 
                <View style = {{ width: '100%', height: vScale(63), alignItems: 'flex-end' }}>
                {
                  item.type && item.type != "PaymentOnlineLink" &&
                  <TouchableOpacity style = {{height: '100%', aspectRatio: 1, borderRadius: hScale(5), backgroundColor: '#FF0000', justifyContent: 'center', alignItems: 'center'}}
                    onPress = {() => this.deleteNotification(item)}>
                    <Text style = {styles.delete_textStyle}>{strings.notification_delete}</Text>
                  </TouchableOpacity>
                }
                </View>
              }
              leftOpenValue={isRTL ? vScale(63) : 0}
              rightOpenValue={isRTL ? 0 : -vScale(63)}
            />
          )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(89.5),
    paddingBottom: vScale(74),
    alignItems: "stretch"
  },
  textStyle: {
    color: colors.white,
    fontSize: fScale(23),
    alignSelf: "flex-start",
    paddingHorizontal: hScale(22.4),
    marginBottom: vScale(7.1),
    fontFamily: fonts.arial
  },
  secTitleStyle: {
    fontSize: fScale(17),
    marginBottom: vScale(31.4),
    fontFamily: fonts.arial
  },
  emptyImageStyle: {
    width: hScale(51.4),
    height: vScale(61.7)
  },
  modalRateButtonContainer: {
    width: hScale(375),
    // height: vScale(163.6),
    alignItems: "center",
    paddingHorizontal: hScale(40)
  },
  serviceRateContainer: {
    width: sWidth,
    paddingHorizontal: hScale(40),
    marginTop: vScale(15.6),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vScale(25)
  },
  modalButtonStyle: {
    width: hScale(294.3),
    height: vScale(52.6),
    borderRadius: 0
  },
  modalTitleStyle: {
    textAlign: "center",
    fontSize: fScale(15),
    fontFamily: fonts.arial
  },
  serviceTextStyle: {
    fontSize: fScale(14),
    color: colors.mainText,
    fontFamily: fonts.arial
  },
  modalStyle: {
    height: Platform.select({ ios: vScale(200), android: vScale(230) }),
    width: hScale(350),
    alignSelf: "flex-end",
    borderTopRightRadius: hScale(5),
    borderTopLeftRadius: hScale(5),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(9),
    shadowOpacity: 1,
    elevation: 10
  },
  starStyle: {
    width: hScale(15.2),
    height: hScale(15.2),
    marginEnd: hScale(4.6)
  },
  modalInputStyle: {
    width: hScale(294.3),
    textAlign: isRTL ? "right" : "left",
    color: colors.mainText,
    fontSize: fScale(13),
    height: vScale(46),
    marginBottom: vScale(4),
    fontFamily: fonts.arial
  },
  errorStyle: {
    color: colors.error,
    fontSize: fScale(13)
  },
  delete_textStyle: {
    color: colors.white,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  },
});

export const Notification = connect(NotificationScreen);
