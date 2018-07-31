
import { combineReducers } from 'redux';
import general from './general';
import cart from './cart';
import user from './user';

export default combineReducers({
  general,
  cart,
  user
});