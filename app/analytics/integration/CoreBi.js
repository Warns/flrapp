const Utils = require('../Utils.js');
module.exports = {
    customFunc: {
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


            console.log('item_purchased_corebi', { order_id, total_price, products: arr });

            return { order_id, total_price, products: arr };
        }
    },
    send: function ({ event = '', data = {}, customType = '' }) {

        const _self = this;

        /* 
            gelen datayı manipule ederiz.
        */
        switch (customType) {
            case 'setCustomFunc':
                const customFunc = _self.customFunc[event] || '';
                if (customFunc != '')
                    data = customFunc(data);
                break;
            default:
                break;
        }


        const ts = Utils.getTimeStamp(),
            clientProp = Utils.getClientProperties(),
            _body = {
                apiKey: '40e251c5-131e-422e-a7aa-17b4a9b44408',
                type: event,
                timestamp: ts.timestamp,
                properties: {
                    ...clientProp,
                    ...data,
                    uuid: '',
                    tz: ts.tz,
                    userID: Utils.getUserID()
                }
            };

        //console.log('corebi', _body);
        Utils.ajx({ uri: 'https://logv2.corebi.com/api/log', body: _body }, (res) => {
            //console.log(res);
        });
    }
};