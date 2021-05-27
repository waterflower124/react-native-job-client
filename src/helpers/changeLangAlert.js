import { Alert } from "react-native";
import { strings } from "../strings";
import { languageSwitcher } from "./language";

export const changeLangAlert = (title) => {
  Alert.alert(
    title,
    strings.confirmRestart,
    [
      {
        text: strings.confirm,
        onPress: () => languageSwitcher.toggleLanguages()
      },
      { text: strings.cancel, style: "cancel" }
    ],
    { cancelable: true }
  );
};
