import { SHOW_MENU, HIDE_MENU } from 'root/app/helper/Constant';

const initialState = {
    isVisible: false,
    direction: 'left',
    type: 'extra'
};
export default function menu(state = initialState, action) {
    switch (action.type) {
        case SHOW_MENU: return {
            isVisible: true,
            direction: action.value.direction,
            type: action.value.type,
        };
        case HIDE_MENU: return {
            ...state,
            isVisible: false,
        };
        default:
            return state;
    }
}