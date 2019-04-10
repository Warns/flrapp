import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    Image,
    Platform,
    Linking,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { MinimalHeader } from 'root/app/components/';
import { StoreList } from 'root/app/viewer/';
import { DefaultButton, IconButton } from 'root/app/UI';
import {
    ICONS,
    SET_LOCATION,
    NAVIGATE
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';
import { MapView } from 'expo';
const { Marker } = MapView;
const Utils = require('root/app/helper/Global.js');

const ZOOM_LEVEL = Platform.OS == 'android' ? 16 : 12;

class AddressDetail extends Component {
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

    setAjx = async () => {
        const _self = this,
            { permission, location } = store.getState().location || {},
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

    _callToStore = () => {
        const _self = this,
            { phoneNo = '' } = _self.props.data;

        if (phoneNo != '')
            Linking.openURL('tel:' + Utils.cleanText(phoneNo));
    }

    _directions = () => {
        const _self = this,
            { permission = false, location = {} } = store.getState().location || {},
            { latitude = '', longitude = '' } = ( location || {} )['coords'] || {},
            { serviceLatitude = '', serviceLongitude = '' } = _self.props.data;

        if (serviceLatitude != '' && serviceLongitude != '') {
            let uri = 'https://www.google.com/maps/dir/?api=1&origin={{origin}}&destination={{destination}}&travelmode=driving',
                destination = (serviceLatitude + ',' + serviceLongitude),
                origin = (latitude + ',' + longitude);
            if (!permission)
                uri = 'http://maps.google.com/maps?q={{destination}}';

            uri = uri.replace(/{{destination}}/g, destination).replace(/{{origin}}/g, origin);

            Linking.openURL(uri);
        }
    }

    _getPhoneButton = () => {
        const _self = this,
            { phoneNo = '' } = _self.props.data;

        let view = null;

        if (phoneNo != '')
            view = (
                <DefaultButton wrapperStyle={{ marginLeft: 5, flex: 1 }} callback={_self._callToStore} name={'MAĞAZAYI ARA'} />
            );

        return view;
    }

    _getDirections = () => {
        const _self = this,
            { serviceLatitude = '', serviceLongitude = '' } = _self.props.data;

        let view = null;

        if (serviceLatitude != '' && serviceLongitude != '')
            view = (
                <DefaultButton wrapperStyle={{ marginRight: 5, flex: 1 }} callback={_self._directions} name={'YOL TARİFİ'} />
            );

        return view;
    }

    render() {
        const _self = this,
            { serviceName, address, } = _self.props.data;

        const distanceInfo = _self.state.distance ? <Text style={{ fontSize: 15, marginRight: 30, marginBottom: 12 }}>{_self.state.distance}   {_self.state.duration}</Text> : null;

        return (
            <Animated.View style={{ position: 'absolute', bottom: 0, zIndex: 2, backgroundColor: '#FFFFFF', width: '100%', minHeight: 100, paddingLeft: 30, paddingBottom: 20, paddingTop: 30, paddingRight: 30 }}>
                <Text style={{ fontFamily: 'Medium', fontSize: 16, marginBottom: 10 }}>{serviceName.toUpperCase()}</Text>
                <Text style={{ fontSize: 15, marginBottom: 12 }}>{address}</Text>
                {distanceInfo}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {_self._getDirections()}
                    {_self._getPhoneButton()}
                </View>
            </Animated.View>
        );
    }
}

class Detail extends React.Component {

    constructor(props) {
        super(props);
        const _self = this,
            { navigation = {} } = _self.props,
            { activeItem = null, data = {}, location, permission } = navigation.state.params;

        _self.Map = null;
        _self.state = {
            markers: data['data'] || [], // all data
            showDetail: activeItem ? true : false, // address detail show, hide
            detail: activeItem || {}, // address detail data
            location: location,
            permission: permission
        };
    }

    _onMarkerClicked = (evt, index) => {
        const _self = this,
            { markers } = _self.state;

        _self._reset();
        setTimeout(() => {
            _self.setState({ showDetail: true, detail: markers[index] });
        }, 1);
    }

    _addressDetail = () => {
        const _self = this,
            { showDetail = false, detail, location, permission } = _self.state;
        let view = null;
        if (showDetail)
            view = <AddressDetail data={detail} location={location} permission={permission} />;
        return view;
    }

    /* https://github.com/react-community/react-native-maps/issues/758 */
    _reset = () => {
        const _self = this;
        _self.setState({ showDetail: false, })
    }

    _getViewer = () => {
        const _self = this,
            { markers, showDetail, detail = {} } = _self.state,
            act = Object.entries(detail).length > 0 ? true : false;/* active item gonderilmişse ona odaklansın gönderilmemişse tüm gelen datanın ortalama corrdinatına odaklansın */

        let view = null;

        if (markers.length > 0) {

            const coordsArr = act ? [{ latitude: parseFloat(detail['serviceLatitude'] || ''), longitude: parseFloat(detail['serviceLongitude'] || '') }] : [],
                items = markers.map((item, index) => {
                    const { serviceId, serviceLatitude, serviceLongitude, serviceName, address } = item;
                    if (serviceLatitude != '' && serviceLongitude != '') {
                        const coords = { latitude: parseFloat(serviceLatitude), longitude: parseFloat(serviceLongitude) };

                        if (!act)
                            coordsArr.push(coords);

                        let op = 1;
                        if (showDetail && serviceId != detail['serviceId'])
                            op = 0.5;

                        let img = null;
                        if (Platform.OS === 'ios')
                            img = (
                                <View>
                                    <Image source={ICONS['storeLocation']} style={{ width: 40, height: 40 }} />
                                </View>
                            );

                        return (
                            <Marker
                                key={index}
                                coordinate={coords}
                                onPress={e => { e.stopPropagation(); _self._onMarkerClicked(e.nativeEvent, index) }}
                                style={{ opacity: op }}
                            >
                                {img}
                            </Marker>
                        );
                    }
                });

            const { location = {}, } = store.getState(),
                { permission } = location;

            if (permission) {

                items.push(
                    <Marker
                        key={'myLocation'}
                        coordinate={location['location']['coords']}
                    >
                        <View>
                            <Image source={ICONS['myLocation']} style={{ width: 40, height: 40 }} />
                        </View>
                    </Marker>
                );
            }

            view = (
                <MapView
                    style={{ flex: 1 }}
                    onPress={() => _self._reset()}
                    ref={(ref) => { _self.Map = ref }}
                    onLayout={() => _self.Map.fitToCoordinates(coordsArr, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}
                    maxZoomLevel={ZOOM_LEVEL}
                    zoomControlEnabled={true}
                >
                    {items}
                </MapView>
            );
        } else
            view = (
                <MapView
                    style={{ flex: 1 }}
                    ref={(ref) => { _self.Map = ref }}
                    maxZoomLevel={ZOOM_LEVEL}
                    zoomControlEnabled={true}
                />
            );

        return view;
    }

    render() {
        const _self = this;
        return (
            <View style={{ position: 'relative', flex: 1 }}>
                {_self._addressDetail()}
                {_self._getViewer()}
            </View>
        );
    }
}

/* permissions */
_getLocationAsync = async (success, error) => {
    const { Location, Permissions } = Expo;
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        error('Permission to access location was denied');
        throw new Error('Location permission not granted');
    }

    let location = await Location.getCurrentPositionAsync({});
    success(location);
};
export default class StoreNavigator extends Component {
    constructor(props) {
        super(props);
        _self = this;
    }

    componentWillMount() {
        const _self = this;
        _getLocationAsync((k) => {
            store.dispatch({ type: SET_LOCATION, value: { permission: true, location: k } });
        }, (k) => {
            store.dispatch({ type: SET_LOCATION, value: { permission: false, location: null } });
        });
    }

    _getHeader = ({ props, root = false, ref = '' }) => {
        const _onClose = () => {
            const { navigation } = props;
            if (root)
                store.dispatch({ type: NAVIGATE, value: { item: { navigation: 'Home' } } });
            else
                navigation.goBack(null);
        },
            buttonWrp = { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
            _onMain = () => {
                const { navigation } = props;
                navigation.navigate('Main', {});
            },
            _onSearch = () => {
                const { navigation } = props;
                navigation.navigate('Search', {});
            },
            _onDetail = () => {
                const { navigation } = props,
                    data = ref == 'main' ? _self._main._getData() : _self._search._getData();

                navigation.navigate('Detail', data);
            };

        let ico = null;
        if (ref == 'main')
            ico = (
                <View style={buttonWrp}>
                    <IconButton callback={_onSearch} ico={'searchMap'} />
                    <IconButton callback={_onDetail} ico={'map'} />
                </View>
            );
        else if (ref == 'search')
            ico = (
                <View style={buttonWrp}>
                    <IconButton callback={_onMain} ico={'list'} />

                </View>
            );
        else
            ico = (
                <View style={buttonWrp}>
                    <IconButton callback={_onSearch} ico={'searchMap'} />
                    <IconButton callback={_onMain} ico={'list'} />
                </View>
            );

        return <MinimalHeader
            onPress={_onClose}
            title={'YAKIN MAĞAZALAR'}
            right={ico}
        />
    }

    _main = null;
    _search = null;

    _StoreNavigator = createStackNavigator(
        {
            Main: {
                screen: props => <StoreList onRef={ref => _self._main = ref} filtered={false} {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props, root: true, ref: 'main' })
                }
            },
            Search: {
                screen: props => <StoreList onRef={ref => _self._search = ref} filtered={true} {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props, ref: 'search' })
                }
            },
            Detail: {
                screen: props => <Detail {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props, ref: 'detail' })
                }
            },
        },
        {
            navigationOptions: {
                header: null
            },
            cardStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
            }
        }
    )

    render() {
        return <this._StoreNavigator />
    }
}