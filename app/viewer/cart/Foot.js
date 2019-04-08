import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    View,
    ScrollView,
} from 'react-native';
import {
    ICONS,
    SET_VIEWER,
    SHOW_CUSTOM_POPUP,
    SET_AGREEMENT
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { CheckBox } from 'root/app/form';
import { store } from 'root/app/store';

const CONFIG_POPUP = {
    "cart": {
        "type": "scrollView",
        "itemType": "cartList",
        "viewType": "miniCart", /* viewType = minicart ise sepetteki remove ve update işlemleri gizlenecek */
        "uri": { "key": "cart", "subKey": "getCart" },
        "keys": {
            "id": "cartItemId",
            "arr": "products"
        },
        "refreshing": false,
    },
    "agreement1": {
        "title": "MESAFELİ SATIŞ SÖZLEŞMESİ",
        "type": "webViewer",
        "uri": {
            "key": "cart",
            "subKey": "getAgreement"
        },
        "keys": {
            "arr": "agreement1Html"
        },
        "customClass": "ems-page-payment",
    },
    "agreement2": {
        "title": "ÖN BİLGİLENDİRME FORMU",
        "type": "webViewer",
        "uri": {
            "key": "cart",
            "subKey": "getAgreement"
        },
        "keys": {
            "arr": "agreement2Html"
        },
        "customClass": "ems-page-payment",
    }
};

class Main extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = (k) => {
        const _self = this;
        store.dispatch({
            type: SHOW_CUSTOM_POPUP,
            value: { visibility: true, type: SET_VIEWER, data: CONFIG_POPUP[k] || {} }
        });
    }

    _onCheckBoxChange = (obj) => {
        const data = {};
        data[obj['key']] = obj['value'];
        store.dispatch({
            type: SET_AGREEMENT,
            value: data
        });
    }

    _getButton = ({ type, buttonName, chk = false }) => {
        const _self = this,
            { agreements = {} } = _self.props.cart,
            checkbox = chk ? <CheckBox closed={true} callback={_self._onCheckBoxChange} data={{ id: type, desc: 'Okudum ve kabul ediyorum', value: agreements[type] || false, updated: true }} /> : null;

        return (
            <View style={{ borderBottomColor: '#d8d8d8', borderBottomWidth: 1 }}>
                <TouchableOpacity activeOpacity={.8} onPress={_self._onPress.bind(this, type)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{buttonName}</Text>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={ICONS['rightArrow']}
                        />
                    </View>
                </TouchableOpacity>
                {checkbox}
            </View>
        );
    }

    render() {
        const _self = this,
            cart = _self._getButton({ type: 'cart', buttonName: 'Sepet özetini göster' }),
            agreement1 = _self._getButton({ type: 'agreement1', buttonName: 'Mesafeli satış sözleşmesi', chk: true }),
            agreement2 = _self._getButton({ type: 'agreement2', buttonName: 'Üyelik sözleşmesi', chk: true });
        return (
            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                {cart}
                {agreement2}
                {agreement1}
            </View>
        );
    }
}

function mapStateToProps(state) { return state }
const Foot = connect(mapStateToProps)(Main);
export { Foot };