/* app için gerekli iconlar burdan tanımlanır */
export const ICONS = {
    rightArrow: require('root/assets/icons/rightArrow.png'),
    storeLocation: require('root/assets/icons/storeLocation.png'),
    location: require('root/assets/icons/location.png'),
};

/* VIEWER SAYFA TİPLERİ */
export const VIEWERTYPE = {
    LIST: 'listViewer',
    HTML: 'htmlViewer',
    HTMLTOJSON: 'htmlToJSON',
    WEBVIEW: 'webViewer'
};

/* VIEWER FLATLIST ITEM TYPE */
export const ITEMTYPE = {
    ADDRESS: 'address',
    FAVORITE: 'favorite',
    ORDER: 'order',
    COUPON: 'coupon',
    FOLLOWLIST: 'followList',
    SERVICELIST: 'serviceList',
    VIDEO: 'video',
};

export const DATA_LOADED = 'DATA_LOADED';
export const SERVICE_LIST_CLICKED = 'SERVICE_LIST_CLICKED';
export const ORDER_LIST_CLICKED = 'ORDER_LIST_CLICKED';
export const ADDRESS_LIST_CLICKED = 'ADDRESS_LIST_CLICKED';
export const LOCATION_SERVICE = 'LOCATION_SERVICE';

/* form */
export const FORMDATA = {
    login: require('root/data/login.js'),
    createUser: require('root/data/createUser.js'),
    recoverPassword: require('root/data/recoverPassword.js'),
    changePassword: require('root/data/changePassword.js'),
    createAddress: require('root/data/createAddress.js'),
    setAddress: require('root/data/setAddress.js'),
    setUser: require('root/data/setUser.js'),
};

/* Redux Actions */
export const SET_SETTINGS = 'SET_SETTINGS';