import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    View,
    Alert,
    ScrollView,
} from 'react-native';
import {
    SET_CART_INFO,
    ICONS,
    SET_VIEWER,
    FORMDATA,
    SET_CART_PROGRESS,
    CART_FOOTER_MARGIN_BOTTOM,
    CART_BACKGROUND_COLOR_1,
    CART_BACKGROUND_COLOR_2
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import Footer from './Footer';
import { CheckBox, Form } from 'root/app/form';
import creditCardType, { getTypeInfo, types as CardType } from 'credit-card-type';
import UnderSide from './UnderSide';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

/* footer config */
const CONFIG = {
    buttonText: 'ÖDEME YAP',
    coupon: false
};

const CONFIG_POPUP = {
    "cart": {
        "type": "scrollView",
        "itemType": "cartList",
        "uri": { "key": "cart", "subKey": "getCart" },
        "keys": {
            "id": "cartItemId",
            "arr": "products"
        },
        "refreshing": false,
    },
    "agreement1Html": {
        "title": "MESAFELİ SATIŞ SÖZLEŞMESİ",
        "type": "webViewer",
        "uri": {
            "key": "cart",
            "subKey": "getAgreement"
        },
        "keys": {
            "arr": "agreement1Html"
        }
    },
    "agreement2Html": {
        "title": "ÖN BİLGİLENDİRME FORMU",
        "type": "webViewer",
        "uri": {
            "key": "cart",
            "subKey": "getAgreement"
        },
        "keys": {
            "arr": "agreement2Html"
        }
    }
};

class Foot extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = (k) => {
        const _self = this;
        _self.props.navigation.navigate('Detail', { type: SET_VIEWER, data: CONFIG_POPUP[k] || {} });
    }

    _getButton = ({ type, buttonName, chk = false }) => {
        const _self = this,
            checkbox = chk ? <CheckBox closed={true} callback={_self._onCheckBoxChange} data={{ desc: 'Okudum ve kabul ediyorum' }} /> : null;

        return (
            <View style={{ borderBottomColor: '#d8d8d8', borderBottomWidth: 1 }}>
                <TouchableOpacity activeOpacity={.8} onPress={_self._onPress.bind(this, type)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{buttonName}</Text>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={ICONS['rightArrow']}
                        />
                    </View>
                </TouchableOpacity>
                {checkbox}
            </View>
        );
    }

    render() {
        const _self = this,
            cart = _self._getButton({ type: 'cart', buttonName: 'Sepet özetini göster' }),
            agreement1 = _self._getButton({ type: 'agreement1Html', buttonName: 'Mesafeli satış sözleşmesi', chk: true }),
            agreement2 = _self._getButton({ type: 'agreement2Html', buttonName: 'Üyelik sözleşmesi', chk: true });
        return (
            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                {cart}
                {agreement1}
                {agreement2}  
            </View>
        );
    }
}

class CrediCart extends Component {
    constructor(props) {
        super(props);
        const _self = this;
        _self.state = {};
        _self.cartControl = true;
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _callback = () => {

    }

    _getInstallment = (val) => {
        const _self = this;
        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getInstallment' }), data: { bin: val } }, (res) => {
            alert('_getInstallment' + JSON.stringify(res));
        });
    }

    setAjx = ({ uri, data }, callback) => {
        const _self = this;
        Globals.AJX({ _self: _self, uri: uri, data: data }, (res) => {
            const { status, message } = res;
            if (status == 200 && typeof callback !== 'undefined')
                callback(res);
        });
    }

    _onChangeText = (obj) => {
        const _self = this,
            { key = '', value = '' } = obj;

        if (key == 'creditCardNo') {
            const val = Utils.cleanText(value),
                count = val.length,
                num = 6;

            if (count == num && _self.cartControl) {
                _self._getInstallment(val);
            } else if (count > num)
                _self.cartControl = false;
            else if (count < num)
                _self.cartControl = true;
        }
    }

    render() {
        const _self = this;
        return <Form onChangeText={_self._onChangeText} callback={_self._callback} data={FORMDATA['creditCart']} />;
    }
}

const Payment = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        const _self = this,
            { navigation } = _self.props;

        _self._isMounted = true;

        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCart' }), data: { cartLocation: 'payment' } }, (res) => {
            _self.props.dispatch({ type: SET_CART_INFO, value: res.data });
            setTimeout(() => {
                _self.setState({ loaded: true });
                _self._getPayment();
            }, 10);
        });

        if (navigation)
            _self._Listener = navigation.addListener('willFocus', _self.onWillFocus);

        /*
        https://github.com/braintree/credit-card-type
        https://github.com/kevva/credit-card-regex
        https://github.com/sbycrosz/react-native-credit-card-input
        

        let visaCards = creditCardType('3588228280601429');
        console.log(JSON.stringify(visaCards));

        visaCards = creditCardType('38790546741937');
        console.log(JSON.stringify(visaCards));

        visaCards = creditCardType('370218180742397');
        console.log(JSON.stringify(visaCards));
        
        visaCards = creditCardType('5536838507150030');
        console.log(JSON.stringify(visaCards));
        */
    }

    onWillFocus = () => {
        const _self = this;
        _self.props.dispatch({ type: SET_CART_PROGRESS, value: "3/3" });
    }


    componentWillUnmount() {
        const _self = this,
            { navigation } = _self.props;

        _self._isMounted = false;

        if (navigation)
            _self._Listener.remove();
    }

    _getPayment = () => {
        const _self = this,
            { cart = {} } = _self.props,
            { cargoId = 0 } = cart.postData;

        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getPayment' }), data: { cargoId: cargoId } }, (res) => {
            alert('getPayment' + JSON.stringify(res));
        });
    }

    setAjx = ({ uri, data }, callback) => {
        const _self = this;
        Globals.AJX({ _self: _self, uri: uri, data: data }, (res) => {
            const { status, message } = res;
            if (status == 200 && typeof callback !== 'undefined')
                callback(res);
        });
    }

    _getView = () => {
        const _self = this;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{
                        flex: 1,
                        marginBottom: CART_FOOTER_MARGIN_BOTTOM,
                        backgroundColor: CART_BACKGROUND_COLOR_1,
                    }}>
                    <View style={{ flex: 1, backgroundColor: CART_BACKGROUND_COLOR_2 }}>
                        <CrediCart />
                        <Foot {..._self.props} />
                    </View>
                    <UnderSide wrapperStyle={{ backgroundColor: CART_BACKGROUND_COLOR_1 }} />
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
const PaymentPage = connect(mapStateToProps)(Payment);
export { PaymentPage };