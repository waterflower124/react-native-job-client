import React, { Component } from "react";
import { StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { vScale } from "step-scale";
import { BackButton, Container } from "../components";
import { whiteHeaderOptions } from "../navigation/options";
import { strings } from "../strings";

class PaymentWebviewScreen extends Component {

  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      ...whiteHeaderOptions,
      title: this.props.route.params.title,
      headerLeft: () => <BackButton onPress={() => this.props.navigation.goBack()} />
    })

  }

  render() {
    const { container } = styles;
    const { navigation } = this.props;
    const uri = this.props.route.params.uri;

    return (
      <Container style={container}>
        <WebView
          useWebKit
          startInLoadingState
          source={{ uri }}
          onNavigationStateChange={({ title, url }) => {
            navigation.setParams({ title });
            const successfullyPayment = url.includes("success");
            const failPayment = url.includes("declined");
            const canceledlPayment = url.includes("cancel");
            if (successfullyPayment) {
              Alert.alert(strings.paymentSuccess);
              navigation.navigate("Notification", { refresh: true });
            } else if (failPayment || canceledlPayment) {
              if (failPayment) {
                Alert.alert(strings.paymentFailed);
              }
              navigation.navigate("Notification", { refresh: true });
            } else {
              // console.warn("URL Changed to ", url);
            }
          }}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(14.7),
    alignItems: "stretch"
  }
});

export const PaymentWebview = PaymentWebviewScreen;
