import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  FlatList,
  I18nManager
} from "react-native";
import { colors } from "../constants";
import { hScale, vScale, fScale } from "step-scale";
import { ModalContainer } from "./common";
import { strings } from "../strings";
import { icons, fonts } from "../assets";

export const ModalButton = props => {
  const {
    title,
    data,
    onSelect,
    errorMessage,
    onCloseModal,
    onPressSave,
    selectedItem,
    modalVisible,
    onPress,
    submittedItem,
    isCategory,
    containerStyle
  } = props;
  const {
    container,
    textStyle,
    borderSeparator,
    separatorModalStyle,
    roundedViewStyle,
    smallroundedViewStyle,
    modalListButton,
    cancelSaveContainer,
    innerModalButton,
    errorContainer,
    errorMessageStyle,
    selectedItemContainer,
    sortIconStyle
  } = styles;
  const { isRTL } = I18nManager;
  const selectedName = isCategory
    ? submittedItem.map((e, index) => {
        return (
          e.name +
          (index != submittedItem.length - 1 ? "," : "")
        );
      })
    : submittedItem.name;
  return (
    <View>
      <ModalContainer modalVisible={modalVisible} onClose={onCloseModal}>
        <FlatList
          data={data}
          extraData={this.state}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: vScale(20) }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const { name, id } = item;
            const isSelected = isCategory
              ? selectedItem.includes(item)
              : selectedItem.id == id;
            return (
              <TouchableOpacity
                onPress={() => onSelect(item,isSelected)}
                style={modalListButton}
              >
                <View style={roundedViewStyle}>
                  {isSelected && <View style={smallroundedViewStyle} />}
                </View>
                <Text style={textStyle}>{name}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={separatorModalStyle} />
        <View style={cancelSaveContainer}>
          <TouchableOpacity
            onPress={onCloseModal}
            style={[innerModalButton, { marginEnd: hScale(10) },]}
          >
            <Text style={[textStyle, { fontSize: fScale(14) }]}>
              {strings.cancel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={innerModalButton} onPress={onPressSave}>
            <Text style={[textStyle, { fontSize: fScale(14) }]}>
              {strings.save}
            </Text>
          </TouchableOpacity>
        </View>
      </ModalContainer>
      <TouchableOpacity style={[container, containerStyle]} onPress={onPress}>
        <Text
          style={[
            textStyle,
            { marginBottom: vScale(4.1) },
            isRTL && { textAlign: "left" }
          ]}
        >
          {title}
        </Text>
        <View style={selectedItemContainer}>
          <Text
            style={[textStyle, { marginBottom: vScale(10.6) }]}
            numberOfLines={1}
          >
            {selectedName}
          </Text>
          <Image
            resizeMode={"contain"}
            source={icons.sortDown}
            style={sortIconStyle}
          />
        </View>
        <View style={borderSeparator} />
      </TouchableOpacity>
      <View style={errorContainer}>
        <Text style={errorMessageStyle}>
          {errorMessage ? errorMessage : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: hScale(343.8),
    marginBottom: vScale(17.1)
  },
  textStyle: {
    color: colors.mainTextColor,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  },
  borderSeparator: {
    width: hScale(343.8),
    height: vScale(1.2),
    backgroundColor: colors.inputBorder
  },
  separatorModalStyle: {
    width: hScale(296.7),
    height: vScale(0.6),
    backgroundColor: colors.line
  },
  roundedViewStyle: {
    width: hScale(20),
    height: hScale(20),
    borderRadius: hScale(10),
    marginEnd: hScale(10.4),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.whiteColor,
    shadowColor: "rgba(102, 72, 254, 0.24)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: hScale(1),
    borderColor: "rgba(0, 0, 0, 0.07)",
    // elevation: 10
  },
  smallroundedViewStyle: {
    width: hScale(10),
    height: hScale(10),
    borderRadius: hScale(5),
    backgroundColor: colors.black
  },
  modalListButton: {
    width: hScale(315.1),
    marginBottom: vScale(17.1),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: hScale(13.5)
  },
  cancelSaveContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: vScale(47.1),
    width: hScale(315.1),
    paddingHorizontal: hScale(27.1)
  },
  innerModalButton: {
    width: hScale(60),
    justifyContent: "center",
    alignItems: "center",
    height: vScale(47.1)
  },
  errorContainer: {
    height: vScale(15),
    marginTop: vScale(5)
  },
  errorMessageStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    fontSize: fScale(10),
    color: "red",
    fontFamily: fonts.arial
  },
  selectedItemContainer: {
    width: hScale(343.8),
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sortIconStyle: {
    width: hScale(11),
    height: vScale(6),
    marginTop: vScale(4)
  }
});
