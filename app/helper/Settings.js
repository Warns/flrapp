import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SET_SETTINGS } from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
        /*
        Globals.AJX({ _self: _self, uri: _self.getUri(), data: { "exportType": "mobiAppSettingsJson" } }, (res) => {
            const settings = JSON.parse(res['data']['html'] || '{}');
            _self.props.dispatch({ type: SET_SETTINGS, value: settings });
        });
        */
       const settings = require('root/data/settings.json');
       _self.props.dispatch({ type: SET_SETTINGS, value: settings });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getUri = () => {
        return Utils.getURL({ key: 'export', subKey: 'getExport' })
    }

    render() {
        return null;
    }
}

function mapStateToProps(state) { return state; }
const Settings = connect(mapStateToProps)(Setting);
export { Settings };