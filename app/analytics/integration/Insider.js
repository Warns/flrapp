//import RNInsider from 'react-native-insider';
module.exports = {
    send: function ({ event = '', data = {}, customType = 'tagEventWithParameters' }) {
        console.log('insider', customType, event, data);
        switch (customType) {
            case 'tagEventWithParameters':
                //RNInsider.tagEventWithParameters(event, data);  
                break;
            case 'tagEvent':
                //RNInsider.tagEventWithParameters(event);  
                break;
            default:
                break;
        }
    }
};