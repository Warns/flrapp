import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import {
    FORMDATA,
    SET_INSTALLMENT,
    SET_CREDIT_CART,
    SET_BANK_POINT,
    SET_ORDER_3D_BUTTON
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { Form, SelectBox, CheckBox } from 'root/app/form';
import { store } from 'root/app/store';
import {
    cardType,
    validateCardNumber,
    validateCardCVC
} from 'root/app/helper/CreditCard';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

const setAjx = ({ _self, uri, data }, callback) => {
    Globals.AJX({ _self: _self, uri: uri, data: data }, (res) => {
        const { status, message } = res;
        if (status == 200 && typeof callback !== 'undefined')
            callback(res);
    });
};

class CrediCard extends Component {
    constructor(props) {
        super(props);
        const _self = this;
        _self.state = {
            srcCardImage: '',
            installments: [],

            bankPoint: 0,
            extraBonusText: ''
        };
        _self.cartControl = true;
    }

    componentDidMount() {
        const _self = this,
            { onRef } = _self.props;

        _self._isMounted = true;

        if (onRef)
            onRef(this);
    }

    componentWillUnmount() {
        const _self = this,
            { onRef } = _self.props;

        _self._isMounted = false;

        if (onRef)
            onRef(null);
    }

    _getCard = (value) => {
        const _self = this,
            name = cardType(value) || '',
            src = name != '' ? ('/scripts/keyboard/img/' + name + '.png') : '';

        /* min. 2 karekter girişinden sonra kartı göster */
        _self.setState({ srcCardImage: value.length >= 2 ? src : '' });
    }

    _getCardImage = () => {
        const _self = this,
            { srcCardImage = '' } = _self.state;
        if (srcCardImage != '')
            return (<Image
                style={{
                    position: 'absolute',
                    right: 40,
                    width: 30,
                    height: 30,
                    resizeMode: 'contain'
                }}
                source={{ uri: Utils.getImage(srcCardImage) }}
            />);
        else
            return null;
    }

    _callback = () => {

    }

    /* taksit seçenekleri */
    _getInstallmentAjx = (val) => {
        const _self = this;
        setAjx({ _self: _self, uri: Utils.getURL({ key: 'cart', subKey: 'getInstallment' }), data: { bin: val } }, (res) => {
            console.log('_getInstallmentAjx', res);
            let { status, data = {} } = res,
                { creditCarts = [] } = data,
                { installments = [] } = creditCarts[0];

            /*installments = [
                {
                    "bankId": 231,
                    "installmentId": 1043,
                    "description": "",
                    "installmentCount": 1,
                    "monthlyPrice": 4399.01,
                    "totalPrice": 4399.01,
                    "Currency": "TL",
                    "rate": "0"
                },
                {
                    "bankId": 231,
                    "installmentId": 1001,
                    "description": "",
                    "installmentCount": 3,
                    "monthlyPrice": 1466.33666666667,
                    "totalPrice": 4399.01,
                    "Currency": "TL",
                    "rate": "0"
                },
                {
                    "bankId": 231,
                    "installmentId": 987,
                    "description": "",
                    "installmentCount": 2,
                    "monthlyPrice": 879.802,
                    "totalPrice": 4399.01,
                    "Currency": "TL",
                    "rate": "0"
                }
            ];*/

            /* tek bir taksit seçeneği varsa redux yazdır */
            if (installments.length == 1)
                _self._setInstallment(installments[0]);

            if (status == 200)
                _self.setState({ installments: installments });


            /* banka puan bilgisi sorgulanır */
            _self._checkBankPoint();

        });
    }

    _getInstallmentDsc = (item) => {
        const { installmentCount = 1, monthlyPrice = '', Currency } = item;

        return installmentCount == 1 ? 'Tek Çekim' : (installmentCount + ' taksit, aylık ' + monthlyPrice.toFixed(2) + ' ' + Currency);
    }


    _getInstallmentData = (value) => {
        const _self = this,
            { installments = [] } = _self.state;
        return installments.filter((item) => {
            const { installmentId } = item;
            if (installmentId == value)
                return item;
        });
    }

    /* selectbox taksit seçeneği seçildikten sonra */
    _onChangeInstallment = (obj) => {
        const _self = this,
            { value = -1 } = obj;
        if (value != -1)
            _self._setInstallment((_self._getInstallmentData(value) || [])[0]);
        else
            _self._setInstallment({ bankId: 0, installmentId: 0 });
    }

    _setInstallment = (data) => {
        store.dispatch({ type: SET_INSTALLMENT, value: data });
    }

    _getInstallments = () => {
        let _self = this,
            { installments = [] } = _self.state;

        let view = null;

        if (installments.length > 0) {

            const values = installments.map((item) => {
                const { installmentId = '' } = item;
                return { key: _self._getInstallmentDsc(item), value: installmentId };
            });

            if (values.length > 1)
                values.unshift({ key: Translation['dropdown']['choose'], value: -1 });

            const obj = { defaultTitle: 'Taksit:', values: values, value: -1, ico: 'rightArrow', icoStyle: { width: 40, height: 40 } };

            view = <SelectBox
                fontStyle={{ fontFamily: 'Bold', fontSize: 16 }}
                showHeader={false}
                containerStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 0, }}
                wrapperStyle={{ height: 60, borderWidth: 0, borderBottomColor: '#d8d8d8', borderBottomWidth: 1, paddingLeft: 0, paddingRight: 0, }}
                closed={true}
                callback={_self._onChangeInstallment}
                data={obj}
            />
        }

        return view;
    }

    /* banka puan bilgisini çekmek */
    _checkBankPoint = () => {
        const _self = this,
            { creditCart } = _self.props.cart,
            { bankId = 0, creditCardNo = '', cvcCode = '' } = creditCart,
            date = (creditCart['year'] || '0/0').split('/'),
            month = date[0] || 0,
            year = date[1] || 0,
            cardValid = validateCardNumber(creditCardNo),
            _cardType = cardType(creditCardNo),
            cvcValid = validateCardCVC(cvcCode, _cardType);

        if (bankId != 0 && cardValid && cvcValid && month != 0 && year != 0 && month.length == 2 && year.length == 2) {
            const data = {
                bankId: bankId,
                creditCardNo: creditCardNo.replace(/\s+/g, ''),
                cvcCode: cvcCode,
                month: month,
                year: '20' + year,
            };
            console.log(data)
            globals.fetch(
                Utils.getURL({ key: 'cart', subKey: 'checkBankPoint' }),
                JSON.stringify(data), (answer) => {
                    if (answer.status == 200) {
                        _self.setState({ ...(answer.data || {}) })
                    } else
                        _self.setState({ bankPoint: 0, extraBonusText: '' });

                    console.log(answer);

                });
        } else
            _self.setState({ bankPoint: 0, extraBonusText: '' });

        setTimeout(() => {
            if (cardValid)
                _self._checkCreditCard({ creditCardNo: creditCardNo.replace(/\s+/g, '') });
            else
                store.dispatch({
                    type: SET_ORDER_3D_BUTTON,
                    value: false
                });
        }, 1);
    }

    /* kredi kartı 3d açık veya değil */
    _checkCreditCard = (data) => {
        /* 
        {
            "data": Object {
                "is3DPosValid": true,
                "isDebitCard": false,
                "isPosValid": true,
            },
            "innerMessage": null,
            "message": null,
            "status": 200,
            }
        */
        const _self = this;
        globals.fetch(
            Utils.getURL({ key: 'cart', subKey: 'checkCreditCard' }),
            JSON.stringify(data), (answer) => {
                if (answer.status == 200) {
                    const { is3DPosValid = false } = answer.data || {}
                    store.dispatch({
                        type: SET_ORDER_3D_BUTTON,
                        value: is3DPosValid
                    });
                } else
                    store.dispatch({
                        type: SET_ORDER_3D_BUTTON,
                        value: false
                    });
            });
    }

    _getBankPoint = () => {
        const _self = this,
            { bankPoint = 0, extraBonusText = '' } = _self.state;

        let view = null;
        if (bankPoint != 0) {
            const txt = 'Banka Puanımı Kullanmak İstiyorum ' + bankPoint + ' TL';
            view = <CheckBox containerStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 0, }} closed={true} callback={_self._onChangeBankPoint} data={{ desc: txt }} />;
        }

        return view;
    }

    _onChangeBankPoint = (obj) => {
        store.dispatch({
            type: SET_BANK_POINT,
            value: obj['value']
        });
    }

    /* formda yapılan her bir değişiklik bu fonk gönderilir */
    _onChangeText = (obj) => {
        const _self = this,
            { key = '', value = '' } = obj;

        /* formdan gelen kredi kart alan bilgilerini redux gönderme */
        let data = {};
        data[key] = value || '';
        store.dispatch({
            type: SET_CREDIT_CART,
            value: data
        });

        /* tip kredi kartı ise taksit bilgilerini, çekmek */
        if (key == 'creditCardNo') {
            const val = Utils.cleanText(value),
                count = val.length,
                num = 6;

            _self._getCard(val);

            if (count >= num && _self.cartControl) {
                _self.cartControl = false;
                _self._getInstallmentAjx(val.substr(0, num));
            } else if (count < num && !_self.cartControl) {
                _self.cartControl = true;
                _self.setState({ installments: [] });
                _self._setInstallment({ bankId: 0, installmentId: 0 });
            }
        }

        /* banka puan bilgilerini sorgulama */
        console.log(key)
        if (key !== 'fullName')
            setTimeout(() => { _self._checkBankPoint(); }, 1);
    }


    /* kredi kart form validation */
    _validation = (callback) => {
        const _self = this;
        _self.child._formValidation((b) => {
            if (typeof callback !== 'undefined')
                callback(b);
        });
    }

    render() {
        const _self = this,
            installments = _self._getInstallments(),
            bankPoint = _self._getBankPoint();

        return (
            <View style={{ flex: 1, paddingTop: 10 }}>
                {_self._getCardImage()}
                <Form
                    onRef={ref => (_self.child = ref)}
                    style={{ paddingBottom: 0 }}
                    onChangeText={_self._onChangeText}
                    callback={_self._callback}
                    data={FORMDATA['creditCart']}
                />
                {bankPoint}
                {installments}
            </View>
        );

    }
}

function mapStateToProps(state) { return state }
const CrediCart = connect(mapStateToProps)(CrediCard);
export { CrediCart };