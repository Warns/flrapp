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
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import Footer from './Footer';
import { CheckBox } from 'root/app/form';

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

/* footer config */
const CONFIG = {
    buttonText: 'ÖDEME YAP',
    coupon: false
};


const popup = [

    {
        "title": "MESAFELİ SATIŞ SÖZLEŞMESİ",
        "type": "webViewer",
        "uri": {
            "key": "cart",
            "subKey": "getAgreement"
        },
        "keys": {
            "arr": "agreement1Html"
        },
        "data": {}
    },

    {
        "title": "ÖN BİLGİLENDİRME FORMU",
        "type": "webViewer",
        "uri": {
            "key": "cart",
            "subKey": "getAgreement"
        },
        "keys": {
            "arr": "agreement2Html"
        },
        "data": {}
    }
];

class Foot extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        const _self = this;
        alert( JSON.stringify({ type: SET_VIEWER, data: popup[0] }) )
        _self.props.navigation.navigate('Detail', { });
    }

    render() {
        const _self = this;

        return (
            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                <View style={{ borderBottomColor: '#d8d8d8', borderBottomWidth: 1 }}>
                    <TouchableOpacity activeOpacity={.8} onPress={_self._onPress}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{'Sepet özetini göster'}</Text>
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={ICONS['rightArrow']}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ borderBottomColor: '#d8d8d8', borderBottomWidth: 1 }}>
                    <TouchableOpacity activeOpacity={.8} onPress={_self._onPress}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{'Üyelik sözleşmesi'}</Text>
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={ICONS['rightArrow']}
                            />
                        </View>
                    </TouchableOpacity>

                    <CheckBox closed={true} callback={_self._onCheckBoxChange} data={{ desc: 'Okudum ve kabul ediyorum' }} />

                </View>

                <View style={{ borderBottomColor: '#d8d8d8', borderBottomWidth: 1 }}>
                    <TouchableOpacity activeOpacity={.8} onPress={_self._onPress}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{'Mesafeli satış sözleşmesi'}</Text>
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={ICONS['rightArrow']}
                            />
                        </View>
                    </TouchableOpacity>
                    <CheckBox closed={true} callback={_self._onCheckBoxChange} data={{ desc: 'Okudum ve kabul ediyorum' }} />
                </View>
            </View>
        );
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
        const _self = this;
        _self._isMounted = true;
        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getCart' }), data: { cartLocation: 'payment' } }, (res) => {
            _self.props.dispatch({ type: SET_CART_INFO, value: res.data });
            setTimeout(() => {
                _self.setState({ loaded: true });
                _self._getPayment();
            }, 10);
        });
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _getPayment = () => {
        const _self = this,
            { cart = {} } = _self.props,
            { cargoId = 0 } = cart.postData;

        _self.setAjx({ uri: Utils.getURL({ key: 'cart', subKey: 'getPayment' }), data: { cargoId: cargoId } }, (res) => {
            console.log(res);
        });
    }

    setAjx = ({ uri, data }, callback) => {
        const _self = this;
        AJX({ _self: _self, uri: uri, data: data }, (res) => {
            const { status, message } = res;
            if (status == 200 && typeof callback !== 'undefined')
                callback(res);
        });
    }

    _getView = () => {
        const _self = this,
            { loaded = false } = _self.state;

        let view = null;
        //if (loaded)
        view = (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, marginBottom: 125, }}>
                    <Foot {..._self.props} />
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
const PaymentPage = connect(mapStateToProps)(Payment);
export { PaymentPage };