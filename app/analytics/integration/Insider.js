//import RNInsider from 'react-native-insider';
module.exports = {
    customFunc: {
        login: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[ 0 ];
            gender = gender == 'E' ? 'Male' : 'Female';
            
            console.log('customFunc login', birthDay, email, firstName, lastName, gender, mobilePhone, userId);
            
            /*
            RNInsider.tagEvent('login');
            RNInsider.setUserIdentifier(userId);
            RNInsider.setCustomAttributeWithString('name', firstName);
            RNInsider.setCustomAttributeWithString('last_name', lastName);
            RNInsider.setCustomAttributeWithString('email', lastName);
            RNInsider.setCustomAttributeWithString('phone_number', lastName);
            RNInsider.setCustomAttributeWithString('gender', gender);
            RNInsider.setCustomAttributeWithDate('birthdate', birthDay);
            RNInsider.setCustomAttributeWithBOOL('login', true);
            */
        },
        register: function ({ birthDay = '', email = '', firstName = '', lastName = '', gender = '', mobilePhone = '', userId = '' }) {
            birthDay = birthDay.split(' ')[ 0 ];
            gender = gender == 'E' ? 'Male' : 'Female';
            
            console.log('customFunc register', birthDay, email, firstName, lastName, gender, mobilePhone, userId);
            
            /*
            RNInsider.tagEvent('register');
            RNInsider.setUserIdentifier(userId);
            RNInsider.setCustomAttributeWithString('name', firstName);
            RNInsider.setCustomAttributeWithString('last_name', lastName);
            RNInsider.setCustomAttributeWithString('email', lastName);
            RNInsider.setCustomAttributeWithString('phone_number', lastName);
            RNInsider.setCustomAttributeWithString('gender', gender);
            RNInsider.setCustomAttributeWithDate('birthdate', birthDay);
            RNInsider.setCustomAttributeWithBOOL('login', true);
            */
        },
        logout: function(){
            console.log('logout');
            /*
                RNInsider.tagEvent('logout');
                RNInsider.unsetUserIdentifier();
            */
        }
    },
    send: function ({ event = '', data = {}, customType = 'tagEventWithParameters' }) {
        const _self = this;console.log('insider', customType, event, data);
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