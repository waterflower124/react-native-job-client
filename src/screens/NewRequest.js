import moment from "moment";
import React, { Component } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePicker from "react-native-modal-datetime-picker";
import { fScale, hScale, sWidth, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { Button, Container, TextField, BackButton } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { whiteHeaderOptions } from "../navigation/options";
import { StepRequest } from "step-api-client";
import {
  ImagePicker,
  getUserLocation,
  convertNumbers2English
} from "../helpers";
import AsyncStorage from '@react-native-community/async-storage';

export class NewRequest extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      ...whiteHeaderOptions,
      headerLeft: () => 
        <BackButton
          backWithTitle
          onPress={() => this.props.navigation.goBack()}
          title={strings.newRequest}
        />
    })

  }
  state = {
    paymentMethods: [],
    photo: null,
    requirements: "",
    requirements_detail: "",
    budget: "",
    error: "",
    selectedPaymentMethods: { id: null },
    dateTime: new Date(),
    dateVisible: false,
    loading: false,
    imageToUpload: null,
    location: null,
    screenLoading: true
  };

  componentDidMount() {
    this.getPaymentMethods();
  }
  async getPaymentMethods() {
    try {
      const paymentMethods = await StepRequest("payment-method");
      this.setState({ paymentMethods, screenLoading: false });
      console.log("paymentMethods", paymentMethods);
    } catch (error) {
      Alert.alert(error.message);
      this.props.navigation.goBack();
    }
  }

  async validateInputs(isEmptyDetails, detailsError, isEmptyBudget, budgetError) {
    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      Alert.alert(strings.signinRequest, "");
      return;
    } 
    const { photo, selectedPaymentMethods } = this.state;
    let error = "";
    if ((isEmptyDetails, detailsError)) {
      error = "requirements";
    } else if ((isEmptyBudget, budgetError)) {
      error = "budget";
    } else if (selectedPaymentMethods.id == null) {
      error = "payment";
    } 
    // else if (photo == null) {
    //   error = "photo";
    // }
    if (error == "") {
      this.AddNewRequest();
    } else {
      this.setState({ error });
    }
  }

  async AddNewRequest() {
    this.setState({ loading: true });
    const category_id = this.props.route.params.category_id;
    const {
      budget,
      requirements,
      requirements_detail,
      dateTime,
      imageToUpload,
      location,
      selectedPaymentMethods
    } = this.state;
    var requestData = null;
    if(imageToUpload) {
      requestData = {
        budget,
        requirements,
        requirements_detail,
        schedule: moment(dateTime).format("YYYY-MM-DD hh:mm:ss"),
        category_id,
        image: imageToUpload,
        lat: location.latitude,
        lng: location.longitude,
        payment_method: selectedPaymentMethods.id
      };
    } else {
      requestData = {
        budget,
        requirements,
        requirements_detail,
        schedule: moment(dateTime).format("YYYY-MM-DD hh:mm:ss"),
        category_id,
        lat: location.latitude,
        lng: location.longitude,
        payment_method: selectedPaymentMethods.id
      };
    }

    console.log("requestdata in request::::", JSON.stringify(requestData));
    try {
      const data = await StepRequest("client-requests", "POST", requestData);
      
      this.setState({ loading: false });
      Alert.alert(data);
      await this.props.navigation.goBack();
    } catch (error) {
      this.setState({ loading: false });
      console.log("client request error:   " + error.message)
      Alert.alert(error.message);
      
    }
  }

  async uploadPhotoPress() {
    const { imageObject, imageSource } = await ImagePicker({
      width: 100,
      height: 100,
      multiple: false,
      compressImageQuality: 0.2
    });
    this.setState({
      photo: imageSource,
      imageToUpload: imageObject,
      error: ""
    });
  }
  render() {
    const {
      inputsContainer,
      containerStyle,
      uploadImageContainer,
      imageContainer,
      placeholderImageStyle,
      uploadButtonStyle,
      uploadStyle,
      uploadTextStyle,
      paymentTextStyle,
      paymentButtonStyle,
      paymentTitleStyle,
      buttonStyle,
      linearStyle,
      titleStyle,
      dateTimeContainer,
      dateTimeButton,
      linearDateTime,
      dateStyle,
      timestyle,
      dateTimeTitle,
      scrollViewStyle,
      inputStyle,
      paymentListStyle,
      avatarStyle,
      imageStyle,
      errorContainer,
      errorMessageStyle
    } = styles;

    const {
      loading,
      requirements,
      budget,
      selectedPaymentMethods,
      dateVisible,
      dateTime,
      error,
      photo,
      paymentMethods,
      location,
      screenLoading,
      requirements_detail
    } = this.state;
    const isPhotoError = error == "photo";
    const isEmptyDetails = requirements.length == 0;
    const isEmptyBudget = budget.length == 0;
    const isDetailsError = error == "requirements";
    const isBudgetError = error == "budget";
    const isPaymentMethodError = error == "payment";
    const detailsError = requirements.length < 1;
    const showDetailsError = requirements.length > 0 || isDetailsError;
    const budgetError = isNaN(budget) || budget.length < 1;
    const showBudgetError = budget.length > 0 || isBudgetError;

    return (
      <Container loading={screenLoading}>
        <MapView
          provider = {PROVIDER_GOOGLE}
          ref={ref => (this.myMapView = ref)}
          showsUserLocation
          showsMyLocationButton
          style={{ height: vScale(200), width: sWidth }}
          initialRegion={{
            longitude: 45,
            latitude: 25,
            latitudeDelta: 20,
            longitudeDelta: 20
          }}
          onMapReady={() => {
            getUserLocation(
              position => {
                const { latitude, longitude } = position.coords;
                this.myMapView.animateToRegion({
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                });
                this.setState({ location: { latitude, longitude } });
              },
              error => {
                
                this.props.navigation.goBack();
                if(this.props.route.params.showLocationAlert) {
                  this.props.route.params.showLocationAlert(true);
                }
                
              }
            );
          }}
          onRegionChangeComplete={region => {
            const { latitude, longitude } = region;
            this.setState({ location: { latitude, longitude } });
          }}
        >
          <Marker
            pinColor={colors.second}
            coordinate={location || { longitude: 45, latitude: 25 }}
          />
        </MapView>
        <View style={inputsContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={scrollViewStyle}
          >
            <KeyboardAvoidingView behavior={"padding"}>
              <TextField
                onChangeText={requirements => this.setState({ requirements })}
                value={requirements}
                containerStyle={containerStyle}
                maxLength={190}
                inputStyle={inputStyle}
                placeholder={strings.whatDoYouWant}
                placeholderTextColor={colors.mainText}
                errorMessage={
                  detailsError &&
                  showDetailsError &&
                  strings.invalidRequestDetails
                }
              />
              <TextField
                onChangeText={requirements_detail => this.setState({ requirements_detail })}
                value={requirements_detail}
                containerStyle={[containerStyle, {height: hScale(80)}]}
                inputStyle={inputStyle}
                placeholder={strings.requirement_more_detail}
                placeholderTextColor={colors.mainText}
                multiline = {true}
              />
              <TextField
                onChangeText={budget =>
                  this.setState({ budget: convertNumbers2English(budget) })
                }
                value={budget}
                maxLength={6}
                inputStyle={inputStyle}
                containerStyle={containerStyle}
                placeholder={strings.budget}
                placeholderTextColor={colors.mainText}
                keyboardType="numeric"
                errorMessage={
                  budgetError && showBudgetError && strings.invalidBudget
                }
              />
              <View style={dateTimeContainer}>
                <Button
                  title={moment(dateTime).format("YYYY-MM-DD")}
                  style={dateTimeButton}
                  whiteBackgroundButton
                  linearCustomStyle={linearDateTime}
                  numberOfLines={1}
                  icon={icons.date}
                  customIconStyle={dateStyle}
                  titleStyle={dateTimeTitle}
                  onPress={() => this.setState({ dateVisible: true })}
                />
                <Button
                  title={moment(dateTime).format("LT")}
                  whiteBackgroundButton
                  linearCustomStyle={linearDateTime}
                  numberOfLines={1}
                  style={dateTimeButton}
                  customIconStyle={timestyle}
                  icon={icons.time}
                  titleStyle={dateTimeTitle}
                  onPress={() => this.setState({ dateVisible: true })}
                />
              </View>

              <DateTimePicker
                isVisible={dateVisible}
                minimumDate={new Date()}
                mode="datetime"
                onConfirm={res => {
                  // console.warn("res", res);
                  this.setState({ dateTime: res, dateVisible: false });
                }}
                onCancel={() => this.setState({ dateVisible: false })}
              />

              <View style={uploadImageContainer}>
                <View style={imageContainer}>
                  <Image
                    resizeMode={"contain"}
                    source={photo ? photo : icons.placeholderImage}
                    style={photo ? avatarStyle : placeholderImageStyle}
                  />
                </View>
                <TouchableOpacity
                  disabled={loading}
                  style={uploadButtonStyle}
                  onPress={() => this.uploadPhotoPress()}
                >
                  <Image
                    source={icons.upload}
                    resizeMode={"contain"}
                    style={uploadStyle}
                  />
                  <Text style={uploadTextStyle}>{strings.upload}</Text>
                </TouchableOpacity>
              </View>
              <View style={errorContainer}>
                <Text style={errorMessageStyle}>
                  {isPhotoError ? strings.choosePhoto : ""}
                </Text>
              </View>
              <Text style={paymentTextStyle}>{strings.paymentMethod}</Text>
              <View style={paymentListStyle}>
                <FlatList
                  data={paymentMethods}
                  extraData={this.state}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ width: sWidth }}
                  renderItem={({ item, index }) => {
                    const { name, image } = item;
                    const isSelected = selectedPaymentMethods.id == item.id;
                    return (
                      <TouchableOpacity
                        disabled={loading}
                        style={[
                          paymentButtonStyle,
                          isSelected && { borderColor: colors.second }
                        ]}
                        onPress={() =>
                          this.setState({
                            selectedPaymentMethods: item,
                            error: ""
                          })
                        }
                      >
                        {image ? (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Image
                              source={{ uri: image }}
                              resizeMode={"contain"}
                              style={[
                                imageStyle,
                                { opacity: 0.35 },
                                isSelected && { opacity: 1 }
                              ]}
                            />
                            <Text
                              style={[
                                [paymentTitleStyle, { fontSize: fScale(10) }],
                                isSelected && {
                                  opacity: 1,
                                  color: colors.second
                                }
                              ]}
                            >
                              {name}
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={[
                              paymentTitleStyle,
                              isSelected && {
                                opacity: 1,
                                color: colors.second
                              }
                            ]}
                          >
                            {name}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <View style={errorContainer}>
                <Text style={errorMessageStyle}>
                  {isPaymentMethodError ? strings.choosePaymentMethod : ""}
                </Text>
              </View>

              <Button
                onPress={() =>
                  this.validateInputs(
                    isEmptyDetails,
                    detailsError,
                    isEmptyBudget,
                    budgetError
                  )
                }
                title={strings.continue}
                titleStyle={titleStyle}
                style={buttonStyle}
                linearCustomStyle={linearStyle}
                loading={loading}
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(69.3)
  },
  inputsContainer: {
    height: vScale(363.6),
    width: sWidth,
    alignItems: "stretch",
    borderRadius: hScale(10),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.31)",
    shadowOffset: {
      width: 0,
      height: vScale(2)
    },
    shadowRadius: hScale(21),
    shadowOpacity: 1,
    elevation: 10
  },
  containerStyle: {
    width: hScale(345.6),
    height: vScale(34.9)
  },
  imageContainer: {
    width: hScale(65.6),
    height: vScale(58.1),
    borderRadius: hScale(5),
    marginEnd: hScale(15.6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 0,
      height: vScale(1)
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    elevation: 10
  },
  placeholderImageStyle: {
    width: hScale(22.2),
    height: hScale(22.2)
  },
  uploadButtonStyle: {
    width: hScale(60.5),
    height: vScale(24.3),
    borderRadius: hScale(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 0,
      height: vScale(1)
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    elevation: 10
  },
  uploadStyle: {
    width: hScale(12.1),
    height: hScale(12.1),
    marginEnd: hScale(4.2)
  },
  uploadTextStyle: {
    color: colors.mainText,
    fontSize: fScale(9),
    fontFamily: fonts.arial
  },
  uploadImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginHorizontal: hScale(14.4),
    marginBottom: vScale(11.4)
  },
  paymentTextStyle: {
    color: colors.mainText,
    fontSize: fScale(13),
    alignSelf: "flex-start",
    marginHorizontal: hScale(13.5),
    marginTop: vScale(10),
    marginBottom: vScale(18.7),
    fontFamily: fonts.arial
  },
  paymentButtonStyle: {
    minWidth: hScale(62),
    height: vScale(30),
    paddingHorizontal: hScale(5),
    borderRadius: hScale(5),
    marginStart: hScale(14.4),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 0,
      height: vScale(1)
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    elevation: 10
  },
  paymentTitleStyle: {
    color: colors.mainText,
    fontSize: fScale(14),
    opacity: 0.35,
    fontFamily: fonts.arial
  },
  buttonStyle: {
    width: sWidth,
    height: vScale(56.4),
    borderRadius: 0,
    marginVertical: vScale(10)
  },
  linearStyle: {
    borderRadius: 0
  },
  titleStyle: {
    textAlign: "center",
    fontSize: fScale(19),
    fontFamily: fonts.arial
  },
  dateTimeButton: {
    width: hScale(168.1),
    height: vScale(34.9),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hScale(5),
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 0,
      height: vScale(1)
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    elevation: 10
  },
  linearDateTime: {
    flex: 1,
    borderRadius: hScale(5)
  },
  dateStyle: {
    width: hScale(12),
    height: vScale(13),
    resizeMode: "contain"
  },
  timestyle: {
    width: hScale(12),
    height: hScale(12),
    resizeMode: "contain"
  },
  dateTimeTitle: {
    color: colors.mainText,
    fontSize: fScale(14),
    marginStart: hScale(10),
    fontFamily: fonts.arial
  },
  dateTimeContainer: {
    width: sWidth,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: hScale(14.4)
  },
  scrollViewStyle: {
    alignItems: "stretch",
    paddingTop: vScale(15.2)
  },
  inputStyle: {
    fontSize: fScale(14)
  },
  errorMessageStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    fontSize: fScale(10),
    color: "red",
    fontFamily: fonts.arial
  },
  errorContainer: {
    height: vScale(15),
    marginTop: vScale(5)
  },
  paymentListStyle: {
    height: vScale(50),
    marginBottom: vScale(10.9)
  },
  avatarStyle: {
    width: hScale(60),
    height: vScale(50)
  },
  imageStyle: {
    width: hScale(31.3),
    height: vScale(9.9),
    opacity: 0.35
  },
  errorMessageStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    fontSize: fScale(10),
    color: "red",
    fontFamily: fonts.arial
  },
  errorContainer: {
    height: vScale(15),
    marginTop: vScale(5)
  }
});
