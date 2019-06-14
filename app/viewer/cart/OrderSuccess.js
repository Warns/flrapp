import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
} from 'react-native';
import { connect } from 'react-redux';
import {
    ICONS,
    ASSISTANT_SHOW,
    NAVIGATE,
    SET_MENU_TYPE,
} from 'root/app/helper/Constant';
import {
    BoxButton
} from 'root/app/UI';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const _self = this;
        _self.props.dispatch({ type: ASSISTANT_SHOW, value: false });
    }

    componentWillUnmount() {
        const _self = this;
        _self.props.dispatch({ type: ASSISTANT_SHOW, value: true });
    }

    _onGotoHome = () => {
        const _self = this,
        obj = {
            "item": {
                "data": {},
                "itemType": "order",
                "keys": {
                    "arr": "orders",
                    "id": "orderId",
                },
                "navigation": "ExtraUser",
                "title": "SİPARİŞLERİM",
                "type": "listViewer",
                "uri": {
                    "key": "order",
                    "subKey": "getOrder",
                }
            }
        };
        _self.props.dispatch({ type: SET_MENU_TYPE, value: 'user' });
        _self.props.dispatch({ type: NAVIGATE, value: obj });
        
        //_self.props.dispatch({ type: NAVIGATE, value: { item: { navigation: 'Home' } } });
    }

    render() {
        const _self = this,
            { orderSuccessMessage = '' } = _self.props.cart;
        return (
            <View
                style={{ flex: 1, alignItems: 'center', position: 'relative' }}>
                <Image
                    style={{ width: '100%', height: 40, position: 'absolute', zIndex: 2, top: 0, left: 0, right: 0, justifyContent: 'center', resizeMode: 'contain' }}
                    source={ICONS['orderSuccessIcon']}
                />
                <Image
                    style={{ width: '100%', height: 155, marginTop: -60 }}
                    source={ICONS['orderSuccessRect']}
                />

                <Image
                    style={{ flex: 1, resizeMode: 'contain' }}
                    source={ICONS['orderSuccessTxt']}
                />

                <Image
                    style={{ flex: 1, resizeMode: 'contain' }}
                    source={ICONS['orderSuccessImg']}
                />

                <View style={{ flex: 1, marginLeft: 50, marginRight: 50, }}>
                    <Text style={{ paddingTop: 20, paddingBottom: 20, fontSize: 16, fontFamily: 'Regular', textAlign: 'center' }}>{orderSuccessMessage}</Text>
                    <BoxButton wrapperStyle={{ height: 48, }} callback={_self._onGotoHome}>SİPARİŞLERİM</BoxButton>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) { return state }
const OrderSuccess = connect(mapStateToProps)(Main);
export { OrderSuccess };