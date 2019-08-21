const Utils = require('../Utils.js');
module.exports = {
    send: function ({ event = '', data = {} }) {
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

        Utils.ajx({ uri: 'https://logv2.corebi.com/api/log', body: _body }, (res) => {
            // console.log(res);
        });
    }
};