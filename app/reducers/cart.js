import { SET_CART_ITEMS, ADD_CART_ITEM } from 'root/app/helper/Constant';

const cartInitialState = {
    name: 'Cart',
    cartProductsNumber: 0,
  }

export default function cart( state = cartInitialState, action ){

    switch ( action.type ) {
        case SET_CART_ITEMS: return {
            ...state,
            cartProductsNumber: action.value
        };
        case ADD_CART_ITEM: return {
            ...state,
            cartProductsNumber: state.cartProductsNumber + action.value
        };
        default:
            return state;
    }
}