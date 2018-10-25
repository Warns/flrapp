const Utils = require('root/app/helper/Global.js');

module.exports = {

    uri: Utils.getURL({ key: 'cart', subKey: 'useCoupon' }),

    successMessage: '',

    buttonText: 'Kullan',
    buttonStyle: {
        width: 60
    },

    fields: [
        {
            wrapperStyle: {
                
            },
            items: [
                {
                    id: 'couponCode',
                    //title: 'Promosyon Kodum',
                    type: 'text',
                    value: '',
                    validation: [{ key: 'isEmpty' }],               
                },
            ]
        }

    ]

};