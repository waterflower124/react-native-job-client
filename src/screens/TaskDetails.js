import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { fScale, hScale, sWidth, vScale } from "step-scale";
import { fonts } from "../assets";
import { BackButton, Container, MainCard } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { whiteHeaderOptions } from "../navigation/options";
import { StepRequest } from "step-api-client";
import { connect } from "step-react-redux";
import { actions } from "../helpers";

class TaskDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      ...whiteHeaderOptions,
      headerLeft: () =>
        <BackButton
          backWithTitle
          onPress={() => this.props.navigation.goBack()}
          title={strings.request}
        />
    })

    const id = this.props.route.params.id;
    this.state = {
      data: { lng: 0, lat: 0 },
      screenLoading: true,
      location: null,
      id,
      cancelLoading: false,
      completeLoading: false,
      order_id: null
    };
  }
  
  componentDidMount() {
    this.loadSingleTask();
  }
  async loadSingleTask() {
    const { id } = this.state;
    try {
      const data = await StepRequest(`employee-requests/${id}`);
      this.setState({ data, order_id: data.order.id, screenLoading: false });
      console.log("sigle task response:", JSON.stringify(data));
    } catch (error) {
      this.setState({ screenLoading: false });
      Alert.alert(error.message);
    }
  }

  async cancelRequest() {
    const { order_id } = this.state;
    this.setState({ cancelLoading: true });
    try {
      const data = await StepRequest("employee-orders/statusCanceled", "POST", {
        order_id
      });
      console.warn("cancelled", data);
      Alert.alert(data)
      await this.setState({ cancelLoading: false });
      await this.props.navigation.navigate("YourTasks", { refresh: true });
    } catch (error) {
      this.setState({ cancelLoading: false });
      Alert.alert(error.message);
    }
  }
  async completeRequest() {
    const { order_id } = this.state;
    this.setState({ completeLoading: true });
    console.warn("order_id", order_id);
    try {
      const data = await StepRequest("employee-orders/statusDone", "POST", {
        order_id
      });
      await actions.refreshWalletBalance();
      Alert.alert(data)
      await this.setState({ completeLoading: false });
      await this.props.navigation.navigate("YourTasks", { refresh: true });
      console.warn("completed", data);
    } catch (error) {
      this.setState({ completeLoading: false });
      Alert.alert(error.message);
    }
  }
  async underPaymentRequest() {
    const { order_id } = this.state;
    this.setState({ completeLoading: true });
    console.warn("order_id", order_id);
    try {
      const data = await StepRequest(
        "employee-orders/statusUnderPayment",
        "POST",
        {
          order_id
        }
      );
      await actions.refreshWalletBalance();
      Alert.alert(data)
      await this.setState({ completeLoading: false });
      await this.props.navigation.navigate("YourTasks", { refresh: true });
      console.warn("completed", data);
    } catch (error) {
      this.setState({ completeLoading: false });
      Alert.alert(error.message);
    }
  }
  render() {
    const {
      containerStyle,
      buttonsContainer,
      cancelButtonStyle,
      textStyle
    } = styles;
    const { navigation } = this.props;
    const { screenLoading, cancelLoading, data, completeLoading } = this.state;
    const hideButtons =
      data.OrderStatus == "Done" || data.OrderStatus == "Cancelled";
    const underPayment = data.OrderStatus == "UnderPayment";
    return (
      <Container loading={screenLoading}>
        <MapView
          provider = {PROVIDER_GOOGLE}
          ref={ref => (this.myMapView = ref)}
          style={{ flex: 1, width: sWidth }}
          initialRegion={{
            longitude: data.lng,
            latitude: data.lat,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }}
        >
          <Marker
            pinColor={colors.second}
            coordinate={{ longitude: data.lng, latitude: data.lat }}
          />
        </MapView>

        {hideButtons ? null : (
          <View style={buttonsContainer}>
            <TouchableOpacity
              disabled={cancelLoading || completeLoading}
              style={cancelButtonStyle}
              onPress={() => this.cancelRequest()}
            >
              {cancelLoading ? (
                <ActivityIndicator size={"small"} color={colors.second} />
              ) : (
                <Text style={textStyle}>{strings.cancel}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              disabled={cancelLoading || completeLoading}
              style={cancelButtonStyle}
              onPress={() => {
                underPayment
                  ? this.completeRequest()
                  : this.underPaymentRequest();
              }}
            >
              {completeLoading ? (
                <ActivityIndicator size={"small"} color={colors.second} />
              ) : (
                <Text style={textStyle}>
                  {underPayment ? strings.recieved : strings.underPayment}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        <MainCard
          item={data}
          disableTouch
          isTask
          taskDetails
          onPressChat={() =>
            navigation.navigate("Chat", { receiver_id: data.client.id , task_id: data.id})
          }
          containerStyle={containerStyle}
        />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    position: "absolute",
    bottom: vScale(11.3)
  },
  buttonsContainer: {
    width: hScale(352),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: vScale(170)
  },
  cancelButtonStyle: {
    width: hScale(75.4),
    height: vScale(30.4),
    borderRadius: hScale(5),
    alignItems: "center",
    justifyContent: "center",
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
  textStyle: {
    color: colors.mainText,
    fontSize: fScale(12),
    fontFamily: fonts.arial
  }
});

export const TaskDetails = connect(TaskDetailsScreen);
