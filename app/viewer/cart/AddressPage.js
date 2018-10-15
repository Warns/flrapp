import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    UPDATE_CART,
    SET_CART_INFO,
    DATA_LOADED,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import Footer from './Footer';

const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');
const AJX = async ({ _self, uri, data = {} }, callback) => {
    _self.setState({ loading: true });
    Globals.fetch(uri, JSON.stringify(data), (answer) => {
        if (_self._isMounted) {
            if (answer === 'error') {
                console.log('fatalllll error: could not get access token');
            } else {
                if (answer.status == 200) {
                    if (typeof callback !== 'undefined')
                        callback(answer);
                }
            }
            _self.setState({ loading: false, refreshing: false });
        }
    });
}

/* address list config */
const DATA = {
    type: 'listViewer',
    itemType: 'address',
    itemButtonType: 'cart',
    uri: {
        key: 'address',
        subKey: 'getAddress'
    },
    keys: {
        id: 'addressId',
        arr: 'addresses'
    },
    data: {
        addressId: 0
    },
    refreshing: false,
};

/* footer config */
const CONFIG = {
    buttonText: 'DEVAM ET',
    coupon: false
};

const Address = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCart' }), data: { cartLocation: 'delivery' } }, (res) => {
            _self.props.dispatch({ type: SET_CART_INFO, value: res.data });
            setTimeout(() => {
                _self.setState({ loaded: true });    
            }, 10); 
        });
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    setAjx = ({ uri, data }, callback) => {
        const _self = this;
        AJX({ _self: _self, uri: uri, data: data }, (res) => {
            const { status, message } = res;
            if (status == 200 && typeof callback !== 'undefined')
                callback(res);
        });
    }

    _callback = ({ type, data }) => {
        const _self = this;
        /*if (type === UPDATE_CART)
            console.log(data);*/
    }

    _response = ({ type, data }) => {
        const _self = this;
        /*if (type === DATA_LOADED)
            _self.props.dispatch({ type: SET_CART_INFO, value: data });*/
    }

    _onUpdate = () => {
        const _self = this;
        _self.child._onUpdateItem();
    }

    _onPress = () => {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            navigation.navigate('Address', {});
    }

    _getView = () => {
        const _self = this,
            { loaded = false } = _self.state;

        let view = null;
        //if (loaded)
            view = (
                <View style={{ flex: 1 }}>
                    <Viewer onRef={ref => (_self.child = ref)} {..._self.props} style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 125 }} config={DATA} response={this._response} callback={this._callback} />
                    <Footer onPress={_self._onPress} data={CONFIG} />
                </View>
            );
        return view;
    }

    render() {
        const _self = this,
            view = _self._getView();
        return view;
    }
}

function mapStateToProps(state) { return state }
const AddressPage = connect(mapStateToProps)(Address);
export { AddressPage }