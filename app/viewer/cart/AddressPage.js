import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Alert
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    SET_CART_INFO,
    SET_DIFFERENT_ADDRESS,
    SET_ADDRESS_ITEM,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { CheckBox } from 'root/app/form';
import Footer from './Footer';

const Translation = require('root/app/helper/Translation.js');
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

    /*
        her bir adres ve fatura seçiminde önce kargoya istek yapılır ardından ilk seçenekten cargo idsi alınıp setcart istek yapılır.
    */
    _callback = ({ type, data }) => {
        const _self = this,
            { selectedAddress = {} } = _self.props.cart,
            { shipAddress = 0, billAddress = 0 } = selectedAddress;
        console.log('SET_ADDRESS_ITEM', shipAddress);
        if (type == SET_ADDRESS_ITEM)
            _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCargo' }), data: { shipAddressId: shipAddress } }, (res) => {
                console.log(res);
                const { status, data = {} } = res,
                    { cargoes = [] } = data;
                if (status == '200' && cargoes.length > 0) {
                    const { cargoId = 0 } = cargoes[0],
                        obj = {
                            'shipAddressId': shipAddress,
                            'billAddressId': billAddress,
                            'cargoId': cargoId,
                            'cartLocation': 'delivery'
                        };
                    alert(shipAddress + ' ' + billAddress);
                    _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'setCart' }), data: obj }, (res) => {
                        console.log(res);
                    });
                }
            });
    }

    _onUpdate = () => {
        const _self = this;
        _self.child._onUpdateItem();
    }

    _onPress = () => {
        const _self = this,
            { navigation, cart = {} } = _self.props,
            { selectedAddress = {} } = cart,
            { shipAddress = 0, billAddress = 0, differentAddress = false } = selectedAddress,
            { errorShipAddress, errorBillAddress } = Translation['address'] || {};

        if (!differentAddress && shipAddress == 0) {
            Alert.alert(errorShipAddress);
            return false;
        } else if (differentAddress && billAddress == 0) {
            Alert.alert(errorBillAddress);
            return false;
        }

        if (navigation)
            navigation.navigate('Payment', {});
    }

    _onCheckBoxChange = ({ value = false }) => {
        /* fatura farklı adres */
        const _self = this;
        _self.props.dispatch({ type: SET_DIFFERENT_ADDRESS, value: value });
    }

    _getView = () => {
        const _self = this,
            { loaded = false } = _self.state,
            { selectedAddress = {} } = _self.props.cart,
            { differentAddress = false } = selectedAddress,
            checkboxConfig = {
                desc: 'Faturayı başka adrese gönder.',
                value: differentAddress
            };

        let view = null;
        //if (loaded)
        view = (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, marginBottom: 125, }}>
                    <Viewer scrollEnabled={false} onRef={ref => (_self.child = ref)} style={{ paddingLeft: 10, paddingRight: 10, }} config={DATA} callback={this._callback} />
                    <CheckBox closed={true} callback={_self._onCheckBoxChange} data={checkboxConfig} />
                </ScrollView>
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