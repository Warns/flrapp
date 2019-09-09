import { SET_SEGMENTIFY_USER_SESSION, SET_SEGMENTIFY_INSTANCEID } from 'root/app/helper/Constant';

const initialState = {
    userID: null,
    sessionID: null,
    instanceID: null,
};

export default function segmentify(state = initialState, action) {

    switch (action.type) {
        case SET_SEGMENTIFY_USER_SESSION: {
            const arr = action.value || [];
            return {
                ...state,
                userID: arr[0] || null,
                sessionID: arr[1] || null
            };
        };
        case SET_SEGMENTIFY_INSTANCEID: {
            return {
                ...state,
                instanceID: action.value,
            };
        };
        default:
            return state;
    }
}