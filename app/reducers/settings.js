import { SET_SETTINGS } from 'root/app/helper/Constant';

const initialState = {};

export default function settings(state = initialState, action) {
    switch (action.type) {
        case SET_SETTINGS: return {
            ...state,
            ...action.value
        };
        default:
            return state;
    }
}