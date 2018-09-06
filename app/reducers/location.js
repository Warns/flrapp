import { SET_LOCATION } from 'root/app/helper/Constant';

const initialState = {};
export default function location(state = initialState, action) {
    switch (action.type) {
        case SET_LOCATION: return {
            ...action.value
        };
        default:
            return state;
    }
}