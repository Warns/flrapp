import { 
    SET_CATEGORIES, 
    SET_SCREEN_DIMENSIONS, 
    SET_SELECTED_CATEGORY, 
    SET_TEXTURE_DISPLAY,
    OPEN_PRODUCT_DETAILS,
    UPDATE_PRODUCT_DETAILS_ITEM,
    CLOSE_PRODUCT_DETAILS,
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

const generalInitialState = {
    categories: [
      {
        selector: 'All',
        id: 'all',
      }
    ],
    selectedCategory: null,
    textureDisplay: false,
    product:{
        visibility: false,
        measurements: null,
        id: null,
        animate: false,
        item: null,
    },
    preloading: false,
  }

export default function general( state = generalInitialState, action ){

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
        case CLOSE_PRODUCT_DETAILS: return {
            ...state, product:{
                ...state.product,
                item: null,
                visibility: false,
                measurements: null,
            }
        };
        case OPEN_PRODUCT_DETAILS:{

            if( action.value.id ){
                fetchProductDetails( action.value.id );
            }

            return {...state, product:{
                ...state.product,
                ...action.value,
                visibility: true,
                },
                preloading: true,
            };
        };
        case UPDATE_PRODUCT_DETAILS_ITEM: return {
            ...state, product:{
                ...state.product,
                item: action.value.product,
                colors: action.value.colors,
            },
            preloading: false,
        }
        default:
            return state;
    }
}

// to be moved to actions
fetchProductDetails = ( id ) => {

    globals.fetch(
        "https://www.flormar.com.tr/webapi/v3/Product/getProductDetail",
        JSON.stringify({
            "productId": id,
        }), ( answer ) => {
            
            console.log('answer for detail', answer.status)

            if( answer.status == 200){
                let colors = answer.data.product.productGroups;
                
                colors.push({
                    productId: answer.data.product.productId,
                    productUrl: answer.data.product.productUrl,
                    shortCode: answer.data.product.shortCode,
                    smallImageUrl: answer.data.product.productImages[0].smallImageUrl,
                    mediumImageUrl: answer.data.product.productImages[0].mediumImageUrl,
                    hasStock: answer.data.product.stockQty > 0 ? true : false,
                    name: answer.data.product.shortName
                  });
                
                colors.sort(function(a, b){return a.shortCode - b.shortCode });

                store.dispatch({type:UPDATE_PRODUCT_DETAILS_ITEM, value: {product:answer.data.product, colors:colors} });

                /*
                fetch(
                    'https://www.flormar.com.tr/mobile-app-product-video-export.html', 
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            urn: id,
                        })
                    })
                .then((response) => response.json())
                .then((responseJson) => {
                 console.log(responseJson);
                })
                .catch((error) => {
                console.error(error);
                });
                */

            }
            else{
            // handle error
            }
    });

}