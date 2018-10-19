import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Alert,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    SET_CART_INFO,
    SET_DIFFERENT_ADDRESS,
    SET_ADDRESS_ITEM_CLICK,
    SET_CART_CARGO,
    DATA_LOADED,
    SET_FORM,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { CheckBox } from 'root/app/form';
import Footer from './Footer';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

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


class CargoItem extends Component {
    /*
        {
            " isPaymentAtDoor": false,
            "cargoIcon": "http://mcdn.flormar.com.tr/images/nakLogo/nakImg170.jpg",
            "cargoId": 170,
            "cargoName": "Yurt İçi Kargo",
            "isDefault": true,
            "price": 0,
        }

    */
    constructor(props) {
        super(props);
    }
    render() {
        const _self = this,
            { price, cargoIcon, cargoName, isDefault = false } = _self.props.data,
            borderColor = isDefault ? '#000000' : '#D1D1D1';



        return (
            <View style={{ borderColor: borderColor, width: 60, borderWidth: 1, justifyContent: 'center' }}>
                <Image
                    style={{ resizeMode: 'contain', width: 50, height: 50, }}
                    source={{ uri: Utils.getImage(cargoIcon) }}
                />
                <Text>{cargoName}</Text>
                <Text>{price}</Text>
            </View>
        );
    }
}

const Address = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            cargoes: []
        };
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;

        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCart' }), data: { cartLocation: 'delivery' } }, (res) => {

            _self._getCargoAjx();

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
        Globals.AJX({ _self: _self, uri: uri, data: data }, (res) => {
            const { status, message } = res;
            if (status == 200 && typeof callback !== 'undefined')
                callback(res);
        });
    }

    _getCargoAjx = (callback) => {
        const _self = this,
            { selectedAddress = {} } = _self.props.cart,
            { shipAddress = 0, billAddress = 0 } = selectedAddress;

        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCargo' }), data: { shipAddressId: shipAddress } }, (res) => {
            console.log(res);
            const { status, data = {} } = res,
                { cargoes = [] } = data;

            _self.setState({ cargoes: cargoes });

            if (status == '200' && cargoes.length > 0) {
                const { cargoId = 0 } = cargoes[0],
                    k = {
                        'shipAddressId': shipAddress,
                        'billAddressId': billAddress,
                        'cargoId': cargoId,
                        'cartLocation': 'delivery'
                    };

                _self.props.dispatch({ type: SET_CART_CARGO, value: cargoId });

                _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'setCart' }), data: k }, (res) => {
                    const { status } = res;
                    if (status == 200)
                        console.log('BAŞARILI....');


                    if (typeof callback !== 'undefined')
                        callback();
                });
            }
        });
    }

    _callback = (obj) => {
        const _self = this,
            { type } = obj;

        if (type == DATA_LOADED) return false;
        else if (type == SET_ADDRESS_ITEM_CLICK)
            _self._getCargoAjx();
        else
            _self.props.navigation.navigate('Detail', obj);
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

    /* YENI ADRESS EKLEMEK */
    _onNewAddress = () => {
        const _self = this,
            obj = {
                type: SET_FORM,
                data: {
                    itemType: 'createAddress'
                },
                refreshing: _self._onUpdate
            };

        _self.props.navigation.navigate('Detail', obj);
    }

    _getCargoItems = () => {
        const _self = this,
            { cargoes = [] } = _self.state;

        return cargoes.map((item, order) => {
            return <CargoItem key={order} data={item} />;
        });
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

                    {_self._getCargoItems()}

                    <TouchableOpacity onPress={_self._onNewAddress}>
                        <Text>YENİ ADRES EKLE +</Text>
                    </TouchableOpacity>

                    <Viewer
                        scrollEnabled={false}
                        onRef={ref => (_self.child = ref)}
                        style={{ paddingLeft: 10, paddingRight: 10, }}
                        config={DATA}
                        callback={this._callback}
                        refreshing={true}
                    />
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