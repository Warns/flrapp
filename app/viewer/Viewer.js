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
} from 'react-native';
import HTML from 'react-native-render-html';
import {
    ICONS,
    FEEDSTYPE,
    VIEWERTYPE,
    ITEMTYPE,
    DATA_LOADED,
    SERVICE_LIST_CLICKED,
    ORDER_LIST_CLICKED,
    ADDRESS_LIST_CLICKED,
    CLICK,
    DOUBLE_CLICK,
    SET_FORM,
} from 'root/app/helper/Constant';
import {
    ElevatedView,
} from 'root/app/components';
import { RatingButton, DoubleClickButton } from 'root/app/UI';
import { CountryPicker } from 'root/app/form';
import { connect } from 'react-redux';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');
const AJX = async ({ _self, uri, data = {} }, callback) => {
    _self.setState({ loading: true });
    Globals.fetch(uri, JSON.stringify(data), (answer) => {
        if (_self._isMounted) {
            if (answer === 'error') {
                console.log('fatalllll error: could not get access token');
            } else {
                if (answer.status == 200) {
                    if (typeof callback !== 'undefined')
                        callback(answer);
                }
            }
            _self.setState({ loading: false, refreshing: false });
        }
    });
}

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

class IconButton extends Component {
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
        const _self = this,
            { ico, icoStyle = {}, style = {} } = _self.props;

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={_self._onPressButton} onLayout={e => _self._measureDimensions(e)}>
                <View style={[{ width: 12, height: 12, justifyContent: 'center', alignItems: 'center' }, style]}>
                    <Image
                        style={[{ width: 12, height: 12 }, icoStyle]}
                        source={ICONS[ico]}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

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
                <View style={{ alignItems: "center", justifyContent: "center", borderColor: '#666666', borderWidth: 1, backgroundColor: "#FFFFFF", borderRadius: 3, height: 36, paddingLeft: 30, paddingRight: 30 }}>
                    <Text style={{ fontFamily: 'Bold', fontSize: 14 }}>{_self.props.children}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class AdressListItem extends Component {
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
                AJX({ _self: _self, uri: Utils.getURL({ key: 'address', subKey: 'deleteAddress' }), data: { addressId: addressId } }, (res) => {
                    const { status, message } = res;
                    if (onRemove && status == 200)
                        setTimeout(() => {
                            onRemove({ key: 'addressId', value: addressId });
                        }, 100);

                })

            }
        });
    }

    render() {
        const _self = this,
            { addressName, address } = _self.props.data,
            { remove, edit } = Translation['address'] || {};
        return (

            <View style={{ flexDirection: 'column', paddingTop: 20, paddingBottom: 20, paddingRight: 20, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, }}>
                <View>
                    <Text style={{ fontFamily: 'Medium', fontSize: 15 }}>{addressName}</Text>
                    <Text style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{address}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={_self._onRemove}>
                        <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15 }}>{remove}</Text>
                    </TouchableOpacity>
                    <BoxButton callback={_self._onPress}>{edit}</BoxButton>
                </View>
            </View>

        )
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

    _onPress = () => {
        const _self = this,
            { data = {} } = _self.props;

    }

    _onRemove = () => {
        const _self = this,
            { data, onRemove } = _self.props;
        Utils.confirm({ message: Translation['confirm']['removeMessage'] }, ({ type }) => {
            if (type == 'ok') {
                const { productId } = data;
                AJX({ _self: _self, uri: Utils.getURL({ key: 'user', subKey: 'deleteFavoriteProduct' }), data: { productId: productId } }, (res) => {
                    const { status, message } = res;
                    if (onRemove && status == 200)
                        setTimeout(() => {
                            onRemove({ key: 'productId', value: productId });
                        }, 100);

                })

            }
        });
    }

    render() {

        const _self = this,
            { shortName, productName, smallImageUrl, salePrice } = _self.props.data,
            { addTo } = Translation['cart'] || {};

        return (
            <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 20, paddingRight: 20, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, }}>
                <View style={{ width: 60, justifyContent: 'center', }}>
                    <Image
                        style={{ height: 60 }}
                        source={{ uri: Utils.getImage(smallImageUrl) }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text numberOfLines={1} style={{ fontFamily: 'Medium', fontSize: 15 }}>{productName}</Text>
                            <IconButton ico={'close'} callback={_self._onRemove} />
                        </View>
                        <Text numberOfLines={1} style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{shortName}</Text>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(salePrice)}</Text>
                        <BoxButton callback={_self._onPress}>{addTo}</BoxButton>
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
        if (callback)
            callback({ type: ORDER_LIST_CLICKED, data: data });
    }

    render() {
        const _self = this,
            { orderNo, orderDate, status, totalPrice } = _self.props.data;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={_self._onPress}>
                <View style={{ paddingTop: 20, paddingLeft: 20, paddingBottom: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
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
    render() {
        const { couponKey } = this.props.data;
        return (
            <Text>{couponKey}</Text>
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
    render() {
        const { shortName, productName, smallImageUrl, salePrice } = this.props.data;
        return (
            <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 20, paddingRight: 20, paddingLeft: 10, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, }}>
                <View style={{ width: 60, justifyContent: 'center', }}>
                    <Image
                        style={{ height: 60 }}
                        source={{ uri: Utils.getImage(smallImageUrl) }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View>
                        <Text numberOfLines={1} style={{ fontFamily: 'Medium', fontSize: 15 }}>{productName}</Text>
                        <Text numberOfLines={1} style={{ fontFamily: 'RegularTyp2', fontSize: 13, color: '#555555' }}>{shortName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21 }}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>{Utils.getPriceFormat(salePrice)}</Text>
                        <BoxButton>{'SEPETE AT'}</BoxButton>
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
            { permission, location } = _self.props.rdx,
            { serviceLatitude = '', serviceLongitude = '' } = _self.props.data;

        if (serviceLatitude != '' && serviceLongitude != '' && permission) {
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
            { serviceLatitude = '', serviceLongitude = '' } = _self.props.data;
        let view = null;
        if (serviceLatitude != '' && serviceLongitude != '') {
            view = (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={{ fontFamily: 'Regular', fontSize: 15, }}>{_self.state.distance}   {_self.state.duration}</Text>
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
                <View style={{ paddingBottom: 20, paddingTop: 20, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
                    <Text style={{ fontFamily: 'Medium', fontSize: 16, marginBottom: 6 }}>{Utils.trimText(serviceName)}</Text>
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
    render() {
        const { image, utpCode } = this.props.data;
        return (
            <Image
                style={{ height: 300 }}
                source={{ uri: Utils.getImage(image) }}
            />
        )
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

    _onRatingClicked = ({ id, userLike }) => {
        const _self = this;
        _self.setState({ userLike: userLike });
    }

    _getLike = () => {
        const _self = this,
            { userLike, like } = _self.state;

        return <RatingButton onPress={_self._onRatingClicked} id="rating" value={like} userLike={userLike} style={{ position: 'absolute', top: 10, left: 10 }} />
    }

    _getIcon = () => {
        const _self = this,
            { type } = _self.props.data;

        let source = null;

        if (type == FEEDSTYPE['VIDEO'])
            source = ICONS['feedVideo'];
        else if (type == FEEDSTYPE['INSTAGRAM'])
            source = ICONS['feedInstagram']
        else if (type == FEEDSTYPE['CAMPAING'])
            source = ICONS['feedCampaing']

        if (source == null) return null;

        return (
            <Image
                style={{ width: 40, height: 40, position: 'absolute', bottom: 5, right: 5 }}
                source={source}
            />
        );
    }

    _callback = ({ type }) => {
        const _self = this;
        if (type == DOUBLE_CLICK) {
            _self.setState({ userLike: true });
            _self._animate(true, () => {
                setTimeout(() => {
                    _self._animate(false);
                }, 100);
            });
        }

    };

    _getImage = () => {
        const _self = this,
            { image = '', type } = _self.props.data;

        let h = 394;
        if (type == FEEDSTYPE['VIDEO'] || type == FEEDSTYPE['COLLECTION'])
            h = 300;

        return (
            <DoubleClickButton callback={_self._callback}>
                <Image
                    style={{ height: h }}
                    source={{ uri: image }}
                />
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

            </DoubleClickButton>
        );
    }

    _getFooter = () => {
        let view = null;

        const _self = this,
            { desc = '' } = _self.props.data;

        if (desc != '')
            view = (
                <View style={{ flexDirection: 'row', height: 40, borderColor: '#dcdcdc', borderRadius: 3, borderTopEndRadius: 0, borderTopLeftRadius: 0, borderWidth: 1, borderTopWidth: 0 }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.8} onPress={_self._onPress}>
                        <Text style={{ fontFamily: 'Medium', fontSize: 16 }}>{desc}</Text>
                    </TouchableOpacity>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={ICONS['rightArrow']}
                    />
                </View>
            );
        return view;
    }

    render() {
        const _self = this;

        return (
            <View style={{ marginBottom: 20 }}>
                <View style={{ position: 'relative' }}>
                    {_self._getImage()}
                    {_self._getLike()}
                    {_self._getIcon()}
                </View>
                {_self._getFooter()}
            </View>


        )
    }
}

const HTML_DEFAULT_PROPS = {
    tagsStyles: { h1: { color: 'red' } },
    classesStyles: { 'blue': { color: 'blue', fontWeight: '800' } },
    imagesMaxWidth: Dimensions.get('window').width,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: false
};

class Viewers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            html: '<b></b>',
            data: [],
            total: 0,
            refreshing: false,
            loading: false,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!Utils.isArrEqual(this.state.data, nextState.data) || this.state.html !== nextState.html)
            return true;
        return false;
    }

    onDidFocus = () => {
        const _self = this,
            { navigation } = _self.props;
        if (navigation)
            _self._Listener.remove();

        _self.setAjx({ uri: _self.getUri(), data: _self._getData() });
    }

    componentDidMount() {
        const _self = this,
            { navigation } = _self.props;
        _self._isMounted = true;
        if (navigation)
            _self._Listener = navigation.addListener('didFocus', _self.onDidFocus);
        else
            _self.onDidFocus();
    }

    /* https://medium.com/@TaylorBriggs/your-react-component-can-t-promise-to-stay-mounted-e5d6eb10cbb */
    componentWillUnmount() {
        const _self = this,
            { navigation } = _self.props;
        _self._isMounted = false;
        if (navigation)
            _self._Listener.remove();
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

    _addStyle = ({ customClass, data }) => {
        const uri = Utils.getURL({ key: 'style', subKey: 'main' }) + '?' + parseInt(Math.random() * new Date()),
            opened = '<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>',
            closed = '</body></html>',
            css = '<link href="' + uri + '" rel="stylesheet" type="text/css" />',
            htm = opened + '<div class="ems-mobi-app-container ' + customClass + '">' + (css + data) + '</div>' + closed;

        return htm;
    }

    /* özel durumlarda datayı manipule etmek için kullanacağız. Örneğin kampanya sayfası için dönen datayı */
    _customFunc = (data) => {
        const _self = this,
            { customFunc = '' } = _self.props.config;

        if (customFunc == 'campaing') {
            const arr = [];
            Object
                .entries(data)
                .forEach(([ind, item]) => {
                    const obj = {};
                    Object
                        .entries(item['parameters'])
                        .forEach(([childInd, child]) => {
                            obj['id'] = ind;
                            if (child['parameterKey'] == 'prmCamImgMobile')
                                obj['image'] = child['parameterValue'];
                            else if (child['parameterKey'] == 'prmCamID')
                                obj['utpCode'] = child['parameterValue'];
                        })
                    arr.push(obj);
                });
            data = arr;
        }
        return data;
    }

    setAjx = ({ uri, data = {} }, callback) => {
        const _self = this,
            { type = VIEWERTYPE['LIST'] } = _self.props.config;

        AJX({ _self: _self, uri: uri, data: data }, function (res) {

            const { keys, customClass = '', customFunc = '' } = _self.props.config,
                keyArr = keys['arr'] || '',
                keyTotal = keys['total'] || '';

            let data = res.data[keyArr];

            if (customFunc != '')
                data = _self._customFunc(data);

            if (type == VIEWERTYPE['HTMLTOJSON'])
                data = JSON.parse(data)[keys['obj']][keys['objArr']];

            if (type == VIEWERTYPE['LIST'] || type == VIEWERTYPE['HTMLTOJSON'])
                _self.setState({ data: data, total: res.data[keyTotal] || 0 });
            else if (type == VIEWERTYPE['WEBVIEW'])
                _self.setState({ html: _self._addStyle({ customClass: customClass, data: data }) });
            else
                _self.setState({ html: _self._clearTag(data) });

            _self._callback({ type: DATA_LOADED, data: data });

            if (typeof callback !== 'undefined')
                callback();
        });
    }

    _keyExtractor = (item, index) => {
        const _self = this,
            { keys } = _self.props.config;
        return (keys['arr'] + '-' + item[keys['id']] + '-' + index).toString();
    }

    _onGotoDetail = (o) => {
        this.props.navigation.navigate('Detail', o);
    };

    /* item element remove */
    _removeItem = ({ key = '', value = '' }) => {
        const _self = this,
            { data } = _self.state,
            arr = data.filter(function (item, index) {
                return item[key] != value;
            });
        _self.setState({ data: arr });
    }

    /* Viewer genel callback */
    _callback = (obj) => {
        const _self = this,
            { callback, refreshing = false } = _self.props;

        if (refreshing)
            obj['refreshing'] = _self._refreshing;

        if (callback)
            callback(obj);
    }

    /* refreshing */
    _refreshing = () => {
        const _self = this;
        _self.onDidFocus();
    }

    _renderItem = ({ item }) => {
        const _self = this,
            { itemType } = _self.props.config;

        switch (itemType) {
            case ITEMTYPE['ADDRESS']:
                return <AdressListItem callback={_self._callback} onRemove={_self._removeItem} data={item} />;
            case ITEMTYPE['FAVORITE']:
                return <FavoriteListItem onRemove={_self._removeItem} data={item} />;
            case ITEMTYPE['ORDER']:
                return <OrderListItem callback={this._callback} data={item} />;
            case ITEMTYPE['COUPON']:
                return <CouponListItem onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['FOLLOWLIST']:
                return <FollowListItem onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['SERVICELIST']:
                return <ServiceListItem callback={_self._callback} rdx={_self.props.location} data={item} />;
            case ITEMTYPE['VIDEO']:
                return <VideoListItem onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['FEEDS']:
                return <FeedsItem data={item} />;
            case ITEMTYPE['CAMPAING']:
                return <CampaingItem data={item} />;
            default:
                return null;
        }
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

            _self.setAjx({ uri: _self.getUri(), data: data });
        }

    }

    _getFilter = () => {
        const _self = this,
            { itemType, filterData = {} } = _self.props.config,
            { filtered = false } = filterData;

        if (!filtered) return null;
        switch (itemType) {
            case ITEMTYPE['SERVICELIST']:
                return (
                    <ElevatedView
                        elevation={4}
                        style={{
                            backgroundColor: '#FFFFFF',
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 12,
                            paddingTop: 12,
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
                )
            default:
                return null;
        }
    }

    _onRefresh = () => {
        const _self = this,
            { refreshing = true } = _self.props.config;
        if (refreshing)
            _self.setState({ refreshing: true }, () => { _self.setAjx({ uri: _self.getUri(), data: _self._getData() }); })
    }

    _viewable = [];

    _onViewableItemChanged = ({ index, item }) => {
        const _self = this,
            { onViewableItemsChanged } = _self.props;
        if (!_self._viewable.includes(index)) {
            _self._viewable.push(index);
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
    }

    _getViewer = () => {
        const _self = this,
            { type = VIEWERTYPE['LIST'] } = _self.props.config;

        let view = null;
        if (type == VIEWERTYPE['LIST'] || type == VIEWERTYPE['HTMLTOJSON'])
            view = (
                <FlatList
                    data={_self.state.data}
                    keyExtractor={_self._keyExtractor}
                    renderItem={_self._renderItem}
                    ListHeaderComponent={_self._getHeader}
                    refreshing={_self.state.refreshing}
                    onRefresh={_self._onRefresh}
                    onViewableItemsChanged={_self._onViewableItemsChanged}
                />
            );
        else if (type == VIEWERTYPE['HTML'])
            view = (
                <ScrollView style={{ flex: 1, }}>
                    <HTML {...HTML_DEFAULT_PROPS} html={_self.state.html} />
                </ScrollView>
            );
        else if (type == VIEWERTYPE['WEBVIEW'])
            view = (
                <View style={{ flex: 1, }}>
                    <WebView
                        scalesPageToFit={false}
                        automaticallyAdjustContentInsets={false}
                        source={{ html: _self.state.html }}
                    />
                </View>

            );

        return view;
    }

    render() {
        const _self = this;
        return (
            <View style={{ flex: 1, }}>
                {_self._getFilter()}
                <View style={[{ flex: 1, paddingLeft: 10, paddingRight: 10 }, { ..._self.props.style }]}>
                    {_self._getViewer()}
                </View>
            </View >

        )
    }
}

function mapStateToProps(state) { return state }
const Viewer = connect(mapStateToProps)(Viewers);
export { Viewer }