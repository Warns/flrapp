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
    SET_CART_PROGRESS,
    SET_INSTALLMENT,
    SET_PAYMENT,
} from 'root/app/helper/Constant';

const cartInitialState = {
    progress: '1/3',
    name: 'Cart',
    cartProductsNumber: 0,
    cartInfo: {},
    cartNoResult: false,

    /* kredi kartı ve havale değişimde bankid değerinin atanması */
    creditCart: {
        bankId: 0,
        installmentId: 0
    },
    bankTransfer: {
        bankId: 0,
        installmentId: 0
    },

    optin: {
        differentAddress: false, /* farklı adrese gönder; false = teslimat, fatura aynı / true = farklı */
        shipAddressId: 0, /* teslimat adresi */
        billAddressId: 0, /* fatura adresi */
        customerNote: '',
        paymentId: 0,
        cargoId: 0,
        bankId: 0,
        installmentId: 0,
        usePoint: 0,
        useBankPoint: false,
        cartLocation: '',
        paymentNote: '',
        //serviceId: 0 /* mağazada öde kısmı için kullanılabilir */
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
            const { optin = {} } = state,
                { differentAddress = false } = optin,
                { addressId, addressType = 'shipAddress' } = action.value;

            let data = {};

            if (!differentAddress)
                data = {
                    ...state,
                    optin: { ...state.optin, shipAddressId: addressId, billAddressId: addressId }
                }
            else {
                if (addressType == 'shipAddress')
                    data = {
                        ...state,
                        optin: { ...state.optin, shipAddressId: addressId }
                    }
                else if (addressType == 'billAddress')
                    data = {
                        ...state,
                        optin: { ...state.optin, billAddressId: addressId }
                    }
            }

            setCart(data['optin']);

            return data;
        };
        case SET_DIFFERENT_ADDRESS: {
            const { optin = {} } = state,
                { shipAddressId } = optin,
                b = action.value;

            let data = {};
            if (b)
                data = {
                    ...state,
                    optin: { ...state.optin, differentAddress: b, billAddressId: 0 }
                }
            else
                data = {
                    ...state,
                    optin: { ...state.optin, billAddressId: shipAddressId, differentAddress: b }
                }

            setCart(data['optin']);

            return data;
        };
        case SET_CART_CARGO: {
            const data = {
                ...state,
                optin: { ...state.optin, cargoId: action.value }
            };

            setCart(data['optin']);

            return data;
        };
        case SET_INSTALLMENT: {
            const { bankId = 0, installmentId = 0 } = action.value || {},
                data = {
                    ...state,
                    creditCart: { bankId: bankId, installmentId: installmentId },
                    optin: { ...state.optin, bankId: bankId, installmentId: installmentId }
                };

            setCart(data['optin']);

            return data;
        };
        case SET_PAYMENT: {
            const { paymentId, paymentType } = action.value,
                { bankId = 0, installmentId = 0 } = state[paymentType] || {};
            data = {
                ...state,
                optin: { ...state.optin, paymentId: paymentId, bankId: bankId, installmentId: installmentId }
            };

            setCart(data['optin']);

            return data;
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
                optin: {
                    differentAddress: false,
                    shipAddressId: 0,
                    billAddressId: 0,
                    customerNote: '',
                    paymentId: 0,
                    cargoId: 0,
                    bankId: 0,
                    installmentId: 0,
                    usePoint: 0,
                    useBankPoint: false,
                    cartLocation: '',
                    paymentNote: '',
                    serviceId: 0
                },
            }
        };
        case SET_CART_PROGRESS: {
            const { progress, cartLocation } = action.value || {};
            return {
                ...state,
                progress: progress,
                optin: { ...state.optin, cartLocation: cartLocation }
            }
        };


        default:
            return state;
    }
}

/* sepet adımlarında her bir seçimde setcart tetiklenmeli */
setCart = async (data) => {
    console.log('set cart', data);
    globals.fetch(
        "https://www.flormar.com.tr/webapi/v3/Cart/setCart",
        JSON.stringify(data), (answer) => {
            if (answer.status == 200) {
                //nothing
            } else
                console.log('hata', answer.message);

            console.log(answer);
        });
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