/*

https://medium.com/@oakromulo/firebase-analytics-on-react-native-4b348466f025

import firebase from 'react-native-firebase';
const Analytics = firebase.analytics();
*/
const Utils = require('../Utils.js');
module.exports = {
    customFunc: {
        login: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[0];
            gender = gender == 'E' ? 'Male' : 'Female';

            console.log('customFunc login', birthDay, email, firstName, lastName, gender, mobilePhone, userId);

            /*
            Analytics.logEvent('login');
            Analytics.setUserId(userId);
            Analytics.setUserProperty('name', firstName);
            Analytics.setUserProperty('last_name', lastName);
            Analytics.setUserProperty('email', email);
            Analytics.setUserProperty('phone_number', mobilePhone);
            Analytics.setUserProperty('gender', gender);
            Analytics.setUserProperty('birthdate', birthDay);
            Analytics.setUserProperty('login', true);
            */
        },
        register: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[0];
            gender = gender == 'E' ? 'Male' : 'Female';

            console.log('customFunc register', birthDay, email, firstName, lastName, gender, mobilePhone, userId);

            /*
            Analytics.logEvent('register');
            Analytics.setUserId(userId);
            Analytics.setUserProperty('name', firstName);
            Analytics.setUserProperty('last_name', lastName);
            Analytics.setUserProperty('email', email);
            Analytics.setUserProperty('phone_number', mobilePhone);
            Analytics.setUserProperty('gender', gender);
            Analytics.setUserProperty('birthdate', birthDay);
            Analytics.setUserProperty('register', true);
            */
        },
        logout: function () {
            console.log('logout');
            /*
                Analytics.logEvent('logout');
                Analytics.setUserId(null);
                Analytics.setUserProperty('name', null);
                Analytics.setUserProperty('last_name', null);
                Analytics.setUserProperty('email', null);
                Analytics.setUserProperty('phone_number', null);
                Analytics.setUserProperty('gender', null);
                Analytics.setUserProperty('birthdate', null);
            */
        },

        item_purchased: function (data) {
            let { order_id, total_price, products = [] } = data,
                keys = {
                    'productName': 'product_name',
                    'productId': 'product_id',
                    'allCatIds': 'category_id'
                },
                arr = [];

            Object
                .entries(products)
                .forEach(([key, item]) => {
                    arr.push(Utils.mapping({ data: item, keys: keys }));
                });

            console.log('order_completed', { order_id, total_price, products: arr });
            //Analytics.logEvent('order_completed', { order_id, total_price, products: arr }); 
        }
    },
    send: function ({ event = '', data = {}, customType = 'tagEventWithParameters' }) {
        const _self = this; console.log('firebase', customType, event, data);
        switch (customType) {
            case 'tagEventWithParameters':
                //Analytics.logEvent(event, data);  
                break;
            case 'tagEvent':
                //Analytics.logEvent(event);  
                break;
            case 'setCustomFunc':
                const customFunc = _self.customFunc[event] || '';
                if (customFunc != '')
                    customFunc(data);
                break;
            default:
                break;
        }
    }
};