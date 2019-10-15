import { Platform } from "react-native";

/*
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
const UA_CODE = Platform.OS === 'ios' ? 'UA-37879183-6' : 'UA-37879183-7',
    GAT = new GoogleAnalyticsTracker(UA_CODE);
*/

const Utils = require('../Utils.js');
module.exports = {
    customFunc: {
        login: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[0];
            gender = gender == 'E' ? 'Male' : 'Female';

            console.log('customFunc login', birthDay, email, firstName, lastName, gender, mobilePhone, userId);

            /*
            GAT.trackEvent('login', 'login', null, { userId: userId, name: firstName, lastName: lastName, email: email, phone_number: mobilePhone, gender: gender, birthdate: birthDay }); 
            GAT.setUser(userId);
            */
        },
        register: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[0];
            gender = gender == 'E' ? 'Male' : 'Female';

            console.log('customFunc register', birthDay, email, firstName, lastName, gender, mobilePhone, userId);

            /*
            GAT.trackEvent('register', 'register', null, { userId: userId, name: firstName, lastName: lastName, email: email, phone_number: mobilePhone, gender: gender, birthdate: birthDay }); 
            GAT.setUser(userId);
            */
        },
        logout: function () {
            console.log('logout');

            /*
            GAT.trackEvent('logout', 'logout', null); 
            GAT.setUser(null);
            */
        },

        order_completed: function (data) {
            let { order_id, total_price, products = [] } = data,
                keys = {
                    'productName': 'product_name',
                    'productId': 'product_id',
                    'allCatIds': 'category_id',
                    'catName': 'category_name'
                },
                arr = [];

            Object
                .entries(products)
                .forEach(([key, item]) => {
                    arr.push(Utils.mapping({ data: item, keys: keys }));
                });

            console.log('order_completed', { order_id, total_price, products: arr });

            // GAT.trackEvent('order_completed', 'order_completed', null, { order_id, total_price, products: arr });
        }
    },
    send: function ({ event = '', data = {}, customType = 'tagEventWithParameters' }) {
        const _self = this; //console.log('google analytic', customType, event, data);
        switch (customType) {
            case 'tagEventWithParameters':
                //GAT.trackEvent(event, event, null, data);
                break;
            case 'tagEvent':
                //GAT.trackEvent(event, event, null);  
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