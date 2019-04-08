import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Keyboard,
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    ICONS,
    DATA_LOADED,
    ASSISTANT_OPENED,
    FORMDATA
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { Form } from "root/app/form";
import { IconButton } from "root/app/UI";

const Utils = require("root/app/helper/Global.js");

/* Fırsatlar */
const DATA = {
    "title": "FIRSATLAR",
    "type": "listViewer",
    "itemType": "opportunity",
    "uri": {
        "key": "banner",
        "subKey": "getBannerList"
    },
    "siteURI": "/mobiapp-opportunity.html",
    "keys": {
        "id": "id",
        "arr": "banners",
    },
    "data": {
        "bgrCode": "7255"
    },
    "horizontal": true,
    "showsHorizontalScrollIndicator": false,
    "customFunc": "opportunity"
};

class ProductActionButton extends Component {

    _onPress = () => {
        this.props.onPress();
    };

    render() {

        let count = this.props.count ? (
            <View style={{ padding: 5, backgroundColor: '#dddddd', borderRadius: 20, height: 24, minWidth: 24, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, }}>{this.props.count}</Text>
            </View>
        ) : null;

        let icon = ICONS['rightArrow'],
            borderColor = '#D8D8D8';

        if (this.props.expanded) {
            icon = ICONS['downArrow'];
            borderColor = '#ffffff';
        }

        return (
            <TouchableOpacity activeOpacity={.8} onPress={this._onPress}>
                <View style={[{ flexDirection: 'row', borderBottomWidth: 1, borderColor: borderColor, height: 60, alignItems: 'center' }, { ...this.props.wrapperStyle }]}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.props.name}</Text>
                    {count}
                    <Image source={icon} style={{ width: 40, height: 40, resizeMode: 'contain', position: 'absolute', right: 0, top: 10, }} />
                </View>
            </TouchableOpacity>
        )
    }
}

const UnderSide = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0,
            showCoupon: false
        }
    }

    _callback = ({ type, data }) => {
        const _self = this;
        if (type === DATA_LOADED)
            _self.setState({ totalCount: data.length });
    }

    /* kupon kodu */
    _onFormCallback = obj => {
        const _self = this,
            { onCouponCallback } = _self.props;
        if (onCouponCallback) onCouponCallback(obj);

        Keyboard.dismiss();
    };

    _onShowCoupon = () => {
        const _self = this,
            { expand } = _self.props,
            { showCoupon = false } = _self.state;
        _self.setState({ showCoupon: !showCoupon });

        if (expand) expand(!showCoupon);
    };

    _getFormButton = () => {
        const _self = this,
            { cartNoResult = false } = _self.props.cart,
            { showCoupon = false } = _self.state,
            { coupon = false } = _self.props.data || {},
            ico = showCoupon ? "upArrow" : "bottomArrow";

        let txt = "Promosyon Kodu";
        if (showCoupon) {
            const couponCode = _self._getCouponCode();
            if (couponCode != "") txt = "Bu promosyon kodunu girdiniz:";
        }

        let view = null;
        if (coupon && !cartNoResult)
            view = <ProductActionButton
                wrapperStyle={{ paddingLeft: 10, marginBottom: 10, marginTop: -10  }}
                name={txt}
                expanded={showCoupon}
                onPress={_self._onShowCoupon}
            />;

        return view;
    };

    _onCouponButton = () => {
        const _self = this;

        Keyboard.dismiss();

        if (_self.child != null) _self.child._onPress();
    };

    _getCouponCode = () => {
        const _self = this,
            { cartInfo = {} } = _self.props.cart,
            { couponCode = null } = cartInfo;

        return couponCode || "";
    };

    _getForm = () => {
        const _self = this,
            { showCoupon = false } = _self.state,
            { coupon = false } = _self.props.data || {};
        let view = null;
        if (coupon && showCoupon) {
            const couponCode = _self._getCouponCode(),
                data =
                    couponCode != "" ? FORMDATA["deleteCoupon"] : FORMDATA["useCoupon"],
                ico = couponCode != "" ? "searchClose" : "button",
                passive =
                    couponCode != "" ? (
                        <View
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                left: 0,
                                top: 0,
                                zIndex: 1
                            }}
                        />
                    ) : null;

            data["fields"][0]["items"][0]["value"] = couponCode;

            view = (
                <View style={{ width: "100%", position: 'relative', marginBottom: 10, marginTop: -10 }}>
                    <View style={{ flexDirection: "row", height: 50 }}>
                        <Form
                            onRef={ref => (_self.child = ref)}
                            scrollEnabled={false}
                            style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}
                            data={data}
                            callback={this._onFormCallback}
                        />
                        {passive}
                        <IconButton
                            buttonStyle={{ zIndex: 3, borderWidth: 2 }}
                            style={{
                                width: 40,
                                height: 40,
                                position: "absolute",
                                right: 5,
                                top: 5,
                                zIndex: 3
                            }}
                            icoStyle={{ width: 40, height: 40 }}
                            ico={ico}
                            callback={_self._onCouponButton}
                        />
                    </View>
                </View>
            );
        }

        return view;
    };

    /* sepet tutar */
    _getCartItem = ({ key, value }) => {
        let _self = this,
            css = { fontFamily: 'RegularTyp2', fontSize: 15, lineHeight: 30 };
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={css}>{key}</Text>
                <Text style={css}>{value}</Text>
            </View>
        );
    }

    _getCartInfo = () => {
        const _self = this,
            { cartInfo = {} } = _self.props.cart,
            { subTotal = 0, discountTotal = 0, shippingTotal = 0, taxTotal = 0 } = cartInfo || {},
            form = _self._getForm(),
            formButton = _self._getFormButton();

        return (
            <View style={{ marginTop: 45, padding: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#FFFFFF' }}>
                {formButton}
                {form}
                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    {_self._getCartItem({ key: 'Ara toplam', value: Utils.getPriceFormat(subTotal) })}
                    {/*_self._getCartItem({ key: 'KDV', value: Utils.getPriceFormat(taxTotal) })*/}
                    {_self._getCartItem({ key: 'Kargo', value: shippingTotal == 0 ? 'ücretsiz' : Utils.getPriceFormat(shippingTotal) })}
                    {_self._getCartItem({ key: 'İndirim', value: Utils.getPriceFormat(discountTotal) })}
                </View>
            </View>
        );
    }


    /* fırsatlar */
    _getOpportunity = () => {
        const _self = this,
            { opportunity = false } = _self.props,
            { totalCount = 0 } = _self.state,
            title = totalCount == 0 ? null : (<View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>FIRSATLAR</Text>
                <Text style={{ paddingLeft: 5, fontFamily: 'Bold', fontSize: 16, color: 'rgb(255, 43, 148)' }}>{totalCount}</Text>
            </View>);

        let view = null;

        if (opportunity)
            view = (
                <View>
                    {title}
                    <Viewer callback={_self._callback} wrapperStyle={{ marginBottom: 25 }} config={DATA} />
                </View>
            );

        return view;
    }

    _onAssistanClick = () => {
        const _self = this;
        _self.props.dispatch({ type: ASSISTANT_OPENED, value: true });
    }

    _getView = () => {
        const _self = this;

        return (
            <View style={{ paddingTop: 20, flex: 1 }}>

                {_self._getOpportunity()}

                <TouchableOpacity activeOpacity={0.8} onPress={_self._onAssistanClick}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}>
                        <View style={{ width: 50, height: 50, backgroundColor: '#FFFFFF', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ width: 40, height: 40, resizeMode: 'contain' }}
                                source={ICONS['asistanButton']}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: 15, fontWeight: 'bold' }}>Yardım ister misin?</Text>
                            <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15 }}>Aklına takılan sorular ile ilgili satış temsilcimiz ile iletişıme geçebilirsin.</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {_self._getCartInfo()}
            </View>
        );
    }

    render() {
        const _self = this,
            { cartNoResult = false } = _self.props.cart,
            view = cartNoResult ? null : _self._getView();
        return view;
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(UnderSide);