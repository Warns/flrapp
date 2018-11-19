import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    UPDATE_CART,
    SET_CART_INFO,
    DATA_LOADED,
    SET_CART_NO_RESULT,
    RESET_CART,
    SET_CART_PROGRESS,
    ASSISTANT_SHOW,
    SET_CART_ITEMS,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import Footer from './Footer';
import UnderSide from './UnderSide';

const DATA = {
    type: 'scrollView',
    itemType: 'cartList',
    uri: { key: 'cart', subKey: 'getCart' },
    keys: {
        id: 'cartItemId',
        arr: 'products',
    },
    refreshing: false,
};

/* footer config */
const CONFIG = {
    buttonText: 'ALIŞVERİŞİ TAMAMLA',
    coupon: true,
    opportunity: true
};

const Cart = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paddingBottom: 125
        };
    }

    onWillFocus = () => {
        const _self = this;
        _self.props.dispatch({ type: SET_CART_PROGRESS, value: "1/3" });
    }

    componentDidMount() {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            _self._Listener = navigation.addListener('willFocus', _self.onWillFocus);

        _self.props.dispatch({ type: ASSISTANT_SHOW, value: false });
    }

    componentWillUnmount() {
        const _self = this,
            { navigation } = _self.props;

        _self.props.dispatch({ type: RESET_CART });

        if (navigation)
            _self._Listener.remove();


        _self.props.dispatch({ type: ASSISTANT_SHOW, value: true });
    }

    _callback = ({ type, data }) => {
        const _self = this;
        /*if (type === UPDATE_CART)
            console.log(data);*/
    }

    _response = ({ type, data }) => {
        const _self = this;
        if (type === DATA_LOADED) {
            _self.props.dispatch({ type: SET_CART_ITEMS, value: Utils.getCartCount(data || {}) });
            _self.props.dispatch({ type: SET_CART_INFO, value: data });
        }
    }

    _onUpdate = () => {
        const _self = this;
        _self.child._onUpdateItem();
    }

    _onPress = () => {
        const _self = this,
            { navigation } = _self.props;

        /*if (navigation)
            navigation.navigate('Address', {});*/
    }

    _onCouponCallback = ({ type, data = {} }) => {
        const _self = this,
            { status } = data;
        if (status == 200)
            _self._onUpdate();
    }

    _noResult = () => {
        const _self = this;
        _self.props.dispatch({ type: SET_CART_NO_RESULT, value: true });
    }

    _onExpand = (b) => {
        const _self = this,
            paddingBottom = b ? 200 : 125;

        _self.setState({ paddingBottom: paddingBottom });
    }

    render() {
        const _self = this,
            { paddingBottom } = _self.state,
            { cartNoResult = false } = _self.props.cart,
            backgroundColor = cartNoResult ? '#FFFFFF' : 'rgb(244, 236, 236)';
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{
                        flex: 1,
                        marginBottom: paddingBottom,
                        backgroundColor: backgroundColor
                    }}>
                    <Viewer
                        noResult={_self._noResult}
                        onRef={ref => (_self.child = ref)}
                        {..._self.props}
                        config={DATA}
                        response={this._response}
                        callback={this._callback}
                        wrapperStyle={{ backgroundColor: backgroundColor }}
                        style={{ backgroundColor: '#FFFFFF' }}
                    />
                    <UnderSide opportunity={CONFIG['opportunity']} />
                </ScrollView>
                <Footer expand={_self._onExpand} onCouponCallback={_self._onCouponCallback} onPress={_self._onPress} data={CONFIG} />
            </View>
        )
    }
}

function mapStateToProps(state) { return state }
const CartPage = connect(mapStateToProps)(Cart);
export { CartPage }