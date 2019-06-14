const Utils = require('root/app/helper/Global.js');

module.exports = {

    uri: Utils.getURL({ key: 'cart', subKey: 'useCoupon' }),

    successMessage: 'Kupon Kodunuz Aktif Edilmiştir.',

    showButton: false,
    buttonText: 'Kullan',
    buttonStyle: {
        width: 60
    },

    fields: [
        {
            wrapperStyle: {
                flex: 1
            },
            items: [
                {
                    id: 'couponCode',
                    //title: 'Promosyon Kodum',
                    showHeader: false,    
                    type: 'text',
                    value: '',
                    validation: [{ key: 'isEmpty' }],
                    //disabled: false,
                    css: {
                        containerStyle: { 
                            marginBottom: 0,
                            marginRight: 0, 
                        }
                    },           
                },
            ]
        }

    ]

};