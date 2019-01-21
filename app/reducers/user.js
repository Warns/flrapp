import {
    SET_USER,
    REMOVE_USER,
    SET_CART_NUM,
    SET_CART_ITEMS,
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
    },

    user: {},

    userBazaarvoiceToken: "46b1241da5c3b3df4875ed4c7330a44d4c0c965beaf6dc96ef8ab8d19b821637646174653d323031382d31322d3236267573657249443d3131393535303926656d61696c616464726573733d627572616b2e6b6172616b6179614070726f6a2d652e636f6d26757365726e616d653d627572616b6b266d61786167653d3330",
}

export default function user(state = userInitialState, action) {

    switch (action.type) {
        case SET_CART_NUM: return {
            ID: action.value
        };
        case SET_USER: {

            console.log('set user')

            let optin_value = JSON.stringify(action.value.user);

            globals.setSecureStorage('__OPTIN__', optin_value);
            fetchCartDetails();

            //getUserToken();

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

getUserToken = async () => {
    console.log('asking for token');
    Utils.ajx({ uri: 'https://dev.flormar.com.tr/mobiapp-bazaarvoice.txt?uyekod=' + '1195509' }, (result) => {
        if (result['type'] == 'success')
            store.dispatch({ type: 'SET_USER_BAZAARVOICE_TOKEN', value: result.data });
    });
}