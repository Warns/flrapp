import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    SET_FORM,
    SET_CART_ADDRESS,
    SET_ADDRESS_ITEM_CLICK,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

class BoxButton extends Component {
    constructor(props) {
        super(props);
    }

    _onPressButton = () => {
        const { callback, item = {}, sequence = 0 } = this.props;
        if (callback)
            callback({ item, sequence });
    }

    _measureDimensions = (e) => {
        const { onDimensions, sequence = 0 } = this.props;
        if (onDimensions)
            onDimensions({ layout: e.nativeEvent.layout, sequence });
    }

    render() {
        const _self = this;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={_self._onPressButton} onLayout={e => _self._measureDimensions(e)}>
                <View style={[{ alignItems: "center", justifyContent: "center", borderColor: '#666666', borderWidth: 1, backgroundColor: "#FFFFFF", borderRadius: 3, height: 36, paddingLeft: 30, paddingRight: 30 }, { ..._self.props.wrapperStyle }]}>
                    <Text style={[{ fontFamily: 'Bold', fontSize: 14 }, { ..._self.props.textStyle }]}>{_self.props.children}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class AddressList extends Component {
    /*
        {
            "address": "DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA DAVUTPAŞA",
            "addressId": 473044,
            "addressName": "TEST P",
            "cityId": 1,
            "cityName": "İstanbul",
            "companyName": "",
            "corprateFl": false,
            "countryId": 1,
            "countryName": "Türkiye",
            "districtId": 980,
            "districtName": "ESENLER",
            "fullName": "Proj-E Proj-E",
            "mobilePhone": "900(555) 5555555",
            "phone": "",
            "readOnly": false,
            "taxNumber": "",
            "taxOffice": "",
            "tckn": "26072013304",
            "zipCode": "34080",
        }
    */

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _onPress = () => {
        const _self = this,
            { callback, data = {} } = _self.props;
        if (callback)
            callback({
                type: SET_FORM,
                data: {
                    itemType: 'setAddress',
                    postData: { addressId: data['addressId'] || '' }
                }
            });
    }

    _onRemove = () => {
        const _self = this,
            { data, onRemove } = _self.props;
        Utils.confirm({ message: Translation['confirm']['removeMessage'] }, ({ type }) => {
            if (type == 'ok') {
                const { addressId } = data;
                Globals.AJX({ _self: _self, uri: Utils.getURL({ key: 'address', subKey: 'deleteAddress' }), data: { addressId: addressId } }, (res) => {
                    const { status, message } = res;
                    if (onRemove && status == 200)
                        setTimeout(() => {
                            onRemove({ key: 'addressId', value: addressId });
                        }, 100);

                })

            }
        });
    }

    _onCallback = () => {
        const _self = this,
            { callback } = _self.props;

        setTimeout(() => {
            if (callback) {
                callback({
                    type: SET_ADDRESS_ITEM_CLICK,
                    data: {}
                });
            }
        }, 10);
    }

    _onShipAddressPress = () => {
        const _self = this,
            { addressId } = _self.props.data;


        _self.props.dispatch({ type: SET_CART_ADDRESS, value: { addressId: addressId, addressType: 'shipAddress' } });
        _self._onCallback();
    }

    _getShipAddressButton = () => {
        const _self = this,
            { data = {} } = _self.props,
            { addressId } = data,
            { selectedAddress = {} } = _self.props.cart,
            { shipAddress, differentAddress } = selectedAddress;
        let { selectShipAddress, selectedShipAddress, select, selected } = Translation['address'] || {};

        if (!differentAddress) {
            selectShipAddress = select;
            selectedShipAddress = selected;
        }

        let view = null;
        if (addressId == shipAddress)
            view = (
                <BoxButton
                    wrapperStyle={{ backgroundColor: 'rgb(255, 43, 148)', borderColor: 'rgb(255, 43, 148)', minWidth: 130, paddingLeft: 0, paddingRight: 0 }}
                    textStyle={{ color: '#FFFFFF' }}
                    callback={_self._onShipAddressPress}>
                    {selectedShipAddress}
                </BoxButton>
            );
        else
            view = (
                <BoxButton
                    wrapperStyle={{ minWidth: 130, paddingLeft: 0, paddingRight: 0 }}
                    callback={_self._onShipAddressPress}>
                    {selectShipAddress}
                </BoxButton>
            );

        return view;
    }

    _onBillAddressPress = () => {
        const _self = this,
            { addressId } = _self.props.data;

        _self.props.dispatch({ type: SET_CART_ADDRESS, value: { addressId: addressId, addressType: 'billAddress' } });
        _self._onCallback();
    }

    _getBillAddressButton = () => {
        const _self = this,
            { data = {} } = _self.props,
            { addressId } = data,
            { selectedAddress = {} } = _self.props.cart,
            { billAddress, differentAddress } = selectedAddress,
            { selectBillAddress, selectedBillAddress } = Translation['address'] || {};

        let view = null;
        if (differentAddress) {
            if (addressId == billAddress)
                view = (
                    <BoxButton
                        wrapperStyle={{ backgroundColor: 'rgb(255, 43, 148)', borderColor: 'rgb(255, 43, 148)', minWidth: 130, paddingLeft: 0, paddingRight: 0, marginLeft: 10 }}
                        textStyle={{ color: '#FFFFFF' }}
                        callback={_self._onBillAddressPress}>
                        {selectedBillAddress}
                    </BoxButton>
                );
            else
                view = (
                    <BoxButton
                        wrapperStyle={{ minWidth: 130, paddingLeft: 0, paddingRight: 0, marginLeft: 10 }}
                        callback={_self._onBillAddressPress}>
                        {selectBillAddress}
                    </BoxButton>
                );
        }

        return view;
    }

    _getItemType = () => {
        const _self = this,
            { itemButtonType = 'default' } = _self.props.config,
            { remove, edit } = Translation['address'] || {};

        /* adres düzenleme ve sepet adımlarındaki seçimlerde ayrım yapmak için kullanırız. */
        let view = null;
        if (itemButtonType == 'default')
            view = (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={_self._onRemove}>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15 }}>{remove}</Text>
                    </TouchableOpacity>
                    <BoxButton callback={_self._onPress}>{edit}</BoxButton>
                </View>
            );
        else if (itemButtonType == 'cart')
            view = (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={_self._onPress}>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15 }}>{edit}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        {_self._getShipAddressButton()}
                        {_self._getBillAddressButton()}
                    </View>

                </View>
            );

        return view;
    }

    render() {
        const _self = this,
            { addressName, address } = _self.props.data,
            itemButtonType = _self._getItemType();

        return (
            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, marginBottom: 10, paddingTop: 16, paddingBottom: 12, paddingRight: 10, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, }}>
                <View>
                    <Text style={{ fontFamily: 'Medium', fontSize: 15 }}>{addressName}</Text>
                    <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{address}</Text>
                </View>
                {itemButtonType}
            </View>
        )
    }
}

function mapStateToProps(state) { return state }
const AddressListItem = connect(mapStateToProps)(AddressList);
export { AddressListItem };