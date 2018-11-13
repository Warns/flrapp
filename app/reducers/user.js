import { 
    SET_USER,
    REMOVE_USER,
    SET_CART_NUM,
} from 'root/app/helper/Constant';
globals = require('root/app/globals.js');

const userInitialState = {
    ID: '007',

    optin:{
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

    user:{},
}

export default function user( state = userInitialState, action ){
    
    switch ( action.type ) {
        case SET_CART_NUM: return {
            ID: action.value
        };
        case SET_USER:{

            let optin_value = JSON.stringify(action.value.user);

            globals.setSecureStorage('__OPTIN__', optin_value);
            
            return {
            ...state,
            ...action.value
            }
        };
        case 'UPDATE_OPTIN': return {
            ...state,
            optin:{ ...state.optin,
                    ...action.value,
            }
        };
        case REMOVE_USER:{

            let newOptin = {...state.user, userLoggedOut:true};
            
            globals.setSecureStorage('__OPTIN__', JSON.stringify(newOptin));
            
            return {
                ...state,
                user: {},
                optin: {
                    email: newOptin.email,
                    phone_formatted: newOptin.mobilePhone,
                }
            }; 
        };
        default:
            return state;
    }
}