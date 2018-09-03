import { SET_CATEGORIES, SET_SCREEN_DIMENSIONS } from 'root/app/helper/Constant';

const generalInitialState = {
    categories: [
      {
        selector: 'All',
        id: 'all',
      }
    ],
    selectedCategory: null,
  }

export default function cart( state = generalInitialState, action ){

    switch ( action.type ) {
        case SET_CATEGORIES: return {
            ...state,
            categories: action.value.categories,
            selectedCategory: action.value.selectedCategory,
        };
        case SET_SCREEN_DIMENSIONS: return {
            ...state,
            SCREEN_DIMENSIONS: action.value,
        }
        default:
            return state;
    }
}