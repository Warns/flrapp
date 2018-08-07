
import { combineReducers } from 'redux';
import general from './general';
import cart from './cart';
import user from './user';
import settings from './settings';

export default combineReducers({
  general,
  cart,
  user,
  settings,
});