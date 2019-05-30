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
    SET_BANK_TRANSFER,
    RESET_PAYMENT,
    SET_CREDIT_CART,
    SET_BANK_POINT,
    SET_EXTRA_POINT,
    SET_AGREEMENT,
    SET_ORDER_SUCCESS_MESSAGE,
    SET_ORDER_3D_BUTTON,
} from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');

const cartInitialState = {
    activeTitle: 'SEPETİM',
    progress: '1/3',
    name: 'Cart',
    cartProductsNumber: 0,
    cartInfo: {},
    cartNoResult: false,

    /* kredi kartı ve havale değişimde bankid değerinin atanması */
    creditCart: {
        bankId: 0,
        installmentId: 0,
        fullName: '',
        creditCardNo: '',
        cvcCode: '',
        year: 0,
        month: 0,
        useBankPoint: false,
        order3dButton: false,
        usePoint: 0,
    },
    bankTransfer: {
        bankId: 0,
        installmentId: 0,
        useBankPoint: false,
        order3dButton: false,
        usePoint: 0,
    },

    optin: {
        order3dButton: false, /* 3d sipariş butonu gizle goster */
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
    },
    agreements: {
        agreement1: false,
        agreement2: false
    },
    orderSuccessMessage: ''
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
            console.log('ADDDDDD');
            if (action.value.id) {
                addFavoriteProduct(action.value);
            }
        };
        case REMOVE_FROM_FAVORITES: {
            console.log('REMOVEEEE');
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

            setCart(data['optin'], () => {
                setTimeout(() => {
                    getCart('payment');
                }, 333);
            });

            return data;
        };
        case SET_INSTALLMENT: {
            const { bankId = 0, installmentId = 0 } = action.value || {},
                data = {
                    ...state,
                    creditCart: { ...state.creditCart, bankId: bankId, installmentId: installmentId },
                    optin: { ...state.optin, bankId: bankId, installmentId: installmentId }
                };

            setCart(data['optin']);

            return data;
        };
        case SET_PAYMENT: {
            const { paymentId, paymentType } = action.value,
                { bankId = 0, installmentId = 0, useBankPoint, order3dButton, usePoint = 0 } = state[paymentType] || {};
            data = {
                ...state,
                optin: { ...state.optin, paymentId: paymentId, bankId: bankId, installmentId: installmentId, useBankPoint: useBankPoint, order3dButton: order3dButton, usePoint: usePoint }
            };

            setCart(data['optin'], () => {
                setTimeout(() => {
                    getCart();
                }, 333);
            });

            return data;
        };
        case SET_BANK_TRANSFER: {
            const data = {
                ...state,
                bankTransfer: { ...state.bankTransfer, bankId: action.value },
                optin: { ...state.optin, bankId: action.value, }
            };

            setCart(data['optin']);

            return data;
        };
        case SET_CREDIT_CART: {
            const data = {
                ...state,
                creditCart: { ...state.creditCart, ...action.value },
            };

            return data;
        };
        case SET_BANK_POINT: {
            const data = {
                ...state,
                creditCart: { ...state.creditCart, useBankPoint: action.value },
                optin: { ...state.optin, useBankPoint: action.value }
            };


            setCart(data['optin'], () => {
                setTimeout(() => {
                    getCart();
                }, 333);
            });

            return data;
        };
        case SET_EXTRA_POINT: {
            const data = {
                ...state,
                creditCart: { ...state.creditCart, usePoint: action.value },
                bankTransfer: { ...state.bankTransfer, usePoint: action.value },
                optin: { ...state.optin, usePoint: action.value }
            };

            //console.log('extra point', data['optin']);

            setCart(data['optin'], () => {
                setTimeout(() => {
                    getCart();
                }, 333);
            });

            return data;
        };
        case SET_AGREEMENT: {
            const data = {
                ...state,
                agreements: {
                    ...state.agreements,
                    ...action.value
                }
            };

            return data;
        };
        case SET_ORDER_SUCCESS_MESSAGE: {
            const data = {
                ...state,
                orderSuccessMessage: action.value
            };

            return data;
        };
        case SET_ORDER_3D_BUTTON: {
            const data = {
                ...state,
                creditCart: { ...state.creditCart, order3dButton: action.value },
                optin: { ...state.optin, order3dButton: action.value }
            };

            return data;
        };
        case RESET_PAYMENT: {
            const data = {
                ...state,
                agreements: {
                    agreement1: false,
                    agreement2: false
                },
                creditCart: {
                    bankId: 0,
                    installmentId: 0,
                    fullName: '',
                    creditCardNo: '',
                    cvcCode: '',
                    year: 0,
                    month: 0,
                    useBankPoint: false,
                    order3dButton: false,
                    usePoint: 0
                },
                bankTransfer: {
                    bankId: 0,
                    installmentId: 0,
                    useBankPoint: false,
                    order3dButton: false,
                    usePoint: 0
                },
                optin: { ...state.optin, usePoint: 0, bankId: 0, installmentId: 0, order3dButton: false, }
            };

            setCart(data['optin']);

            return data;
        };
        case RESET_CART: {
            return {
                ...state,
                cartNoResult: false,
                creditCart: {
                    bankId: 0,
                    installmentId: 0,
                    fullName: '',
                    creditCardNo: '',
                    cvcCode: '',
                    year: 0,
                    month: 0,
                    useBankPoint: false,
                    order3dButton: false,
                    usePoint: 0
                },
                bankTransfer: {
                    bankId: 0,
                    installmentId: 0,
                    useBankPoint: false,
                    order3dButton: false,
                    usePoint: 0
                },
                optin: {
                    order3dButton: false,
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
                    serviceId: 0,
                },
                agreements: {
                    agreement1: false,
                    agreement2: false
                },
                orderSuccessMessage: '',
            }
        };
        case SET_CART_PROGRESS: {
            const { progress, cartLocation, activeTitle } = action.value || {};
            return {
                ...state,
                progress: progress,
                activeTitle: activeTitle,
                optin: { ...state.optin, cartLocation: cartLocation }
            }
        };
        case SET_CART_NO_RESULT: {
            return {
                ...state,
                cartNoResult: action.value
            }
        };

        default:
            return state;
    }
}

getCart = async (loc) => {
    const { optin } = store.getState().cart,
        { cartLocation } = optin;

    globals.fetch(
        Utils.getURL({ key: 'cart', subKey: 'getCart' }),
        JSON.stringify({ cartLocation: loc || cartLocation }), (answer) => {
            if (answer.status == 200) {
                setTimeout(() => {
                    store.dispatch({ type: SET_CART_INFO, value: answer.data });
                }, 10);
            }
        });
};

/* sepet adımlarında her bir seçimde setcart tetiklenmeli */
setCart = async (data, callback) => {
    console.log('set cart', data);

    globals.fetch(
        Utils.getURL({ key: 'cart', subKey: 'setCart' }),
        JSON.stringify(data), (answer) => {
            if (answer.status == 200) {
                //nothing
            } else
                console.log('hata', answer.message);

            if (typeof callback !== 'undefined')
                callback();

            console.log(answer);
        });
}


addCartLine = (obj) => {

    globals.fetch(
        Utils.getURL({ key: 'cart', subKey: 'addCartLine' }),
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
    console.log('adddd', obj.id);
    globals.fetch(
        Utils.getURL({ key: 'user', subKey: 'addFavoriteProduct' }),
        JSON.stringify({
            productId: obj.id,
        }), (answer) => {
            // do nothing 
            console.log(answer);
        });
}

deleteFavoriteProduct = (obj) => {
    console.log('deleteeee', obj.id);
    globals.fetch(
        Utils.getURL({ key: 'user', subKey: 'deleteFavoriteProduct' }),
        JSON.stringify({
            productId: obj.id,
        }), (answer) => {
            // do nothing
            console.log(answer);
        });
}