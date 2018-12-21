import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    View,
    Alert,
    ScrollView,
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    SET_CART_INFO,
    ICONS,
    SET_VIEWER,
    SHOW_CUSTOM_POPUP,
    FORMDATA,
    SET_CART_PROGRESS,
    CART_FOOTER_MARGIN_BOTTOM,
    CART_BACKGROUND_COLOR_1,
    CART_BACKGROUND_COLOR_2,
    SET_INSTALLMENT,
    SET_PAYMENT,
    CREDIT_CART,
    BANK_TRANSFER,
    RESET_PAYMENT,
    SET_CREDIT_CART
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import Footer from './Footer';
import { CheckBox, Form, SelectBox } from 'root/app/form';
import { store } from 'root/app/store';
import creditCardType, { getTypeInfo, types as CardType } from 'credit-card-type';
import UnderSide from './UnderSide';

import { createMaterialTopTabNavigator } from 'react-navigation';
import { Minus99HorizontalTabs } from 'root/app/components';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

/* banka havale config */
const DATA = {
    type: 'listViewer',
    itemType: 'bank_transfer',
    uri: {
        key: 'cart',
        subKey: 'getBankTransfer'
    },
    keys: {
        id: 'bankId',
        arr: 'banks'
    },
    data: {}
};

/* footer config */
const CONFIG = {
    buttonText: 'ÖDEME YAP',
    coupon: false
};

const CONFIG_POPUP = {
    "cart": {
        "type": "scrollView",
        "itemType": "cartList",
        "viewType": "miniCart", /* viewType = minicart ise sepetteki remove ve update işlemleri gizlenecek */
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

const setAjx = ({ _self, uri, data }, callback) => {
    Globals.AJX({ _self: _self, uri: uri, data: data }, (res) => {
        const { status, message } = res;
        if (status == 200 && typeof callback !== 'undefined')
            callback(res);
    });
};

class Foot extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = (k) => {
        const _self = this;
        store.dispatch({
            type: SHOW_CUSTOM_POPUP,
            value: { visibility: true, type: SET_VIEWER, data: CONFIG_POPUP[k] || {} }
        });
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
                {agreement2}
                {agreement1}
            </View>
        );
    }
}

/* 

olmayan cart tipleri

case "visaelectron":
    kktSprId = "4";
    maxCvcLength = 3;
    break;

    case "forbrugsforeningen":
    kktSprId = "6";
    maxCvcLength = 3;
    break;
case "dankort":
    kktSprId = "7";
    maxCvcLength = 3;
    break;

case "troy":
    kktSprId = "12";
    maxCvcLength = 3;
    break;    

*/

class CrediCart extends Component {
    constructor(props) {
        super(props);
        const _self = this;
        _self.state = {
            srcCardImage: '',
            installments: []
        };
        _self.cartControl = true;

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
        console.log(JSON.stringify(visaCards));*/
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _cardType = {
        'visa': {
            src: '/scripts/keyboard/img/visa.png'
        },
        'mastercard': {
            src: '/scripts/keyboard/img/mastercard.png'
        },
        'american-express': {
            src: '/scripts/keyboard/img/amex.png'
        },
        'diners-club': {
            src: '/scripts/keyboard/img/dinersclub.png'
        },
        'discover': {
            src: '/scripts/keyboard/img/discover.png'
        },
        'jcb': {
            src: '/scripts/keyboard/img/jcb.png'
        },
        'unionpay': {
            src: '/scripts/keyboard/img/unionpay.png'
        },
        'maestro': {
            src: '/scripts/keyboard/img/maestro.png'
        }
    };

    _getCard = (value) => {
        const _self = this,
            card = (creditCardType(value) || [])[0] || {},
            { type = '' } = card,
            { src = '' } = _self._cardType[type] || {};

        /* min. 2 karekter girişinden sonra kartı göster */
        _self.setState({ srcCardImage: value.length >= 2 ? src : '' });
    }

    _getCardImage = () => {
        const _self = this,
            { srcCardImage = '' } = _self.state;
        if (srcCardImage != '')
            return (<Image
                style={{
                    position: 'absolute',
                    right: 40,
                    width: 30,
                    height: 30,
                    resizeMode: 'contain'
                }}
                source={{ uri: Utils.getImage(srcCardImage) }}
            />);
        else
            return null;
    }

    _callback = () => {

    }

    /* taksit seçenekleri */
    _getInstallmentAjx = (val) => {
        const _self = this;
        setAjx({ _self: _self, uri: Utils.getURL({ key: 'cart', subKey: 'getInstallment' }), data: { bin: val } }, (res) => {
            let { status, data = {} } = res,
                { creditCarts = [] } = data,
                { installments = [] } = creditCarts[0];

            /*installments = [
                {
                    "bankId": 231,
                    "installmentId": 1043,
                    "description": "",
                    "installmentCount": 1,
                    "monthlyPrice": 4399.01,
                    "totalPrice": 4399.01,
                    "Currency": "TL",
                    "rate": "0"
                },
                {
                    "bankId": 231,
                    "installmentId": 1001,
                    "description": "",
                    "installmentCount": 3,
                    "monthlyPrice": 1466.33666666667,
                    "totalPrice": 4399.01,
                    "Currency": "TL",
                    "rate": "0"
                },
                {
                    "bankId": 231,
                    "installmentId": 987,
                    "description": "",
                    "installmentCount": 2,
                    "monthlyPrice": 879.802,
                    "totalPrice": 4399.01,
                    "Currency": "TL",
                    "rate": "0"
                }
            ];*/

            /* tek bir taksit seçeneği varsa redux yazdır */
            if (installments.length == 1)
                _self._setInstallment(installments[0]);

            if (status == 200)
                _self.setState({ installments: installments })

        });
    }

    _getInstallmentDsc = (item) => {
        const { installmentCount = 1, monthlyPrice = '', Currency } = item;

        return installmentCount == 1 ? 'Tek Çekim' : (installmentCount + ' taksit, aylık ' + monthlyPrice.toFixed(2) + ' ' + Currency);
    }


    _getInstallmentData = (value) => {
        const _self = this,
            { installments = [] } = _self.state;
        return installments.filter((item) => {
            const { installmentId } = item;
            if (installmentId == value)
                return item;
        });
    }

    /* selectbox taksit seçeneği seçildikten sonra */
    _onChangeInstallment = (obj) => {
        const _self = this,
            { value = -1 } = obj;
        if (value != -1)
            _self._setInstallment((_self._getInstallmentData(value) || [])[0]);
        else
            _self._setInstallment({ bankId: 0, installmentId: 0 });
    }

    _setInstallment = (data) => {
        store.dispatch({ type: SET_INSTALLMENT, value: data });
    }

    _getInstallments = () => {
        let _self = this,
            { installments = [] } = _self.state;

        let view = null;

        if (installments.length > 0) {

            const values = installments.map((item) => {
                const { installmentId = '' } = item;
                return { key: _self._getInstallmentDsc(item), value: installmentId };
            });

            if (values.length > 1)
                values.unshift({ key: Translation['dropdown']['choose'], value: -1 });

            const obj = { defaultTitle: 'Taksit:', values: values, value: -1, ico: 'rightArrow', icoStyle: { width: 40, height: 40 } };

            view = <SelectBox
                fontStyle={{ fontFamily: 'Bold', fontSize: 16 }}
                showHeader={false}
                containerStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 0, }}
                wrapperStyle={{ height: 60, borderWidth: 0, borderBottomColor: '#d8d8d8', borderBottomWidth: 1, paddingLeft: 0, paddingRight: 0, }}
                closed={true}
                callback={_self._onChangeInstallment}
                data={obj}
            />
        }

        return view;
    }

    _onChangeText = (obj) => {
        const _self = this,
            { key = '', value = '' } = obj;

        if (key == 'creditCardNo') {
            const val = Utils.cleanText(value),
                count = val.length,
                num = 6;

            _self._getCard(val);

            if (count >= num && _self.cartControl) {
                _self.cartControl = false;
                _self._getInstallmentAjx(val.substr(0, num));
            } else if (count < num && !_self.cartControl) {
                _self.cartControl = true;
                _self.setState({ installments: [] });
                _self._setInstallment({ bankId: 0, installmentId: 0 });
            }
        }

        /* kredi kart bilgilerini yollama  */
        let data = {};
        data[key] = value || '';
        store.dispatch({
            type: SET_CREDIT_CART,
            value: data
        });
    }

    render() {
        const _self = this,
            installments = _self._getInstallments();

        return (
            <View style={{ flex: 1, paddingTop: 10 }}>
                {_self._getCardImage()}
                <Form
                    style={{ paddingBottom: 0 }}
                    onChangeText={_self._onChangeText}
                    callback={_self._callback}
                    data={FORMDATA['creditCart']}
                />;
                {installments}
            </View>
        );

    }
}

/* navigator BankTransfer component */
class BankTransfer extends Component {
    constructor(props) {
        super(props);
    }

    onDidFocus = () => {
        const _self = this,
            { paymentId, paymentType } = _self.props.data;
        store.dispatch({ type: SET_PAYMENT, value: { paymentId: paymentId, paymentType: paymentType } });
    }

    componentDidMount() {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            _self._Listener = navigation.addListener('didFocus', _self.onDidFocus);
        else
            _self.onDidFocus();
    }

    componentWillUnmount() {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            _self._Listener.remove();
    }

    _callback = () => {

    }

    render() {
        const _self = this;
        return (
            <Viewer
                onRef={ref => (_self.child = ref)}
                style={{ flex: 0 }}
                wrapperStyle={{ flex: 0 }}
                config={DATA}
                callback={_self._callback}
            />
        );
    }
}

/* navigator CreditCart component */
class CreditCart extends Component {
    constructor(props) {
        super(props);
    }

    onDidFocus = () => {
        const _self = this,
            { paymentId, paymentType } = _self.props.data;
        store.dispatch({ type: SET_PAYMENT, value: { paymentId: paymentId, paymentType: paymentType } });
    }

    componentDidMount() {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            _self._Listener = navigation.addListener('didFocus', _self.onDidFocus);
        else
            _self.onDidFocus();
    }

    componentWillUnmount() {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            _self._Listener.remove();
    }

    render() {
        const _self = this;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    style={{
                        flex: 1,
                        marginBottom: CART_FOOTER_MARGIN_BOTTOM,
                        backgroundColor: CART_BACKGROUND_COLOR_1,
                    }}>
                    <View style={{ flex: 1, backgroundColor: CART_BACKGROUND_COLOR_2, paddingTop: 20 }}>
                        <CrediCart />
                        <Foot {..._self.props} />
                    </View>
                    <UnderSide wrapperStyle={{ backgroundColor: CART_BACKGROUND_COLOR_1 }} />
                </ScrollView>
                <Footer onPress={_self._onPress} data={CONFIG} />
            </View>
        );
    }
}

/* create payment navigator; creditCart, bankTransfer */
class CustomHorizontalTabs extends Component {

    jumpToIndex = this.props.jumpTo;

    _onTabsPress = (obj, index) => {
        this.jumpToIndex(obj.routeName);
    }

    render() {
        const routes = this.props.navigationState.routes,
            i = this.props.navigationState.index;

        return (
            <Minus99HorizontalTabs items={routes} selected={i} callback={this._onTabsPress} />
        )
    }
}

class Navigator extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const _self = this;
        if (!Utils.isArrEqual(_self.props.payment, nextProps.payment))
            return true;

        return false;
    }

    _getComponent = ({ item, props }) => {
        const _self = this,
            { paymentType = '' } = item;

        switch (paymentType) {
            case CREDIT_CART:
                return <CreditCart {...props} data={item} />;
            case BANK_TRANSFER:
                return <BankTransfer {...props} data={item} />;
            default:
                return null;
        }
    }

    _getScreen = () => {
        const _self = this,
            { payment = [] } = _self.props,
            obj = {};

        payment.map((item, ind) => {
            const { paymentName } = item;
            obj[paymentName] = {
                screen: props => _self._getComponent({ item: item, props: props }),
                navigationOptions: {
                    title: paymentName,
                }
            }
        });

        return obj;
    }

    TabNavigator = createMaterialTopTabNavigator(
        this._getScreen(),
        {
            swipeEnabled: false,
            lazy: true,
            tabBarPosition: 'top',
            tabBarComponent: CustomHorizontalTabs,
        }
    );

    render() {
        const _self = this;
        return <_self.TabNavigator />
    }
}

/*
   1 - componentDidMount, getCart => payment
   2 - getPayment ile ödeme tiplerini çek ve tabnavigator oluştur.
*/

const Payment = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            payment: []
        };
    }

    onWillFocus = () => {
        const _self = this;
        _self.props.dispatch({ type: SET_CART_PROGRESS, value: { progress: '3/3', cartLocation: 'payment' } });
    }

    componentWillUnmount() {
        const _self = this,
            { navigation } = _self.props;

        _self._isMounted = false;

        _self.props.dispatch({ type: RESET_PAYMENT });

        if (navigation)
            _self._Listener.remove();
    }

    componentDidMount() {
        const _self = this,
            { navigation } = _self.props;

        _self._isMounted = true;

        if (navigation)
            _self._Listener = navigation.addListener('willFocus', _self.onWillFocus);

        setAjx({ _self: _self, uri: Utils.getURL({ key: 'cart', subKey: 'getCart' }), data: { cartLocation: 'payment' } }, (res) => {
            _self.props.dispatch({ type: SET_CART_INFO, value: res.data });
            setTimeout(() => { _self._getPayment(); }, 10);
        });
    }

    /* ödeme tiplerini çek ve oluştur */
    _getPayment = () => {
        const _self = this,
            { cart = {} } = _self.props,
            { cargoId = 0 } = cart.optin;

        setAjx({ _self: _self, uri: Utils.getURL({ key: 'cart', subKey: 'getPayment' }), data: { cargoId: cargoId } }, (res) => {
            const { status, data = {} } = res,
                { payments = [] } = data;
            if (status == 200)
                _self.setState({
                    payment: payments,
                    loaded: true
                });
        });
    }

    render() {
        const _self = this,
            { loaded = false, payment = [] } = _self.state;

        return loaded ? <Navigator payment={payment} /> : null;
    }
}

function mapStateToProps(state) { return state }
const PaymentPage = connect(mapStateToProps)(Payment);
export { PaymentPage };