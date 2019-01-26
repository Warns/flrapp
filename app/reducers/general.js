import {
    SET_CATEGORIES,
    SET_SCREEN_DIMENSIONS,
    SET_SELECTED_CATEGORY,
    SET_TEXTURE_DISPLAY,
    OPEN_PRODUCT_DETAILS,
    UPDATE_PRODUCT_DETAILS_ITEM,
    CLOSE_PRODUCT_DETAILS,
    UPDATE_PRODUCT_VIDEOS,
    OPEN_VIDEO_PLAYER,
    SHOW_PRELOADING,
    SHOW_CUSTOM_POPUP,
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

const generalInitialState = {
    categories: [
        {
            selector: 'All',
            id: 'all',
        }
    ],
    selectedCategory: null,
    textureDisplay: false,
    product: {
        visibility: false,
        measurements: {},
        id: null,
        animate: false,
        item: null,
        screenshot: null,
        videos: [],
    },
    preloading: false,
    video: {
        visibility: false,
        items: [],
        selected: 0,
    },
    customModal: {
        visibility: false,
        type: '',
        data: {},
    },
    // Other
    SCREEN_DIMENSIONS: {
        topMargin: 0,
        window: {},
    },
}

export default function general(state = generalInitialState, action) {

    switch (action.type) {
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
            ...state, product: {
                ...state.product,
                item: null,
                visibility: false,
                measurements: {},
            }
        };
        case 'UPDATE_PRODUCT_OBJECT': {
            console.log('----add fx');
            return {
                ...state, product: {
                    ...state.product,
                    ...action.value,
                }
            };
        };
        case OPEN_PRODUCT_DETAILS: {

            console.log('----open');

            if (action.value.id) {
                fetchProductDetails(action.value.id);
            }

            return {
                ...state, product: {
                    ...state.product,
                    ...action.value,
                    visibility: true,
                },
                preloading: true,
            };
        };
        case UPDATE_PRODUCT_DETAILS_ITEM: {

            console.log('----update');

            if (state.product.callback) state.product.callback();

            return {
                ...state, product: {
                    ...state.product,
                    item: action.value.product,
                    colors: action.value.colors,
                    videos: [],
                },
                preloading: false,
            }
        };
        case OPEN_VIDEO_PLAYER: return {
            ...state, video: {
                ...state.video,
                ...action.value,
            }
        };
        case UPDATE_PRODUCT_VIDEOS: return {
            ...state, product: {
                ...state.product,
                videos: action.value.videos,
            }
        };
        case SHOW_PRELOADING: return {
            ...state,
            preloading: action.value
        };
        case SHOW_CUSTOM_POPUP: return {
            ...state,
            customModal: {
                ...action.value
            }
        };

        default:
            return state;
    }
}

// to be moved to actions
fetchProductDetails = (id) => {

    globals.fetch(
        Utils.getURL({ key: 'product', subKey: 'getProductDetail' }),
        JSON.stringify({
            "productId": id,
        }), (answer) => {

            //console.log('answer for detail', answer.status)

            if (answer.status == 200) {
                let colors = [];

                if (answer.data.product.productGroups) colors = answer.data.product.productGroups;

                colors.push({
                    productId: answer.data.product.productId,
                    productUrl: answer.data.product.productUrl,
                    shortCode: answer.data.product.shortCode,
                    smallImageUrl: answer.data.product.productImages[0].smallImageUrl,
                    mediumImageUrl: answer.data.product.productImages[0].mediumImageUrl,
                    hasStock: answer.data.product.stockQty > 0 ? true : false,
                    name: answer.data.product.shortName
                });

                colors.sort((a, b) => (a.shortCode > b.shortCode) ? 1 : ((b.shortCode > a.shortCode) ? -1 : 0));

                store.dispatch({ type: UPDATE_PRODUCT_DETAILS_ITEM, value: { product: answer.data.product, colors: colors } });

                // Fetch video
                Utils.ajx({ uri: Utils.getURL({ key: 'product', subKey: 'getProductVideos' }) + '?urn=' + id }, (result) => {
                    if (result['type'] == 'success')
                        store.dispatch({ type: UPDATE_PRODUCT_VIDEOS, value: { videos: result.data.data.videos } });
                });

            }
            else {
                // handle error
            }
        });

}