/* 
    ex: Analytics.send({ event: Analytics.events.category_visited, data: data })
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
        if (data != '') {
            Object
                .entries(_self.keyList)
                .forEach(([key, item]) => {
                    var keys = item[event] || '';
                    if (keys != '')
                        _self.mapping({ _integrationType: key, _data: data, ...keys });
                });
        }
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
              "category_id": "18776",
              "category_name": "DUDAK KALEMİ",
              "event": "category_visited",
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
            obj = {};

        Object
            .keys(o)
            .map(key => {
                /* gelen objede keyi keys, data, event, integrationType olanların dışındakileri kapsa */
                if (key != '_keys' && key != '_data' && key != '_integrationType' && key != 'event')
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

        obj = { prop: obj, event: o['event'] || '' };

        /* 
                tanımlı tipler buradan yollanır
        */
        switch (integrationType) {
            case 'corebi':
                CoreBi.send(obj);
                break;

            case 'insider':
                Insider.send(obj);
                break;

            default:
                break;
        }
    },
}

