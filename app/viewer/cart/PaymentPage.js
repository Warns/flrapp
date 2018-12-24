import React, { Component } from 'react';
import {
    View,
    ScrollView,
    WebView,
} from 'react-native';
import { Viewer, CrediCart, Foot } from 'root/app/viewer/';
import {
    SET_CART_PROGRESS,
    CART_FOOTER_MARGIN_BOTTOM,
    CART_BACKGROUND_COLOR_1,
    CART_BACKGROUND_COLOR_2,
    SET_PAYMENT,
    CREDIT_CART,
    BANK_TRANSFER,
    RESET_PAYMENT,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import Footer from './Footer';
import { store } from 'root/app/store';
import UnderSide from './UnderSide';

import { createMaterialTopTabNavigator } from 'react-navigation';
import { Minus99HorizontalTabs } from 'root/app/components';

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

const setAjx = ({ _self, uri, data }, callback) => {
    Globals.AJX({ _self: _self, uri: uri, data: data }, (res) => {
        const { status, message } = res;
        if (status == 200 && typeof callback !== 'undefined')
            callback(res);
    });
};

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
                        <Viewer
                            onRef={ref => (_self.child = ref)}
                            style={{ flex: 0 }}
                            wrapperStyle={{ flex: 0 }}
                            config={DATA}
                            callback={_self._callback}
                        />
                        <Foot {..._self.props} />
                    </View>
                    <UnderSide wrapperStyle={{ backgroundColor: CART_BACKGROUND_COLOR_1 }} />
                </ScrollView>
                <Footer onPress={_self._onPress} data={CONFIG} />
            </View>
        );
    }
}

/* navigator CreditCart component */
class CreditCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frm: '<body onload="setTimeout(function() { document.frm.submit() }, 500)"><form name="frm" action="https://entegrasyon.asseco-see.com.tr/fim/est3Dgate" method="post"><input type="text" name="formName" value="pay_form">,<input type="text" name="okUrl" value="https://dev.flormar.com.tr/webapi/v3/orderProcessing/confirm3dTransaction?op=success&alv=65440">,<input type="text" name="failUrl" value="https://dev.flormar.com.tr/webapi/v3/orderProcessing/confirm3dTransaction?op=fail&alv=65440">,<input type="text" name="clientid" value="100100000">,,<input type="text" name="currency" value="949">,<input type="text" name="oid" value="">,<input type="text" name="storetype" value="3d">,<input type="text" name="lang" value="tr">,<input type="text" name="rnd" value="24.12.2018 16:40:46">,<input type="text" name="hash" value="oHgq66ntuGEHjJdsnWUGYaVyMs8=">,<input type="text" name="amount" value="27,99">,<input type="text" name="pan" value="5571135571135575">,<input type="text" name="cv3" value="000">,<input type="text" name="Ecom_Payment_Card_ExpDate_Year" value="2018">,<input type="text" name="Ecom_Payment_Card_ExpDate_Month" value="12">,<input type="text" name="cardType" value="2"><input type="submit" value="Submit"></form> </body>'
        };
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

    _template = {
        form: '<body onload="setTimeout(function() { document.frm.submit() }, 500)"><form name="frm" action="{{action}}" method="post">{{input}}<input type="submit" value="Submit"></form> </body>',
        input: '<input type="text" name="{{name}}" value="{{value}}">'
    };

    _getTemplate = (obj) => {
        let formUrl = '';

        const _self = this,
            { posParameters = [] } = obj.data,
            input = posParameters.map((item) => {
                const { key, value } = item;
                if (key != 'formUrl')
                    return _self._template['input'].replace(/{{name}}/g, key).replace(/{{value}}/g, value);
                else
                    formUrl = value;
            }),
            htm = _self._template['form'].replace(/{{action}}/g, formUrl).replace(/{{input}}/g, input);

        _self.setState({ frm: htm });
        console.log('_getTemplate', htm);
    }

    _onPress = () => {
        const _self = this,
            { creditCart = {} } = store.getState().cart,
            { bankId = 0, fullName = '', creditCardNo = '', cvcCode = '', installmentId } = creditCart,
            date = (creditCart['year'] || '0/0').split('/'),
            month = date[0] || 0,
            year = date[1] || 0,
            data = {
                bankId: bankId,
                fullName: fullName,
                creditCardNo: creditCardNo.replace(/\s+/g, ''),
                cvcCode: cvcCode,
                year: '20' + year,
                month: month,
                installmentId: installmentId,
                userClientIp: '0.0.0.0'
                //"customRedirectUrl": "string"
            };

        globals.fetch(
            Utils.getURL({ key: 'cart', subKey: 'getCart' }),
            JSON.stringify({ cartLocation: 'payment' }), (answer) => {
                console.log(data);
                if (answer.status == 200) {
                    globals.fetch(
                        Utils.getURL({ key: 'cart', subKey: 'getPos3DParameter' }),
                        JSON.stringify(data), (res) => {
                            if (res.status == 200)
                                _self._getTemplate(res);
                        });
                }
            });
    }

    _getFrm = () => {
        const _self = this,
            { frm = '' } = _self.state;

        let view = null;
        if (frm != '') {
            view = (
                <View style={{ flex: 1, height: 300, backgroundColor: 'red' }}>
                    <WebView
                        scalesPageToFit={false}
                        automaticallyAdjustContentInsets={false}
                        source={{ html: frm }}
                    />
                </View>
            );
        }

        return view;
    }

    render() {
        const _self = this,
            frm = _self._getFrm();
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    style={{
                        flex: 1,
                        marginBottom: CART_FOOTER_MARGIN_BOTTOM,
                        backgroundColor: CART_BACKGROUND_COLOR_1,
                    }}>
                    {frm}
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

        _self._getPayment();
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

        return loaded ? (<Navigator payment={payment} />) : null;
    }
}

function mapStateToProps(state) { return state }
const PaymentPage = connect(mapStateToProps)(Payment);
export { PaymentPage };