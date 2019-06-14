import { SET_CONNECTION } from 'root/app/helper/Constant';

const initialState = {
    isConnected: true
}

export default function offlineNotice( state = initialState, action ){

    switch ( action.type ) {
        case SET_CONNECTION: return {
            ...state,
            isConnected: action.value
        };
        default:
            return state;
    }
}