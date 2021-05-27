import React, { Component } from "react";
import { FlatList, Image, StyleSheet, Alert, TouchableOpacity, View } from "react-native";
import { hScale, vScale } from "step-scale";
import {
  Container,
  MainCard,
  OfferCard,
  EmptyScreen,
  BackButton
} from "../components";
import { icons } from "../assets";
import { strings } from "../strings";
import { whiteHeaderOptions } from "../navigation/options";
import { StepRequest } from "step-api-client";
import { colors } from "../constants";
import { EventRegister } from 'react-native-event-listeners';
import global from '../global/global';

export class RequestDetails extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      ...whiteHeaderOptions,
      headerLeft: () =>
        <BackButton
          backWithTitle
          onPress={() => this.props.navigation.goBack()}
          // onPress={() => this.props.navigation.navigate("Home", {screen: 'RequestTab', params: {screen: 'YourRequests'}})}
          title={strings.request}
        />
    })

    // const item = this.props.route.params.item;
    this.state = {
      item: null,
      id: this.props.route.params.id,
      screenLoading: true,
      loading: false,
      rejectLoading: false,
      refreshLoading: false,
      bid_accepted: false,
      showImage: false,
      showImageUrl: "",
    };
  }
  

  componentDidMount(){
    // const id = this.props.route.params.getData;
    // if (shouldGetData){
    //   this.refreshData()
    // } else {
    //   this.setState({ screenLoading: false })
    // }
    this.setState({screenLoading: true})
    this.refreshData();
    this.notiOfferCreatedListener = EventRegister.addEventListener(global.NOTI_OFFER_CREATED, (id) => {
      console.log(id + "       " + this.state.id)
      if(id == this.state.id) {
        this.refreshData()
      }
    })
    this.notiOfferCreatedOpenListener = EventRegister.addEventListener(global.NOTI_OFFER_CREATED_OPEN, (id) => {
      console.log(id + "       " + this.state.id)
      if(id != this.state.id) {
        this.setState({
          id: id,
          bid_accepted: false,
        }, () => this.refreshData())
      }
    })
    this.notiRequestResetListener = EventRegister.addEventListener(global.NOTI_REQUEST_RESET, (id) => {
      console.log(id + "       " + this.state.id)
      if(id == this.state.id) {
        this.refreshData()
      }
    })
  }


  async componentWillUnmount() {
    // this.forcusListener();
    EventRegister.removeEventListener(this.notiOfferCreatedListener);
    EventRegister.removeEventListener(this.notiOfferCreatedOpenListener);
    EventRegister.removeEventListener(this.notiRequestResetListener);
  }

  async acceptOffer(id) {
    this.setState({ loading: true });
    const { item, selectedItem } = this.state;
    try {
      const acceptBody = { offer_id: id, request_id: item.id };
      const data = await StepRequest("client-offers", "POST", acceptBody);
      this.refreshData()
      await this.setState({ loading: false });
      console.warn("data", data);
      await this.props.navigation.navigate("Chat", {
        receiver_id: selectedItem.employee.id,
        avatar: selectedItem.employee.avatar,
        task_id: this.state.id
      });
      console.warn("acceptBody", acceptBody);
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert(error.message);
    }
  }

  async rejectOffer(id) {
    this.setState({ rejectLoading: true });
    const { item } = this.state;
    try {
      const rejectBody = { offer_id: id, request_id: this.state.id };
      const data = await StepRequest(
        "client-offers/rejectOffer",
        "POST",
        rejectBody
      );
      await this.refreshData();
      await this.setState({ rejectLoading: false });
      console.warn("data", data);
      Alert.alert(data);
      console.warn("rejectBody", rejectBody);
    } catch (error) {
      this.setState({ rejectLoading: false });
      Alert.alert(error.message);
    }
  }

  async refreshData() {
    // const { id } = this.state.item;
    try {
      const data = await StepRequest(`client-requests/${this.state.id}`);
      console.log("request data: ", data);
      var bid_accepted = false;
      if(data.offers != null && data.offers.length > 0) {
        for(i = 0; i < data.offers.length; i ++) {
          if(data.offers[i].status == 1) {
            bid_accepted = true;
            break;
          }
        }
      }
      this.setState({ item: data, refreshLoading: false, screenLoading: false, bid_accepted: bid_accepted });
    } catch (error) {
      Alert.alert(error.message);
      this.props.navigation.goBack()
    }
  }

  render() {
    const {
      container,
      mainImageStyle,
      contentContainerStyle,
      noOffersImageStyle
    } = styles;

    if(this.state.item == null) {
      return (
        <Container style={container} loading={true}>

        </Container>
      )
    }
    
    const {
      item,
      selectedItem,
      loading,
      rejectLoading,
      screenLoading,
      refreshLoading,
      bid_accepted
    } = this.state;
    const data = item.offers;
    const noOffers = data.length == 0;
    return (
      <Container style={container} loading={screenLoading}>
      {
        this.state.showImage && this.state.showImageUrl != null && this.state.showImageUrl != "" &&
        <View style = {{flex: 1, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center'}}
          onStartShouldSetResponder = {() => {this.setState({showImage: false, showImageUrl: ""})}}>
          <View style = {{width: '100%', height: '100%', backgroundColor: '#000000', opacity: 0.8, position: 'absolute', top: 0, left: 0}}></View>
          <TouchableOpacity style = {{position: 'absolute', right: 20, top: 20, width: hScale(18), height: hScale(18), padding: hScale(3), borderRadius: hScale(12), backgroundColor: '#ffffff', zIndex: 10}}
            onPress = {() => {this.setState({showImage: false, showImageUrl: ""})}}>
            <Image source={icons.xClose} style={[{width: '100%', height: '100%', tintColor: colors.black }]} resizeMode="contain" />
          </TouchableOpacity>
          <Image style = {{width: '90%', height: '90%', resizeMode: 'contain'}} source = {{uri: this.state.showImageUrl}}/>
        </View>
      }
        <MainCard
          clientProfile
          item={item}
          containerStyle={{ alignSelf: "center" }}
          disableTouch
        />
        <TouchableOpacity onPress = {() => {this.setState({showImage: true, showImageUrl: item.image})}}>
          <Image
            source={{ uri: item.image }}
            style={mainImageStyle}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
        {noOffers ? (
          <EmptyScreen
            title={strings.noOffers}
            image={icons.emptyNoOffers}
            imageStyle={noOffersImageStyle}
            hideButton
          />
        ) : (
          <FlatList
            data={data}
            extraData={this.state}
            onRefresh={() =>
              this.setState({ rejectLoading: true }, () => this.refreshData())
            }
            refreshing={refreshLoading}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <OfferCard
                loading={selectedItem == item && loading}
                rejectLoading={selectedItem == item && rejectLoading}
                item={item}
                bid_accepted = {bid_accepted}
                onRejectPress={() => {
                  this.setState({ selectedItem: item }, () =>
                    this.rejectOffer(item.id)
                  );
                }}
                onPress={() => {
                  this.setState({ selectedItem: item }, () =>
                    this.acceptOffer(item.id)
                  );
                }}
              />
            )}
          />
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(8.4),
    alignItems: "stretch"
  },
  mainImageStyle: {
    width: hScale(350.7),
    height: vScale(107.3),
    borderRadius: hScale(5),
    alignSelf: "center"
  },
  contentContainerStyle: {
    alignItems: "center",
    marginTop: vScale(11.6)
  },
  noOffersImageStyle: {
    width: hScale(36.4),
    height: vScale(28.6)
  }
});
