const Utils = require('../Utils.js');

module.exports = {
    send: function ({ event = '', prop = {} }) {
        const clientProp = Utils.getClientProperties(),
            _body = {
                api_key: '',
                user_segment: {
                    ...clientProp
                },
                new_event: {
                    ...prop,
                    event: event
                }
            };

        Utils.ajx({ uri: 'https://mobile.useinsider.com/api/v1/event/insert', body: _body }, (res) => {
            console.log(res);
        });
    }
};