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

/* Redux Actions */
export const SET_SETTINGS = 'SET_SETTINGS';