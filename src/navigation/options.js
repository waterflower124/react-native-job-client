import { I18nManager, React } from 'react-native'
import { vScale, hScale, } from "step-scale";
const { isRTL } = I18nManager;

export const defaultNavigationOptions = {
    headerTitle: null,
    headerTransparent: true,
    headerBackTitle: null,
    headerBackTitleVisible: false,
    headerStyle: {
        height: vScale(80),
        borderBottomWidth: 0
    },
    gestureEnabled: false
};

export const whiteHeaderOptions = {
  headerTransparent: false,
  headerStyle: {
    height: vScale(60),
    borderBottomWidth: 0,
    shadowColor: "rgba(0, 0, 0, 0.22)",
    shadowOffset: {
      width: 0,
      height: vScale(2)
    },
    shadowRadius: hScale(5),
    shadowOpacity: 1,
    elevation: 10
  },
}
export const drawerOptions = {
  drawerBackgroundColor: "transparent",
  drawerWidth: hScale(243.1),
  drawerPosition: isRTL ? "right" : "left"
};

