import {
    Alert,
} from 'react-native';
const Translation = require('root/app/helper/Translation.js');
module.exports = {
    mapApiKey: 'AIzaSyAvSoqfCr4I9Vb11HtQ6cDEAMki6THBgrQ',
    prefix: 'https://www.flormar.com.tr',
    URLs: {
        style: {
            main: '/styles/mobiApp.css'
        },
        banner: {
            getBannerList: '/webapi/v3/Banner/getBannerList'
        },
        product: {
            getProductList: '/webapi/v3/Product/getProductList',
        },
        user: {
            getToken: '/webapi/v3/User/getToken',
            getUser: '/webapi/v3/User/getUser',
            setUser: '/webapi/v3/User/setUser',
            createUser: '/webapi/v3/User/createUser',
            login: '/webapi/v3/User/login',
            logout: '/webapi/v3/User/logout',
            recoverPassword: '/webapi/v3/User/recoverPassword',
            changePassword: '/webapi/v3/User/changePassword',
            getFavoriteProductList: '/webapi/v3/User/getFavoriteProductList',
            deleteFavoriteProduct: '/webapi/v3/User/deleteFavoriteProduct',
            getStockFollowUpList: '/webapi/v3/User/getStockFollowUpList', // takip listem - Stoğa Girenler
            getPriceFollowUpList: '/webapi/v3/User/getPriceFollowUpList', // takip listem - fiyatı düşenler
        },
        address: {
            country: '/webapi/v3/Address/getCountry',
            city: '/webapi/v3/Address/getCity',
            district: '/webapi/v3/Address/getDistrict',
            createAddress: '/webapi/v3/Address/createAddress',
            getAddress: '/webapi/v3/Address/getAddress',
            setAddress: '/webapi/v3/Address/setAddress',
            deleteAddress: '/webapi/v3/Address/deleteAddress',
        },
        order: {
            getOrder: '/webapi/v3/Order/getOrder', // siparişlerim
            getOrderDetail: '/webapi/v3/Order/getOrderDetail', // sipariş detay
            repeatOrder: '/webapi/v3/Order/repeatOrder', // sipariş tekrarla
        },
        integrator: {
            /*
                Implementation Notes
                StatusId : 1(New), 2(Approved), 3(Cancel), 4(Used) - Type : 1(Gift Cart), 2(Discount Coupon)
            */
            getCouponDetail: '/webapi/v3/Integrator/getCouponDetail' // kuponlarım
        },
        service: {
            getServiceList: '/webapi/v3/Service/getServiceList', // servis listesi
            getServiceTypeList: '/webapi/v3/Service/getServiceTypeList',
        },
        export: {
            getExport: '/webapi/v3/Export/getExport',
        },
        content: {
            getContent: '/webapi/v3/Content/getContent',
            getDataByUrl: '/webapi/v3/Content/getDataByUrl',
        }
    },
    customURLs: {
        location: 'https://maps.googleapis.com/maps/api/distancematrix/json?language={{lang}}&units=metric&origins={{origins}}&destinations={{destinations}}&key={{mapApikey}}'
    },
    getCustomURL: function ({ key = '', lang = 'tr-TR', origins = '', destinations = '' }) {
        const _t = this;
        return (_t.customURLs[key] || '')
            .replace(/{{lang}}/g, lang)
            .replace(/{{origins}}/g, origins)
            .replace(/{{destinations}}/g, destinations)
            .replace(/{{mapApikey}}/g, _t.mapApiKey);
    },
    getURL: function ({ key = '', subKey = '' }) {
        const _t = this;
        return _t.prefix + (_t.URLs[key][subKey] || '');
    },
    regex: {
        typ1: /[^a-zA-ZıiIğüşöçİĞÜŞÖÇ\s]+/g, /* sadece harf */
        typ2: /[^0-9\s]+/g, /* sadece rakam */
        typ3: /[^a-zA-ZıiI0-9ğüşöçİĞÜŞÖÇ\s]+/g, /* harf rakam karışık */
        typ4: /[^a-zA-ZıiI0-9ğüşöçİĞÜŞÖÇ:\/\s]+/g, /* address alanı için */
        typ5: /[^0-9\(\)\s]+/g, /* telefon için */
    },
    getRegex: function ({ key = '', value = '' }) {
        const _t = this,
            rgx = _t.regex[key] || '';
        if (rgx)
            return value.replace(rgx, '');
        else
            return value;
    },
    detect: (k) => {
        return k.length == 0 ? false : true;
    },
    trimText: (k) => {
        return k.replace(/(^\s+|\s+$)/g, '');
    },
    cleanText: (k) => {
        return k.replace(/\s+/g, '');
    },
    subtractDate: (o) => {
        var typ = o['typ'] || 'remove',
            days = o['day'] || 0,
            months = o['month'] || 0,
            years = o['year'] || 0,
            date = new Date();

        date.setDate(date.getDate() + days);
        date.setMonth(date.getMonth() + months);
        date.setFullYear(date.getFullYear() + years);

        return { data: date, dateFormat: date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() };
    },
    isArrEqual: function (value, other) {
        /* https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/ */
        const _self = this;

        // Get the value type
        var type = Object.prototype.toString.call(value);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) return false;

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

        // Compare the length of the length of the two items
        var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) return false;

        // Compare two items
        var compare = function (item1, item2) {

            // Get the object type
            var itemType = Object.prototype.toString.call(item1);

            // If an object or array, compare recursively
            if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
                if (!_self.isArrEqual(item1, item2)) return false;
            }

            // Otherwise, do a simple comparison
            else {

                // If the two items are not the same type, return false
                if (itemType !== Object.prototype.toString.call(item2)) return false;

                // Else if it's a function, convert to a string and compare
                // Otherwise, just compare
                if (itemType === '[object Function]') {
                    if (item1.toString() !== item2.toString()) return false;
                } else {
                    if (item1 !== item2) return false;
                }

            }
        };

        // Compare properties
        if (type === '[object Array]') {
            for (var i = 0; i < valueLen; i++) {
                if (compare(value[i], other[i]) === false) return false;
            }
        } else {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    if (compare(value[key], other[key]) === false) return false;
                }
            }
        }

        // If nothing failed, return true
        return true;

    },
    getImage: function (k) {
        const _t = this;
        /* favori ürünlerde resmin tam yolu gelmiyor o durumu çözmek için kullanılacak */
        if (k.indexOf(_t.prefix) == -1)
            k = _t.prefix + k;
        return k;
    },
    getPriceFormat: function (k) {
        /* fiyat formatlama */
        return '₺' + k;
    },
    getDateFormat: function (k) {
        /* date formatlama, "orderDate": "02012017 17:48:00" */
        k = k.split(' ')[0];
        return (k.slice(0, 2) + '.' + k.slice(2, 4) + '.' + k.slice(4, 8));
    },
    ajx: function ({ uri = '' }, callback) {
        return fetch(uri)
            .then((res) => res.json())
            .then((res) => {
                if (typeof callback !== 'undefined')
                    callback({ type: 'success', data: res });
            })
            .catch((error) => {
                if (typeof callback !== 'undefined')
                    callback({ type: 'error', data: error });
            });
    },
    confirm: function ({ title = 'Uyarı', message = '' }, callback) {
        const { cancel, ok } = Translation['confirm'];
        Alert.alert(
            title,
            message,
            [
                {
                    text: cancel,
                    onPress: () => {
                        if (typeof callback !== 'undefined')
                            callback({ type: 'cancel' });
                    }
                },
                {
                    text: ok,
                    onPress: () => {
                        if (typeof callback !== 'undefined')
                            callback({ type: 'ok' });
                    }
                }
            ],
            {
                cancelable: false
            }
        )
    },
    filterToSelectObject: function (filters) {
        const obj = {}, filter = { sendAjx: false, fields: [] };

        Object.entries(filters).forEach(([ind, value]) => {
            const key = value['filterGroupName'] || '';
            if (typeof obj[key] == 'undefined')
                obj[key] = [];
            obj[key].push(value)
        });

        Object.entries(obj).forEach(([key, value]) => {
            const k = { items: [] },
                sel = [],
                values = value.map((val, ind) => {
                    if (val['isSelected'])
                        sel.push(val['filterId']);

                    return { key: val['filterName'], value: val['filterId'] };
                }),
                o = { id: key, defaultTitle: key, multiple: true, type: 'select', values: values, value: sel.length > 0 ? sel : -1 };


            k['items'].push(o);

            filter['fields'].push(k);
        });
        
        console.log(JSON.stringify(filter))

        return filter;
    }
};