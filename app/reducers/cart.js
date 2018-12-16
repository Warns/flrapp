import { store } from 'root/app/store';
import {
    SET_CART_ITEMS,
    ADD_CART_ITEM,
    SET_CART_INFO,
    SET_CART_ADDRESS,
    SET_DIFFERENT_ADDRESS,
    SET_CART_CARGO,
    SET_CART_NO_RESULT,
    RESET_CART,
    ADD_TO_FAVORITES,
    REMOVE_FROM_FAVORITES,
    SET_CART_PROGRESS
} from 'root/app/helper/Constant';

const cartInitialState = {
    progress: '1/3',
    name: 'Cart',
    cartProductsNumber: 0,
    cartInfo: {},
    cartNoResult: false,
    
    setCart: {
        differentAddress: false, /* farklı adrese gönder; false = teslimat, fatura aynı / true = farklı */
        shipAddressId: 0, /* teslimat adresi */
        billAddressId: 0, /* fatura adresi */
        customerNote: '',
        paymentId: 0,
        cargoId: 0,
        bankId: 0,
        installmentId: 0,
        usePoint: 0,
        useBankPoint: true,
        cartLocation: '',
        paymentNote: '',
        serviceId: 0
    }
};

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
        case ADD_CART_ITEM: {

            if (action.value.id) {
                addCartLine(action.value);
            }

            return {
                ...state,
                cartProductsNumber: state.cartProductsNumber + action.value.quantity
            };
        };
        case ADD_TO_FAVORITES: {
            if (action.value.id) {
                addFavoriteProduct(action.value);
            }
        };
        case REMOVE_FROM_FAVORITES: {
            if (action.value.id) {
                deleteFavoriteProduct(action.value);
            }
        }

        case SET_CART_ADDRESS: {
            const { setCart = {} } = state,
                { differentAddress = false } = setCart,
                { addressId, addressType = 'shipAddress' } = action.value;

            if (!differentAddress)
                return {
                    ...state,
                    setCart: { ...state.setCart, shipAddressId: addressId, billAddressId: addressId }
                }
            else {
                if (addressType == 'shipAddress')
                    return {
                        ...state,
                        setCart: { ...state.setCart, shipAddressId: addressId }
                    }
                else if (addressType == 'billAddress')
                    return {
                        ...state,
                        setCart: { ...state.setCart, billAddressId: addressId }
                    }
            }
        };
        case SET_DIFFERENT_ADDRESS: {
            const { setCart = {} } = state,
                { shipAddressId } = setCart,
                b = action.value;

            if (b)
                return {
                    ...state,
                    setCart: { ...state.setCart, differentAddress: b, billAddressId: 0 }
                }
            else
                return {
                    ...state,
                    setCart: { ...state.setCart, billAddressId: shipAddressId, differentAddress: b }
                }
        };
        case SET_CART_CARGO: {
            return {
                ...state,
                setCart: { ...state.setCart, cargoId: action.value }
            }
        };
        case SET_CART_NO_RESULT: {
            return {
                ...state,
                cartNoResult: action.value
            }
        };
        case RESET_CART: {
            return {
                ...state,
                cartNoResult: false,
                setCart: {
                    differentAddress: false,
                    shipAddressId: 0,
                    billAddressId: 0,
                    customerNote: '',
                    paymentId: 0,
                    cargoId: 0,
                    bankId: 0,
                    installmentId: 0,
                    usePoint: 0,
                    useBankPoint: true,
                    cartLocation: '',
                    paymentNote: '',
                    serviceId: 0
                },
            }
        };
        case SET_CART_PROGRESS: {
            return {
                ...state,
                progress: action.value
            }
        };


        default:
            return state;
    }
}


addCartLine = (obj) => {

    globals.fetch(
        "https://www.flormar.com.tr/webapi/v3/Cart/addCartLine",
        JSON.stringify({
            "productId": obj.id,
            "quantity": obj.quantity,
        }), (answer) => {

            if (answer.status == 200) {
                //do nothing
            }
            else {
                store.dispatch({ type: ADD_CART_ITEM, value: { quantity: -obj.quantity } });
            }
        });

}

addFavoriteProduct = (obj) => {
    globals.fetch(
        "https://www.flormar.com.tr/webapi/v3/User/addFavoriteProduct",
        JSON.stringify({
            "productId": obj.id,
        }), (answer) => {
            // do nothing
        });
}

deleteFavoriteProduct = (obj) => {
    globals.fetch(
        "https://www.flormar.com.tr/webapi/v3/User/deleteFavoriteProduct",
        JSON.stringify({
            "productId": obj.id,
        }), (answer) => {
            // do nothing
        });
}