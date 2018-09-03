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
        _self.ajx({ uri: _self.getUri(), data: { "exportType": "mobiAppSettingsJson" } }, (res) => {
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

    ajx = ({ uri, data = {} }, callback) => {
        const _self = this;
        _self.setState({ loading: true });
        Globals.fetch(uri, JSON.stringify(data), (answer) => {
            if (_self._isMounted) {
                if (answer === 'error') {
                    console.log('fatalllll error: could not get access token');
                } else {
                    if (answer.status == 200) {
                        if (typeof callback !== 'undefined')
                            callback(answer);
                    } else {

                    }
                }
                _self.setState({ loading: false });
            }
        });
    }

    render() {
        return null;
    }
}

function mapStateToProps(state) { return state; }
const Settings = connect(mapStateToProps)(Setting);
export { Settings };