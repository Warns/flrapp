import { SET_CATEGORIES, SET_SCREEN_DIMENSIONS } from 'root/app/helper/Constant';
import { SET_SELECTED_CATEGORY, SET_TEXTURE_DISPLAY } from '../helper/Constant';

const generalInitialState = {
    categories: [
      {
        selector: 'All',
        id: 'all',
      }
    ],
    selectedCategory: null,
    textureDisplay: false,
  }

export default function cart( state = generalInitialState, action ){

    console.log(action.type, state.textureDisplay);

    switch ( action.type ) {
        case SET_CATEGORIES: return {
            ...state,
            categories: action.value,
        };
        case SET_SELECTED_CATEGORY: return {
            ...state,
            selectedCategory: action.value,
        };
        case SET_SCREEN_DIMENSIONS: return {
            ...state,
            SCREEN_DIMENSIONS: action.value,
        };
        case SET_TEXTURE_DISPLAY: return {
            ...state,
            textureDisplay: action.value,
        };
        default:
            return state;
    }
}