// import StepOneSignal from "step-onesignal";
import { xSetState } from "step-react-redux";
import Step_API_Client, { StepRequest } from "step-api-client";
import { Alert } from "react-native";
import global from '../global/global';
import AsyncStorage from '@react-native-community/async-storage';

export const actions = {
  async refreshWalletBalance() {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if(userToken == null || userToken == "") {
        xSetState({ userWallet: 0 });
      } else {
        const data = await StepRequest("transactions/getBalance");
        xSetState({ userWallet: data.balance });
      }
      
    } catch (error) {
      alert(error.message);
    }
  },

  async refreshCities() {
    const cities = await StepRequest("cities");
    xSetState({ cities });
  },
  async refreshCategories() {
    const categories = await StepRequest("categories");
    
    xSetState({ categories });
  },
  async refreshBanks() {
    const banks = await StepRequest("banks");
    xSetState({ banks });
  },

  async setUserData({ data, userToken }) {
    const user = { data, loggedIn: true };
    xSetState({ user });
    
    if (userToken) {
      await this.setAccessToken(userToken);
      this.registerDeviceToken();
    }
  },

  async setAccessToken(userToken) {
    const accessToken = "Bearer " + userToken;
    Step_API_Client.appendHeader("Authorization", accessToken);
    xSetState({ accessToken });
  },

  removeUserData() {
    Step_API_Client.removeHeader("Authorization");
    const user = { data: {}, loggedIn: false };
    xSetState({ user });
    AsyncStorage.setItem("user", JSON.stringify(user));
  },

  async updateUser(updatedData) {
    const data = await StepRequest("update-profile", "POST", updatedData);
    console.log("updateUser", data);
    return data;
  },

  async registerDeviceToken() {
    
    try {
      const response = await StepRequest("register-device", "PATCH", {
        token: global.deviceId
      });

    } catch (error) {
      console.log("registerDeviceError", error.message);
    }
  }
};
