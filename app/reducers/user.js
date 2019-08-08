import {
  SET_USER,
  UPDATE_USER,
  REMOVE_USER,
  SET_CART_NUM,
  SET_CART_ITEMS,
  SET_USER_POINTS,
  UPDATE_OPTIN,
  SET_FAVORITE_PRODUCT,
  GET_FAVORITE_PRODUCT,
  REFRESH_CART
} from "root/app/helper/Constant";
import { store } from "root/app/store";
Utils = require("root/app/helper/Global.js");
globals = require("root/app/globals.js");

const userInitialState = {
  ID: "007",

  optin: {
    phone: null,
    phone_formatted: "",
    phone_verification: null,
    phone_checked: false,
    email: null,
    password: null,
    emos: null,
    cegid: null,
    signup: false,
    userLogout: false,
    isMailSubscribe: false,
    isSmsSubscribe: false,
    registered_email: ""
  },

  user: {},

  userBazaarvoiceToken: null,

  favoriteProducts: {}
};

export default function user(state = userInitialState, action) {
  switch (action.type) {
    case SET_CART_NUM:
      return {
        ID: action.value
      };
    case SET_USER_POINTS: {
      return {
        ...state,
        user: {
          ...state.user,
          points: action.value
        }
      };
    }
    case SET_FAVORITE_PRODUCT: {
      const { favoriteProducts = {} } = state,
        { id, type } = action.value;

      if (type == 'ADD')
        favoriteProducts[id] = 1;
      else
        favoriteProducts[id] = 0;

      return {
        ...state,
        favoriteProducts: favoriteProducts
      };
    }
    case GET_FAVORITE_PRODUCT: {
      return {
        ...state,
        favoriteProducts: action.value
      };
    }
    case SET_USER: {
      //console.log('>>>>>>> SET_USER', action.value);

      fetchCartDetails();
      getUserToken(action.value);
      _getFavoriteProducts();
      return {
        ...state,
        ...action.value
      };
    }
    case UPDATE_USER: {
      //console.log('*****  UPDATE_USER', state.user);

      let new_settings = {};

      if (action.value.updateSubscriptions == true) {
        new_settings = {
          mobilePhone: state.optin.phone_formatted,
          isMailSubscribe: state.optin.isMailSubscribe,
          isSmsSubscribe: state.optin.isSmsSubscribe,
          smsVerificationCode: state.optin.phone_verification
        };
      } else {
        new_settings = {
          mobilePhone: state.optin.phone_formatted,
          smsVerificationCode: state.optin.phone_verification
        };
      }

      let optin_value = JSON.stringify({ ...state.user, ...new_settings });

      globals.setSecureStorage("__OPTIN__", optin_value);

      setUserDetails(new_settings);
    }
    case UPDATE_OPTIN:
      return {
        ...state,
        optin: {
          ...state.optin,
          ...action.value
        }
      };
    case REMOVE_USER: {
      let newOptin = { ...state.user, userLoggedOut: true };

      globals.setSecureStorage("__OPTIN__", JSON.stringify(newOptin));
      fetchCartDetails();

      return {
        ...state,
        user: {},
        optin: {
          email: newOptin.email,
          phone_formatted: newOptin.mobilePhone
        }
      };
    }
    case "SET_USER_BAZAARVOICE_TOKEN":
      return {
        ...state,
        userBazaarvoiceToken: action.value
      };
    case REFRESH_CART: {
      fetchCartDetails();
      return state;
    }
    default:
      return state;
  }
}

// USER ACTIONS

fetchCartDetails = async () => {
  globals.fetch(
    Utils.getURL({ key: "cart", subKey: "getCart" }),
    JSON.stringify({ cartLocation: "basket" }),
    answer => { 
      if (answer.status == 200) {
        store.dispatch({
          type: SET_CART_ITEMS,
          value: Utils.getCartCount(answer.data || {})
        });
      }
    }
  );
};

getUserToken = async obj => {
  const { userId = "" } = obj.user || {};

  Utils.ajx(
    { uri: Utils.getURL({ key: "bazaarvoice", subKey: "userCode" }) + userId },
    result => {
      if (result["type"] == "success")
        store.dispatch({
          type: "SET_USER_BAZAARVOICE_TOKEN",
          value: result.data
        });
    }
  );
};

setUserDetails = async obj => {
  globals.fetch(
    Utils.getURL({ key: "user", subKey: "setUser" }),
    JSON.stringify(obj),
    answer => {
      //console.log('this is set user answer', answer);
    }
  );
};


_getFavoriteProducts = () => {
  globals.fetch(
    Utils.getURL({ key: 'user', subKey: 'getFavoriteProductList' }),
    JSON.stringify({}), (answer) => {
      const { status, data = {} } = answer,
        { products = [] } = data;
      if (status == 200) {
        if (products.length > 0) {
          let obj = {};

          products.map((item, ind) => {
            const key = item['productId'] || '';
            obj[key] = 1;
          });

          store.dispatch({
            type: GET_FAVORITE_PRODUCT,
            value: obj
          });

        }
      }
    });
}