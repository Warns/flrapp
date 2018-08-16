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
    Image
} from 'react-native';
import HTML from 'react-native-render-html';
import {
    ICONS,
    VIEWERTYPE,
    ITEMTYPE,
    DATA_LOADED,
    SERVICE_LIST_CLICKED,
    ORDER_LIST_CLICKED,
    ADDRESS_LIST_CLICKED
} from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

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

class AdressListItem extends Component {
    /*
    {
        "addressId": 0,
        "addressName": "string",
        "fullName": "string",
        "address": "string",
        "countryId": 0,
        "countryName": "string",
        "cityId": 0,
        "cityName": "string",
        "districtId": 0,
        "districtName": "string",
        "corprateFl": true,
        "companyName": "string",
        "taxOffice": "string",
        "taxNumber": "string",
        "phone": "string",
        "mobilePhone": "string",
        "tckn": "string",
        "zipCode": "string",
        "readOnly": true
      }
    */

    constructor(props) {
        super(props);
    }

    _onPress = () => {
        const _self = this,
            { callback, data } = _self.props;
        if (callback)
            callback({ type: ADDRESS_LIST_CLICKED, data: data });
    }

    render() {
        const _self = this,
            { addressId, addressName } = _self.props.data;
        return (
            <TouchableOpacity activeOpacity={0.4} onPress={_self._onPress}>
                <Text>{addressId}</Text>
                <Text>{addressName}</Text>
            </TouchableOpacity>
        )
    }
}



class FavoriteListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { productName } = this.props.data;
        return (
            <Text>{productName}</Text>
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
    constructor(props) {
        super(props);
    }
    render() {
        const { productName } = this.props.data;
        return (
            <Text>{productName}</Text>
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

    componentWillUnmount() {
        this._isMounted = false;
    }

    setAjx = () => {
        const _self = this,
            origin = { lat: 41.020334, long: 28.889993499999996 },
            { serviceLatitude = '', serviceLongitude = '' } = _self.props.data;
        if (serviceLatitude != '' && serviceLongitude != '') {
            const uri = Utils.getCustomURL({ key: 'location', origins: (origin['lat'] + ',' + origin['long']), destinations: (serviceLatitude + ',' + serviceLongitude) });

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

const HTML_DEFAULT_PROPS = {
    tagsStyles: { h1: { color: 'red' } },
    classesStyles: { 'blue': { color: 'blue', fontWeight: '800' } },
    imagesMaxWidth: Dimensions.get('window').width,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: false
};

class Viewer extends Component {

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

    ajx = ({ uri, data = {} }, callback) => {
        const _self = this;
        _self.setState({ loading: true });
        Globals.fetch(uri, JSON.stringify(data), (answer) => {
            if (_self._isMounted) {
                if (answer === 'error') {
                    console.log('fatalllll error: could not get access token');
                } else {
                    if (answer.status == 200) {
                        if (typeof callback !== 'undefined')
                            callback(answer);
                    } else {

                    }
                }
                _self.setState({ loading: false, refreshing: false });
            }
        });
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

    setAjx = ({ uri, data = {} }, callback) => {
        const _self = this,
            { type = VIEWERTYPE['LIST'] } = _self.props.config;

        _self.ajx({ uri: uri, data: data }, function (res) {

            const { keys } = _self.props.config,
                keyArr = keys['arr'] || '',
                keyTotal = keys['total'] || '';

            let data = res.data[keyArr];
            if (type == VIEWERTYPE['HTMLTOJSON'])
                data = JSON.parse(data)[keys['obj']][keys['objArr']];

            if (type == VIEWERTYPE['LIST'] || type == VIEWERTYPE['HTMLTOJSON'])
                _self.setState({ data: data, total: res.data[keyTotal] || 0 });
            else if (type == VIEWERTYPE['WEBVIEW'])
                _self.setState({ html: data });
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
        return (keys['arr'] + '-' + item[keys['id']]).toString();
    }

    _onGotoDetail = (o) => {
        this.props.navigation.navigate('Detail', o);
    };

    /* Viewer genel callback */
    _callback = (obj) => {
        const _self = this,
            { callback } = _self.props;
        if (callback)
            callback(obj);
    }

    _renderItem = ({ item }) => {
        const _self = this,
            { itemType } = _self.props.config;

        switch (itemType) {
            case ITEMTYPE['ADDRESS']:
                return <AdressListItem callback={this._callback} onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['FAVORITE']:
                return <FavoriteListItem onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['ORDER']:
                return <OrderListItem callback={this._callback} data={item} />;
            case ITEMTYPE['COUPON']:
                return <CouponListItem onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['FOLLOWLIST']:
                return <FollowListItem onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['SERVICELIST']:
                return <ServiceListItem callback={this._callback} onPress={this._onGotoDetail} data={item} />;
            case ITEMTYPE['VIDEO']:
                return <VideoListItem onPress={this._onGotoDetail} data={item} />;
            default:
                return null;
        }
    }

    _getHeader = () => {
        let header = null;
        return header;
    }

    _onRefresh = () => {
        const _self = this,
            { refreshing = true } = _self.props.config;
        if (refreshing)
            _self.setState({ refreshing: true }, () => { _self.setAjx({ uri: _self.getUri(), data: _self._getData() }); })
    }

    _getViewer = () => {
        const _self = this,
            { type = VIEWERTYPE['LIST'] } = _self.props.config;

        let view = null;
        if (type == VIEWERTYPE['LIST'] || type == VIEWERTYPE['HTMLTOJSON'])
            view = (
                <FlatList
                    style={[{ paddingLeft: 10, paddingRight: 10 }, { ..._self.props.style }]}
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._getHeader}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            );
        else if (type == VIEWERTYPE['HTML'])
            view = (
                <ScrollView style={{ flex: 1, }}>
                    <HTML {...HTML_DEFAULT_PROPS} html={this.state.html} />
                </ScrollView>
            );
        else if (type == VIEWERTYPE['WEBVIEW'])
            view = (
                <WebView source={{ html: this.state.html }} />
            );

        return view;
    }

    render() {
        const _self = this;
        return _self._getViewer();
    }
}

export { Viewer };