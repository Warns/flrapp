import { 
    SET_USER,
    REMOVE_USER,
    SET_CART_NUM,
} from 'root/app/helper/Constant';

const userInitialState = {
    ID: '007',

    optin:{
        phone: null,
        phone_verification: null,
        phone_checked: false,
        email: null,
        time:180,
    }
  }

export default function user( state = userInitialState, action ){
    
    switch ( action.type ) {
        case SET_CART_NUM: return {
            ID: action.value
        };
        case SET_USER: return {
            ...state,
            ...action.value
        };
        case 'UPDATE_OPTIN': return {
            ...state,
            optin:{ ...state.optin,
                    ...action.value,
            }
        };
        case REMOVE_USER: return {};
        default:
            return state;
    }
}