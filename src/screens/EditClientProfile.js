import React, { Component } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  I18nManager
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import StarRating from "react-native-star-rating";
import { fScale, hScale, sWidth, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import {
  Button,
  ChatIcon,
  Container,
  DrawerIcon,
  MainCard,
  ModalContainer,
  TextField,
  EmptyScreen,
  HeaderLogo
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { ImagePicker, actions } from "../helpers";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";
import AsyncStorage from '@react-native-community/async-storage';

const { isRTL } = I18nManager;

class EditClientProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      refreshOrders: () => this.refreshOrders()
    });

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
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    feedback: "",
    order_id: null,
    error: "",
    selectedIndex: 0,
    selelectedTab: "account",
    selectedItem: null,
    image: null,
    uploadImage: null,
    rate: 0,
    modalVisible: false,
    screenLoading: true,
    loading: false,
    data: [],
    errors: [],
    listLoading: false
  };

  async componentDidMount() {
    const { user } = this.props;
    
    this.setState({ first_name: user.data.first_name, last_name: user.data.last_name, image: user.data.avatar });
    
    this.loadOrders();
  }

  async uploadPhotoPress() {
    const { imageObject, imageSource } = await ImagePicker({
      width: 100,
      height: 100,
      multiple: false,
      compressImageQuality: 0.2
    });
    this.setState({
      image: imageSource.uri,
      uploadImage: imageObject
    });
  }

  async validateInputs(
    isEmptyPassword,
    isEmptyConfirmPassword,
    isEmptyFirstName,
    isEmptyLastName,
    passwordError,
    confirmPasswordError,
    firstNameError,
    lastNameError
  ) {
    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      this.setState({
        screenLoading: false,
        listLoading: false
      });
      Alert.alert(strings.signinRequest, "");
      return;
    } 

    let error = "";
    if ((isEmptyFirstName, firstNameError)) {
      error = "name";
    } if ((isEmptyLastName, lastNameError)) {
      error = "name";
    } else if ((isEmptyPassword, passwordError)) {
      error = "password";
    } else if ((isEmptyConfirmPassword, confirmPasswordError)) {
      error = "confirmPassword";
    }
    if (error == "") {
      this.editAccount();
    } else {
      this.setState({ error });
    }
  }

  editAccount() {
    const { user } = this.props;
    const { first_name, last_name, password, confirmPassword, uploadImage, image } = this.state;
    const mainData = user.data;
    const updatedData = {};
    const newFirstName = first_name != mainData.first_name;
    const newLastName = last_name != mainData.last_name;
    const newPassword = password.length != 0 && password === confirmPassword;
    const newUploadedImage = image != mainData.avatar;

    if (newUploadedImage) {
      updatedData.avatar = uploadImage;
    }
    if (newFirstName) {
      updatedData.first_name = first_name;
    }
    if (newLastName) {
      updatedData.last_name = last_name;
    }
    if (newPassword) {
      updatedData.password = password;
    }
    const notChangedData = !newPassword && !newFirstName && !newLastName && !newUploadedImage;
    if (!notChangedData) {
      this.editUserAccount(updatedData);
    }
  }
  
  async editUserAccount(updatedData) {
    this.setState({ loading: true });
    console.log("updateduser post data: ", JSON.stringify(updatedData));
    try {
      const data = await actions.updateUser(updatedData);
      console.log("update response", JSON.stringify(data));
      const profile = await StepRequest("profile");
      actions.setUserData({ data: profile });
      console.log("profile::", JSON.stringify(profile));
      this.setState({
        loading: false,
        first_name: profile.first_name,
        last_name: profile.last_name,
        image: profile.avatar,
        password: "",
        confirmPassword: ""
      });
      this.props.navigation.navigate("Home");
      Alert.alert(data);
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert(error.message);
    }
  }

  async loadOrders() {
    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      this.setState({ screenLoading: false, listLoading: false });
      return;
    } 

    this.setState({ listLoading: true });
    try {
      const data = await StepRequest("client-orders");
      this.setState({ data, screenLoading: false, listLoading: false });
      console.log("orders:: ", JSON.stringify(data));
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });
      Alert.alert(error.message);
    }
  }

  async addReview() {
    let { rate, feedback, order_id } = this.state;
    const body = { rate, comment: feedback, order_id };
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
      // console.warn("data", data);
      this.setState({ modalVisible: false, rate: 0, feedback: "" });
      this.loadOrders();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  refreshOrders() {
    this.setState({ listLoading: true }, () => this.loadOrders());
  }

  render() {
    const {
      container,
      textStyle,
      secTitleStyle,
      selectionContainer,
      selectionButton,
      selectionTextStyle,
      contentContainerStyle,
      linearStyle,
      contentContainer,
      textFieldContainer,
      uploadImageContainer,
      imageContainer,
      placeholderImageStyle,
      uploadButtonStyle,
      uploadStyle,
      uploadTextStyle,
      buttonStyle,
      buttonLinear,
      buttonTitleStyle,
      containerModal,
      serviceAvatarContainer,
      modalTextStyle,
      modalBorderStyle,
      modalButtonStyle,
      modalClientNameStyle,
      modalImageContainer,
      modalRateButtonContainer,
      modalTitleStyle,
      serviceRateContainer,
      serviceTextStyle,
      modalStyle,
      avatarStyle,
      starStyle,
      modalInputStyle,
      serviceNameStyle,
      emptyImageStyle,
      rateArrowsStyle,
      photoStyle,
      servicePlaceholder,
      errorStyle
    } = styles;

    const {
      first_name,
      last_name,
      password,
      confirmPassword,
      selectedItem,
      modalVisible,
      rate,
      error,
      feedback,
      screenLoading,
      loading,
      image,
      data,
      selectedIndex,
      errors,
      listLoading
    } = this.state;

    const isEmptyPassword = password.length == 0;
    const isEmptyConfirmPassword = confirmPassword.length == 0;
    const isEmptyFirstName = first_name.length == 0;
    const isEmptyLastName = last_name.length == 0;
    const isPasswordError = error === "password";
    const isConfirmPasswordError = error === "confirmPassword";
    const isFirstNameError = error === "name";
    const isLastNameError = error === "name";
    const rateError = errors.includes("rate");
    
    const feedBackError = errors.includes("feedback");
    const passwordError = password.length < 6 && password.length > 0;
    const showPasswordErrorStatus = password.length > 0 || isPasswordError;
    const confirmPasswordError = confirmPassword != password;
    const showConfirmPasswordErrorStatus =
      confirmPassword.length > 0 || isConfirmPasswordError;
    const firstNameError = first_name.length < 2;
    const lastNameError = last_name.length < 2;
    const showFirstNameErrorStatus = first_name.length > 0 || isFirstNameError;
    const showLastNameErrorStatus = last_name.length > 0 || isLastNameError;
    const tabs = [
      {
        image: icons.accountInfo,
        name: strings.accountInformation,
        imageStyle: styles.accountInfoStyle
      },
      {
        image: icons.historyInfo,
        name: strings.requestsHistory,
        imageStyle: styles.historyInfoStyle
      }
    ];
    const noRequests = data.length == 0;
    const { user } = this.props;
    const hideModalButton = selectedItem
      ? selectedItem.review
        ? true
        : false
      : false;
    return (
      <Container gradientHeader style={container}>
        <ModalContainer
          modalVisible={modalVisible}
          onClose={() => this.setState({ modalVisible: false })}
          style={modalStyle}
        >
          <ScrollView scrollEnabled={true}>
            <View style={containerModal}>
              <View style={serviceAvatarContainer}>
                <Text style={modalTextStyle}>{strings.Service}</Text>
                <View style={modalImageContainer}>
                  <Image
                    source={
                      selectedItem
                        ? { uri: selectedItem.category.image }
                        : icons.service
                    }
                    resizeMode={"contain"}
                    style={selectedItem ? avatarStyle : servicePlaceholder}
                  />
                </View>
                <Text numberOfLines={1} style={serviceNameStyle}>
                  {selectedItem ? selectedItem.category.name : ""}
                </Text>
              </View>
              <Image
                source={icons.rateArrows}
                style={rateArrowsStyle}
                resizeMode={"contain"}
              />
              <View style={serviceAvatarContainer}>
                <Text style={modalTextStyle}>{strings.from}</Text>
                <View style={modalImageContainer}>
                  <Image
                    resizeMode={"cover"}
                    style={avatarStyle}
                    source={
                      selectedItem && selectedItem.employee.avatar
                        ? { uri: selectedItem.employee.avatar }
                        : icons.userPlaceholder
                    }
                  />
                </View>
                <Text numberOfLines={1} style={modalClientNameStyle}>
                  {selectedItem ? selectedItem.employee.name : ""}
                </Text>
              </View>
            </View>
            <View style={modalBorderStyle} />
            <View style={modalRateButtonContainer}>
              <View style={serviceRateContainer}>
                <Text style={serviceTextStyle}>{strings.serviceValues}</Text>
                <StarRating
                  disabled={hideModalButton}
                  selectedStar={rate => this.setState({ rate })}
                  emptyStar={icons.bigInActiveStar}
                  fullStar={icons.bigActiveStar}
                  maxStars={5}
                  rating={
                    selectedItem && selectedItem.review
                      ? selectedItem.review.rate
                      : rate
                  }
                  starStyle={starStyle}
                />
              </View>
              <Text style={errorStyle}>
                {rateError && strings.rateRequired}
              </Text>
              <TextInput
                editable={!hideModalButton}
                onChangeText={feedback => this.setState({ feedback })}
                value={hideModalButton ? selectedItem.review.comment : feedback}
                placeholder={strings.yourFeedback}
                style={modalInputStyle}
                multiline
                maxLength={140}
              />
              <Text style={errorStyle}>
                {feedBackError && strings.feedbackRequired}
              </Text>
              {!hideModalButton && (
                <Button
                  onPress={() => this.addReview()}
                  linearCustomStyle={{ borderRadius: 0 }}
                  title={strings.send}
                  style={modalButtonStyle}
                  titleStyle={modalTitleStyle}
                />
              )}
            </View>
          </ScrollView>
        </ModalContainer>
        <Text style={textStyle}>{strings.myProfile}</Text>
        <Text style={[textStyle, secTitleStyle]}>
          {strings.chooseServiceAndLetsStart}
        </Text>
        <View style={selectionContainer}>
          <FlatList
            data={tabs}
            extraData={this.state}
            horizontal
            contentContainerStyle={contentContainerStyle}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isSelected = index == selectedIndex;
              const isorders = index == 1;
              const { name, image, imageStyle } = item;
              return (
                <TouchableOpacity
                  style={selectionButton}
                  onPress={() =>
                    this.setState(
                      { selectedIndex: index },
                      () => isorders && this.loadOrders()
                    )
                  }
                >
                  <LinearGradient
                    style={linearStyle}
                    colors={
                      isSelected
                        ? [colors.first, colors.second]
                        : [colors.white, colors.white]
                    }
                  >
                    <Image
                      source={image}
                      resizeMode={"contain"}
                      style={[
                        imageStyle,
                        isSelected && { tintColor: colors.white }
                      ]}
                    />
                    <Text
                      style={[
                        selectionTextStyle,
                        isSelected && { color: colors.white }
                      ]}
                    >
                      {name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {selectedIndex == 0 && (
          <View style={textFieldContainer}>
            <ScrollView
              contentContainerStyle={{ alignItems: "center" }}
              showsVerticalScrollIndicator={false}
            >
              <KeyboardAvoidingView
                behavior={"position"}
                keyboardVerticalOffset={110}
              >
                <View style={uploadImageContainer}>
                  <View style={imageContainer}>
                    <Image
                      resizeMode={"contain"}
                      source={image ? { uri: image } : icons.placeholderImage}
                      style={image ? photoStyle : placeholderImageStyle}
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

                <TextField
                  onChangeText={first_name => this.setState({ first_name })}
                  value={first_name}
                  label={strings.firstname}
                  errorMessage={
                    firstNameError && showFirstNameErrorStatus && strings.invalidName
                  }
                  inputStyle={{ marginStart: 0 }}
                />
                <TextField
                  onChangeText={last_name => this.setState({ last_name })}
                  value={last_name}
                  label={strings.last_name}
                  errorMessage={
                    lastNameError && showLastNameErrorStatus && strings.invalidName
                  }
                  inputStyle={{ marginStart: 0 }}
                />
                <TextField
                  onChangeText={password => this.setState({ password })}
                  value={password}
                  label={strings.newPassword}
                  errorMessage={
                    passwordError &&
                    showPasswordErrorStatus &&
                    strings.invalidPassword
                  }
                  secureTextEntry
                  inputStyle={{ marginStart: 0 }}
                />
                <TextField
                  onChangeText={confirmPassword =>
                    this.setState({ confirmPassword })
                  }
                  secureTextEntry
                  value={confirmPassword}
                  label={strings.confirmPassword}
                  errorMessage={
                    confirmPasswordError &&
                    showConfirmPasswordErrorStatus &&
                    strings.passwordNotMatch
                  }
                  inputStyle={{ marginStart: 0 }}
                />
                <Button
                  title={strings.save}
                  loading={loading}
                  style={buttonStyle}
                  linearCustomStyle={buttonLinear}
                  titleStyle={buttonTitleStyle}
                  onPress={() =>
                    this.validateInputs(
                      isEmptyPassword,
                      isEmptyConfirmPassword,
                      isEmptyFirstName,
                      isEmptyLastName,
                      passwordError,
                      confirmPasswordError,
                      firstNameError,
                      lastNameError
                    )
                  }
                />
              </KeyboardAvoidingView>
            </ScrollView>
          </View>
        )}

        {selectedIndex == 1 && (
          <Container
            loading={screenLoading}
            style={{ backgroundColor: colors.mainBackground }}
          >
            {noRequests ? (
              <EmptyScreen
                title={strings.noRequestsHistory}
                image={icons.emptyNoRequestsHistory}
                imageStyle={emptyImageStyle}
                onPress={() =>
                  this.setState({ screenLoading: true }, () =>
                    this.refreshOrders()
                  )
                }
              />
            ) : (
              <FlatList
                onRefresh={() => this.refreshOrders()}
                refreshing={listLoading}
                data={data}
                extraData={this.state}
                contentContainerStyle={contentContainer}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <MainCard
                      currentUserType={user.data.type}
                      clientProfile
                      showReview
                      onPressRate={() =>
                        this.setState({
                          modalVisible: true,
                          selectedItem: item,
                          order_id: item.id
                        })
                      }
                      item={item}
                    />
                  );
                }}
              />
            )}
          </Container>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(89.5),
    paddingBottom: vScale(68),
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
  selectionContainer: {
    width: hScale(350.3),
    height: vScale(51.8),
    alignSelf: "center",
    marginBottom: vScale(12.5),
    justifyContent: "center",
    alignItems: "stretch",
    borderRadius: hScale(5),
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
  selectionButton: {
    width: hScale(161.1),
    height: vScale(33.8),
    marginEnd: hScale(10.6),
    borderRadius: hScale(5),
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
  selectionTextStyle: {
    color: colors.mainText,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  },
  accountInfoStyle: {
    width: hScale(14.8),
    height: vScale(16.4),
    marginEnd: hScale(7.4),
    tintColor: colors.accountInfo
  },
  historyInfoStyle: {
    width: hScale(12.7),
    height: vScale(15.8),
    marginEnd: hScale(7.4)
  },
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingStart: hScale(8.6)
  },
  linearStyle: {
    flex: 1,
    flexDirection: "row",
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
  contentContainer: {
    alignItems: "center",
    paddingBottom: vScale(14)
  },
  textFieldContainer: {
    flex: 1,
    width: hScale(350.3),
    borderRadius: hScale(5),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "stretch",
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
      height: 1
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    elevation: 10
  },
  placeholderImageStyle: {
    width: hScale(22.2),
    height: vScale(22.2)
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
    marginHorizontal: hScale(7.9),
    marginTop: vScale(13.2),
    marginBottom: vScale(18.1)
  },
  buttonStyle: {
    width: hScale(332.7),
    height: vScale(35.4),
    borderRadius: hScale(5),
    marginBottom: vScale(22),
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  },
  buttonLinear: {
    borderRadius: hScale(5)
  },
  buttonTitleStyle: {
    textAlign: "center"
  },
  containerModal: {
    width: hScale(375),
    height: vScale(164.1),
    paddingHorizontal: hScale(58),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  serviceAvatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: hScale(120)
  },
  modalTextStyle: {
    fontSize: fScale(14),
    color: colors.mainText,
    marginBottom: vScale(16.7),
    fontFamily: fonts.arial
  },
  modalImageContainer: {
    width: hScale(68.2),
    height: hScale(68.2),
    borderRadius: hScale(34.1),
    marginBottom: vScale(13),
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
  avatarStyle: {
    width: hScale(68.2),
    height: hScale(68.2),
    borderRadius: hScale(34.1)
  },
  modalClientNameStyle: {
    fontSize: fScale(13),
    color: colors.rateModal,
    fontFamily: fonts.arial
  },
  modalBorderStyle: {
    height: vScale(7.3),
    width: sWidth,
    backgroundColor: colors.rateModalBorder
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
    borderRadius: 0,
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
    height: vScale(400),
    width: sWidth,
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
  serviceNameStyle: {
    fontSize: fScale(13),
    color: colors.rateModal,
    fontFamily: fonts.arial
  },
  emptyImageStyle: {
    width: hScale(64),
    height: vScale(60.8)
  },
  rateArrowsStyle: {
    width: hScale(29.2),
    height: vScale(33.2)
  },
  photoStyle: {
    width: hScale(60),
    height: vScale(50)
  },
  servicePlaceholder: {
    width: hScale(28.1),
    height: hScale(28.1)
  },
  errorStyle: {
    color: colors.error,
    fontSize: fScale(13)
  }
});

export const EditClientProfile = connect(EditClientProfileScreen);
