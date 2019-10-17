import React, { Component } from 'react';
import {
    View,
    ScrollView,
    WebView,
    Modal,
    Image,
    Text,
    Alert,
    Platform
} from 'react-native';
import { Viewer, CrediCart, Foot } from 'root/app/viewer/';
import {
    ICONS,
    SET_CART_PROGRESS,
    CART_FOOTER_MARGIN_BOTTOM,
    CART_BACKGROUND_COLOR_1,
    CART_BACKGROUND_COLOR_2,
    SET_PAYMENT,
    CREDIT_CART,
    BANK_TRANSFER,
    RESET_PAYMENT,
    SET_ORDER_SUCCESS_MESSAGE,
    SET_CART_ITEMS,
    SHOW_PRELOADING,
    SET_USER_POINTS,
    SET_EXTRA_POINT
} from 'root/app/helper/Constant';
import {
    cardType,
    validateCardNumber,
    validateCardCVC
} from 'root/app/helper/CreditCard';
import { MinimalHeader } from 'root/app/components';
import { connect } from 'react-redux';
import Footer from './Footer';
import { store } from 'root/app/store';
import UnderSide from './UnderSide';
import BankTransfer from './BankTransfer';
import { CheckBox } from 'root/app/form';

import { createMaterialTopTabNavigator } from 'react-navigation';
import { Minus99HorizontalTabs } from 'root/app/components';

const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');
const Analytics = require("root/app/analytics");
const PRELOAD = async (b) => {
    store.dispatch({ type: SHOW_PRELOADING, value: b });
}

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

/* navigator CreditCart component */
class CreditCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            injectScript: '',
            frm: '',
            isVisible: false,
            loading: false,
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
        form: '<body onload="setTimeout(function() { document.frm.submit() }, 200)"><form style="visibility: hidden;" name="frm" action="{{action}}" method="post">{{input}}<input type="submit" value="Submit"></form> </body>',
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

        _self.setState({ frm: htm, isVisible: true });
    }

    _onMessage = (event) => {
        const _self = this,
            obj = JSON.parse(event.nativeEvent.data || '{}'),
            { status, message = '', innerMessage = '', data } = obj || {},
            { orderNo = '', successText = '', url3ds } = data || {};

        /* işlem bitince 3d secure formunu gizleme */
        _self._onCloseModal()

        if (status == 200) {
            // success
            _self._sendAnalyticOrderData(obj);
            store.dispatch({ type: SET_ORDER_SUCCESS_MESSAGE, value: (orderNo + " no'lu " + successText) });
            store.dispatch({ type: SET_CART_ITEMS, value: 0 });
            setTimeout(() => {
                _self.props.nav.navigate('OrderSuccess', {});
            }, 10);
        } else {
            // error
            setTimeout(() => {
                if( message != '' )
                    Alert.alert(message);
            }, 500);
        }

        //const ornek = {"status":200,"message":null,"innerMessage":null,"data":{"orderNo":"SIP0151456440","successText":"Siparişiniz başarıyla alındı. Sipariş ettiğiniz ürünler en kısa sürede teslimat adresinize teslim edilecektir.","url3ds":null}}
    }

    _sendAnalyticOrderData = (data) => {
        const _self = this,
            { cartInfo = {} } = store.getState().cart || {};
        Analytics.send({ event: Analytics.events.item_purchased, data: { ...data.data, ...cartInfo } });
    }

    _onNavigationStateChange(webViewState) {
        /*
        const _self = this,
            { url } = webViewState;
        if (url.indexOf('orderProcessing/confirm3dTransaction') != -1)
            _self.setState({ injectScript: 'window.parent.postMessage(document.body.innerText);' });
        */
    }

    _onLoad = () => {
    }

    _onLoadEnd = () => {
        const _self = this;
        _self.setState({ loading: false });
    }

    _onLoadStart = () => {
        const _self = this;
        _self.setState({ loading: true });
    }

    _getFrm = () => {
        const _self = this,
            { frm = '', loading = false } = _self.state,
            pre = loading ? <View style={{ backgroundColor: '#FFFFFF', zIndex: 2, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}><Image source={ICONS['loading']} style={{ resizeMode: 'cover', width: 60, height: 60, borderRadius: 30, }} /></View> : null;

        let view = null,
        injectScript = Platform.OS === "ios" ? "if (window.location.href.indexOf('orderProcessing/confirm3dTransaction') != -1) window.parent.postMessage(document.body.innerText);" : "if (window.location.href.indexOf('orderProcessing/confirm3dTransaction') != -1) window.ReactNativeWebView.postMessage(document.body.innerText);";

        if (frm != '') {
            view = (
                <View style={{ flex: 1, backgroundColor: 'red' }}>
                    {pre}
                    <WebView
                        onLoad={_self._onLoad}
                        onLoadEnd={_self._onLoadEnd}
                        onLoadStart={_self._onLoadStart}
                        onMessage={this._onMessage}
                        injectedJavaScript={injectScript}
                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                        ref={component => (this.webview = component)}
                        scalesPageToFit={false}
                        automaticallyAdjustContentInsets={false}
                        source={{ html: frm }}
                    />
                </View>
            );
        }

        return view;
    }

    _onCloseModal = () => {
        const _self = this;
        _self.setState({ frm: '', injectScript: '', isVisible: false })
    }

    _getModal = () => {
        const _self = this,
            frm = _self._getFrm(),
            { isVisible = false } = _self.state;

        /* 3d secure modal */
        return (
            <Modal
                visible={isVisible}
                onRequestClose={() => { }}
            >
                <MinimalHeader onPress={_self._onCloseModal} title={'Sepetim'} right={<View />} />
                {frm}
            </Modal>
        )
    }

    _applyForm = () => {
        const _self = this,
            { creditCart = {}, optin = {} } = store.getState().cart,
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
        console.log('_applyForm', optin);
        PRELOAD(true);
        globals.fetch(
            Utils.getURL({ key: 'cart', subKey: 'setCart' }),
            JSON.stringify(optin), (answer) => {
                //console.log(data);
                if (answer.status == 200) {
                    globals.fetch(
                        Utils.getURL({ key: 'cart', subKey: 'getPos3DParameter' }),
                        JSON.stringify(data), (res) => {
                            PRELOAD(false);
                            if (res.status == 200) {
                                setTimeout(() => {
                                    _self._getTemplate(res);
                                }, 100);
                            }
                        });
                }
            });
    }

    _onPress = () => {
        const _self = this,
            { agreements, creditCart } = store.getState().cart,
            { installmentId = 0 } = creditCart,
            { agreement1, agreement2 } = agreements,
            arr = [];

        _self
            .child
            ._validation((b) => {
                if (!b)
                    arr.push('Lütfen kredi kartı Bilgilerini eksiksiz giriniz.');

                if (installmentId == 0)
                    arr.push('Lütfen taksit seçeneğini seçiniz.');

                if (!agreement1)
                    arr.push('Lütfen ön bilgilendirme formunu okuyup onaylayınız');

                if (!agreement2)
                    arr.push('Lütfen satış sözleşmesini okuyup onaylayınız');

                if (arr.length > 0)
                    Alert.alert(arr.join('\n'));
                else
                    _self._applyForm();
            });
    }

    render() {
        const _self = this,
            modal = _self._getModal();

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

                    <View style={{ flex: 1, backgroundColor: CART_BACKGROUND_COLOR_2, paddingTop: 20 }}>
                        <CrediCart
                            onRef={ref => (_self.child = ref)}
                        />
                        <Foot {..._self.props} />
                    </View>
                    <UnderSide wrapperStyle={{ backgroundColor: CART_BACKGROUND_COLOR_1 }} />

                    {modal}
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
                return <CreditCart nav={_self.props.nav} {...props} data={item} />;
            case BANK_TRANSFER:
                return <BankTransfer nav={_self.props.nav} {...props} data={item} />;
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
        _self.props.dispatch({ type: SET_CART_PROGRESS, value: { activeTitle: 'ÖDEME', progress: '3/3', cartLocation: 'payment' } });

        /* 
            sepet son aşamada kullanıcı puan bilgisinin güncellenmesi, site içi kullanıcı puanı için ek önlem olarak yazıldı
        */

        setAjx({ _self: _self, uri: Utils.getURL({ key: 'user', subKey: 'getUser' }), data: {} }, (res) => {
            const { status, data = {} } = res;
            if (status == 200)
                _self.props.dispatch({ type: SET_USER_POINTS, value: data['points'] || 0 });
        });
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

        return loaded ? (<Navigator nav={_self.props.navigation} payment={payment} />) : null;
    }
}

function mapStateToProps(state) { return state }
const PaymentPage = connect(mapStateToProps)(Payment);
export { PaymentPage };