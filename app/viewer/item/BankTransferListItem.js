import React, { Component } from 'react';
import {
    Text,
    View,
    Image
} from 'react-native';
import {
    SET_BANK_TRANSFER,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { BoxButton } from 'root/app/UI';
import HTML from 'react-native-render-html';

const Utils = require('root/app/helper/Global.js');

class BankTransferList extends Component {
    /* 
    {
        "accountNo": "0016618",
        "bankCampaignNote": "",
        "bankDescription": "İş Bankası ve Maximum kart anlaşmalı bankalar",
        "bankId": 409,
        "bankLogo": "https://mcdn.flormar.com.tr/images/banka_logo/maximum.gif",
        "bankName": "İş Bankası",
        "ibanNo": "TR19 0006 4000 0012 4400 0166 18 <br> KOSAN KOZMETİK PAZARLAMA VE TİC. A.Ş.",
    }
    */
    constructor(props) {
        super(props);
    }

    HTML_DEFAULT_PROPS = {
        tagsStyles: { span: { fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' } },
    };

    _getIban = () => {
        let _self = this,
            { ibanNo = '' } = _self.props.data;
        ibanNo = '<span>' + ibanNo + '</span>';

        return <HTML {..._self.HTML_DEFAULT_PROPS} html={ibanNo} />
    }

    _onPress = () => {
        const _self = this,
            { bankId } = _self.props.data;
        _self.props.dispatch({ type: SET_BANK_TRANSFER, value: bankId });
    }

    _getButton = () => {
        const _self = this,
            { bankId } = _self.props.data,
            { bankTransfer = {} } = _self.props.cart || {}

        let view = null;
        if (bankTransfer.bankId == bankId)
            view = (
                <BoxButton
                    wrapperStyle={{ backgroundColor: 'rgb(255, 43, 148)', borderColor: 'rgb(255, 43, 148)' }}
                    textStyle={{ color: '#FFFFFF' }}
                    callback={_self._onPress}>{'Seçildi'}</BoxButton>
            );
        else
            view = (
                <BoxButton callback={_self._onPress}>{'Seç'}</BoxButton>
            );

        return view;
    }

    render() {
        const _self = this,
            { bankLogo, bankName, accountNo } = _self.props.data,
            button = _self._getButton(),
            ibanNo = _self._getIban();

        return (

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginRight: 10, marginBottom: 10, paddingTop: 16, paddingBottom: 12, paddingRight: 10, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
                <Image
                    style={{ width: 72, height: 20 }}
                    source={{ uri: Utils.getImage(bankLogo), resizeMode: 'contain' }}
                />
                <View style={{ paddingLeft: 5, paddingRight: 5, flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 16, color: '#555555' }}>{bankName}</Text>
                    <Text numberOfLines={1} style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{accountNo}</Text>
                    {ibanNo}
                </View>

                {button}
            </View>

        );
    }
}


function mapStateToProps(state) { return state }
const BankTransferListItem = connect(mapStateToProps)(BankTransferList);
export { BankTransferListItem };