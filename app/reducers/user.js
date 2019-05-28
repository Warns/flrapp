import {
    SET_USER,
    REMOVE_USER,
    SET_CART_NUM,
    SET_CART_ITEMS,
    SET_USER_POINTS,
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';
Utils = require('root/app/helper/Global.js');
globals = require('root/app/globals.js');

const userInitialState = {
    ID: '007',

    optin: {
        phone: null,
        phone_formatted: null,
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
    },

    user: {},

    userBazaarvoiceToken: null,
}

export default function user(state = userInitialState, action) {

    switch (action.type) {
        case SET_CART_NUM: return {
            ID: action.value
        };
        case SET_USER_POINTS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    points: action.value
                }
            }
        };
        case SET_USER: {

            console.log('set user');

            let optin_value = JSON.stringify(action.value.user);

            globals.setSecureStorage('__OPTIN__', optin_value);
            fetchCartDetails();

            getUserToken(action.value);

            return {
                ...state,
                ...action.value
            }
        };
        case 'UPDATE_OPTIN': return {
            ...state,
            optin: {
                ...state.optin,
                ...action.value,
            }
        };
        case REMOVE_USER: {

            let newOptin = { ...state.user, userLoggedOut: true };

            globals.setSecureStorage('__OPTIN__', JSON.stringify(newOptin));
            fetchCartDetails();

            return {
                ...state,
                user: {},
                optin: {
                    email: newOptin.email,
                    phone_formatted: newOptin.mobilePhone,
                }
            };
        };
        case 'SET_USER_BAZAARVOICE_TOKEN': return {
            ...state,
            userBazaarvoiceToken: action.value
        }
        default:
            return state;
    }
}

fetchCartDetails = async () => {
    globals
        .fetch(Utils.getURL({ key: 'cart', subKey: 'getCart' }), JSON.stringify({ 'cartLocation': 'basket' }), (answer) => {
            if (answer.status == 200) {
                store.dispatch({ type: SET_CART_ITEMS, value: Utils.getCartCount(answer.data || {}) });
            }
        });
}

getUserToken = async (obj) => {
    const { userId = '' } = obj.user || {};

    Utils.ajx({ uri: Utils.getURL({ key: 'bazaarvoice', subKey: 'userCode' }) + userId }, (result) => {
        if (result['type'] == 'success')
            store.dispatch({ type: 'SET_USER_BAZAARVOICE_TOKEN', value: result.data });
    });
}