import { ASSISTANT_SHOW } from 'root/app/helper/Constant';

const initialState = {
    show: true
};

export default function assistant(state = initialState, action) {
    switch (action.type) {
        /* assistant gizle göster */
        case ASSISTANT_SHOW: return {
            ...state,
            show: action.value
        };
        default:
            return state;
    }
}