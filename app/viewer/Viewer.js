import React, { Component } from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    Dimensions,
    Linking,
    TouchableOpacity,
    WebView,
    View,
    Image,
    Animated,
    Easing,
    Platform,
} from 'react-native';
import {
    Asset,
} from 'expo';
import {
    ICONS,
    FEEDSTYPE,
    VIEWERTYPE,
    ITEMTYPE,
    DATA_LOADED,
    SERVICE_LIST_CLICKED,
    ORDER_LIST_CLICKED,
    DOUBLE_CLICK,
    SET_FORM,
    UPDATE_CART,
    REMOVE_CART,
    SET_SEGMENTIFY_INSTANCEID,
    ADD_CART_ITEM,
    OPEN_PRODUCT_DETAILS,
    SET_VIDEO_PLAYER,
    SHOW_CUSTOM_POPUP,
    NAVIGATE,
    SET_VIEWER,
    SET_CATEGORIES,
    SET_SELECTED_CATEGORY,
    SET_INSTAGRAM,
    FEEDS_IMAGE_RATE
} from 'root/app/helper/Constant';
import {
    HorizontalProducts,
    ElevatedView,
    ReadMoreText,
    ShareButton,
} from 'root/app/components';
import { RatingButton, DoubleClickButton, IconButton, BoxButton, DefaultButton } from 'root/app/UI';
import { CountryPicker, SelectBox } from 'root/app/form';
import { connect } from 'react-redux';
import { AddressListItem, BankTransferListItem } from './';
import { store } from 'root/app/store';
import YoutubePlayer from 'root/app/sub-views/YoutubePlayer';
import {
    ParserHTML
} from 'root/app/helper/';
import Placeholder from 'rn-placeholder';
import HTML from 'react-native-render-html';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');
const injectScript = `
  (function () {
    window.onclick = function(e) {
      e.preventDefault();
      window.postMessage(e.target.href);
      e.stopPropagation()
    }
  }());
`;

/*
const config = {
    type: 'favorite',
    uri: Utils.getURL({ key: 'user', subKey: 'getFavoriteProductList' }),
    keys: {
        id: 'productId', // required
        arr: 'products', // required
        total: 'totalProductCount' // optional
    },
    data: {
       addressId: 0 
    }
};
*/

/* https://medium.com/technoetics/adding-image-placeholders-in-react-native-the-right-way-9140e78ac5c2 */
class progressiveImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thumbnailOpacity: new Animated.Value(0)
        }
    }
    onLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 0,
            duration: 250
        }).start()

    }
    onThumbnailLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 1,
            duration: 250
        }).start();
    }
    render() {
        return (
            <View
                width={this.props.style.width}
                height={this.props.style.height}
                backgroundColor={'#ffffff'}
            >
                <Animated.Image
                    resizeMode={'contain'}
                    key={this.props.key}
                    style={[
                        {
                            position: 'absolute'
                        },
                        this.props.style
                    ]}
                    source={this.props.source}
                    onLoad={(event) => this.onLoad(event)}
                />
                <Animated.Image
                    resizeMode={'contain'}
                    key={this.props.key}
                    style={[
                        {
                            opacity: this.state.thumbnailOpacity
                        },
                        this.props.style
                    ]}
                    source={this.props.thumbnail}
                    onLoad={(event) => this.onThumbnailLoad(event)}
                />
            </View>
        )
    }
}


class CartListItem extends Component {

    /*
    {
        "cartItemId": 3281917,
        "productId": 567060,
        "productName": "SILK MATTE LIQUID LIPSTICK",
        "brandId": 3064,
        "brandName": "Flormar",
        "shortName": null,
        "shortCode": null,
        "productCode": "0313062-002",
        "productShortDesc": "Dudakları kurutmayan, ipeksi matlık sunan likit ruj.",
        "productOption1": "",
        "productOption2": "",
        "quantity": 2,
        "unitCode": "Adet",
        "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-002.jpg",
        "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-002.jpg",
        "firstPrice": 30,
        "firstPriceTotal": 60,
        "salePrice": 29.99,
        "discountTotal": 0,
        "brutTotal": 50.82,
        "taxTotal": 9.15,
        "total": 59.98,
        "netTotal": 59.98,
        "hasStock": true,
        "isGiftPackage": false,
        "giftPackageId": 0,
        "mainCartItemId": 0,
        "bundleId": 0,
        "bundleSelectType": 0,
        "isReadOnly": true,
        "productTypes": [
          {
            "productTypeId": 76,
            "productTypeName": "MAT ETKİ"
          }
        ]
    }
    */

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _callback = (obj) => {
        const _self = this,
            { callback } = _self.props;

        if (callback)
            callback(obj);
    }

    _onChange = ({ value = 1 }) => {
        const _self = this,
            { data = {}, onUpdateItem } = _self.props,
            { cartItemId } = data;
        Globals.AJX({
            _self: _self,
            uri: Utils.getURL({ key: 'cart', subKey: 'updateCartLine' }),
            data: { cartItemId: cartItemId, quantity: value }
        }, (res) => {
            const { status, message = '' } = res;
            if (status == 200 && onUpdateItem)
                onUpdateItem({ type: UPDATE_CART, data: res });
            else
                setTimeout(() => {
                    Utils.alert({ message: message }, () => {
                        if (onUpdateItem)
                            onUpdateItem({ type: UPDATE_CART });
                    });
                }, 300);

        });
    }

    _onRemove = () => {
        const _self = this,
            { data = {}, onUpdateItem } = _self.props,
            { cartItemId } = data;

        Utils.confirm({ message: Translation['confirm']['removeMessage'] }, ({ type }) => {
            if (type == 'ok') {
                Globals.AJX({ _self: _self, uri: Utils.getURL({ key: 'cart', subKey: 'deleteCartLine' }), data: { cartItemId: [cartItemId] } }, (res) => {
                    const { status, message } = res;
                    if (status == 200 && onUpdateItem)
                        setTimeout(() => {
                            onUpdateItem({ type: REMOVE_CART, data: res });
                        }, 100);
                });

            }
        });

    }

    getSelectValue = () => {
        const _self = this,
            { data = {} } = _self.props,
            { quantity, unitCode = 'Adet' } = data,
            values = [],
            arr = [15, 20, 30, 40];

        for (var i = 1; i <= 10; ++i)
            arr.push(i);

        if (!arr.includes(quantity))
            arr.push(quantity);

        arr.sort((a, b) => a - b);

        for (var i = 0; i < arr.length; ++i) {
            const k = arr[i];
            values.push({ key: k + ' ' + unitCode, value: k });
        }

        return { values: values, value: quantity };
    }

    _getPromotions = () => {
        const _self = this,
            { data = {} } = _self.props,
            { promotions = [] } = data;

        return promotions.map((itm, ind) => {
            const { promotionName = '' } = itm;
            return <Text key={ind} style={{ marginTop: 10, fontSize: 12, fontFamily: 'RegularTyp2', color: 'rgb(255, 43, 148)' }}>{promotionName}</Text>
        });
    }

    _getView = () => {
        const _self = this,
            { data = {}, viewType = '' } = _self.props,
            { shortName, productName = '', total = 0, firstPriceTotal = 0 } = data;

        const prc = total == firstPriceTotal ? <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(total)}</Text> : <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(total)}</Text><Text style={{ marginLeft: 10, fontFamily: 'Bold', fontSize: 13, textDecorationLine: "line-through" }}>{Utils.getPriceFormat(firstPriceTotal)}</Text></View>

        if (viewType == 'miniCart')
            return (
                <View style={{ flex: 1 }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text numberOfLines={1} style={{ fontFamily: 'Medium', fontSize: 15, width: '90%' }}>{productName}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                        <Text numberOfLines={1} style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{shortName}</Text>
                        {prc}
                    </View>
                </View>
            );
        else
            return (
                <View style={{ flex: 1 }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text numberOfLines={1} style={{ fontFamily: 'Medium', fontSize: 15, width: '90%' }}>{productName}</Text>
                            <IconButton ico={'closedIco'} callback={_self._onRemove} />
                        </View>
                        <Text numberOfLines={1} style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{shortName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>

                        <SelectBox fontStyle={{ fontSize: 12, fontFamily: 'RegularTyp2', }} showHeader={false} wrapperStyle={{ width: 85, height: 30, borderRadius: 15 }} containerStyle={{ marginBottom: 0 }} closed={true} callback={_self._onChange} data={_self.getSelectValue()} />

                        {prc}
                    </View>
                </View>
            );
    }

    render() {
        const _self = this,
            { data = {}, index = 0, totalCount = 0 } = _self.props,
            { smallImageUrl } = data,
            marginBottom = index == totalCount - 1 ? 0 : 10,
            view = _self._getView();

        return (
            <View style={{ paddingTop: 15, paddingBottom: 15, paddingRight: 20, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, marginBottom: marginBottom, marginLeft: 10, marginRight: 10 }}>
                <View style={{ flexDirection: 'row', }}>
                    <View style={{ width: 60, justifyContent: 'center', }}>
                        <Image
                            style={{ width: 49, height: 60 }}
                            source={{ uri: Utils.getImage(smallImageUrl) }}
                        />
                    </View>
                    {view}
                </View>
                {_self._getPromotions()}
            </View>
        );
    }
}

class FavoriteListItem extends Component {
    /*
    
    {
        "creationDate": "2018-07-18T10:45:00",
        "listPrice": 24.99,
        "mediumImageUrl": "/UPLOAD/Flormar/mobile_image_1/thumb/0313035-D37_medium.jpg",
        "productCode": "0313035-D37",
        "productId": 572359,
        "productName": "DELUXE SHINE GLOSS STYLO",
        "salePrice": 9.99,
        "shortCode": "D37",
        "shortName": "GOLDEN BEIGE",
        "smallImageUrl": "/UPLOAD/Flormar/mobile_image_1/thumb/0313035-D37_small.jpg",
    }
    */
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _onAddToCart = () => {
        const _self = this,
            { data = {} } = _self.props,
            { productId } = data;
        store.dispatch({ type: ADD_CART_ITEM, value: { id: productId, quantity: 1 } });
    }

    _onRemove = () => {
        const _self = this,
            { data, onRemove } = _self.props;
        Utils.confirm({ message: Translation['confirm']['removeMessage'] }, ({ type }) => {
            if (type == 'ok') {
                const { productId } = data;
                Globals.AJX({ _self: _self, uri: Utils.getURL({ key: 'user', subKey: 'deleteFavoriteProduct' }), data: { productId: productId } }, (res) => {
                    const { status, message } = res;
                    if (onRemove && status == 200)
                        setTimeout(() => {
                            onRemove({ key: 'productId', value: productId });
                        }, 100);

                })

            }
        });
    }

    _onShowProduct = () => {
        const _self = this,
            { productId } = _self.props.data;
        store.dispatch({
            type: OPEN_PRODUCT_DETAILS,
            value: {
                id: productId,
                measurements: {},
                animate: false,
                sequence: 0
            }
        });
    }

    render() {

        const _self = this,
            { shortName, productName, smallImageUrl, salePrice } = _self.props.data,
            { addTo } = Translation['cart'] || {};

        return (
            <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 20, paddingRight: 20, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, marginLeft: 10, marginRight: 10 }}>
                <View style={{ width: 60, justifyContent: 'center', }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={_self._onShowProduct}>
                        <Image
                            style={{ height: 60 }}
                            source={{ uri: Utils.getImage(smallImageUrl) }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={_self._onShowProduct}>
                                <Text numberOfLines={1} style={{ fontFamily: 'Medium', fontSize: 15 }}>{productName}</Text>
                            </TouchableOpacity>
                            <IconButton ico={'closedIco'} callback={_self._onRemove} />
                        </View>
                        <Text numberOfLines={1} style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{shortName}</Text>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(salePrice)}</Text>
                        <DefaultButton
                            containerStyle={{ height: 36, paddingLeft: 15, paddingRight: 15 }}
                            callback={_self._onAddToCart}
                            name={addTo}
                            boxColor="#FFFFFF"
                            textColor="#000000"
                            borderColor="#000000"
                            animateOnTap={true}
                            endName="EKLENDİ"
                        />
                    </View>



                </View>
            </View>
        )
    }
}

/* siparişlerim */
class OrderListItem extends Component {
    /* 
    {
  "cargo": Array [],
  "currency": "TL",
  "discountPrice": 5.93,
  "numberOfRows": 2,
  "orderDate": "02012017 17:48:00",
  "orderId": 23419,
  "orderNo": "SIP0065746440",
  "promDiscountPrice": 0,
  "shippingTotal": 4.99,
  "status": "İptal",
  "totalPrice": 24.79,
  "totalPriceWithoutProm": 19.8,
}
    */
    constructor(props) {
        super(props);
    }

    _onPress = () => {

        const _self = this,
            { callback, data } = _self.props;

        /*    if (callback)
            callback({ type: ORDER_LIST_CLICKED, data: data });*/

        store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { modalTitle: 'SİPARİŞ DETAYI', visibility: true, type: ORDER_LIST_CLICKED, data: { data: data } } });
    }

    render() {
        const _self = this,
            { orderNo, orderDate, status, totalPrice } = _self.props.data;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={_self._onPress}>
                <View style={{ paddingTop: 20, paddingLeft: 20, paddingBottom: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, marginLeft: 10, marginRight: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontFamily: 'Medium', fontSize: 15, marginRight: 20 }}>{orderNo}</Text>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13 }}>{Utils.getDateFormat(orderDate)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(totalPrice)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15 }}>{status}</Text>
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={ICONS['rightArrow']}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

class CouponListItem extends Component {
    constructor(props) {
        super(props);
    }
    /* 
      {
        "couponKey": "SUPER75",
        "description": "75 TL ve Üzeri Alışverişlerde Supershine Lipstick Bordeaux Silk Hediye",
        "email": "",
        "endDate": "2018-08-20T00:00:00",
        "isVisibleInCouponPage": null,
        "onlyForFirstUser": false,
        "priceTypeId": 333,
        "startDate": "2018-07-05T00:00:00",
        "statusName": "Süresi Doldu",
        "totalUsageCount": 100000000,
        "usageCountPerUser": 10000,
        "userCategoryId": 0,
        }
    */

    _setDateFormat = (k) => {
        k = k || '';
        return k.split('T')[0];
    }

    render() {
        let _self = this,
            { couponKey, description, startDate = '', endDate = '', statusName = '' } = _self.props.data;

        startDate = _self._setDateFormat(startDate);
        endDate = _self._setDateFormat(endDate);

        return (
            <View style={{ borderBottomColor: '#dcdcdc', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, marginTop: 15 }}>
                <Text style={{ fontFamily: 'Bold', fontSize: 14, marginBottom: 6 }}>{couponKey}</Text>
                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 14, }}>{description}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 15 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 12, color: '#828282', paddingBottom: 6 }}>{'Başlangıç Tarihi'}</Text>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 14 }}>{startDate}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 12, color: '#828282', paddingBottom: 6 }}>{'Bitiş Tarihi'}</Text>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 14 }}>{endDate}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 12, color: '#828282', paddingBottom: 6 }}>{'Durum'}</Text>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 14 }}>{statusName}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

class FollowListItem extends Component {
    /*
        {
            "creationDate": "2017-07-03T15:45:00",
            "listPrice": 14.99,
            "mediumImageUrl": "/UPLOAD/Flormar/mobile_image_1/thumb/0313078-005_medium.jpg",
            "productCode": "0313078-005",
            "productId": 571029,
            "productName": "CARE4LIPS",
            "salePrice": 14.99,
            "shortCode": "005",
            "shortName": "WATERMELON",
            "smallImageUrl": "/UPLOAD/Flormar/mobile_image_1/thumb/0313078-005_small.jpg",
        }
    */
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _onAddToCart = () => {
        const _self = this,
            { data = {} } = _self.props,
            { productId } = data;
        store.dispatch({ type: ADD_CART_ITEM, value: { id: productId, quantity: 1 } });
    }

    _onRemove = () => {
        const _self = this,
            { data = {}, onRemove, config = {} } = _self.props;
        Utils.confirm({ message: Translation['confirm']['removeMessage'] }, ({ type }) => {
            if (type == 'ok') {
                const { productId } = data;
                Globals.AJX({ _self: _self, uri: Utils.getURL(config['deleteURI']), data: { productId: productId } }, (res) => {
                    const { status, message } = res;
                    if (onRemove && status == 200)
                        setTimeout(() => {
                            onRemove({ key: 'productId', value: productId });
                        }, 100);

                })

            }
        });
    }

    _onShowProduct = () => {
        const _self = this,
            { productId } = _self.props.data;
        store.dispatch({
            type: OPEN_PRODUCT_DETAILS,
            value: {
                id: productId,
                measurements: {},
                animate: false,
                sequence: 0
            }
        });
    }

    render() {
        const _self = this,
            { shortName, productName, smallImageUrl, salePrice } = _self.props.data,
            { addTo } = Translation['cart'] || {};

        return (
            <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 20, paddingRight: 20, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, marginLeft: 10, marginRight: 10 }}>
                <View style={{ width: 60, justifyContent: 'center', }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={_self._onShowProduct}>
                        <Image
                            style={{ height: 60 }}
                            source={{ uri: Utils.getImage(smallImageUrl) }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={_self._onShowProduct}>
                                <Text numberOfLines={1} style={{ fontFamily: 'Medium', fontSize: 15, width: '90%' }}>{productName}</Text>
                            </TouchableOpacity>
                            <IconButton ico={'closedIco'} callback={_self._onRemove} />
                        </View>
                        <Text numberOfLines={1} style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{shortName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(salePrice)}</Text>
                        <DefaultButton
                            containerStyle={{ height: 36, paddingLeft: 15, paddingRight: 15 }}
                            callback={_self._onAddToCart}
                            name={addTo}
                            boxColor="#FFFFFF"
                            textColor="#000000"
                            borderColor="#000000"
                            animateOnTap={true}
                            endName="EKLENDİ"
                        />
                    </View>
                </View>
            </View>
        )
    }
}

class ServiceListItem extends Component {
    /*
    {
        "serviceId": 0,
        "serviceName": "string",
        "countryId": 0,
        "cityId": 0,
        "districtName": "string",
        "serviceLatitude": "string",
        "serviceLongitude": "string",
        "phoneNo": "string",
        "fax": "string",
        "picture": "string",
        "address": "string"
      }
    */
    constructor(props) {
        super(props);
        this.state = {
            distance: null,
            duration: null
        };
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
        _self.setAjx();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const _self = this;
        if (!Utils.isArrEqual(_self.state.distance, nextState.distance))
            return true;

        return false;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setAjx = async () => {
        const _self = this,
            { permission, location = null } = store.getState().location || {},
            { serviceLatitude = '', serviceLongitude = '' } = _self.props.data;

        if (serviceLatitude != '' && serviceLongitude != '' && permission && location != null) {

            const uri = Utils.getCustomURL({ key: 'location', origins: (location['coords']['latitude'] + ',' + location['coords']['longitude']), destinations: (serviceLatitude + ',' + serviceLongitude) });

            Utils.ajx({ uri: uri }, (res) => {
                if (res['type'] == 'success' && _self._isMounted) {
                    const data = res['data'] || {},
                        elements = data['rows'][0]['elements'][0],
                        duration = elements['duration'] || {},
                        distance = elements['distance'] || {};
                    _self.setState({ distance: distance['text'] || '', duration: duration['text'] || '' });
                }
            });
        }
    }

    _onPress = () => {
        const _self = this,
            { callback, data } = _self.props;
        if (callback)
            callback({ type: SERVICE_LIST_CLICKED, data: data });
    }


    _isLocation = () => {
        const _self = this,
            { serviceLatitude = '', serviceLongitude = '' } = _self.props.data,
            { distance = null, duration = null } = _self.state;

        let view = null;
        if (serviceLatitude != '' && serviceLongitude != '') {
            view = (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, }}>
                    <Text style={{ fontSize: 15, }}>{distance} {duration}</Text>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={ICONS['rightArrow']}
                    />
                </View>
            );
        }
        return view;
    }

    render() {
        const _self = this,
            { serviceName, address } = _self.props.data;

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={_self._onPress}>
                <View style={{ paddingBottom: 15, paddingTop: 20, paddingLeft: 10, paddingRight: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, marginLeft: 10, marginRight: 10 }}>
                    <Text style={{ fontFamily: 'Medium', fontSize: 16, marginBottom: 6 }}>{Utils.trimText(serviceName).toUpperCase()}</Text>
                    <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15, }}>{Utils.trimText(address)}</Text>
                    {_self._isLocation()}
                </View>
            </TouchableOpacity>
        )
    }
}

class VideoListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { videoName } = this.props.data;
        return (
            <Text>{videoName}</Text>
        )
    }
}

class CampaingItem extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        const _self = this,
            { name, utpCode, image, desc = '', catCode = '' } = _self.props.data,
            data = [{
                title: name,
                img: Utils.getImage(image),
                utpId: utpCode,
                desc: desc,
                id: catCode
            }];
        store.dispatch({ type: SET_CATEGORIES, value: data });
        store.dispatch({ type: SET_SELECTED_CATEGORY, value: name });
        store.dispatch({ type: NAVIGATE, value: { item: { navigation: 'Category' } } });
    }

    _getFooter = () => {
        let view = null;

        const _self = this,
            desc = Translation['feeds']['campaing'] || '';

        if (desc != '')
            view = (
                <View style={{ flexDirection: 'row', height: 40, borderColor: '#dcdcdc', borderRadius: 3, borderTopEndRadius: 0, borderTopLeftRadius: 0, borderWidth: 1, borderTopWidth: 0 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{desc}</Text>
                    </View>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={ICONS['rightArrow']}
                    />
                </View>
            );
        return view;
    }

    render() {
        const _self = this,
            { image } = _self.props.data,
            w = Dimensions.get('window').width,
            h = w / FEEDS_IMAGE_RATE['promo'];

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={_self._onPress}>
                <View style={{ margin: 10, marginBottom: 20 }}>
                    <Image
                        style={{ height: h }}
                        source={{ uri: Utils.getImage(image) }}
                    />
                    {_self._getFooter()}
                </View>
            </TouchableOpacity>
        )
    }
}

// ürün detay nasıl uygulanır kısmı
class CustomDetailContentItem extends Component {
    constructor(props) {
        super(props);
    }

    CUSTOM_STYLE = {
        tagsStyles: { p: { fontSize: 16, color: '#6c6c6c', lineHeight: 24, fontFamily: 'RegularTyp2' }, b: { fontSize: 16, color: '#000000', lineHeight: 24, fontFamily: 'Bold' } },
        imagesMaxWidth: Dimensions.get('window').width,
        onLinkPress: (evt, href) => { Linking.openURL(href); },
        debug: false
    };

    _getView = () => {
        const _self = this,
            { content = [] } = _self.props.data;

        return content
            .map((item, order) => {
                const { title = '', content = '<i></i>', img = '', video = '' } = item;
                if (title != '')
                    return <Text style={{ fontFamily: 'Bold', fontSize: 16, marginTop: 15 }} key={order}>{title}</Text>
                else if (video != '')
                    return null;
                else return (
                    <View key={order} style={{ marginBottom: 15 }}>
                        <HTML {..._self.CUSTOM_STYLE} html={content} />
                        <Image
                            style={{ height: 250, resizeMode: 'cover' }}
                            source={{ uri: Utils.getImage(img) }}
                        />
                    </View>
                );
            });
        /*
        fontSize: 16,
color: '#6c6c6c',
lineHeight: 24,
        */
    }

    render() {
        const _self = this;
        return _self._getView();
    }
}


// feeds sayfası blog, collection detayı
class CustomDetailListItem extends Component {
    constructor(props) {
        super(props);
    }

    _getHead = () => {
        const _self = this,
            { video = '', image = '' } = _self.props.data;

        let view = null;
        if (video != '') {
            const items = [
                {
                    "provider": "youtube",
                    "text": '',
                    "thumbnail": image,
                    "videoId": video
                }
            ];
            view = <YoutubePlayer items={items} selected={0} />;
        }
        else if (image != '')
            view = (
                <Image
                    style={{ height: 300 }}
                    source={{ uri: Utils.getImage(image) }}
                />
            );
        return view;
    }

    _getDsc = () => {
        let _self = this,
            { desc = '', shortDesc = '', link = '', title = '' } = _self.props.data;

        if (shortDesc == '')
            shortDesc = desc.substr(0, 100);

        return (
            <View style={{ margin: 20, paddingBottom: 30, marginBottom: 30, marginTop: 10, borderBottomColor: 'rgb(216, 216, 216)', borderBottomWidth: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Text numberOfLines={2} style={{ fontFamily: 'Bold', fontSize: 16, flex: 1, paddingRight: 10 }}>{title}</Text>
                    <ShareButton style={{ paddingTop: 2 }} url={Utils.getImage(link)} title={title} />
                </View>
                <ReadMoreText lessText={shortDesc} moreText={desc} />
            </View>
        );
    }

    _changeProduct = (id) => {
        store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: false, data: {}, type: '', itemType: '' } });
        store.dispatch({ type: OPEN_PRODUCT_DETAILS, value: { id: id, measurements: {}, animate: false, sequence: 0 } });
    }

    _getReleatedProduct = () => {
        let _self = this,
            { products = '' } = _self.props.data;

        products = Utils.getPrdCodeToArr(products);
        
        let view = null;
        if (products.length > 0)
            view = (
                (
                    <View>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16, marginBottom: 20, marginLeft: 20 }}>İLGİLİ ÜRÜNLER</Text>
                        <HorizontalProducts items={products} onPress={this._changeProduct} />
                    </View>
                )
            );

        return view;
    }

    _getBody = () => {
        const _self = this;
        return (
            <View style={{ flex: 1, paddingBottom: 30 }}>
                {_self._getDsc()}
                {_self._getReleatedProduct()}
            </View>
        )
    }

    render() {
        const _self = this;
        return (
            <View style={{ flex: 1 }}>
                {_self._getHead()}
                {_self._getBody()}
            </View>
        );
    }
}

/*
    Segmentify feeds
    
    type:
    - instagram
	- video
	- kampanya
	- ürün
	- blog post
	- collection

*/
class FeedsItem extends Component {
    constructor(props) {
        super(props);
        const _self = this,
            { like = 0, user_like = false } = _self.props.data;
        _self.state = {
            userLike: user_like,
            like: like
        };
        _self.anim = new Animated.Value(0);
    }

    _animate = (status, callback) => {
        const _self = this;

        Animated.timing(
            _self.anim,
            {
                toValue: status ? 1 : 0,
                duration: 222,
                easing: Easing.inOut(Easing.quad)
            }
        ).start(() => {
            if (typeof callback !== 'undefined')
                callback();
        });
    }

    /* feeds item like, unlike */
    _segLike = (b) => {
        const _self = this,
            { productId } = _self.props.data,
            data = {
                "name": "BASKET_OPERATIONS",
                "step": b ? "add" : "remove",
                "productId": productId,
                "quantity": 1
            };

        Globals.seg({ data: data }, (res) => {

        });
    }

    _segClick = () => {
        const _self = this,
            { productId } = _self.props.data,
            { segmentify = {} } = _self.props.rdx,
            { instanceID } = segmentify;
        data = {
            "name": "INTERACTION",
            "type": "click",
            "instanceId": instanceID,
            "interactionId": productId
        };

        Globals.seg({ data: data }, (res) => { });
    }

    /* feeds item tıklamada */
    _onPress = () => {
        const _self = this,
            { productId, labels = [], name, image, params = {} } = _self.props.data;

        if (FEEDSTYPE['BLOGPOST'] == labels[0]) {
            const data = {
                "type": "htmlToJSON",
                "itemType": "customDetail",
                "uri": {
                    "key": "export",
                    "subKey": "getExport"
                },
                "keys": {
                    "id": "id",
                    "arr": "html",
                    "obj": "data",
                    "objArr": "content"
                },
                "data": {
                    "exportType": "mobiAppFeedsDetail",
                    "customParameters": [
                        {
                            "key": "icr",
                            "value": productId
                        }
                    ]
                }
            };

            store.dispatch({
                type: SHOW_CUSTOM_POPUP,
                value: { visibility: true, type: SET_VIEWER, data: data }
            });
        } else if (FEEDSTYPE['PRODUCT'] == labels[0])
            store.dispatch({
                type: OPEN_PRODUCT_DETAILS,
                value: {
                    id: productId,
                    measurements: {},
                    animate: false,
                    sequence: 0
                }
            });
        else if (FEEDSTYPE['VIDEO'] == labels[0])
            store.dispatch({
                type: SHOW_CUSTOM_POPUP,
                value: {
                    visibility: true,
                    type: SET_VIDEO_PLAYER,
                    //modalTitle: name,
                    data: {
                        selected: 0,
                        items: [
                            {
                                "provider": "youtube",
                                "text": params['videoName'] || '',
                                "thumbnail": image,
                                "videoId": params['youtubeId'] || ''
                            }
                        ]
                    }
                }
            });
        else if (FEEDSTYPE['INSTAGRAM'] == labels[0]) {
            store.dispatch({
                type: SHOW_CUSTOM_POPUP,
                value: {
                    visibility: true,
                    type: SET_INSTAGRAM,
                    data: params
                    /*data: {
                        "title": "",
                        "description": "Sen hareket ettikçe ışıltı saçacak Dazzle Up Lip Gloss ile yepyeni bir gloss deneyimine ne dersin? #FlormarLiteItUp",
                        "link": "https://www.instagram.com/p/BqffIIbhlt9/",
                        "image_link": "https://scontent.cdninstagram.com/vp/c9e4309ece2bd32cadbe5ddc72ef6ac7/5C9111DD/t51.2885-15/e35/s150x150/44634207_357213888187904_3334655814915087386_n.jpg",
                        "user_name": "sevilsworld",
                        "user_image": "https://scontent.cdninstagram.com/vp/c9e4309ece2bd32cadbe5ddc72ef6ac7/5C9111DD/t51.2885-15/e35/s150x150/44634207_357213888187904_3334655814915087386_n.jpg",
                        "count": "3586"
                    }*/
                }
            });
        } else if (FEEDSTYPE['CAMPAING'] == labels[0] || FEEDSTYPE['COLLECTION'] == labels[0]) { 
            const { title = '', utp = '', galleryImage = '', desc = '', catCode = '' } = params,
                data = [{
                    title: name,
                    img: Utils.getImage(galleryImage),
                    utpId: utp,
                    desc: desc,
                    id: catCode
                }];

            store.dispatch({ type: SET_CATEGORIES, value: data });
            store.dispatch({ type: SET_SELECTED_CATEGORY, value: name });
            store.dispatch({ type: NAVIGATE, value: { item: { navigation: 'Category' } } });
        }

    }

    _onRatingClicked = ({ id, userLike }) => {
        const _self = this;
        _self.setState({ userLike: userLike });
        _self._segLike(userLike);
    }

    _getLike = () => {
        const _self = this,
            { userLike, like } = _self.state;
        return null; //--> like için kaldır 
        return <RatingButton onPress={_self._onRatingClicked} id="rating" value={like} userLike={userLike} style={{ position: 'absolute', top: 10, left: 10 }} />
    }

    _getIcon = () => {
        const _self = this,
            { labels = [] } = _self.props.data,
            type = labels[0];

        let source = null;

        if (type == FEEDSTYPE['VIDEO'])
            source = ICONS['feedVideo'];
        else if (type == FEEDSTYPE['INSTAGRAM'])
            source = ICONS['feedInstagram'];
        else if (type == FEEDSTYPE['CAMPAING'])
            source = ICONS['feedCampaing'];

        if (source == null) return null;

        return (
            <Image
                style={{ width: 40, height: 40, position: 'absolute', bottom: 5, right: 5 }}
                source={source}
            />
        );
    }

    _callback = ({ type }) => {
        const _self = this,
            { userLike } = _self.state;

        if (type == DOUBLE_CLICK) {
            /* double click segmentify data yollanır */
            if (!userLike)
                _self._segClick();

            _self.setState({ userLike: true });
            _self._animate(true, () => {
                setTimeout(() => {
                    _self._animate(false);
                }, 100);
            });
        } else
            _self._onPress();
    };

    _heartAnim = () => {
        const _self = this;
        return null; //--> like için kaldır 
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    style={[
                        {
                            width: 180,
                            height: 180,
                        },
                        {
                            opacity: _self.anim,
                            transform: [{
                                scale: _self.anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.6, 1]
                                }),
                            }]
                        }
                    ]}
                    source={ICONS['like']}
                />
            </View>
        )
    }

    _getProduct = () => {
        const _self = this,
            { image = '', name, params = {} } = _self.props.data,
            { colorCount = 0, stockQty = '', discountPrice = 0, salesPrice = 0, discountRate = 0 } = params,
            color = colorCount > 0 ? <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#9b9b9b', marginBottom: 10 }}>{colorCount}{' Renk'}</Text> : null,
            stockState = stockQty <= 20 ? <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#be1066' }}>{'Tükenmek üzere'}</Text> : null;

        let price = null;
        if (discountPrice == salesPrice) {
            price = <Text style={{ fontFamily: 'Bold', fontSize: 20 }}>{Utils.getPriceFormat(salesPrice)}</Text>;
        } else {
            const discountRate = 100 - Math.round((Utils.getNumberFormat(discountPrice) / Utils.getNumberFormat(salesPrice)) * 100);
            price = (
                <View>
                    <Text style={{
                        color: "#BE1066",
                        fontFamily: 'Regular',
                        fontSize: 12
                    }}>
                        {`%${discountRate} İNDİRİM`}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", alignContent: 'center' }}>
                        <Text
                            style={{
                                fontFamily: 'Bold',
                                fontSize: 20,
                            }}
                        >
                            {Utils.getPriceFormat(discountPrice)}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Bold',
                                fontSize: 16,
                                marginLeft: 10,
                                textDecorationLine: "line-through"
                            }}
                        >
                            {Utils.getPriceFormat(salesPrice)}
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <TouchableOpacity activeOpacity={1} onPress={_self._onPress}>
                <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#dcdcdc' }}>
                    <View style={{ width: 175 }}>
                        <Image
                            style={{ height: 218, resizeMode: 'contain' }}
                            source={{ uri: Utils.getImage(image) }}
                        />
                    </View>
                    <View style={{ flex: 1, paddingTop: 30, paddingRight: 10 }}>
                        {price}
                        <Text style={{ fontFamily: 'Medium', fontSize: 16 }}>{name}</Text>
                        {color}
                        {stockState}
                    </View>
                </View>
                {_self._heartAnim()}
            </TouchableOpacity>
        );
    }

    _getOverlay = () => {
        const _self = this,
            { name = '', labels = [] } = _self.props.data || {},
            type = labels[0];

        let view = null;
        if (FEEDSTYPE['VIDEO'] == type) {
            view = (
                <View style={{ position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, top: 0, right: 0, zIndex: 2, overflow: 'hidden' }}>
                    <Image
                        style={{ opacity: 0.7, resizeMode: 'cover', width: '100%', height: '100%', bottom: 0, position: 'absolute', zIndex: 1 }}
                        source={ICONS['gradient']}
                    />
                    <Text style={{ zIndex: 2, position: 'absolute', bottom: 0, paddingLeft: 20, paddingBottom: 10, fontSize: 20, color: '#FFFFFF', width: '70%', fontFamily: 'Medium' }}>{name}</Text>
                </View>
            );
        }
        return view;
    }

    _getImage = () => {
        const _self = this,
            { image = '', url = '', labels = [] } = _self.props.data || {},
            type = labels[0],
            w = Dimensions.get('window').width,
            h = w / FEEDS_IMAGE_RATE[type],
            overlay = _self._getOverlay(),
            uri = type == FEEDSTYPE['INSTAGRAM'] ? url : Utils.getImage(image);

        return (
            <TouchableOpacity activeOpacity={1} onPress={_self._onPress}>
                <View style={{ borderWidth: 1, borderColor: '#dcdcdc' }}>
                    <Image
                        style={{ height: h }}
                        source={{ uri: uri }}
                    />
                    {overlay}
                    {_self._heartAnim()}
                </View>
            </TouchableOpacity>
        );
    }

    _getFooter = () => {
        let view = null;

        const _self = this,
            { labels = [] } = _self.props.data,
            type = labels[0],
            desc = Translation['feeds'][type] || '';

        if (desc != '')
            view = (
                <View style={{ flexDirection: 'row', height: 40, borderColor: '#dcdcdc', borderRadius: 3, borderTopEndRadius: 0, borderTopLeftRadius: 0, borderWidth: 1, borderTopWidth: 0 }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }} activeOpacity={0.8} onPress={_self._onPress}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{desc}</Text>
                    </TouchableOpacity>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={ICONS['rightArrow']}
                    />
                </View>
            );
        return view;
    }

    _getFeed = () => {
        const _self = this,
            { labels = [] } = _self.props.data;

        if (FEEDSTYPE['PRODUCT'] == labels[0])
            return _self._getProduct();
        else
            return _self._getImage();
    }

    render() {
        const _self = this,
            { labels = [] } = _self.props.data;

        /*
        test
        if (labels[0] != 'instagram')
            return null;*/

        return (
            <View style={{ margin: 10, marginBottom: 20 }}>
                <View style={{ position: 'relative' }}>
                    {_self._getFeed()}
                    {_self._getLike()}
                    {_self._getIcon()}
                </View>
                {_self._getFooter()}
            </View>

        )
    }
}

class OpportunityListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const _self = this,
            { index } = _self.props,
            { desc = '' } = _self.props.data,
            leftSpace = index == 0 ? 20 : 0;

        return (
            <View style={{ backgroundColor: '#FFFFFF', width: 220, minHeight: 130, marginRight: 10, marginLeft: leftSpace, padding: 15, }}>
                <HTML {...HTML_DEFAULT_PROPS} html={desc} />
            </View>
        )
    }
}

class ContentPlaceHolder extends Component {

    constructor(props) {
        super(props);
    }

    _getView = () => {
        const _self = this,
            { type } = _self.props;

        let view = null;
        if (type == ITEMTYPE['CAMPAING'] || type == ITEMTYPE['FEEDS'])
            view = (
                <View style={{ margin: 10, marginBottom: 20, }}>
                    <View>
                        <Image
                            style={{
                                width: 140,
                                height: 140,
                                zIndex: 2,
                                marginLeft: -70,
                                marginTop: -70,
                                left: '50%',
                                top: '50%',
                                position: 'absolute',
                            }}
                            source={ICONS['plcFeeds']}
                        />
                        <Placeholder.Box
                            height={300}
                            width="100%"
                            animate="fade"
                        />
                    </View>
                    <View style={{
                        height: 40,
                        borderBottomColor: '#dcdcdc',
                        borderBottomWidth: 1,
                        flexDirection: 'row'
                    }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                            <Placeholder.Line
                                animate="fade"
                                height={15}
                                width={117}
                            />
                        </View>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                position: 'absolute',
                                top: 0,
                                right: 0
                            }}
                            source={ICONS['rightArrowGrey']}
                        />
                    </View>
                </View>
            );
        else
            view = (
                <View style={{ margin: 10, marginBottom: 20, }}>
                    <Placeholder.ImageContent
                        size={60}
                        animate="fade"
                        lineNumber={2}
                        lineSpacing={5}
                        firstLineWidth="40%"
                        lastLineWidth="65%"
                    />
                </View>
            );


        return view;
    }

    render() {
        const _self = this;
        return _self._getView();
    }
}


const HTML_DEFAULT_PROPS = {
    tagsStyles: { h1: { color: 'red' } },
    classesStyles: { 'blue': { color: 'blue', fontWeight: '800' } },
    imagesMaxWidth: Dimensions.get('window').width,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: false
};

const preload = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{
                width: 60,
                height: 60,
                borderRadius: 25,
                overflow: 'hidden',
                ...Platform.select({
                    ios: {
                        zIndex: 9,
                    },
                    android: {
                        elevation: 999,
                    }
                }),
            }}>
                <Image source={ICONS['loading']} style={{ resizeMode: 'cover', width: 60, height: 60, borderRadius: 30 }} />
            </View>
        </View>
    )
};

class CustomFilterHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: this.props.activeIndex || 0
        };
    }

    _onPress = ({ item = {} }) => {
        const _self = this,
            { callback, config } = _self.props,
            { type } = item;

        if (callback)
            callback(config[type]);

        _self.setState({ active: type });
    }

    _getButton = () => {
        const _self = this,
            { config } = _self.props,
            { active } = _self.state;

        return Object.keys(config).map((key) => {
            const k = config[key],
                title = k['title'] || '',
                color = active == key ? '#000000' : '#535353',
                borderColor = active == key ? '#DDDDDD' : '#FFFFFF',
                btn = (
                    <BoxButton
                        key={key}
                        item={{ type: key }}
                        textStyle={{ fontFamily: 'RegularTyp2', color: color }}
                        wrapperStyle={{ paddingLeft: 15, paddingRight: 15, borderRadius: 15, marginRight: 12, borderColor: borderColor }}
                        callback={_self._onPress}>
                        {title}
                    </BoxButton>
                );
            return btn;
        });
    }

    render() {
        const _self = this,
            button = _self._getButton();

        return (
            <View style={{ flexDirection: 'row', paddingBottom: 17, paddingTop: 20, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}>
                {button}
            </View>
        );
    }
}

class Viewers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            html: '<b></b>',
            data: this._empty(),
            total: 0,
            refreshing: false,
            loading: false,
            loaded: false,
            noResult: false
        }
    }

    /* placeholder için boş data atıyor */
    _empty = () => {
        const _self = this,
            arr = [],
            { type } = _self.props.config,
            total = (type == ITEMTYPE['CAMPAING'] || type == ITEMTYPE['FEEDS']) ? 2 : 10;
        for (var i = 0; i < total; ++i)
            arr.push({})
        return arr;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!Utils.isArrEqual(this.state.data, nextState.data) || this.state.noResult != nextState.noResult || this.state.html !== nextState.html || this.props.flexible != nextProps.flexible)
            return true;
        return false;
    }

    onDidFocus = () => {
        const _self = this,
            { navigation, config } = _self.props,
            { type = VIEWERTYPE['LIST'] } = config;

        if (navigation)
            _self._Listener.remove();

        if (type == VIEWERTYPE['SEG'])
            Globals.seg({ data: config.data }, _self._setSeg);
        else
            _self.setAjx({ uri: _self.getUri(), data: _self._getData() });
    }

    componentDidMount() {
        const _self = this,
            { navigation, onRef } = _self.props;
        _self._isMounted = true;
        if (navigation)
            _self._Listener = navigation.addListener('didFocus', _self.onDidFocus);
        else
            _self.onDidFocus();

        if (onRef)
            onRef(this);
    }

    /* https://medium.com/@TaylorBriggs/your-react-component-can-t-promise-to-stay-mounted-e5d6eb10cbb */
    componentWillUnmount() {
        const _self = this,
            { navigation, onRef } = _self.props;
        _self._isMounted = false;
        if (navigation)
            _self._Listener.remove();

        if (onRef)
            onRef(null);
    }

    getUri = () => {
        const { uri } = this.props.config;
        return Utils.getURL(uri);
    }

    _getData = () => {
        const { data = {} } = this.props.config;
        return data;
    }

    /* react-native-render-html componenti table tagını çeviremiyor bu yüzden böyle bir kontrol ekledik */
    _clearTag = (data) => {
        return data
            .replace(/<table/g, '<div')
            .replace(/<\/table/g, '</div')
            .replace(/<tbody/g, '<div')
            .replace(/<\/tbody/g, '</div')
            .replace(/<tr/g, '<div')
            .replace(/<\/tr/g, '</div')
            .replace(/<td/g, '<div')
            .replace(/<\/td/g, '</div');
    }

    _addStyle = () => {
        const regular = Asset.fromModule(require("root/assets/fonts/proximanova-regular.otf")).uri,
            bold = Asset.fromModule(require("root/assets/fonts/BrandonGrotesque-Medium.otf")).uri,
            css = '<style type="text/css"> @font-face {font-family: Regular; src: url(' + regular + ') format("truetype");} @font-face {font-family: Bold; src: url(' + bold + ') format("truetype");}</style>';
        return css;
    }

    _addHtmlWrapper = ({ customClass, data }) => {
        const _self = this,
            uri = Utils.getURL({ key: 'style', subKey: 'main' }) + '?' + parseInt(Math.random() * new Date()),
            style = _self._addStyle(),
            opened = '<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">' + style + '</head><body>',
            closed = '</body></html>',
            css = '<link href="' + uri + '" rel="stylesheet" type="text/css" />',
            htm = opened + '<div class="ems-mobi-app-container ' + customClass + '">' + (css + Utils.removeStyleTag(data)) + '</div>' + closed;

        return htm;
    }

    /* özel durumlarda datayı manipule etmek için kullanacağız. Örneğin kampanya sayfası için dönen datayı */
    _customFunc = (data) => {
        const _self = this,
            { customFunc = '' } = _self.props.config;
        if (customFunc == 'campaing') {
            data = Utils.objectMapping({
                data: data,
                mapping: {
                    prmLPImg: 'image',
                    prmCamID: 'utpCode',
                    prmCamSlug: 'slug',
                    prmDesc: 'desc',
                    prmCat: 'catCode',
                    prmTitle: 'title'
                }
            });
        } else if (customFunc == 'opportunity') {
            data = Utils.objectMapping({
                data: data,
                mapping: {
                    prmUniqueKod: 'id',
                    prmTitle: 'title',
                    prmDesc: 'desc'
                }
            });
        } else if (customFunc == 'customDetailContent') {
            data = [{
                content: Utils.objectMapping({
                    data: data,
                    mapping: {
                        prmTitle: 'title',
                        prmContent: 'content',
                        prmImg: 'img',
                        prmVideoID: 'video',
                        prmLayout: 'layout',
                        prmType: 'type'
                    }
                })
            }];
        }
        return data;
    }

    _getSegData = (data) => {
        //return data['video|THIS_WEEK|NONE'];
        let arr = [];
        Object
            .keys(data)
            .map((key) => {
                const k = data[key] || [];
                if (k.length > 0) {
                    Object
                        .keys(k)
                        .map((m) => {
                            arr.push(k[m])
                        });
                }

            });
        return arr;
    }

    /* segmentify özel */
    _setSeg = (res) => {
        const _self = this;
        if (res['type'] == 'success') {
            let { responses = [] } = res.data,
                key = Globals.getSegKey(responses),
                { params = {} } = responses[0][0],
                //--> data = params['recommendedProducts'][key] || [],
                data = _self._getSegData(params['recommendedProducts'] || []),
                instanceId = params['instanceId'] || '',
                obj = {
                    "name": "INTERACTION",
                    "type": "impression",
                    "instanceId": instanceId,
                    "interactionId": instanceId
                };

            _self.props.dispatch({ type: SET_SEGMENTIFY_INSTANCEID, value: instanceId });

            /*data = [
                {
                    name: 'dsasdasd',
                    labels: ['blog'],
                    image: '/UPLOAD/collection/Campaign-Web-Mobileweb-1500x500decemberurunseti.jpg',

                    productId: 20961 // collection, blog
                }

            ];*/

            /* feeds ilk yüklendiğinde 1 defa impresionlar tetiklenecek  */
            Globals.seg({ data: obj }, (response) => {

                if (data.length == 0)
                    _self.setState({ data: [], total: 0, loaded: true, noResult: true });
                else
                    _self.setState({ data: data, total: Object.keys(data).length || 0, loaded: true });

                if (_self._callback)
                    _self._callback({ type: DATA_LOADED, data: data });

                /* sepet için gerekti */
                if (_self.props.response)
                    _self.props.response({ type: DATA_LOADED, data: res.data });

            });
        } else {
            _self.setState({ data: [], total: 0, loaded: true, noResult: true });

            if (_self.props.noResult)
                _self.props.noResult();
        }

    }

    /* */
    setAjx = ({ uri, data = {} }, callback) => {
        const _self = this,
            { type = VIEWERTYPE['LIST'] } = _self.props.config;

        Globals.AJX({ _self: _self, uri: uri, data: data }, function (res) {

            const { keys, customClass = '', customFunc = '' } = _self.props.config,
                keyArr = keys['arr'] || '',
                keyTotal = keys['total'] || '',
                k = res.data || {};

            let data = k[keyArr] || [];

            if (customFunc != '')
                data = _self._customFunc(data);

            if (type == VIEWERTYPE['HTMLTOJSON'] && data.length > 0) {
                data = data.replace(/(\r\n|\n|\r)/gm, " "); // htmlden gelen fazla boşlukları siliyoruz. Yoksa JSON.parse hata veriyor
                data = JSON.parse(data)[keys['obj']][keys['objArr']] || [];
            }

            if (data.length == 0) {
                _self.setState({ data: [], total: 0, loaded: true, noResult: true });

                if (_self.props.noResult)
                    _self.props.noResult();
            } else if (type == VIEWERTYPE['LIST'] || type == VIEWERTYPE['HTMLTOJSON'] || type == VIEWERTYPE['SCROLLVIEW'])
                _self.setState({ data: data, total: res.data[keyTotal] || data.length || 0, loaded: true, noResult: false });
            else if (type == VIEWERTYPE['WEBVIEW'])
                _self.setState({ html: _self._addHtmlWrapper({ customClass: customClass, data: data }), loaded: true, noResult: false });
            else
                _self.setState({ html: _self._clearTag(data), loaded: true, noResult: false });

            _self._callback({ type: DATA_LOADED, data: data });

            /* sepet için gerekti */
            if (_self.props.response)
                _self.props.response({ type: DATA_LOADED, data: res.data });

            /* callback */
            if (typeof callback !== 'undefined')
                callback();

        });
    }

    _keyExtractor = (item, index) => {
        const _self = this,
            { keys } = _self.props.config;

        return (keys['arr'] + '-' + (item[keys['id']] || '0') + '-' + index).toString();
    }

    _onGotoDetail = (o) => {
        this.props.navigation.navigate('Detail', o);
    };

    /* item element remove */
    _removeItem = ({ key = '', value = '' }) => {
        /*
        const _self = this,
            { data } = _self.state,
            arr = data.filter(function (item, index) {
                return item[key] != value;
            });
        _self.setState({ data: arr });
        */
        const _self = this;
        _self._onUpdateItem();
    }

    _preload = async (b) => {
        //store.dispatch({ type: SHOW_PRELOADING, value: b });
    }

    /* tüm listeyi güncelle */
    _onUpdateItem = () => {
        const _self = this;
        _self.setState({ ..._self.state, loaded: false, data: [] });
        setTimeout(() => {
            _self.onDidFocus();
        }, 10);

    }

    /* Viewer genel callback */
    _callback = (obj) => {
        const _self = this,
            { showPopup = false } = obj,
            { callback, refreshing = false } = _self.props;

        if (refreshing)
            obj['refreshing'] = _self._refreshing;

        if (showPopup)
            store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: true, ...obj } });
        else if (callback)
            callback(obj);
    }

    /* refreshing */
    _refreshing = () => {
        const _self = this;
        _self.onDidFocus();
    }

    /* update redux */
    updateRedux = (obj) => {
        const _self = this;
        _self.props.dispatch(obj);
    }

    _renderItem = ({ item, key, index }) => {
        const _self = this,
            { config = {} } = _self.props,
            { itemType = '', viewType = '' } = config,
            { loaded, total } = _self.state;

        if (!loaded)
            return <ContentPlaceHolder key={key} type={itemType} />;

        switch (itemType) {
            case ITEMTYPE['BANKTRANSFER']:
                return <BankTransferListItem key={key} index={index} callback={_self._callback} data={item} />;
            case ITEMTYPE['CUSTOMDETAILCONTENT']:
                return <CustomDetailContentItem key={key} index={index} callback={_self._callback} data={item} />;
            case ITEMTYPE['CUSTOMDETAIL']:
                return <CustomDetailListItem key={key} index={index} callback={_self._callback} data={item} />;
            case ITEMTYPE['OPPORTUNITY']:
                return <OpportunityListItem key={key} index={index} callback={_self._callback} data={item} />;
            case ITEMTYPE['CARTLIST']:
                return <CartListItem viewType={viewType} totalCount={total} index={index} key={key} callback={_self._callback} onUpdateItem={_self._onUpdateItem} onRemove={_self._removeItem} data={item} />;
            case ITEMTYPE['ADDRESS']:
                return <AddressListItem config={_self.props.config} callback={_self._callback} onRemove={_self._removeItem} data={item} />;
            case ITEMTYPE['FAVORITE']:
                return <FavoriteListItem onRemove={_self._removeItem} data={item} />;
            case ITEMTYPE['ORDER']:
                return <OrderListItem callback={this._callback} data={item} />;
            case ITEMTYPE['COUPON']:
                return <CouponListItem data={item} />;
            case ITEMTYPE['FOLLOWLIST']:
                return <FollowListItem onRemove={_self._removeItem} data={item} config={config} />;
            case ITEMTYPE['SERVICELIST']:
                return <ServiceListItem callback={_self._callback} data={item} />;
            case ITEMTYPE['VIDEO']:
                return <VideoListItem data={item} />;
            case ITEMTYPE['FEEDS']:
                return <FeedsItem data={item} rdx={_self.props} />;
            case ITEMTYPE['CAMPAING']:
                return <CampaingItem data={item} />;
            default:
                return null;
        }
    }

    _getItem = () => {
        const _self = this,
            { data = [] } = _self.state,
            arr = [];

        if (data.length > 0)
            data.map((item, ind) => {
                arr.push(_self._renderItem({ item: item, key: _self._keyExtractor(item, ind), index: ind }));
            });

        return arr;
    }

    _getHeader = () => {
        const _self = this,
            { itemType } = _self.props.config;

        return null;
    }

    _filtered = (obj) => {
        const _self = this,
            { itemType } = _self.props.config;
        if (itemType == ITEMTYPE['SERVICELIST']) {
            const { multiValue = [] } = obj,
                data = {},
                keys = ['countryId', 'cityId', 'districtName'];

            Object
                .entries(multiValue)
                .forEach(([ind, item]) => {
                    const { key, value } = item;
                    if (value != -1 && (value != '' && value != Translation['dropdown']['choose'] && value != Translation['dropdown']['countryChoose'] && value != Translation['dropdown']['cityChoose'] && value != Translation['dropdown']['districtChoose']) && keys.includes(key))
                        data[key] = value;
                });

            _self._preload(true);
            _self.setAjx({ uri: _self.getUri(), data: data }, () => {
                _self._preload(false);
            });
        } else if (itemType == ITEMTYPE['COUPON']) {
            _self._preload(true);
            _self.setAjx({ uri: _self.getUri(), data: obj['data'] || {} }, () => {
                _self._preload(false);
            });
        } else if (itemType == ITEMTYPE['FOLLOWLIST']) {

            _self.props.config['deleteURI'] = obj['deleteURI'] || {};
            _self.props.config['uri'] = obj['url'] || {}; /* filtrelemede url değiştiği için burada son tıklanan butonun url genel config eşitlenir böylece sayfa refresh olduğu zaman son url istek atar */

            _self._preload(true);
            _self.setAjx({ uri: obj['uri'] || '', data: obj['data'] || {} }, () => {
                _self._preload(false);
            });
        } else if (itemType == ITEMTYPE['ADDRESS']) {
            const data = {
                type: SET_FORM,
                itemType: 'createAddress',
                refreshing: _self._onUpdateItem,
                modalTitle: 'YENİ ADRES EKLE'
            };
            store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: true, ...data } });
        }
    }

    _getFilter = () => {
        const _self = this,
            { itemType, filterData = {} } = _self.props.config,
            { noResult = false } = _self.state,
            { filtered = false } = filterData;

        switch (itemType) {
            case ITEMTYPE['ADDRESS']: {
                if (!filtered || noResult) return null;
                return (
                    <View style={{ alignItems: 'flex-end', paddingTop: 15, marginLeft: 15, marginRight: 15 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={_self._filtered}>
                            <Text style={{ fontFamily: 'Bold', fontSize: 14 }}>YENİ ADRES EKLE</Text>
                            <Image
                                source={(ICONS['plus'])}
                                style={{ width: 40, height: 40, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                    </View>
                );
            }
            case ITEMTYPE['SERVICELIST']: {
                if (!filtered || noResult) return null;
                return (
                    <ElevatedView
                        elevation={0}
                        style={{
                            backgroundColor: '#FFFFFF',
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 12,
                            paddingTop: 0,
                        }}>
                        <CountryPicker
                            selectionValue={true}
                            callback={_self._filtered}
                            theme={'LIGHT'}
                            control={false}
                            key={'country'}
                            data={filterData}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', }}
                            countryContainerStyle={{ width: '50%', paddingRight: 5, marginBottom: 0 }}
                            countryHeaderShow={false}
                            cityContainerStyle={{ width: '50%', paddingLeft: 5, marginBottom: 0 }}
                            cityHeaderShow={false}
                            districtContainerStyle={{ width: 0, height: 0, marginBottom: 0, opacity: 0 }}
                            districtHeaderShow={false}
                            countryChoose={Translation['dropdown']['countryChoose']}
                            cityChoose={Translation['dropdown']['cityChoose']}
                            districtChoose={Translation['dropdown']['districtChoose']}
                        />
                    </ElevatedView>
                );
            }
            case ITEMTYPE['COUPON']: {
                const _config = [
                    {
                        title: 'Açık Kuponlar',
                        itemType: 'coupon',
                        uri: Utils.getURL({ key: 'integrator', subKey: 'getCouponDetail' }),
                        keys: {
                            id: 'couponKey',
                            arr: 'couponDetailList',
                        },
                        data: {
                            "status": 4,
                            "type": 2,
                            "active": true
                        },
                    },
                    {
                        title: 'Kapanan',
                        itemType: 'coupon',
                        uri: Utils.getURL({ key: 'integrator', subKey: 'getCouponDetail' }),
                        keys: {
                            id: 'couponKey',
                            arr: 'couponDetailList',
                        },
                        data: {
                            "status": 4,
                            "type": 2,
                            "active": false
                        },
                    }
                ];

                return <CustomFilterHeader config={_config} callback={_self._filtered} />;

            } case ITEMTYPE['FOLLOWLIST']: {
                const _config = [
                    {
                        title: 'Fiyatı Düşenler',
                        itemType: 'followList',
                        deleteURI: { key: 'user', subKey: 'deletePriceFollowUpProduct' },
                        url: { key: 'user', subKey: 'getPriceFollowUpList' },
                        uri: Utils.getURL({ key: 'user', subKey: 'getPriceFollowUpList' }),
                        keys: {
                            id: 'productId',
                            arr: 'products',
                        },
                        data: {},
                    },
                    {
                        title: 'Stoğa Girenler',
                        itemType: 'followList',
                        deleteURI: { key: 'user', subKey: 'deleteStockFollowUpProduct' },
                        url: { key: 'user', subKey: 'getStockFollowUpList' },
                        uri: Utils.getURL({ key: 'user', subKey: 'getStockFollowUpList' }),
                        keys: {
                            id: 'productId',
                            arr: 'products',
                        },
                        data: {},
                    }
                ];

                return <CustomFilterHeader config={_config} callback={_self._filtered} />;
            }
            default:
                return null;
        }
    }

    _onRefresh = () => {
        const _self = this,
            { refreshing = true } = _self.props.config;
        if (refreshing)
            _self.setState({ refreshing: true }, () => {
                _self.setAjx({ uri: _self.getUri(), data: _self._getData() });
            });
    }

    _viewable = [];

    _setSegView = (item) => {
        const _self = this,
            { productId = '' } = item,
            { segmentify = {} } = _self.props,
            data = {
                "name": "PRODUCT_VIEW",
                "productId": productId,
                "noUpdate": true
            };
        /*data = {
            "name": "INTERACTION",
            "type": "widget-view",
            "instanceId": segmentify['instanceID'] || '',
            "interactionId": productId
        };*/

        Globals.seg({ data: data }, (res) => {

        });
    }

    _onViewableItemChanged = ({ index, item }) => {
        const _self = this,
            { onViewableItemsChanged } = _self.props,
            { loaded = false } = _self.state,
            { type = VIEWERTYPE['LIST'] } = _self.props.config;

        if (!_self._viewable.includes(index) && loaded) {
            _self._viewable.push(index);

            /* segmentify özel */
            if (type == VIEWERTYPE['SEG'])
                _self._setSegView(item);

            if (onViewableItemsChanged)
                onViewableItemsChanged(item);
        }
    }

    _onViewableItemsChanged = ({ viewableItems }) => {
        /* viewport giren itemları döndürür */
        const _self = this;
        viewableItems.map((item) => {
            _self._onViewableItemChanged(item)
        });

        /*
            multiple item döndürür
        const _self = this,
            arr = [];
        viewableItems.map((k) => {
            const index = k['index'],
                item = k['item']
            if (!_self._viewable.includes(index)) {
                _self._viewable.push(index);
                arr.push(k);
            }
        });
        if (arr.length > 0)
            _self._setSegView(arr);
        */
    }

    _getNoResultView = ({ wrapperStyle = {}, ico = '', text = '', button = null }) => {
        return (
            <View style={[{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }, wrapperStyle]}>
                <View style={{ width: 275, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{
                            width: 158,
                            height: 158,
                            resizeMode: 'contain',
                            marginBottom: 20
                        }}
                        source={ICONS[ico]}
                    />
                    <Text style={{ fontFamily: 'RegularTyp2', fontSize: 22, marginBottom: 34 }}>{text}</Text>
                    {button}
                </View>
            </View>
        );
    }

    /* anasayfaya dön */
    _onGotoHome = () => {
        this.props.dispatch({ type: NAVIGATE, value: { item: { navigation: "Home" } } });
    }

    _onNewAddress = () => {
        const _self = this;
        _self._filtered();
        //_self._callback({ type: NEW_ADDRESS_CLICKED });
    }

    _noResultView = () => {
        const _self = this,
            { itemType = '' } = _self.props.config;


        let view = _self._getNoResultView({ ico: 'contentNoResult', text: 'İçerik Bulunamadı!' });

        if (itemType == ITEMTYPE['CARTLIST'])
            view = _self._getNoResultView({ ico: 'cartNoResult', text: 'Sepetiniz Henüz Boş', button: <BoxButton wrapperStyle={{ height: 48 }} callback={_self._onGotoHome}>ANASAYFAYA GİT</BoxButton> });
        else if (itemType == ITEMTYPE['ADDRESS'])
            view = _self._getNoResultView({ ico: 'addressNoResult', text: 'Adres Bilgileriniz Henüz Boş', button: <BoxButton wrapperStyle={{ height: 48, backgroundColor: '#000000' }} textStyle={{ color: '#FFFFFF' }} callback={_self._onNewAddress}>Yeni Adres Ekle</BoxButton> });
        else if (itemType == ITEMTYPE['COUPON'])
            view = _self._getNoResultView({ ico: 'couponNoResult', text: 'Kuponlarınız Boş' });
        else if (itemType == ITEMTYPE['FAVORITE'])
            view = _self._getNoResultView({ ico: 'favoriteNoResult', text: 'Favorileriniz Boş' });
        else if (itemType == ITEMTYPE['FOLLOWLIST'])
            view = _self._getNoResultView({ ico: 'followListNoResult', text: 'Takip Listeniz Boş' });
        else if (itemType == ITEMTYPE['ORDER'])
            view = _self._getNoResultView({ ico: 'cartNoResult', text: 'Siparişleriniz Boş' });
        else if (itemType == ITEMTYPE['OPPORTUNITY'])
            view = null;

        return view;
    }

    /* 
        webview içerisine tıklananınca callback döndürmek
    */
    onMessage = ({ nativeEvent }) => {
        const data = nativeEvent.data;

        if (data !== undefined && data !== null)
            Linking.openURL(data);
    };

    _getViewer = () => {
        const _self = this,
            { scrollEnabled = true, flexible = true } = _self.props,
            flex = flexible ? { flex: 1 } : {},
            { type = VIEWERTYPE['LIST'], horizontal = false, showsHorizontalScrollIndicator = true } = _self.props.config,
            { noResult = false, loaded = false } = _self.state;

        let view = null;
        if (noResult)
            view = _self._noResultView();
        else if (type == VIEWERTYPE['SEG'] || type == VIEWERTYPE['LIST'] || type == VIEWERTYPE['HTMLTOJSON'])
            view = (
                <FlatList
                    showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
                    horizontal={horizontal}
                    scrollEnabled={scrollEnabled}
                    data={_self.state.data}
                    keyExtractor={_self._keyExtractor}
                    renderItem={_self._renderItem}
                    ListHeaderComponent={_self._getHeader}
                    refreshing={_self.state.refreshing}
                    //onRefresh={_self._onRefresh}
                    onViewableItemsChanged={_self._onViewableItemsChanged}
                />
            );
        else if (type == VIEWERTYPE['HTML'] || type == VIEWERTYPE['WEBVIEW'] || type == VIEWERTYPE['SCROLLVIEW']) {
            if (!loaded)
                view = preload();
            else if (type == VIEWERTYPE['HTML'])
                view = (
                    <ScrollView style={{ ...flex }}>
                        <HTML {...HTML_DEFAULT_PROPS} html={_self.state.html} />
                    </ScrollView>
                );
            else if (type == VIEWERTYPE['WEBVIEW'])
                view = (
                    <View style={{ ...flex }}>
                        <WebView
                            scalesPageToFit={false}
                            automaticallyAdjustContentInsets={false}
                            source={{ html: _self.state.html }}
                            injectedJavaScript={injectScript}
                            onMessage={_self.onMessage}
                        />
                    </View>
                );
            else if (type == VIEWERTYPE['SCROLLVIEW'])
                view = (
                    <ScrollView
                        scrollEnabled={scrollEnabled}
                        style={{ ...flex }}
                    >
                        {_self._getItem()}
                    </ScrollView>
                );
        }

        return view;
    }

    render() {
        const _self = this,
            { flexible = true } = _self.props,
            flex = flexible ? { flex: 1 } : {};

        return (
            <View style={[{ ...flex }, { ..._self.props.wrapperStyle }]}>
                {_self._getFilter()}
                <View style={[{ ...flex, padding: 0, }, { ..._self.props.style }]}>
                    {_self._getViewer()}
                </View>
            </View >

        )
    }
}

function mapStateToProps(state) { return state }
const Viewer = connect(mapStateToProps)(Viewers);
export { Viewer }