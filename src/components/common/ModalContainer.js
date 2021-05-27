import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView
} from "react-native";
import { hScale, vScale } from "step-scale";
import { colors } from "../../constants";

export const ModalContainer = props => {
  const { modal, innerModal } = styles;
  const { children, modalVisible, onClose, style } = props;
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      presentationStyle="overFullScreen"
    >
      <TouchableOpacity activeOpacity={1} style={modal} onPress={onClose} />
      <KeyboardAvoidingView behavior="position">
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity activeOpacity={1} style={modal} onPress={onClose} />
          <View style={[innerModal, style]}>{children}</View>
          <TouchableOpacity activeOpacity={1} style={modal} onPress={onClose} />
        </View>
      </KeyboardAvoidingView>
      <TouchableOpacity activeOpacity={1} style={modal} onPress={onClose} />
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center"
  },
  innerModal: {
    width: hScale(315.1),
    height: vScale(178),
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.white,
    borderRadius: hScale(10),
    shadowColor: "rgba(102, 72, 254, 0.24)",
    shadowOffset: {
      width: 0,
      height: vScale(12)
    },
    shadowRadius: hScale(57),
    shadowOpacity: 1,
    elevation: 10
  }
});
