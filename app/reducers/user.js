import { 
    SET_USER,
    REMOVE_USER,
    SET_CART_NUM 
} from 'root/app/helper/Constant';

const userInitialState = {
    ID: '007',
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
        case REMOVE_USER: return {};
        default:
            return state;
    }
}