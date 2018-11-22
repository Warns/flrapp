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
    ICONS,
    SET_CART_INFO,
    SET_DIFFERENT_ADDRESS,
    SET_ADDRESS_ITEM_CLICK,
    SET_CART_CARGO,
    DATA_LOADED,
    SET_FORM,
    SET_CART_PROGRESS,
    NEW_ADDRESS_CLICKED,
    SET_CART_ADDRESS
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { CheckBox } from 'root/app/form';
import Footer from './Footer';
import UnderSide from './UnderSide';

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

/* */
const PADDING_BOTTOM = 115;


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


    onWillFocus = () => {
        const _self = this;
        _self.props.dispatch({ type: SET_CART_PROGRESS, value: "2/3" });
    }

    componentDidMount() {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            _self._Listener = navigation.addListener('willFocus', _self.onWillFocus);

        _self._isMounted = true;

        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCart' }), data: { cartLocation: 'delivery' } }, (res) => {
            _self.props.dispatch({ type: SET_CART_INFO, value: res.data });
        });
    }

    componentWillUnmount() {
        const _self = this,
            { navigation } = _self.props;

        _self._isMounted = false;

        if (navigation)
            _self._Listener.remove();
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

    /* tek bir adres varsa seçili gelsin */
    _setSingleAddress = (data) => {
        if (data.length == 1) {
            const _self = this,
                { addressId } = data[0];
            _self.props.dispatch({ type: SET_CART_ADDRESS, value: { addressId: addressId, addressType: 'billAddress' } });
        }
    }

    _callback = (obj) => {
        const _self = this,
            { type, data = [] } = obj;

        if (type == DATA_LOADED) {
            if (data.length > 0) {
                _self._setSingleAddress(data);
                _self._getCargoAjx();
                _self.setState({ loaded: true });
            }
        } else if (type == NEW_ADDRESS_CLICKED)
            _self._onNewAddress();
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
    /* */
    _getCargoItems = () => {
        const _self = this,
            { cargoes = [] } = _self.state;

        return cargoes.map((item, order) => {
            return <CargoItem key={order} data={item} />;
        });
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

    _newAddressButton = () => {
        const _self = this;
        return (
            <View style={{ alignItems: 'flex-end', paddingTop: 23, paddingBottom: 12, marginLeft: 15, marginRight: 15 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={_self._onNewAddress}>
                    <Text style={{ fontFamily: 'Bold', fontSize: 14 }}>YENİ ADRES EKLE</Text>
                    <Image
                        source={(ICONS['plus'])}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    /* fatura farklı adres */
    _onCheckBoxChange = ({ value = false }) => {
        const _self = this;
        _self.props.dispatch({ type: SET_DIFFERENT_ADDRESS, value: value });
    }

    _differentAddressButton = () => {
        const _self = this,
            { selectedAddress = {} } = _self.props.cart,
            { differentAddress = false } = selectedAddress,
            checkboxConfig = {
                desc: 'Faturayı başka adrese gönder.',
                value: differentAddress
            };

        return <CheckBox closed={true} callback={_self._onCheckBoxChange} data={checkboxConfig} />;
    }

    /* */
    _getFoot = () => {
        const _self = this,
            { loaded = false } = _self.state,
            differentAddressButton = loaded ? _self._differentAddressButton() : null,
            cargoItems = loaded ? _self._getCargoItems() : null;

        return (
            <View style={{ padding: 30 }}>
                {differentAddressButton}
                {cargoItems}
            </View>
        );
    }

    /* */
    _getView = () => {
        const _self = this,
            { loaded = false } = _self.state,
            backgroundColor = loaded ? 'rgb(244, 236, 236)' : '#FFFFFF',
            newAddressButton = loaded ? _self._newAddressButton() : null,
            foot = loaded ? _self._getFoot() : null,
            underside = loaded ? <UnderSide wrapperStyle={{ backgroundColor: 'rgb(244, 236, 236)' }} /> : null;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{
                        flex: 1,
                        marginBottom: PADDING_BOTTOM,
                        backgroundColor: backgroundColor,
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                        {newAddressButton}
                        <Viewer
                            onRef={ref => (_self.child = ref)}
                            style={{ flex: 0 }}
                            wrapperStyle={{ flex: 0 }}
                            config={DATA}
                            callback={this._callback}
                            refreshing={true}
                        />
                        {foot}
                    </View>
                    {underside}
                </ScrollView>
                <Footer onPress={_self._onPress} data={CONFIG} />
            </View>
        );
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