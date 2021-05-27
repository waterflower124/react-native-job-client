import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View, Modal, Image, TouchableOpacity, Platform, Linking } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import {
  ChatIcon,
  Container,
  DrawerIcon,
  ServiceCard,
  EmptyScreen,
  HeaderLogo,
  BackButton,
  
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { connect } from "step-react-redux";
import { Link } from "@react-navigation/native";

class HomeScreen extends Component {

  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      headerLeft: () => <HeaderLogo/>,
      headerRight: () =>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center'}}>
          {/* <ChatIcon onPress={() => this.props.navigation.navigate("Messages")} /> */}
          <DrawerIcon onPress={() => this.props.navigation.openDrawer()} />
        </View>
    })
    
  }

  // static navigationOptions = ( navigation ) => {
      
  //   headerLeft: (<HeaderLogo />)
  //   headerRight: (
  //     <View style={{ flexDirection: "row", alignItems: "center" }}>
  //       <ChatIcon onPress={() => navigation.navigate("Messages")} />
  //       <DrawerIcon onPress={() => navigation.openDrawer()} />
  //     </View>
  //   )
  // }

  UNSAFE_componentWillMount() {

  }
  
  componentDidMount() {

  }

  state = {
    showLocationAlert: true
  }

  showLocationAlert = (status) => {
    this.setState({
      showLocationAlert: status
    })
    if(status) {
      console.log("1234567890")
    }
  }
  
  render() {
    const { textStyle, secTitleStyle, container, emptyImageStyle } = styles;
    const { navigation, categories } = this.props;
    const noCategories = categories.length == 0;
    return (
      <Container gradientHeader style={container}>
        <Modal
          transparent
          visible={this.state.showLocationAlert}
          presentationStyle="overFullScreen"
        >
          <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style = {{width: '100%', height: '100%', top: 0, left: 0, position: 'absolute', backgroundColor: '#000000', opacity: 0.2}}></View>
            <View style = {{width: '70%', borderRadius: 5, overflow: 'hidden', backgroundColor: '#ffffff'}}>
              <View style = {{paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center'}}>
                <Image style = {{width: hScale(25.7), height: hScale(25.7), resizeMode: 'contain'}} source = {require('../assets/icons/location_update.png')}></Image>
                <Text style = {{textAlign: "center", fontSize: 16, fontWeight: "600",}}>{strings.warnning_location}</Text>
              </View>
              <TouchableOpacity style = {{borderTopWidth: 0.5, borderTopColor: '#a0a0a0', paddingVertical: 15, alignItems: 'center'}} onPress = {() => {
                this.setState({
                  showLocationAlert: false
                })
                if(Platform.OS == "ios") {
                  // Linking.openURL('app-settings:/Location');
                  Linking.openSettings()
                }
              }}>
                <Text style = {{textAlign: "center", fontSize: 16, fontWeight: "600",}}>{strings.ok}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={[textStyle, { marginTop: vScale(10.6) }]}>
          {strings.homeService}
        </Text>
        <Text style={[textStyle, secTitleStyle]}>
          {strings.chooseServiceAndLetsStart}
        </Text>
        {noCategories ? (
          <EmptyScreen
            title={strings.noCategory}
            image={icons.emptyNoCat}
            imageStyle={emptyImageStyle}
          />
        ) : (
          <FlatList
            data={categories}
            numColumns={3}
            columnWrapperStyle={{
              alignItems: "center",
              justifyContent: "space-around"
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ServiceCard
                onPress={() =>
                  navigation.navigate("NewRequest", { category_id: item.id, showLocationAlert: this.showLocationAlert })
                }
                item={item}
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
    paddingTop: vScale(79.5),
    paddingBottom: vScale(64)
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
    // marginBottom: vScale(87.3),
    fontFamily: fonts.arial,
    textShadowColor: "rgba(0, 0, 0, 0.06)",
    textShadowOffset: {
      width: 0,
      height: vScale(1)
    },
    textShadowRadius: 0
  },
  emptyImageStyle: {
    width: hScale(47.5),
    height: vScale(58)
  }
});

export const Home = connect(HomeScreen);
