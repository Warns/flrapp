import { SET_CART_ITEMS, ADD_CART_ITEM, SET_CART_INFO, SET_CART_ADDRESS } from 'root/app/helper/Constant';

const cartInitialState = {
    name: 'Cart',
    cartProductsNumber: 0,
    cartInfo: {},
    selectedAddress: {
        shipAddress: 0, /* teslimat adresi */
        billAddress: 0, /* fatura adresi */
        differentAddress: false /* farklı adrese gönder; false = teslimat, fatura aynı / true = farklı */
    }
  }

export default function cart( state = cartInitialState, action ){

    switch ( action.type ) {
        case SET_CART_INFO: return {
            ...state,
            cartInfo: action.value
        };
        case SET_CART_ITEMS: return {
            ...state,
            cartProductsNumber: action.value
        };
        case ADD_CART_ITEM: return {
            ...state,
            cartProductsNumber: state.cartProductsNumber + action.value
        };
        case SET_CART_ADDRESS: return {
            ...state,
            selectedAddress: { ...state.selectedAddress, shipAddress: action.value.addressId }
        };
        default:
            return state;
    }
}