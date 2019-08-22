/* 
    ex: 
    const Analytics = require("root/app/analytics");
    Analytics.send({ event: Analytics.events.category_visited, data: data })
*/

const Utils = require('./Utils.js');
const Events = require('./Events.js');
const IntegrationKeyList = require('./IntegrationKeyList.js');

/* 
    entegrasyon tanımları burada import edilir
*/
const CoreBi = require('./integration/CoreBi.js');
const Insider = require('./integration/Insider.js');

module.exports = {

    keyList: IntegrationKeyList,

    events: Events,

    send: function (o) {
        o = o || {};
        const _self = this,
            data = o['data'] || '',
            event = o['event'] || '';

        Object
            .entries(_self.keyList)
            .forEach(([key, item]) => {
                var keys = item[event] || ''; // keylist içinde örneğin insider içerisinde category_visited varmı
                if (keys != '') {
                    if (data != '') // data varsa mapping için yolla
                        _self.mapping({ _integrationType: key, _data: data, ...keys }); // _integrationType: keylist tanımlı olan insider, corebi entegrasyon tipi  
                    else
                        _self.sendData({ integrationType: key, data: keys });
                }
            });

    },

    mapping: function (o) {
        /*
            loglama için mapping: data içerisinde json desenini yollarsınız. keys içerisindeki key value değeerlerini replace edip keys de belirtilen yapıya çevirir. _data, _keys, _integrationType, event yeni objeye dahil edilmez diğer alanlar dahil edilir. 
    
            {
                event: 'category_visited',
                _data: {},
                _keys: {
                    title: 'category_name',
                    catId: 'category_id'
                },
                _integrationType: 'insider' 
            }
            
            ex: 
            Analytics.mapping({
              event: 'category_visited',
              _data: {
                page: 1,
                pageSize: 300,
                catId: 18776,
                title: 'DUDAK KALEMİ'
              },
              _keys: {
                title: 'category_name',
                catId: 'category_id'
              },
              _integrationType: 'insider'
            });
    
            output: 
            {
              "event": "category_visited",
              "data": {
                "category_id": "18776",
                "category_name": "DUDAK KALEMİ",
              }
            }
        */

        /* 
            _integrationType: Keylistteki key: value kısmındaki key ismi yani insider, corebi yarın başka bir thirdparty onlarda
        */

        o = o || {};
        let _self = this,
            data = o['_data'] || {},
            keys = o['_keys'] || '',
            integrationType = o['_integrationType'] || '',
            obj = {},
            disAllow = ['_keys', '_data', '_integrationType', 'event', 'customType']; /* gelen objede keyi bu array dışında olanları yoksay */

        Object
            .keys(o)
            .map(key => {
                if (disAllow.indexOf(key) == -1)
                    obj[key] = o[key] || '';
            });

        if (keys != '')
            Object
                .keys(data)
                .map(key => {
                    const k = Utils.trimText((keys[key] || '')),
                        value = data[key] || '';
                    if (k != '' && value != '')
                        obj[k] = value;
                });

        obj = { data: obj, event: o['event'] || '' };

        _self.sendData({ integrationType: integrationType, data: obj });
    },

    sendData: function ({ integrationType, data }) {
        const _self = this;
        /* 
            tanımlı tipler buradan yollanır
        */
        switch (integrationType) {
            case 'corebi':
                CoreBi.send(data);
                break;

            case 'insider':
                Insider.send(data);
                break;

            default:
                break;
        }
    }
}

