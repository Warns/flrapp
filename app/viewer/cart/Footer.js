import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { connect } from 'react-redux';
import { ElevatedView } from 'root/app/components/';
import { Form } from 'root/app/form';
import { LoadingButton } from 'root/app/UI';
import {
    ICONS,
    FORMDATA,
} from 'root/app/helper/Constant';
const Utils = require('root/app/helper/Global.js');

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCoupon: false
        };
    }

    _onFormCallback = (obj) => {
        const _self = this,
            { onCouponCallback } = _self.props;
        if (onCouponCallback)
            onCouponCallback(obj);
    }

    _onPress = () => {
        const _self = this,
            { onPress } = _self.props;
        if (onPress)
            onPress();
    }

    _onShowCoupon = () => {
        const _self = this,
            { expand } = _self.props,
            { showCoupon = false } = _self.state;
        _self.setState({ showCoupon: !showCoupon });

        if (expand)
            expand(!showCoupon);
    }

    _getCouponCode = () => {
        const _self = this,
            { cartInfo = {} } = _self.props.cart,
            { couponCode = null } = cartInfo;

        return couponCode || '';
    }

    _getForm = () => {
        const _self = this,
            { showCoupon = false } = _self.state,
            { coupon = false } = _self.props.data;
        let view = null;
        if (coupon && showCoupon) {
            const data = FORMDATA['useCoupon'];
            data['fields'][0]['items'][0]['value'] = _self._getCouponCode();

            view = (
                <Form scrollEnabled={false} style={{ marginTop: 10, marginBottom: 10, paddingLeft: 0, paddingRight: 0, paddingBottom: 0, flexDirection: 'row', }} data={data} callback={this._onFormCallback} />
            );
        }

        return view;
    }

    _getFormButton = () => {
        const _self = this,
            { showCoupon = false } = _self.state,
            { coupon = false } = _self.props.data,
            ico = showCoupon ? 'upArrow' : 'bottomArrow';

        let txt = 'Promosyon Kodu';
        if (showCoupon) {
            const couponCode = _self._getCouponCode();
            if (couponCode != '')
                txt = 'Bu promosyon kodunu girdiniz:';
        }

        let view = null;
        if (coupon)
            view = (
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.8} onPress={_self._onShowCoupon}>
                    <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13, marginRight: 12 }}>{txt}</Text>
                    <Image
                        style={{ width: 9, height: 5 }}
                        source={ICONS[ico]}
                    />
                </TouchableOpacity>
            );
        return view;
    }

    _getFoot = () => {
        const _self = this,
            { showCoupon = false } = _self.state,
            { coupon = false } = _self.props.data,
            { cartInfo = {}, } = _self.props.cart,
            { subTotal = 0, discountTotal = 0, netTotal = 0 } = cartInfo,
            form = _self._getForm(),
            formButton = _self._getFormButton(),
            prc = (
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'Bold', fontSize: 15 }}>TOPLAM: {Utils.getPriceFormat(netTotal)}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13 }}>İNDİRİM: {Utils.getPriceFormat(discountTotal)}, </Text>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13 }}>ARA TOPLAM: {Utils.getPriceFormat(subTotal)}</Text>
                    </View>
                </View>
            );

        let view = (
            <View style={{ flexDirection: 'row', width: '100%', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ width: '50%', alignItems: 'flex-start' }}>{formButton}</View>
                <View style={{ width: '50%', alignItems: 'flex-end' }}>{prc}</View>
            </View>
        );

        if (coupon && showCoupon)
            view = (
                <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10 }}>
                    <View style={{ width: '100%', alignItems: 'flex-start' }}>{formButton}</View>
                    <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, }}>{form}</View>
                    <View style={{ width: '100%', alignItems: 'flex-end' }}>{prc}</View>
                </View>
            );

        return view;
    }

    render() {
        const _self = this,
            { buttonText = '' } = _self.props.data,
            { cartNoResult = false } = _self.props.cart,
            buttonStyle = cartNoResult ? { backgroundColor: '#999999' } : { backgroundColor: '#000000' };

        return (
            <ElevatedView
                elevation={6}
                style={{
                    position: 'absolute',
                    width: '100%',
                    left: 0,
                    bottom: 0
                }}>

                <View style={{ backgroundColor: '#FFFFFF', width: '100%', paddingLeft: 20, paddingRight: 20, paddingBottom: 7 }}>
                    {_self._getFoot()}
                    <View>
                        <LoadingButton style={buttonStyle} onPress={_self._onPress}>{buttonText}</LoadingButton>
                    </View>
                </View>
            </ElevatedView>
        );
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(Main);