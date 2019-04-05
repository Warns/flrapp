import {
    MAIN_NAVIGATE,
    SET_MAIN_NAVIGATION, 
    SET_NAVIGATION, 
    NAVIGATE 
} from 'root/app/helper/Constant';

const initialState = {};

export default function rootNavigation(state = initialState, action) {
    switch (action.type) {
        case SET_MAIN_NAVIGATION: return {
            ...state,
            main: action.value
        };
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
        case MAIN_NAVIGATE: {
            const data = action.value,
                navigation = data.item['navigation'] || 'Promo'; /* extra kampanya sayfası default değeri */

            setTimeout(() => {
                state['main'].navigate(navigation, data);
            }, 1);
        };
        default:
            return state;
    }
}