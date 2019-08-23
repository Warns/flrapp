import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
} from 'react-native';
import { Viewer, Foot } from 'root/app/viewer/';
import {
    CART_FOOTER_MARGIN_BOTTOM,
    CART_BACKGROUND_COLOR_1,
    CART_BACKGROUND_COLOR_2,
    SET_PAYMENT,
    SET_ORDER_SUCCESS_MESSAGE,
    SET_CART_ITEMS,
    SHOW_PRELOADING,
    SET_USER_POINTS,
    SET_EXTRA_POINT
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import Footer from './Footer';
import { store } from 'root/app/store';
import UnderSide from './UnderSide';
import { CheckBox } from 'root/app/form';

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
    buttonText: 'ALIŞVERİŞİ TAMAMLA',
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

    _onMessage = (obj) => {
        const _self = this,
            { status, message = '', innerMessage = '', data } = obj || {},
            { orderNo = '', successText = '', url3ds } = data || {};

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
                Alert.alert(message);
            }, 100);
        }
    }

    _sendAnalyticOrderData = (data) => {
        const _self = this,
            { cartInfo = {} } = store.getState().cart || {};
        Analytics.send({ event: Analytics.events.item_purchased, data: { ...data.data, ...cartInfo } });
    }

    _applyForm = () => {
        const _self = this,
            data = {};
        PRELOAD(true);
        globals.fetch(
            Utils.getURL({ key: 'cart', subKey: 'getCart' }),
            JSON.stringify({ cartLocation: 'payment' }), (answer) => {
                if (answer.status == 200) {
                    globals.fetch(
                        Utils.getURL({ key: 'cart', subKey: 'setCartOrder' }),
                        JSON.stringify(data), (res) => {
                            PRELOAD(false);
                            setTimeout(() => {
                                _self._onMessage(res);
                            }, 10);
                        });
                }
            });

    }

    _onPress = () => {
        const _self = this,
            { agreements, optin } = store.getState().cart,
            { bankId } = optin,
            { agreement1, agreement2 } = agreements,
            arr = [];

        if (bankId == 0)
            arr.push('Havale yapmak istediğiniz bankayı seçerek devam ediniz.');

        if (!agreement1)
            arr.push('Lütfen ön bilgilendirme formunu okuyup onaylayınız');

        if (!agreement2)
            arr.push('Lütfen satış sözleşmesini okuyup onaylayınız');

        if (arr.length > 0)
            Alert.alert(arr.join('\n'));
        else
            _self._applyForm();
    }

    _getDsc = () => {
        return (
            <Text style={{ fontSize: 12, color: '#9b9b9b', padding: 10 }}>*Havale ile sipariş verdiğinizde en geç 3 iş günü içerisinde sayfada belirtilen banka hesaplarından birine ödeme yapılmalıdır. Ödemesi gerçekleştirilen siparişler 2 iş günü içerisinde kargoya teslim edilir. Ödemenizi yaparken tam tutarı aktardığınızdan ve açıklama kısmına sipariş numaranızı yazdığınızdan emin olmalısınız. ATM üzerinden yapılan havale işlemlerinde bazı bankalar işlem ücreti alabilmektedir. Tahsil edilen bu bedel Flormar’ın sorumluluğunda değildir, detaylar ile ilgili bankanız ile irtibata geçebilirsiniz.</Text>
        );
    }

    /* 
        extra puan 
    */
    _getPoints = () => {
        const _self = this,
            { user } = store.getState().user || {},
            { points = 0 } = user;

        return points;
        //return points - (points % 5);
    }

    _getExtraPoint = () => {
        const _self = this,
            { cartInfo = {}, optin = {} } = store.getState().cart || {},
            { usePoint = 0 } = optin,
            { netTotal = 0 } = cartInfo,
            points = _self._getPoints();

        let view = null;
        if (points != 0 /*&& points <= netTotal*/) {
            const txt = points + ' TL Ekstra Puanımı Kullanmak İstiyorum';
            view = <CheckBox containerStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 0, }} closed={true} callback={_self._onChangeExtraPoint} data={{ desc: txt, value: usePoint == 1 ? true : false, updated: true }} />;
        }

        return view;
    }

    _onChangeExtraPoint = (obj) => {
        const _self = this,
            points = obj['value'] ? 1 : 0;

        store.dispatch({
            type: SET_EXTRA_POINT,
            value: points
        });
    }

    render() {

        const _self = this,
            dsc = _self._getDsc(),
            extraPoint = _self._getExtraPoint();

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
                        {dsc}
                        {extraPoint}
                        <Foot {..._self.props} />
                    </View>
                    <UnderSide wrapperStyle={{ backgroundColor: CART_BACKGROUND_COLOR_1 }} />
                </ScrollView>
                <Footer onPress={_self._onPress} data={CONFIG} />
            </View>
        );
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(BankTransfer);