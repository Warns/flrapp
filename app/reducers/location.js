import { SET_LOCATION } from 'root/app/helper/Constant';

const initialState = {
    permission: false,
    location: {}
};
export default function location(state = initialState, action) {
    switch (action.type) {
        case SET_LOCATION: return {
                ...state,
                ...action.value
            };
        default:
            return state;
    }
}