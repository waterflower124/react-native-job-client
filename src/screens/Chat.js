import React, { Component } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Platform,
  View,
  Linking,
  TouchableOpacity,
  Text
} from "react-native";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Sound from "react-native-sound";
import { hScale, vScale, sWidth, fScale } from "step-scale";
import { icons } from "../assets";
import {
  BackButton,
  Container,
  TextField,
  EmptyScreen,
  ConversationCard
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { ImagePicker, getUserLocation } from "../helpers";
import { connect } from "step-react-redux";
import { whiteHeaderOptions } from "../navigation/options";
import { Step_API_Helpers, StepRequest } from "step-api-client";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { EventRegister } from 'react-native-event-listeners';
import global from '../global/global';

class ChatScreen extends Component {

  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      ...whiteHeaderOptions,
      headerRight: () => 
        <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity style = {{marginEnd: hScale(5), alignItems: 'flex-end'}} onPress = {() => {
            if(this.props.route.params.second_phone != null && this.props.route.params.second_phone != "") {
              Linking.openURL(`tel:${this.props.route.params.second_phone}`)
            }
          }}>
            <Text style = {{fontSize: fScale(10),}}>{this.props.route.params.second_first_name + " " + this.props.route.params.second_last_name}</Text>
            <Text style = {{fontSize: fScale(10),}}>{this.props.route.params.second_phone}</Text>
          </TouchableOpacity>
          <Image
            source={this.props.route.params.second_avatar ? { uri: this.props.route.params.second_avatar } : icons.userPlaceholder}
            resizeMode={"cover"}
            style={styles.avatarStyle}
          />
        </View>,
      headerLeft: () => 
        <BackButton
          backWithTitle
          title={strings.chat}
          onPress={() => this.props.navigation.goBack()}
          // onPress={() => this.props.navigation.navigate("Messages")}
        />,
        tabBarVisibile: false
    })
  }

  state = {
    second: null,
    text: "",
    screenLoading: true,
    receiver_id: "",
    type: 1,
    image: null,
    uploadImage: null,
    hasMicPermission: false,
    isRecording: false,
    currentTime: "",
    voiceMessage: "",
    stoppedRecording: false,
    list: [],
    sendLoading: false,
    pageNo: 1,
    lastPage: null,
    my_latitude: 0,
    my_longitude: 0,
    task_id: 0,
    showImage: false,
    showImageUrl: "",
    first_fetch: true,
    project_title: "",
    second_avatar: null
  };


  UNSAFE_componentWillMount() {
    const task_id = this.props.route.params.task_id;
    this.setState({
      task_id: task_id
    })
  }

  componentWillUnmount(){
    
    try {
      voiceMessage.stop()
    } catch (error) {

    }
    try {
      clearTimeout(refreshInterval)
    } catch (error) {

    }
    EventRegister.removeEventListener(this.notiChatListener);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      second_first_name: '',
      second_last_name: '',
      second_phone: ''
    })
    const receiver_id = this.props.route.params.receiver_id;
    if (receiver_id) {
      this.initializeRecorder();
      this.setState({ receiver_id }, () => this.fetchData());
    } else {
      this.props.navigation.goBack();
    }

    this.notiChatListener = EventRegister.addEventListener(global.NOTI_CHAT_OPEN, (data) => {
      if(data.task_id != this.state.task_id) {
        try {
          voiceMessage.stop()
        } catch (error) {
    
        }
        try {
          clearTimeout(refreshInterval)
        } catch (error) {
    
        }
        this.props.navigation.setParams({
          second_first_name: '',
          second_last_name: '',
          second_phone: ''
        })
        this.setState({ 
          task_id: data.task_id,
          receiver_id: data.receiver_id,
          pageNo: 1,
        }, () => this.fetchData());
      }
    })
  }
  
  async initializeRecorder() {
    try {
      const isAuthorised = await AudioRecorder.requestAuthorization();

      this.setState({ hasMicPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath();

      AudioRecorder.onProgress = (data) => {
        let seconds = Math.floor(data.currentTime);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        if (minutes < 59) {
          minutes = `0${minutes}`;
        }
        const currentTime = `${minutes} : ${seconds}`;
        console.log("currentTime", currentTime);
        this.setState({ text: currentTime, isRecording: true });
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        // if (Platform.OS == "ios") {
          const voiceMessage = data.base64;
          const didSuccess = data.status === "OK";
          const filePath = data.audioFileURL;
          const fileSize = data.audioFileSize;
          if (didSuccess) {
            console.log(
              `Finished recording of duration ${this.state.currentTime} seconds
           at path: ${filePath}  and size of ${fileSize || 0} bytes `
            );

            this.setState({
              isRecording: false,
              stoppedRecording: true,
              voiceMessage,
              type: 2
            }, ()=> this.validateInput());
          }
        // }
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  prepareRecordingPath() {
    const audioPath = AudioUtils.DocumentDirectoryPath + "/temp.aac";
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "High",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
      IncludeBase64: true
    });
  }

  async startRecording() {
    const { isRecording, hasMicPermission, stoppedRecording } = this.state;
    if (isRecording) {
      // console.warn("Already recording!");
      return;
    }

    if (!hasMicPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (stoppedRecording) {
      this.prepareRecordingPath();
    }

    this.setState({ isRecording: true, voiceMessage: "" });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error.message);
    }
  }

  async stopRecording() {
    
    const { isRecording } = this.state;

    if (!isRecording) {
      // console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({ isRecording: false, stoppedRecording: true });

    try {
      const filePath = await AudioRecorder.stopRecording();
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async playVoiceMessage(item, index) {
    if (this.state.playingIndex != null) {
      console.warn("Can't Play, Please Wait");
      return;
    }
    voiceMessage = new Sound(item.text, null, (error) => {
      if (error) {
        console.warn("Error Playing VoiceMessage");
      } else {
        voiceMessage.setCategory("Playback");
        this.setState({ playingIndex: index });
        voiceMessage.play(() => {
          console.warn("end playing");
          this.setState({ playingIndex: null });
        });
      }
    });
  }

  async showImage(item, index) {
    console.log(item);
    this.setState({
      showImage: true,
      showImageUrl: item.text
    })
  }

  refreshData () {
    // console.warn("Refreshing");
    this.setState({ pageNo: 1 }, () => this.fetchData())
  }

  async fetchData() {
    const { pageNo, receiver_id, list, task_id } = this.state;
    
    const params = Step_API_Helpers.convertObjToParams({
      second: receiver_id,
      page: pageNo,
      request_id: task_id
    });
    const isFirstPage = pageNo == 1;
    // console.warn(pageNo);
    try {
      const data = await StepRequest(`conversation?${params}`);
      console.log("conversation_data: " + JSON.stringify(data));
      const newChat = typeof data == "string";
      if (!newChat) {
        this.setState({
          list: isFirstPage
            ? data.conversation.data
            : [...list, ...data.conversation.data],
          lastPage: data.conversation.last_page,
          second: data.second,
          screenLoading: false,
          sendLoading: false,
          project_title: data.request.requirements
        });
        if(data.second.phone != null && data.second.phone != "") {
          this.props.navigation.setParams({
            second_first_name: data.second.first_name,
            second_last_name: data.second.last_name,
            second_phone: data.second.phone
          })
        }
        if(data.second.avatar) {
          this.props.navigation.setParams({
            second_avatar: data.second.avatar
          })
        }
        if(data.alert != null && this.state.first_fetch) {
          Alert.alert(strings.notice, data.alert);
        }
        refreshInterval = setTimeout(() => {
          this.refreshData()
        }, 5000);
      } else {
        const data_split = data.split("||");
        if((data_split[0] == "alert" || data_split[0] == "nofound") && this.state.first_fetch) {
          Alert.alert(strings.notice, data_split[1]);
        }
        this.setState({
          screenLoading: false
        });
        // this.props.navigation.setParams({
        //   second_first_name: '',
        //   second_last_name: '',
        //   second_phone: ''
        // })
      }
      
    } catch (error) {
      this.setState({ screenLoading: false, sendLoading: false });
      Alert.alert(error.message);
    }
    if(this.state.first_fetch) {
      this.setState({
        first_fetch: false
      })
    }
  }

  validateInput() {
    const { text } = this.state;
    text.length > 0 && this.onSend();
  }

  async onSend() {
    let { text, type, voiceMessage, uploadImage, receiver_id, task_id } = this.state;
    
    this.setState({ sendLoading: true });
    const isPhotoMessage = type === 3;
    const isVoiceMessage = type === 2;
    if (isPhotoMessage) {
      text = uploadImage;
    }
    if (isVoiceMessage) {
      text = voiceMessage;
    }
    try {
      const messageBody = { receiver_id, type, text, request_id: task_id };
      console.log("messageBody", JSON.stringify(messageBody));
      const data = await StepRequest("messages", "POST", messageBody);
      this.setState({ text: "", voiceMessage: "", type: 1, pageNo: 1 }, () =>
        this.fetchData()
      );

      console.log(JSON.stringify(data));
    } catch (error) {
      this.setState({ sendLoading: false });
      Alert.alert(error.message);
    }
  }

  async uploadPhotoPress() {
    const { imageObject } = await ImagePicker({
      width: 100,
      height: 100,
      multiple: false,
      compressImageQuality: 0.2
    });
    this.setState(
      {
        uploadImage: imageObject,
        type: 3
      },
      () => this.onSend()
    );
  }

  render() {
    const {
      container,
      defaultIconStyle,
      microphoneStyle,
      inputImageStyle,
      iconContainer,
      noChatImageStyle,
      uploadIconContainer
    } = styles;

    const {
      text,
      screenLoading,
      list,
      receiver_id,
      second,
      sendLoading,
      pageNo,
      lastPage,
      type,
      isRecording,
      playingIndex
    } = this.state;
    // const pendingVoiceMessage = type == 2;

    const noMessages = list.length == 0;
    const { user } = this.props;
    const endReached = pageNo == lastPage;
    return (
      <Container loading={screenLoading}>
      {
        this.state.showImage && 
        <View style = {{flex: 1, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center', elevation: 20}}
          onStartShouldSetResponder = {() => {this.setState({showImage: false, showImageUrl: ""})}}>
          <View style = {{width: '100%', height: '100%', backgroundColor: '#000000', opacity: 0.8, position: 'absolute', top: 0, left: 0}}></View>
          <TouchableOpacity style = {{position: 'absolute', right: 20, top: 20, width: hScale(18), height: hScale(18), padding: hScale(3), borderRadius: hScale(12), backgroundColor: '#ffffff', zIndex: 10}}
            onPress = {() => {this.setState({showImage: false, showImageUrl: ""})}}>
            <Image source={icons.xClose} style={[{width: '100%', height: '100%', tintColor: colors.black }]} resizeMode="contain" />
          </TouchableOpacity>
          <Image style = {{width: '90%', height: '90%', resizeMode: 'contain'}} source = {{uri: this.state.showImageUrl}}/>
        </View>
      }
        {
          !noMessages && 
          <MapView
            provider = {PROVIDER_GOOGLE}
            ref={ref => (this.myMapView = ref)}
            showsUserLocation
            showsMyLocationButton
            style={{ width: hScale(354.4), height: vScale(150.3), }}
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
                  console.log(latitude + "   " + longitude);
                  console.log(this.state.second.lat + "   " + this.state.second.lng);
                  var latDelta = 0.1;
                  var lngDelta = 0.1;
                  if(this.state.second != null) { 
                    latDelta = Math.abs(latitude - this.state.second.lat);
                    lngDelta = Math.abs(longitude - this.state.second.lng);
                  }
                  this.myMapView.animateToRegion({
                    latitude: (latitude + this.state.second.lat) / 2,
                    longitude: (longitude + this.state.second.lng) / 2,
                    latitudeDelta: latDelta == 0 ? 0.1 : latDelta * 1.5,
                    longitudeDelta: lngDelta == 0 ? 0.1 : lngDelta * 1.5
                  });
                  // todo: GeoCoding coords
                  this.setState({
                    my_latitude: latitude,
                    my_longitude: longitude
                  })
                },
                error => { }
              );
            }}
            // onRegionChangeComplete={region => {
            //   const { latitude, longitude } = region;
            //   // this.setState({ location: { latitude, longitude } });
            //   this.setState({
            //     temp_latitude: latitude,
            //     temp_longitude: longitude
            //   })
            // }}
          >
            <Marker
              pinColor={colors.second}
              coordinate={{latitude: this.state.my_latitude, longitude: this.state.my_longitude} || { longitude: 45, latitude: 25 }}
              title = {"My Location"}
              onPress = {() => {
                const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                const latLng = `${this.state.my_latitude},${this.state.my_longitude}`;
                const label = 'My Location';
                var url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`
                });
                Linking.openURL(url); 
                if(Platform.OS == "android") {
                  Linking.openURL(url); 
                } else {
                  url = 'http://maps.google.com/maps?daddr=' + this.state.my_latitude + ',' + this.state.my_longitude;
                  console.log("my location::" + url);
                  Linking.openURL(url).catch(err => console.error('An error occurred', err));
                }
                
              }}
            />
          {
            this.state.second != null &&
              <Marker
                pinColor={colors.first}
                coordinate={{latitude: this.state.second.lat, longitude: this.state.second.lng} || { longitude: 45, latitude: 25 }}
                title = {this.state.second.first_name}
                onPress = {() => {
                  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                  const latLng = `${this.state.second.lat},${this.state.second.lng}`;
                  const label = this.state.second.first_name;
                  var url = Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`
                  });
                  
                  if(Platform.OS == "android") {
                    Linking.openURL(url); 
                  } else {
                    
                    url = 'http://maps.google.com/maps?daddr=' + this.state.second.lat + ',' + this.state.second.lng;
                    console.log("his location::" + url);
                    Linking.openURL(url).catch(err => console.error('An error occurred', err));
                  }
                }}
              />
          }
          </MapView>
        }
        <View style = {{width: '100%', marginTop: vScale(10.4), marginStart: hScale(20), alignItems: 'flex-start'}}>
          <Text style = {{fontSize: fScale(15),}}>{this.state.project_title}</Text>
        </View>
        <KeyboardAvoidingView
          style={container}
          behavior={(Platform.OS === 'ios') ? "padding" : null}
          keyboardVerticalOffset={50}
          enabled
        >
          {noMessages ? (
            <EmptyScreen
              customContainer={{ flex: 1 }}
              title={strings.noMessages}
              image={icons.emptyNoChat}
              imageStyle={noChatImageStyle}
              onPress={() =>
                this.setState({ screenLoading: true }, () => this.fetchData())
              }
            />
          ) : (
            <FlatList
              onEndReachedThreshold={0.5}
              onEndReached={() =>
                !endReached &&
                this.setState({ pageNo: pageNo + 1 }, () => this.fetchData())
              }
              data={list}
              extraData={this.state}
              inverted
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const isOtherUserMsg = item.user_id != user.data.id;
                const isPlaying = playingIndex == index;

                return (
                  <ConversationCard
                    second={second}
                    myAvatar={user.data.avatar}
                    isOtherUserMsg={isOtherUserMsg}
                    item={item}
                    onPressPlay={() => this.playVoiceMessage(item, index)}
                    onPressImage = {() => this.showImage(item, index)}
                  />
                );
              }}
            />
          )}
          <TextField
            onChangeText={(text) => this.setState({ text })}
            value={text}
            onRightIconPress={() => this.validateInput()}
            onSubmitEditing={() => this.validateInput()}
            onLeftIconPress={() => this.uploadPhotoPress()}
            onLeftIcon2Press={() =>
              // isRecording
              //   ? this.stopRecording()
                // : // : pendingVoiceMessage
                  // ? this.setState({ voiceMessage: "", type: 1 })
                  this.startRecording()
            }
            onLeftIcon2Release={()=> this.stopRecording()}
            placeholder={strings.typeHere}
            leftIcon={icons.placeholderImage}
            leftIcon_2={icons.microphone}
            leftIcon_2Style={[
              microphoneStyle,
              isRecording && { tintColor: "red" }
            ]}
            leftIconStyle={microphoneStyle}
            leftIconContainer={uploadIconContainer}
            rightIcon={icons.miniArrow}
            rightIconStyle={defaultIconStyle}
            rightIconContainer={iconContainer}
            loading={sendLoading}
            enabled={!sendLoading || !isRecording}
            disableInput={isRecording}
            inputStyle={{ height: vScale(40) }}
            customMainContainer={{
              marginBottom: vScale(20),
              height: vScale(40)
            }}
            containerStyle={{ height: vScale(40) }}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: hScale(354.4),
    borderRadius: hScale(5),
    marginTop: vScale(10.4),
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
  iconContainer: {
    width: hScale(21.5),
    height: vScale(19.2),
    alignItems: "center",
    justifyContent: "center"
  },
  defaultIconStyle: {
    width: hScale(11.5),
    height: vScale(9.2),
    resizeMode: "contain"
  },
  uploadIconContainer: {
    width: hScale(20),
    height: hScale(20),
    justifyContent: "center",
    alignItems: "center"
  },
  inputImageStyle: {
    width: hScale(11.2),
    height: vScale(11.2),
    tintColor: colors.second,
    resizeMode: "contain"
  },
  microphoneStyle: {
    width: hScale(30),
    height: hScale(30),
    marginHorizontal: hScale(5),
    tintColor: colors.second,
    resizeMode: "contain"
  },
  avatarStyle: {
    width: hScale(24.3),
    height: hScale(24.3),
    borderRadius: hScale(12.15),
    marginEnd: hScale(40.7)
  },
  noChatImageStyle: {
    width: hScale(59.7),
    height: hScale(59.7)
  }
});

export const Chat = connect(ChatScreen);
