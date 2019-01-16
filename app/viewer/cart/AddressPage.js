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
    SET_CART_ADDRESS,
    CARGO_CLICKED,
    CART_FOOTER_MARGIN_BOTTOM,
    CART_BACKGROUND_COLOR_1,
    CART_BACKGROUND_COLOR_2,
    RESET_CART
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
    filterData: {
        filtered: true
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

    _onPress = () => {
        const _self = this,
            { callback, data } = _self.props;
        if (callback)
            callback(data);
    }

    _radio = (b) => {
        const _self = this,
            k = b ? <View style={{ width: 8, height: 8, borderRadius: 8, backgroundColor: 'rgb(244, 74, 126)' }} /> : null;

        return (
            <View style={{ width: 18, height: 18, borderRadius: 18, borderWidth: 1, borderColor: 'rgb(130, 130, 130)', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                {k}
            </View>
        );
    }

    render() {
        const _self = this,
            { data, active = false } = _self.props,
            { price, cargoIcon, cargoName } = data,
            radio = _self._radio(active),
            prc = price == 0 ? null : <Text>{Utils.getPriceFormat(price)}</Text>;

        return (
            <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 15 }} onPress={_self._onPress}>
                {radio}
                <Image
                    style={{ resizeMode: 'contain', width: 50, height: 40, marginRight: 15 }}
                    source={{ uri: Utils.getImage(cargoIcon) }}
                />
                <Text style={{ marginRight: 15 }}>{cargoName}</Text>
                {prc}
            </TouchableOpacity>
        );
    }
}

class Cargoes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: this.props.activeId || ''
        };
    }

    _single = () => {
        const _self = this,
            { data = [] } = _self.props,
            { cargoName = '', cargoIcon = '' } = data[0];

        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, paddingRight: 10 }}>{'Siparişleriniz güvenli bir şekilde ' + cargoName + ' ile size teslim edilecektir.'}</Text>
                <Image
                    style={{ resizeMode: 'contain', width: 50, height: 50, }}
                    source={{ uri: Utils.getImage(cargoIcon) }}
                />
            </View>
        );
    }

    _callback = (data) => {
        const _self = this,
            { callback } = _self.props,
            { cargoId } = data;
        _self.setState({ activeId: cargoId });

        if (callback)
            callback({ type: CARGO_CLICKED, data: cargoId });
    }

    _multiple = () => {
        const _self = this,
            { data } = _self.props,
            { activeId } = _self.state,
            cargoes = data.map((item) => {
                const { cargoId } = item,
                    active = activeId == cargoId ? true : false;
                return <CargoItem active={active} key={cargoId} data={item} callback={_self._callback} />;
            });

        return (
            <View>
                <Text style={{ fontSize: 16, fontFamily: 'Regular' }}>{'Kargo Seç:'}</Text>
                {cargoes}
            </View>
        );
    }

    _getView = () => {
        const _self = this,
            { data = [] } = _self.props;
        return data.length == 1 ? _self._single() : _self._multiple();
    }
    render() {
        const _self = this;
        return _self._getView();
    }
}

/*
    NOT: 

    1- componentDidMount getCart - delivery tetikleniyor ve redux cart güncelleniyor.
    
    
*/

const Address = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noResult: false,
            loaded: false,
            cargoes: []
        };
    }


    onWillFocus = () => {
        const _self = this;
        _self.props.dispatch({ type: SET_CART_PROGRESS, value: { progress: '2/3', cartLocation: 'delivery' } });
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

        _self.props.dispatch({ type: RESET_CART });

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

    /* yapılan seçimlere göre cart tekrardan set etmek */
    _setCart = ({ cargoId }) => {
        const _self = this;
        _self.props.dispatch({ type: SET_CART_CARGO, value: cargoId });
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
                _self.setState({ ..._self.state, loaded: true, noResult: false });
            } else
                _self.setState({ ..._self.state, noResult: true });
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
            { optin = {} } = cart,
            { shipAddressId = 0, billAddressId = 0, differentAddress = false, cargoId = 0 } = optin,
            { errorShipAddress, errorBillAddress, errorCargo } = Translation['address'] || {};

        if (shipAddressId == 0) {
            Alert.alert(errorShipAddress);
            return false;
        } else if (differentAddress && billAddressId == 0) {
            Alert.alert(errorBillAddress);
            return false;
        } else if (cargoId == 0) {
            Alert.alert(errorCargo);
            return false;
        }

        if (navigation)
            navigation.navigate('Payment', {});
    }

    /* kargoları listele */
    _cargoClicked = ({ type, data }) => {
        const _self = this;
        _self._setCart({ 'cargoId': data });
    }

    _getCargoItems = () => {
        let _self = this,
            { cargoes = [] } = _self.state;

        return <Cargoes callback={_self._cargoClicked} data={cargoes} />
    }

    _getCargoAjx = () => {
        const _self = this,
            { optin = {} } = _self.props.cart,
            { shipAddressId = 0 } = optin;

        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCargo' }), data: { shipAddressId: shipAddressId } }, (res) => {
            let { status, data = {} } = res,
                { cargoes = [] } = data;

            /*cargoes = [
                {
                    " isPaymentAtDoor": false,
                    "cargoIcon": "http://mcdn.flormar.com.tr/images/nakLogo/nakImg170.jpg",
                    "cargoId": 170,
                    "cargoName": "Yurt İçi Kargo",
                    "isDefault": true,
                    "price": 0,
                },
                {
                    " isPaymentAtDoor": false,
                    "cargoIcon": "http://mcdn.flormar.com.tr/images/nakLogo/nakImg170.jpg",
                    "cargoId": 180,
                    "cargoName": "Aras Kargo",
                    "isDefault": false,
                    "price": 0,
                },
            ];*/

            _self.setState({ cargoes: cargoes });

            /* tek bir kargo var default seçili gelsin */
            if (status == '200' && cargoes.length > 0)
                if (cargoes.length == 1) {
                    const { cargoId = 0 } = cargoes[0];
                    _self._setCart({ 'cargoId': cargoId });
                }
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

    /* fatura farklı adres */
    _onCheckBoxChange = ({ value = false }) => {
        const _self = this;
        _self.props.dispatch({ type: SET_DIFFERENT_ADDRESS, value: value });
    }

    _differentAddressButton = () => {
        const _self = this,
            { optin = {} } = _self.props.cart,
            { differentAddress = false } = optin,
            checkboxConfig = {
                desc: 'Faturayı başka adrese gönder.',
                value: differentAddress
            };

        return (
            <View style={{ paddingBottom: 20 }}>
                <CheckBox closed={true} callback={_self._onCheckBoxChange} data={checkboxConfig} />
            </View>
        )
    }

    /* */
    _getFoot = () => {
        const _self = this,
            { loaded = false } = _self.state,
            differentAddressButton = loaded ? _self._differentAddressButton() : null,
            cargoItems = loaded ? _self._getCargoItems() : null;

        return (
            <View style={{ padding: 20, paddingTop: 10, paddingBottom: 45 }}>
                {differentAddressButton}
                {cargoItems}
            </View>
        );
    }

    /* */
    _getView = () => {
        const _self = this,
            { loaded = false, noResult = false } = _self.state,
            backgroundColor = loaded ? CART_BACKGROUND_COLOR_1 : CART_BACKGROUND_COLOR_2,
            foot = loaded ? _self._getFoot() : null,
            flexible = !loaded ? true : (noResult ? true : false),
            underside = loaded ? <UnderSide wrapperStyle={{ backgroundColor: CART_BACKGROUND_COLOR_1 }} /> : null;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{
                        flex: 1,
                        marginBottom: CART_FOOTER_MARGIN_BOTTOM,
                        backgroundColor: backgroundColor,
                    }}>
                    <View style={{ flex: 1, backgroundColor: CART_BACKGROUND_COLOR_2 }}>
                        <Viewer
                            flexible={flexible}
                            onRef={ref => (_self.child = ref)}
                            //style={{ flex: 0 }}
                            //wrapperStyle={{ flex: 0 }}
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