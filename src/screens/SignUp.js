import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Modal,
  I18nManager,
  Alert,
  ActivityIndicator,
  Platform,
  Linking
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { isEmpty, isEmail } from "step-validators";
import { fScale, hScale, sWidth, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { ScrollView } from "react-native-gesture-handler";
import { ImagePicker, getUserLocation, convertNumbers2English, GoogleMapiAPIKey } from "../helpers";
import { ModalButton } from "../components/ModalButton";
import AsyncStorage from '@react-native-community/async-storage';
import { StepRequest } from "step-api-client";

import { connect } from "step-react-redux";
import VersionCheck from 'react-native-version-check';

export class SignUpScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (<BackButton onPress={() => navigation.goBack()} />)
  });
  state = {
    validateLoading: false,
    error: "",
    mobile: "",
    first_name: "",
    last_name: "",
    email: "",
    image: null,
    avatar: null,
    selectedCity: {},
    chooseCity: false,
    
    cityModalVisible: false,
    submittedCity: "",

    modalVisible: false,
    location: "",
    temp_latitude: 0.0,
    temp_longitude: 0.0,
    selected_city: "",
    password: "",
    confirmPassword: "",

    screenLoading: false
    
  };

  async validateInputs(
    isEmptyPhone,
    isEmptyFirstName,
    isEmptyLastName,
    isEmptyMail,
    firstNameError,
    lastNameError,
    phoneError,
    MailError,
    isEmptyPassword,
    isEmptyConfirmPassword,
    passwordError,
    confirmPasswordError
  ) {
    let updateNeeded = await VersionCheck.needUpdate();
    if(updateNeeded && updateNeeded.isNeeded) {
      Alert.alert(strings.pls_update, strings.update_message,
        [
          {
            text: strings.ok,
            onPress: () => {
              Linking.openURL(updateNeeded.storeUrl);
            }
          }
        ]
      );
      return;
    }
    const { avatar, first_name, last_name, email, mobile, submittedCity, location, selected_city, temp_latitude, temp_longitude, password } = this.state;
    let error = "";
    if ((isEmptyPhone, phoneError)) {
      error = "phone";
    } else if ((isEmptyFirstName, firstNameError)) {
      error = "firstname";
    } else if ((isEmptyLastName, lastNameError)) {
      error = "lastname";
    } else if ((isEmptyMail, MailError)) {
      error = "email";
    } else if (location == "") {
        error = "location"
    } else if ((isEmptyPassword, passwordError)) {
      error = "password";
    } else if ((isEmptyConfirmPassword, confirmPasswordError)) {
      error = "confirmPassword";
    }
    

    if (error == "") {
      try {
        const data = await StepRequest("otp/register_send", "POST", { mobile, email });
        this.props.navigation.navigate("VerifyPhone", {
          userData: {
            avatar,
            first_name,
            last_name,
            email,
            mobile,
            location,
            selected_city,
            temp_latitude,
            temp_longitude,
            password
          }
        });
      } catch (error) {
        Alert.alert(error.message);
        return;
      }
    } else {
      this.setState({ error });
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
      image: imageSource,
      avatar: imageObject
    });
  }

  getCurrentAddress = async() => {
      this.setState({
          screenLoading: true
      })
    var parameter = "";
    let languageCode = await AsyncStorage.getItem('languageCode')
    if (languageCode == "en") {
      parameter = "latlng=" + this.state.temp_latitude + "," + this.state.temp_longitude + "&key=" + GoogleMapiAPIKey;
    } else {
      parameter = "latlng=" + this.state.temp_latitude + "," + this.state.temp_longitude + "&language=ar&key=" + GoogleMapiAPIKey;
    }

    console.log(parameter)
    await fetch("https://maps.googleapis.com/maps/api/geocode/json?" + parameter, {
        method: "GET",
    })
    .then(response => {
        return response.json();
    })
    .then(responseData => {
        console.log(JSON.stringify(responseData));
        if(responseData.status != "OK") {
            Alert.alert("Warning!", "Error occurred in getting address. Please try again.")
        } else {
            if(responseData.results.length > 0) {
                this.setState({
                    location: responseData.results[0].formatted_address,
                })
                for(i = 0; i < responseData.results[0].address_components.length; i ++) {
                    for(j = 0; j < responseData.results[0].address_components[i].types.length; j ++) {
                        if(responseData.results[0].address_components[i].types[j] == "locality") {
                            this.setState({
                                selected_city: responseData.results[0].address_components[i].short_name
                            })
                            break;
                        }
                    }
                }
            }
        }
        this.setState({ modalVisible: false })
    })
    .catch(error => {
        console.log(error)
    });

    this.setState({
        screenLoading: false
    })
  }

  render() {
    const {
      container,
      containerStyle,
      signUpButtonStyle,
      welcomeBackStyle,
      signinToStyle,
      inputStyle,
      buttonContainer,
      youHaveAnAccountContainer,
      youHaveAccountStyle,
      phoneIconStyle,
      passwordIconStyle,
      uploadButtonStyle,
      uploadStyle,
      uploadImageContainer,
      uploadTextStyle,
      imageContainer,
      placeholderImageStyle,
      avatarStyle,
      buttonStyle,
      errorContainer,
      errorMessageStyle,
      backButtonCustom,
      mapButtonStyle,
      linearStyle,
      errorContainerCustom,
      titleStyle,
      locationButton,
      textStyle,
      locationContainer,
      borderSeparator,
      locStyle
    } = styles;

    const { navigation } = this.props;
    const { cities } = this.props;

    const { 
      validateLoading, 
      error, 
      mobile, 
      first_name, 
      last_name, 
      email, 
      image, 
      modalVisible, 
      submittedCity, 
      chooseCity, 
      cityModalVisible, 
      selectedCity,
      location,
      selected_city,
      password,
      confirmPassword
    } = this.state;
    const isEmptyPhone = mobile.length == 0;
    const isEmptyFirstName = first_name.length == 0;
    const isEmptyLastName = last_name.length == 0;
    const isEmptyMail = isEmpty(email);
    const isPhoneError = error === "phone";
    const isFirstNameError = error === "firstname";
    const isLastNameError = error === "lastname";
    const isMailError = error === "email";
    const isAvatarError = error == "avatar";
    const phoneError =
      isNaN(mobile) || mobile.length != 10 || !mobile.startsWith(0);
    const showPhoneError = mobile.length > 0 || isPhoneError;
    const firstNameError = first_name.length < 3;
    const lastNameError = last_name.length < 3;
    const MailError = !isEmail(email);
    const showfirstNameErrorStatus = first_name.length > 0 || isFirstNameError;
    const showlastNameErrorStatus = last_name.length > 0 || isLastNameError;
    const showMailErrorStatus = email.length > 0 || isMailError;
    const notSelectedCity = submittedCity == "";
    const isLocationError = error == "location";
    const { isRTL } = I18nManager;
    const isEmptyPassword = password.length == 0;
    const isEmptyConfirmPassword = confirmPassword.length == 0;
    const isPasswordError = error === "password";
    const isConfirmPasswordError = error === "confirmPassword";
    const passwordError = password.length < 6;
    const showPasswordErrorStatus = password.length > 0 || isPasswordError;
    const confirmPasswordError =
      confirmPassword.length < 6 || confirmPassword != password;
    const showConfirmPasswordErrorStatus =
      confirmPassword.length > 0 || isConfirmPasswordError;
    return (
      <Container transparentImage style={container}>
        <Modal animationType="fade" transparent={false} visible={modalVisible}>
          <MapView
            provider = {PROVIDER_GOOGLE}
            ref={ref => (this.myMapView = ref)}
            showsUserLocation
            showsMyLocationButton
            style={{ flex: 1, width: sWidth }}
            initialRegion={{
              longitude: 45,
              latitude: 25,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            }}
            onMapReady={() => {
              
              getUserLocation(
                
                position => {
                  const { latitude, longitude } = position.coords;
                  
                  this.myMapView.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                  });
                  // todo: GeoCoding coords
                  this.setState({
                    // location: { latitude, longitude },
                    error: ""
                  });
                },
                error => { console.log("error") }
              );
            }}
            onRegionChangeComplete={region => {
              const { latitude, longitude } = region;
              // this.setState({ location: { latitude, longitude } });
              this.setState({
                temp_latitude: latitude,
                temp_longitude: longitude
              })
            }}
          >
            <Marker
              pinColor={colors.second}
              coordinate={{latitude: this.state.temp_latitude, longitude: this.state.temp_longitude} || { longitude: 45, latitude: 25 }}
            />
          </MapView>
          <BackButton
            onPress={() => this.setState({ modalVisible: false })}
            customContainer={backButtonCustom}
          />
          <Button
            title={strings.continue}
            style={mapButtonStyle}
            linearCustomStyle={linearStyle}
            errorContainerCustom={errorContainerCustom}
            titleStyle={titleStyle}
            onPress={() => {
              this.getCurrentAddress();
              
            }}
          />
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView 
            style = {{flex: 1}}
            behavior={(Platform.OS === 'ios') ? "padding" : null}
            keyboardVerticalOffset={100}
            enabled
          >
            <Text style={welcomeBackStyle}>{strings.welcome}</Text>
            <Text style={signinToStyle}>{strings.signUpToContinue}</Text>
            <View style={uploadImageContainer}>
              <View style={imageContainer}>
                <Image
                  resizeMode={"contain"}
                  source={image || icons.placeholderImage}
                  style={image ? avatarStyle : placeholderImageStyle}
                />
              </View>
              <TouchableOpacity
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
                {isAvatarError ? strings.choosePhoto : ""}
              </Text>
            </View>

            <TextField
              onChangeText={mobile =>
                this.setState({ mobile: convertNumbers2English(mobile) })
              }
              value={mobile}
              errorMessage={
                phoneError && showPhoneError && strings.invalidPhone
              }
              label={strings.yourPhone}
              authInputs
              showCountryCode
              rightIcon={icons.smartphone}
              rightIconstyle={phoneIconStyle}
              customMainContainer={containerStyle}
              inputStyle={inputStyle}
              customTextStyle={{ color: colors.mainText }}
              keyboardType = {'phone-pad'}
            />
            <TextField
              onChangeText={first_name => this.setState({ first_name })}
              value={first_name}
              label={strings.firstname}
              authInputs
              rightIcon={icons.userIcon}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
              errorMessage={
                firstNameError && showfirstNameErrorStatus && strings.invalidName
              }
            />
            <TextField
              onChangeText={last_name => this.setState({ last_name })}
              value={last_name}
              label={strings.lastname}
              authInputs
              rightIcon={icons.userIcon}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
              errorMessage={
                lastNameError && showlastNameErrorStatus && strings.invalidName
              }
            />
            <TextField
              onChangeText={email => this.setState({ email })}
              value={email}
              label={strings.yourmail}
              authInputs
              rightIcon={icons.chatHead}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
              errorMessage={
                MailError && showMailErrorStatus && strings.invalidMail
              }
            />
            {/* <ModalButton
              title={strings.city}
              data={cities}
              errorMessage={notSelectedCity && chooseCity && strings.chooseCity}
              onSelect={item => this.setState({ selectedCity: item })}
              onCloseModal={() => this.setState({ cityModalVisible: false })}
              onPressSave={() =>
                this.setState({
                  cityModalVisible: false,
                  submittedCity: selectedCity
                })
              }
              onPress={() => this.setState({ cityModalVisible: true })}
              modalVisible={cityModalVisible}
              selectedItem={selectedCity}
              submittedItem={submittedCity}
              containerStyle = {{marginStart: hScale(15.1),}}
            /> */}
            <TouchableOpacity
              style={locationButton}
              onPress={() => {
                this.setState({modalVisible: true})
              }}
            >
              <Text
                style={[
                  textStyle,
                  { marginBottom: vScale(4.1) },
                  isRTL && { textAlign: "left" }
                ]}
              >
                {strings.location}
              </Text>
              <View style={locationContainer}>
                <Text style={[textStyle, { marginBottom: vScale(10.6) }]}>
                  {location}
                </Text>
                <Image
                  source={icons.loc}
                  resizeMode={"contain"}
                  style={[passwordIconStyle, {tintColor: location == "" ? colors.inputInActive : colors.inputActive}]}
                />
              </View>
              <View style={borderSeparator} />
              <View style={errorContainer}>
                <Text style={errorMessageStyle}>
                  {isLocationError ? strings.chooseYourLocation : ""}
                </Text>
              </View>
            </TouchableOpacity>
            <TextField
              value={selected_city}
              label={strings.city}
              authInputs
              disableInput = {true}
              rightIcon={icons.chatHead}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
              
            />

            {/* <TextField
              onChangeText={email => this.setState({ email })}
              value={email}
              label={strings.yourmail}
              authInputs
              rightIcon={icons.chatHead}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
              errorMessage={
                MailError && showMailErrorStatus && strings.invalidMail
              }
            /> */}

            <TextField
              onChangeText={password => this.setState({ password })}
              value={password}
              errorMessage={
                passwordError &&
                showPasswordErrorStatus &&
                strings.invalidPassword
              }
              authInputs
              secureTextEntry
              rightIcon={icons.password}
              rightIconStyle={passwordIconStyle}
              label={strings.password}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
            />
            <TextField
              onChangeText={confirmPassword =>
                this.setState({ confirmPassword })
              }
              value={confirmPassword}
              errorMessage={
                confirmPasswordError &&
                showConfirmPasswordErrorStatus &&
                strings.passwordNotMatch
              }
              authInputs
              secureTextEntry
              rightIcon={icons.password}
              rightIconStyle={passwordIconStyle}
              label={strings.confirmPassword}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
            />


            <Button
              loading={validateLoading}
              style={buttonStyle}
              title={strings.signUp}
              icon
              onPress={() =>
                this.validateInputs(
                  isEmptyPhone,
                  isEmptyFirstName,
                  isEmptyLastName,
                  isEmptyMail,
                  phoneError,
                  firstNameError,
                  lastNameError,
                  MailError,
                  isEmptyPassword,
                  isEmptyConfirmPassword,
                  passwordError,
                  confirmPasswordError
                )
              }
            />

            <View style={youHaveAnAccountContainer}>
              <Text style={youHaveAccountStyle}>
                {strings.youHaveAnAccount}
              </Text>
              <TouchableOpacity
                style={signUpButtonStyle}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={[youHaveAccountStyle, { color: colors.first }]}>
                  {strings.login}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(112.3)
  },
  containerStyle: {
    marginStart: hScale(15.1),
    paddingHorizontal: 0
  },
  signUpButtonStyle: {
    width: hScale(80),
    justifyContent: "center"
  },
  welcomeBackStyle: {
    fontSize: fScale(19),
    color: colors.welcomeTextColor,
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(8.6),
    fontFamily: fonts.arial
  },
  signinToStyle: {
    fontSize: fScale(14),
    color: colors.signInTo,
    marginTop: vScale(8.5),
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(30),
    fontFamily: fonts.arial
  },
  inputStyle: {
    fontSize: fScale(14)
  },
  buttonStyle: {
    marginStart: hScale(15.1),
    marginTop: vScale(33.8)
  },
  youHaveAnAccountContainer: {
    flexDirection: "row",
    marginTop: vScale(20.9),
    marginBottom: vScale(40),
    alignSelf: "center"
  },
  youHaveAccountStyle: {
    fontSize: fScale(14),
    color: colors.signInTo,
    fontFamily: fonts.arial
  },
  phoneIconStyle: {
    width: hScale(13),
    height: vScale(17.3),
    marginStart: hScale(5)
  },
  passwordIconStyle: {
    width: hScale(14.5),
    height: vScale(16.6),
    tintColor: colors.inputInActive,
    marginStart: hScale(5)
  },
  uploadImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginStart: hScale(15),
    marginBottom: vScale(21.1),
    marginTop: vScale(16)
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
    width: hScale(22.5),
    height: hScale(22.5)
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
  avatarStyle: {
    width: hScale(60),
    height: vScale(50)
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
  backButtonCustom: {
    position: "absolute",
    top: vScale(17),
    left: 0
  },
  mapButtonStyle: {
    width: sWidth,
    height: vScale(56.4),
    borderRadius: 0
  },
  linearStyle: {
    borderRadius: 0
  },
  errorContainerCustom: {
    height: 0,
    marginTop: 0
  },
  titleStyle: {
    textAlign: "center",
    fontSize: fScale(19),
    fontFamily: fonts.arial
  },
  locationButton: {
    marginStart: hScale(15.1),
    width: hScale(332.7),
    marginBottom: vScale(17.1),
    
  },
  textStyle: {
    color: colors.mainTextColor,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  },
  locationContainer: {
    // width: hScale(343.8),
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: hScale(11.6),
  },
  borderSeparator: {
    width: hScale(359.5),
    height: vScale(1.2),
    backgroundColor: colors.inputBorder
  },
  locStyle: {
    // width: hScale(17),
    // height: hScale(17)
    width: hScale(14.5),
    height: vScale(16.6),
    tintColor: colors.inputInActive,
    marginStart: hScale(5)
  },
});

export const SignUp = connect(SignUpScreen);
