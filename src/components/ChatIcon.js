import React from "react";
import { Image, StyleSheet, TouchableOpacity, View,Alert } from "react-native";
import { hScale, vScale, crScale, rcScale } from "step-scale";
import { icons } from "../assets";
import { colors } from "../constants";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";

export class ChatIconComponent extends React.PureComponent {
  state = { haveNewMessages: false };
  componentDidMount() {
    this.checkNewMessages();
  }
  async checkNewMessages() {
    const { haveNewMessages } = this.state;
    const {user} = this.props;
    if(user.data.id == -1) {
      return;
    }
    try {
      const data = await StepRequest("unread-messages");
      this.setState({ haveNewMessages: data.unread });
      
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  render() {
    const { container, imageStyle, roundedView } = styles;
    const { haveNewMessages } = this.state;
    const { onPress } = this.props;
    return (
      <TouchableOpacity style={container} onPress={onPress}>
        <Image
          source={icons.chatHead}
          resizeMode={"contain"}
          style={imageStyle}
        />
        {haveNewMessages && <View style={roundedView} />}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginEnd: hScale(10.9),
    width: hScale(29.6),
    height: hScale(25.8),
    alignItems: "center",
    justifyContent: 'center',
  },
  imageStyle: {
    ...rcScale(18.9, 15.1),
    // width: hScale(18.9),
    // height: vScale(15.1),
    // marginTop: vScale(5.35),
    position: "absolute"
  },
  roundedView: {
    ...crScale(10.7),
    // width: hScale(10.7),
    // height: hScale(10.7),
    backgroundColor: colors.mainText,
    // borderRadius: hScale(5.35),
    alignSelf: "flex-start"
  }
});

export const ChatIcon = connect(ChatIconComponent);
