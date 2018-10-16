import { SET_CART_ITEMS, ADD_CART_ITEM, SET_CART_INFO, SET_CART_ADDRESS, SET_DIFFERENT_ADDRESS } from 'root/app/helper/Constant';

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

export default function cart(state = cartInitialState, action) {

    switch (action.type) {
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
        case SET_CART_ADDRESS: {
            const { selectedAddress = {} } = state,
                { differentAddress = false } = selectedAddress,
                { addressId, addressType = 'shipAddress' } = action.value;
            console.log('SET_CART_ADDRESS', addressId);
            if (!differentAddress)
                return {
                    ...state,
                    selectedAddress: { ...state.selectedAddress, shipAddress: addressId, billAddress: addressId }
                }
            else {
                if (addressType == 'shipAddress')
                    return {
                        ...state,
                        selectedAddress: { ...state.selectedAddress, shipAddress: addressId }
                    }
                else if (addressType == 'billAddress')
                    return {
                        ...state,
                        selectedAddress: { ...state.selectedAddress, billAddress: addressId }
                    }
            }
        };
        case SET_DIFFERENT_ADDRESS: {
            const { selectedAddress = {} } = state,
                { shipAddress } = selectedAddress,
                b = action.value;

            if (b)
                return {
                    ...state,
                    selectedAddress: { ...state.selectedAddress, differentAddress: b, billAddress: 0 }
                }
            else
                return {
                    ...state,
                    selectedAddress: { ...state.selectedAddress, differentAddress: b, billAddress: shipAddress }
                }
        };
        default:
            return state;
    }
}