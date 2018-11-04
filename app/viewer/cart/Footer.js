import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { ElevatedView } from 'root/app/components/';
import { Form } from 'root/app/form';
import { LoadingButton } from 'root/app/UI';
import {
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

    _getForm = () => {
        const _self = this,
            { showCoupon = false } = _self.state,
            { coupon = false } = _self.props.data;
        let view = null;
        if (coupon && showCoupon)
            view = (
                <Form scrollEnabled={false} style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0, flexDirection: 'row', }} data={FORMDATA['useCoupon']} callback={this._onFormCallback} />
            );
        return view;
    }

    _onShowCoupon = () => {
        const _self = this,
            { showCoupon = false } = _self.state;
        _self.setState({ showCoupon: !showCoupon });
    }

    _getFormButton = () => {
        const _self = this,
            { coupon = false } = _self.props.data;
        let view = null;
        if (coupon)
            view = (
                <TouchableOpacity activeOpacity={0.8} onPress={_self._onShowCoupon}>
                    <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13 }}>{'Promosyon Kodu'}</Text>
                </TouchableOpacity>
            );
        return view;
    }

    render() {
        const _self = this,
            { buttonText = '', coupon = false } = _self.props.data,
            { cartInfo = {}, cartNoResult = false } = _self.props.cart,
            { total = 0, subTotal = 0, discountTotal = 0, netTotal = 0 } = cartInfo,
            form = _self._getForm(),
            formButton = _self._getFormButton(),
            buttonStyle = cartNoResult ? { backgroundColor: '#999999' } : { backgroundColor: '#000000' };

        return (
            <ElevatedView
                elevation={4}
                style={{
                    position: 'absolute',
                    width: '100%',
                    left: 0,
                    bottom: 0
                }}>

                <View style={{ backgroundColor: '#FFFFFF', width: '100%', paddingLeft: 20, paddingRight: 20, paddingBottom: 7 }}>
                    <View style={{ width: '100%' }}>{form}</View>
                    <View style={{ flexDirection: 'row', width: '100%', paddingTop: 10, paddingBottom: 10 }}>
                        <View style={{ width: '50%' }}>
                            {formButton}
                        </View>
                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: 15 }}>TOPLAM: {Utils.getPriceFormat(netTotal)}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13 }}>İNDİRİM: {Utils.getPriceFormat(discountTotal)}, </Text>
                                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13 }}>ARA TOPLAM: {Utils.getPriceFormat(subTotal)}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <LoadingButton style={buttonStyle} onPress={_self._onPress}>{buttonText}</LoadingButton>
                    </View>
                </View>
            </ElevatedView>
        );
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(Main);;