const Utils = require('root/app/helper/Global.js');

module.exports = {

    uri: Utils.getURL({ key: 'cart', subKey: 'deleteCoupon' }),

    successMessage: 'Kodunuz İptal Edilmiştir.',

    showButton: false,
    buttonText: 'İptal',
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
                    //disabled: true,
                    css: {
                        containerStyle: { 
                            marginBottom: 0,
                            marginRight: 0, 
                        },
                        wrapperStyle: {
                            backgroundColor: '#f6f6f6'
                        }
                    }          
                },
            ]
        }

    ]

};