import { store } from 'root/app/store';
import {
    SET_CART_ITEMS,
    ADD_CART_ITEM,
    SET_CART_INFO,
    SET_CART_ADDRESS,
    SET_DIFFERENT_ADDRESS,
    SET_CART_CARGO
} from 'root/app/helper/Constant';

const cartInitialState = {
    name: 'Cart',
    cartProductsNumber: 0,
    cartInfo: {},
    selectedAddress: {
        shipAddress: 0, /* teslimat adresi */
        billAddress: 0, /* fatura adresi */
        differentAddress: false /* farklı adrese gönder; false = teslimat, fatura aynı / true = farklı */
    },
    /* setCart yaptığımız zaman tüm seçimleri göndermemiz gerekiyor */
    postData: {
        shipAddressId: 0,
        billAddressId: 0,
        customerNote: '',
        paymentId: 0,
        cargoId: 0,
        bankId: 0,
        installmentId: 0,
        usePoint: 0,
        //useBankPoint: true,
        //cartLocation: '',
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

            if( action.value.id ){
                addCartLine( action.value );
            }

            return {...state,
                cartProductsNumber: state.cartProductsNumber + action.value.quantity
            };
        };
        case SET_CART_ADDRESS: {
            const { selectedAddress = {} } = state,
                { differentAddress = false } = selectedAddress,
                { addressId, addressType = 'shipAddress' } = action.value;

            if (!differentAddress)
                return {
                    ...state,
                    selectedAddress: { ...state.selectedAddress, shipAddress: addressId, billAddress: addressId },
                    postData: { ...state.postData, shipAddressId: addressId, billAddressId: addressId }
                }
            else {
                if (addressType == 'shipAddress')
                    return {
                        ...state,
                        selectedAddress: { ...state.selectedAddress, shipAddress: addressId },
                        postData: { ...state.postData, shipAddressId: addressId }
                    }
                else if (addressType == 'billAddress')
                    return {
                        ...state,
                        selectedAddress: { ...state.selectedAddress, billAddress: addressId },
                        postData: { ...state.postData, billAddressId: addressId }
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
                    selectedAddress: { ...state.selectedAddress, differentAddress: b, billAddress: 0 },
                    postData: { ...state.postData, billAddressId: 0 }
                }
            else
                return {
                    ...state,
                    selectedAddress: { ...state.selectedAddress, differentAddress: b, billAddress: shipAddress },
                    postData: { ...state.postData, billAddressId: shipAddress }
                }
        };
        case SET_CART_CARGO: {
            return {
                ...state,
                postData: { ...state.postData, cargoId: action.value }
            }
        };
        default:
            return state;
    }
}


addCartLine = ( obj ) => {

    globals.fetch(
        "https://www.flormar.com.tr/webapi/v3/Cart/addCartLine",
        JSON.stringify({
            "productId": obj.id,
            "quantity": obj.quantity,
        }), ( answer ) => {
            
            if( answer.status == 200){
                //do nothing
            }
            else{
                store.dispatch({type:ADD_CART_ITEM, value: {quantity:-obj.quantity} });
            }
    });

}