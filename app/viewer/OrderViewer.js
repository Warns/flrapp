import React, { Component } from 'react';
import {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    Image,
} from 'react-native';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

class Buttons extends Component {
    constructor(props) {
        super(props);
    }
    _onPressButton = () => {
        const { onPress } = this.props;
        if (onPress)
            onPress();
    }
    render() {
        return (
            <TouchableOpacity onPress={this._onPressButton} activeOpacity={0.8}>
                <View style={{ borderColor: '#666666', borderWidth: 1, borderRadius: 3, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Bold', fontSize: 14 }}>{this.props.children}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class OrderViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {}
        }
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
        _self.setAjx({ uri: _self.getUri(), data: _self._getData() });
    }

    /* https://medium.com/@TaylorBriggs/your-react-component-can-t-promise-to-stay-mounted-e5d6eb10cbb */
    componentWillUnmount() {
        this._isMounted = false;
    }

    _getData = () => {
        const { orderId, orderNo, } = this.props.data.data;
        return { orderId: orderId, orderNo: orderNo };
    }

    getUri = () => {
        return Utils.getURL({ key: 'order', subKey: 'getOrderDetail' });
    }

    setAjx = ({ uri, data = {} }, callback) => {
        const _self = this;

        Globals.AJX({ _self: _self, uri: uri, data: data }, function (res) {

            //console.log(res);

            _self.setState({ data: res.data.order });

            if (typeof callback !== 'undefined')
                callback();
        });
    }

    _getValue = ({ key, value }) => {
        const prc = ['totalPriceWithoutProm', 'shippingTotal', 'totalPrice'], /* TL simgesi alacak alanlar */
            bold = ['totalPrice'], /* bold olan alanlar */
            fontFamily = bold.includes(key) ? 'Bold' : 'Regular';

        if (prc.includes(key))
            value = Utils.getPriceFormat(value);

        return <Text style={{ flex: 2, fontFamily: fontFamily, fontSize: 16, }}>{value}</Text>
    }

    _getTemplate = ({ keys = [], data = {}, style = {}, defValue = '-' }) => {
        const _self = this,
            arr = [],
            total = keys.length;

        keys.map((key, index) => {
            const title = Translation['orders'][key],
                value = _self._getValue({ value: data[key] || defValue, key: key }),
                view = (
                    <View key={index} style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }, { ...style }]}>
                        <Text style={{ flex: 1.3, fontFamily: 'RegularTyp2', fontSize: 13, color: '#9b9b9b' }}>{title}</Text>
                        {value}
                    </View>
                );
            arr.push(view);
        });
        return arr;
    }

    _getProducts = () => {
        const _self = this,
            products = _self.state.data.products;

        return products.map((value, index) => {
            const { productName, smallImageUrl, shortName, unitCode, quantity, salePriceWithoutPromTotal } = value,
                view = (
                    <View key={index} style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 20, paddingRight: 20, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, }}>
                        <View style={{ width: 60, justifyContent: 'center', }}>
                            <Image
                                style={{ height: 60 }}
                                source={{ uri: smallImageUrl }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View>
                                <Text style={{ fontFamily: 'Medium', fontSize: 15 }}>{productName}</Text>
                                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{shortName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 12 }}>{quantity} {unitCode}</Text>
                                <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(salePriceWithoutPromTotal)}</Text>
                            </View>
                        </View>
                    </View>
                );
            return view;
        });

    }

    _getCargoButton = () => {
        const _self = this,
            data = _self.state.data;
        let view = null;
        if (data['cargo'].length > 0)
            view = (
                <View style={{ paddingLeft: 20, paddingRight: 20, marginTop: 24 }}>
                    <Buttons>{Translation['orders']['buttonCargoFollow']}</Buttons>
                </View>
            );

        return view;
    }

    _getView = () => {
        const _self = this,
            data = _self.state.data;
        let view = null;
        if (Object.keys(data).length > 0)
            view = (
                <ScrollView style={{ paddingLeft: 10, paddingRight: 10, }}>
                    <View style={{ paddingLeft: 10, paddingRight: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, paddingBottom: 30 }}>
                        {_self._getTemplate({
                            keys:
                                ['orderNo', 'paymentType', 'bankName', 'cargoName', 'orderDate', 'status', 'currency'], data: data
                        })}
                        {_self._getTemplate({ keys: ['cargoKey'], data: data['cargo'][0] })}
                        {_self._getTemplate({ keys: ['shipAddressText', 'billAddressText'], data: data, style: { alignItems: 'flex-start' } })}
                        {_self._getCargoButton()}
                    </View>
                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 20, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, }}>
                        {_self._getTemplate({ keys: ['vatExcludingTotal', 'vat', 'totalPriceWithoutProm', 'shippingTotal', 'totalPrice'], data: data, defValue: 0 })}
                    </View>
                    <View>
                        {_self._getProducts()}
                    </View>
                </ScrollView>

            );

        return view;
    }

    render() {
        const _self = this;
        return _self._getView();
    }
}

export { OrderViewer };