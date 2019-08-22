import {
    Dimensions,
    Platform,
} from "react-native";
import { Constants } from "expo";
import { store } from 'root/app/store';

module.exports = {
    getUserID: function () {
        const { user } = store.getState().user || {},
            { userId = '' } = user;
        return userId;
    },
    getClientProperties: function () {
        const DIMENSIONS = Dimensions.get('window');
        return {
            device_name: Constants.deviceName,
            session: Constants.sessionId,
            platform: Platform.OS,
            version: Platform.Version,
            screen_size: DIMENSIONS.width + "x" + DIMENSIONS.height,
            device_year_class: Constants.deviceYearClass,
            //user_id: 0
        };
    },
    trimText: (k) => {
        k = k || '';
        return k.replace(/(^\s+|\s+$)/g, '');
    },
    getTimeStamp: function () {
        var timestamp = new Date();
        return { timestamp: timestamp.getTime(), tz: timestamp.getTimezoneOffset() };
    },
    ajx: function ({ uri = '', method = 'POST', headers = { 'accept': 'application/json', 'content-type': 'application/json' }, body = {} }, callback) {        
        const _self = this;
        fetch(uri, {
            method: method,
            headers: headers,
            body: JSON.stringify(body)
        })
            .then(response => {
                return response.json();
            })
            .then(function (res) {
                if (typeof callback !== 'undefined')
                    callback({ type: 'success', data: res });
            })
            .catch(res => {
                if (typeof callback !== 'undefined')
                    callback({ type: 'error', data: res });
            });
    }
};