//import RNInsider from 'react-native-insider';
const Utils = require('../Utils.js');
module.exports = {
    customFunc: {
        login: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[0];
            gender = gender == 'E' ? 'Male' : 'Female';

            console.log('customFunc login', birthDay, email, firstName, lastName, gender, mobilePhone, userId);

            /*
            RNInsider.tagEvent('login');
            RNInsider.setUserIdentifier(userId);
            RNInsider.setCustomAttributeWithString('name', firstName);
            RNInsider.setCustomAttributeWithString('last_name', lastName);
            RNInsider.setCustomAttributeWithString('email', email);
            RNInsider.setCustomAttributeWithString('phone_number', mobilePhone);
            RNInsider.setCustomAttributeWithString('gender', gender);
            RNInsider.setCustomAttributeWithDate('birthdate', birthDay);
            RNInsider.setCustomAttributeWithBOOL('login', true);
            */
        },
        register: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[0];
            gender = gender == 'E' ? 'Male' : 'Female';

            console.log('customFunc register', birthDay, email, firstName, lastName, gender, mobilePhone, userId);

            /*
            RNInsider.tagEvent('register');
            RNInsider.setUserIdentifier(userId);
            RNInsider.setCustomAttributeWithString('name', firstName);
            RNInsider.setCustomAttributeWithString('last_name', lastName);
            RNInsider.setCustomAttributeWithString('email', email);
            RNInsider.setCustomAttributeWithString('phone_number', mobilePhone);
            RNInsider.setCustomAttributeWithString('gender', gender);
            RNInsider.setCustomAttributeWithDate('birthdate', birthDay);
            RNInsider.setCustomAttributeWithBOOL('register', true);
            */
        },
        logout: function () {
            console.log('logout');
            /*
                RNInsider.tagEvent('logout');
                RNInsider.unsetUserIdentifier();
            */
        },

        order_completed: function (data) {
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
            //RNInsider.tagEventWithParameters('order_completed', { order_id, total_price, products: arr }); 
        }
    },
    send: function ({ event = '', data = {}, customType = 'tagEventWithParameters' }) {
        const _self = this; //console.log('insider', customType, event, data);
        switch (customType) {
            case 'tagEventWithParameters':
                //RNInsider.tagEventWithParameters(event, data);  
                break;
            case 'tagEvent':
                //RNInsider.tagEvent(event);  
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