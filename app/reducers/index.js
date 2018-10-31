
import { combineReducers } from 'redux';
import general from './general';
import cart from './cart';
import user from './user';
import settings from './settings';
import menu from './menu';
import rootNavigation from './rootNavigation';
import location from './location';
import offlineNotice from './offlineNotice';
import segmentify from './segmentify';

export default combineReducers({
  general,
  cart,
  user,
  settings,
  menu,
  rootNavigation,
  location,
  offlineNotice,
  segmentify,
});