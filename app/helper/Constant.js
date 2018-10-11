/* app için gerekli iconlar burdan tanımlanır */
export const ICONS = {
    rightArrow: require('root/assets/icons/rightArrow.png'),
    storeLocation: require('root/assets/icons/storeLocation.png'),
    location: require('root/assets/icons/location.png'),
    feedInstagram: require('root/assets/icons/feedInstagram.png'),
    feedCampaing: require('root/assets/icons/feedPromo.png'),
    feedVideo: require('root/assets/icons/feedVideo.png'),
    like: require('root/assets/icons/heartFull.png'),
    unLike: require('root/assets/icons/heartOutline.png'),
    close: require('root/assets/icons/close.png'),
    drpIco: require('root/assets/icons/drpIco.png'),

    listProduct: require('root/assets/icons/list_product.png'),
    listTexture: require('root/assets/icons/list_texture.png'),

    list: require('root/assets/icons/list.png'),
    map: require('root/assets/icons/map.png'),
    back: require('root/assets/images/icons/back.png')
};

/* VIEWER SAYFA TİPLERİ */
export const VIEWERTYPE = {
    LIST: 'listViewer',
    HTML: 'htmlViewer',
    HTMLTOJSON: 'htmlToJSON',
    WEBVIEW: 'webViewer',
    FORM: 'form'
};

/* VIEWER FLATLIST ITEM TYPE */
export const ITEMTYPE = {
    ADDRESS: 'address',
    FAVORITE: 'favorite',
    ORDER: 'order',
    COUPON: 'coupon',
    FOLLOWLIST: 'followList',
    SERVICELIST: 'serviceList',
    CAMPAING: 'campaing',
    VIDEO: 'video',
    FEEDS: 'feeds',
    TRIGGERBUTTON: 'triggerButton',
    EXITBUTTON: 'exitButton'
};

export const FEEDSTYPE = {
    INSTAGRAM: 'instagram',
	VIDEO: 'video',
	CAMPAING: 'campaing',
    PRODUCT: 'product',
    BLOGPOST: 'blog_post',
    COLLECTION: 'collection'
};


export const CLICK = 'CLICK';
export const DOUBLE_CLICK = 'DOUBLE_CLICK';
export const DATA_LOADED = 'DATA_LOADED';
export const SERVICE_LIST_CLICKED = 'SERVICE_LIST_CLICKED';
export const ORDER_LIST_CLICKED = 'ORDER_LIST_CLICKED';
export const ADDRESS_LIST_CLICKED = 'ADDRESS_LIST_CLICKED';
export const LOCATION_SERVICE = 'LOCATION_SERVICE';
export const SET_FORM = 'SET_FORM';

/* form */
export const FORMDATA = {
    login: require('root/data/login.js'),
    createUser: require('root/data/createUser.js'),
    recoverPassword: require('root/data/recoverPassword.js'),
    changePassword: require('root/data/changePassword.js'),
    createAddress: require('root/data/createAddress.js'),
    setAddress: require('root/data/setAddress.js'),
    setUser: require('root/data/setUser.js'),
    productFilter: require('root/data/productFilter.js'),
};

/* form style, from->container.js */
export const FORMSTYLE = {
    LIGHT: {
        BORDER_WIDTH: 0,
        BORDER_COLOR: 'rgba(255, 255, 255, 0)',
        TITLE_COLOR: '#FFFFFF',
        ERROR_COLOR: '#d3838d',
        BACKGROUND_COLOR: 'rgba(255, 255, 255, 0.4)'
    },
    DARK: {
        BORDER_WIDTH: 1,
        BORDER_COLOR: '#dddddd',
        TITLE_COLOR: '#9b9b9b',
        ERROR_COLOR: '#d3838d',
        BACKGROUND_COLOR: '#FFFFFF'
    }
};

/*** Redux Actions ***/

/* settings */
export const SET_SETTINGS = 'SET_SETTINGS';

/* root navigation */
export const SET_NAVIGATION = 'SET_NAVIGATION';
export const NAVIGATE = 'NAVIGATE';

/* cart */
export const SET_CART_ITEMS = 'SET_CART_ITEMS';
export const ADD_CART_ITEM = 'ADD_CART_ITEM';

/* general */
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_SELECTED_CATEGORY = 'SET_SELECTED_CATEGORY';
export const SET_TEXTURE_DISPLAY = 'SET_TEXTURE_DISPLAY';
export const SET_SCREEN_DIMENSIONS = 'SET_SCREEN_DIMENSIONS';

/* user */
export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_CART_NUM = 'SET_CART_NUM';

/* menu */
export const SHOW_MENU = 'SHOW_MENU';
export const HIDE_MENU = 'HIDE_MENU';

/* location */
export const SET_LOCATION = 'SET_LOCATION';

/* offline notice */
export const SET_CONNECTION = 'SET_CONNECTION';
