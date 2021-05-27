import React, { Component } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { hScale, vScale } from "step-scale";
import { icons } from "../assets";
import { Container, EmptyScreen, MessageCard, BackButton } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { Step_API_Helpers, StepRequest } from "step-api-client";
import { connect } from "step-react-redux";
import { defaultNavigationOptions, whiteHeaderOptions } from '../navigation/options';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import global from '../global/global';

class MessagesScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setParams({
      refreshChatList: () => this.refreshChatList()
    });

    this.props.navigation.setOptions({
      ...whiteHeaderOptions,
      headerLeft: () => 
        <BackButton
          backWithTitle
          onPress={() => this.props.navigation.goBack()}
          // onPress={() => this.props.navigation.navigate("Home", {screen: 'ServicesTab', params: {screen: 'Home'}})}
          title={strings.conversions}
        />
    })
  }
  state = {
    screenLoading: true,
    pageNo: 1,
    last_page: null,
    list: [],
    listLoading: false
  };

  componentDidMount() {
    this.loadMessages();
    this.notiOthersListener = EventRegister.addEventListener(global.NOTI_OTHERS, () => {
      this.refreshChatList();
    })
    this.notiChatListener = EventRegister.addEventListener(global.NOTI_CHAT_OPEN, (data) => {
      this.props.navigation.navigate("Chat", {
        receiver_id: data.receiver_id,
        avatar: null,
        task_id: data.task_id
      })
    })
    this.focusListener = this.props.navigation.addListener('focus', () => {
      if(global.GOTO_CHAT) {
        global.GOTO_CHAT = false;
        this.props.navigation.navigate("Chat", {
          receiver_id: global.GOTO_CHAT_RECEIVER_ID,
          avatar: null,
          task_id: global.GOTO_CHAT_TASK_ID
        })
      }
    })
  }

  async componentWillUnmount() {
    EventRegister.removeEventListener(this.notiOthersListener);
    EventRegister.removeEventListener(this.notiChatListener);
  }

  
  async loadMessages() {
    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      this.setState({
        screenLoading: false,
        listLoading: false
      });
      return;
    }

    const { pageNo } = this.state;
    const params = Step_API_Helpers.convertObjToParams({
      page: pageNo
    });
    try {

      const list = await StepRequest(`messages?${params}`);
      console.log("list", JSON.stringify(list));
      var temp_list = []
      for(i = 0; i < list.data.length; i ++) {
        if(list.data[i].second) {
          temp_list.push(list.data[i])
        }
      }
      this.setState({
        list: temp_list,
        last_page: list.last_page,
        screenLoading: false,
        listLoading: false
      });
    } catch (error) {
      Alert.alert(error.message);
      this.setState({ screenLoading: false, listLoading: false });
    }
  }

  refreshChatList() {
    this.setState({ pageNo: 1, listLoading: true }, () => this.loadMessages());
  }
  render() {
    const { separatorStyle, container, emptyImageStyle } = styles;
    const { navigation } = this.props;
    const { screenLoading, pageNo, last_page, list, listLoading } = this.state;
    const noConverstaions = list.length == 0;
    const ReachedEnd = pageNo == last_page;

    return (
      <Container loading={screenLoading}>
        {noConverstaions ? (
          <EmptyScreen
            title={strings.noConversations}
            image={icons.emptyNoMsg}
            imageStyle={emptyImageStyle}
            onPress={() =>
              this.setState({ screenLoading: true }, () =>
                this.refreshChatList()
              )
            }
          />
        ) : (
          <View style={container}>
            <FlatList
              onRefresh={() => this.refreshChatList()}
              refreshing={listLoading}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                !ReachedEnd && this.setState({ pageNo: pageNo + 1 }),
                  () => this.loadMessages();
              }}
              data={list}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: vScale(70) }}
              ItemSeparatorComponent={() => <View style={separatorStyle} />}
              renderItem={({ item, index }) => {
                const { second } = item;
                return (
                  <MessageCard
                    onPress={() =>
                      navigation.navigate("Chat", {
                        receiver_id: second.id,
                        avatar: second.avatar,
                        task_id: item.request_id
                      })
                    }
                    item={item}
                  />
                );
              }}
            />
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: hScale(354.2),
    borderRadius: hScale(5),
    marginTop: vScale(10.6),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10,
    paddingBottom: vScale(64)
  },
  separatorStyle: {
    width: hScale(339.3),
    height: vScale(0.5),
    backgroundColor: colors.mainConBack,
    alignSelf: "center"
  },
  emptyImageStyle: {
    width: hScale(56),
    height: vScale(44)
  }
});

export const Messages = connect(MessagesScreen);
