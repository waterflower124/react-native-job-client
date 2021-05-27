/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import { setInitialState } from "step-react-redux";
const initialState = {
  user: { data: {}, loggedIn: false },
  userWallet: 0,
  cities: [],
  categories: [],
  banks: []
};
setInitialState(initialState);
AppRegistry.registerComponent(appName, () => App);
