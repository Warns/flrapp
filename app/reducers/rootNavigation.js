import { SET_NAVIGATION, NAVIGATE } from 'root/app/helper/Constant';

const initialState = {};

export default function rootNavigation(state = initialState, action) {
    switch (action.type) {
        case SET_NAVIGATION: return {
            ...state,
            root: action.value
        };
        case NAVIGATE: {
            const data = action.value,
                navigation = data.item['navigation'] || 'Extra';/* settings.json içerisinde navigation alanı ile root navigationda hangi route gidilecekse o belirlenir. */

            setTimeout(() => {
                state['root'].navigate(navigation, data);
            }, 1);
        };
        default:
            return state;
    }
}