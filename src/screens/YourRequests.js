import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View,Alert, I18nManager, TouchableOpacity } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import {
  ChatIcon,
  Container,
  DrawerIcon,
  MainCard,
  EmptyScreen,
  HeaderLogo
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { icons, fonts } from "../assets";
import { StepRequest } from "step-api-client";
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import global from '../global/global';

const { isRTL } = I18nManager;

export class YourRequests extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setParams({
      refreshRequests: () => this.refreshRequests()
    });
    
    this.props.navigation.setOptions({
      headerLeft: () => <HeaderLogo />,
      headerRight: () =>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <ChatIcon onPress={() => this.props.navigation.navigate("Messages")} /> */}
          <DrawerIcon onPress={() => this.props.navigation.openDrawer()} />
        </View>
    });

  }

  state = { screenLoading: true, data: [], listLoading: false, deletingItemWithID: null };
  
  // async componentDidUpdate(prevProps) {
  //   const { navigation } = this.props;
  //   // const oldRefresh = prevProps.navigation.getParam("refresh");
  //   // const newRefresh = navigation.getParam("refresh");
  //   const oldRefresh = prevProps.route.refresh;
  //   const newRefresh = this.props.route.params.refresh;
  //   if (newRefresh && newRefresh != oldRefresh) {
  //     await navigation.setParams({
  //       refresh: false
  //     });
  //     this.refreshRequests();
  //   }
  // }

  async componentDidMount() {
    // this.loadMyRequests();
    this.forcusListener = this.props.navigation.addListener('focus', () => {
      this.refreshRequests();
    });

    this.notiOfferCreatedListener = EventRegister.addEventListener(global.NOTI_OFFER_CREATED, () => {
      this.refreshRequests();
    })
    this.notiTaskDoneListener = EventRegister.addEventListener(global.NOTI_TASK_DONE, () => {
      this.refreshRequests();
    })
    this.notiPayNowListener = EventRegister.addEventListener(global.NOTI_TASK_PAYNOW, () => {
      this.refreshRequests();
    })
    this.notiTaskReviewListener = EventRegister.addEventListener(global.NOTI_TASK_REVIEW, () => {
      this.refreshRequests();
    })
    this.notiRequestResetListener = EventRegister.addEventListener(global.NOTI_REQUEST_RESET, () => {
      this.refreshRequests();
    })
  }

  async componentWillUnmount() {
    this.forcusListener();
    EventRegister.removeEventListener(this.notiOfferCreatedListener);
    EventRegister.removeEventListener(this.notiTaskDoneListener);
    EventRegister.removeEventListener(this.notiPayNowListener);
    EventRegister.removeEventListener(this.notiTaskReviewListener);
    EventRegister.removeEventListener(this.notiRequestResetListener);
  }

  async cancelRequest(id) {
    this.setState({ deletingItemWithID: id });

    try {
      const data = await StepRequest("client-requests/canceled", "POST", { service_request_id: id });
      Alert.alert(data);
      this.refreshRequests()
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });
      Alert.alert(error.message);
    }
    this.setState({ deletingItemWithID: null });
  }

  async loadMyRequests() {

    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      this.setState({
        screenLoading: false,
        listLoading: false
      });
      return;
    } 

    try {
      const data = await StepRequest("client-requests");
      this.setState({
        data,
        screenLoading: false,
        listLoading: false
      });
      console.log("client request response:", JSON.stringify(data));
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });
      Alert.alert(error.message);
    }
  }

  refreshRequests() {
    
    this.setState({ listLoading: true }, () => this.loadMyRequests());
  }

  render() {
    const { container, textStyle, secTitleStyle, emptyImageStyle } = styles;
    const { screenLoading, data, listLoading, deletingItemWithID } = this.state;
    const { navigation } = this.props;
    const noRequests = data.length == 0;
    return (
      <Container loading={screenLoading} gradientHeader style={container}>
        <Text style={textStyle}>{strings.yourRequests}</Text>
        <Text style={[textStyle, secTitleStyle]}>
          {strings.chooseServiceAndLetsStart}
        </Text>
        {noRequests ? (
          <EmptyScreen
            title={strings.noRequests}
            image={icons.emptyNoRequests}
            imageStyle={emptyImageStyle}
            onPress={() =>
              this.setState({ screenLoading: true }, () =>
                this.refreshRequests()
              )
            }
          />
        ) : (
          <SwipeListView
            onRefresh={() => this.refreshRequests()}
            refreshing={listLoading}
            data={data}
            extraData={this.state}
            contentContainerStyle={{ alignItems: "center", paddingVertical: vScale(10) }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <MainCard
                  showDeleteButton
                  onPressDelete={() => this.cancelRequest(item.id)}
                  isDeleting={deletingItemWithID == item.id}
                  disableTouch={item.OrderStatus === "UnderPayment"}
                  onPress={() => {
                    if (item.OrderStatus === "InProgress") {
                      if(item.offers.length == 0) {

                      } else {
                        if(item.assignedEmployee != null) {
                          navigation.navigate("Chat", {
                            receiver_id: item.assignedEmployee.id,
                            avatar: item.assignedEmployee.avatar,
                            task_id: item.id
                          });
                        }
                      } 
                    } else {
                      navigation.navigate("RequestDetails", { id: item.id })
                    }
                  }}
                  clientProfile
                  item={item}
                />
              );
            }}
            renderHiddenItem = {({item, rowMap}) => (
              <View style = {{ width: '100%', height: vScale(77), alignItems: 'flex-end' }}>
                <TouchableOpacity style = {{height: '100%', aspectRatio: 1, borderRadius: hScale(5), backgroundColor: '#FF0000', justifyContent: 'center', alignItems: 'center'}}
                  onPress = {() => this.cancelRequest(item.id)}>
                  <Text style = {styles.delete_textStyle}>{strings.notification_delete}</Text>
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={isRTL ? vScale(77) : 0}
            rightOpenValue={isRTL ? 0 : -vScale(77)}
          />
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(89.5),
    paddingBottom: vScale(64),
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
    width: hScale(42.3),
    height: vScale(46.1)
  }
});
