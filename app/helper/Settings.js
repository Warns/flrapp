import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    SET_SETTINGS,
    SET_SEGMENTIFY_USER_SESSION
} from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    /* 
        logoff durumu için segmentify servisinden userid ve sessionid alınır ve cookieye yazdırılır. Sonraki kullanıcı girişlerinde bu değerler kullanılır.        
    */
    _setSeg = () => {
        /* https://www.segmentify.com/dev/integration_rest/#user-session-management */
        const _self = this,
            _requestSeg = function () {
                Utils.ajx({ uri: 'https://gandalf.segmentify.com/get/key?count=2&apiKey=61c97507-5c1f-46c6-9b50-2aa9d1d73316' }, (res) => {
                    if (res['type'] == 'success') {
                        const arr = res['data'] || [],
                            obj = { userID: arr[0] || null, sessionID: arr[1] || null };
                        Globals.setSecureStorage("__SEGMENTIFY_USER_SESSION__", JSON.stringify(obj));
                        _self.props.dispatch({ type: SET_SEGMENTIFY_USER_SESSION, value: arr });
                    }
                });
            };

        Globals.getSecureStorage("__SEGMENTIFY_USER_SESSION__", answer => {
            if (answer !== "no") {
                let obj = JSON.parse(answer) || {},
                    userID = obj['userID'] || '',
                    sessionID = obj['sessionID'] || '';

                if (userID != '' && sessionID != '')
                    _self.props.dispatch({ type: SET_SEGMENTIFY_USER_SESSION, value: [userID, sessionID] });
                else
                    _requestSeg();
            } else
                _requestSeg();
        });
    }

    /* 
        settings json load
    */
    IsValidJSONString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    _setSettings = () => {
        const _self = this,
            settings = require('root/data/settings-live.json');

        _self.props.dispatch({ type: SET_SETTINGS, value: settings });

        Globals.AJX({ _self: _self, uri: Utils.getURL({ key: 'export', subKey: 'getExport' }), data: { "exportType": "mobiAppSettingsJson" } }, (res) => {
            const k = res['data']['html'] || '';
            if (k != '' && _self.IsValidJSONString(k)) { 
                const settings = JSON.parse(k || '{}');
                _self.props.dispatch({ type: SET_SETTINGS, value: settings });
            }
        });
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;

        _self._setSettings();
        _self._setSeg();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return null;
    }
}

function mapStateToProps(state) { return state; }
const Settings = connect(mapStateToProps)(Setting);
export { Settings };