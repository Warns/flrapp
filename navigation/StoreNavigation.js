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
import { StoreHeader, MinimalHeader } from 'root/app/components/';
import { LocationService, } from 'root/app/helper/';
import { Viewer } from 'root/app/viewer/';
import { LoadingButton, IconButton } from 'root/app/UI';
import {
    ICONS,
    SERVICE_LIST_CLICKED,
    DATA_LOADED,
    LOCATION_SERVICE,
    NAVIGATE
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';
import { MapView } from 'expo';
const { Marker } = MapView;


const Utils = require('root/app/helper/Global.js');

const DATA = {
    itemType: 'serviceList',
    uri: { key: 'service', subKey: 'getServiceList' },
    keys: {
        id: 'serviceId',
        arr: 'services',
    },
    refreshing: false
};

class Warning extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ padding: 20 }}>
                <Text style={{ fontFamily: 'Medium' }}>Yakınlardaki mağazalar konusunda size yardımcı olabilmemiz için konumunuzu görmemize izin verin </Text>
                <Text style={{ fontFamily: 'Regular' }}>IOS ayarlarında Flormar konum hizmetlerini etkinleştirin veya manuel olarak adresi arayın</Text>
            </View>
        );
    }
}

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
            { permission, location } = _self.props,
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
            { phoneNo = '' } = _self.props.data;

        Linking.openURL('tel:' + phoneNo);
    }

    _getPhoneButton = () => {
        const _self = this,
            { phoneNo = '' } = _self.props.data;

        let view = null;

        if (phoneNo != '')
            view = (
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <LoadingButton onPress={_self._onPress}>{'MAĞAZAYI ARA'}</LoadingButton>
                </View>
            );

        return view;
    }

    render() {
        const _self = this,
            { serviceName, address, } = _self.props.data;
        return (
            <Animated.View style={{ position: 'absolute', bottom: 0, zIndex: 2, backgroundColor: '#FFFFFF', width: '100%', minHeight: 100, paddingLeft: 30, paddingBottom: 20, paddingTop: 30, paddingRight: 20 }}>
                <Text style={{ fontFamily: 'Medium', fontSize: 16, marginBottom: 6 }}>{serviceName}</Text>
                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15, marginBottom: 12 }}>{address}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Regular', fontSize: 15, }}>{_self.state.distance}   {_self.state.duration}</Text>
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
            view = (
                <MapView
                    style={{ flex: 1 }}
                    onPress={() => _self._reset()}
                    ref={(ref) => { _self.Map = ref }}
                    onLayout={() => _self.Map.fitToCoordinates(coordsArr, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}
                    maxZoomLevel={12}
                    zoomControlEnabled={true}
                >
                    {items}
                </MapView>
            );
        }

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

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            permission: null,
            location: null
        }
    }

    _callback = (obj) => {
        const _self = this,
            { type } = obj;

        if (type == SERVICE_LIST_CLICKED)
            _self.props.navigation.navigate('Detail', { activeItem: obj['data'], ..._self.state });
        else if (type == DATA_LOADED)
            _self.setState({ data: obj });
        else if (type == LOCATION_SERVICE)
            _self.setState({ permission: obj['data']['permission'], location: obj['data']['location'] });
    }

    render() {
        const _self = this,
            { permission, location = {} } = _self.state,
            { filtered = false } = _self.props;

        let view = null;
        /*if (permission === true) {
            const { latitude = '', longitude = '' } = location['coords'] || {};*/

            if (filtered) {

                /* 
                    not: iilk açılışta tüm data gelsin denilirse data kısmından countryId silinmeli
                */
                const defCountry = 1,
                    defCity = 1;

                DATA['data'] = {
                    countryId: defCountry,
                    cityId: defCity,
                };

                DATA['filterData'] = {
                    filtered: filtered,
                    id: 'country',
                    value: {
                        country: defCountry,
                        city: defCity,
                        district: 0,
                    },
                    services: true
                };
            } else {
                DATA['data'] = {
                    latitude: latitude,
                    longitude: longitude,
                    distance: 3,
                };
            }

            view = <Viewer config={DATA} callback={_self._callback} />;
        /*} else if (permission === false)
            view = <Warning />;
        else
            view = <LocationService callback={_self._callback} />;*/

        return (
            <View style={{ flex: 1 }}>
                {view}
            </View>
        )
    }
}

_getHeader = ({ props, root = false }) => {
    const _onClose = () => {
        const { navigation } = props;
        if (root)
            store.dispatch({ type: NAVIGATE, value: { item: { navigation: 'Home' } } });
        else
            navigation.goBack(null);
    },
        _onDetailClick = () => {
            const { navigation } = props;
            //navigation.navigate('Detail', {});
        }

    return <MinimalHeader
        onPress={_onClose}
        title={'YAKIN MAĞAZALAR'}
        right={<IconButton callback={_onDetailClick} ico={'map'} icoStyle={{ width: 40, height: 40, resizeMode: 'contain' }} style={{ width: 40, height: 40 }} />}
    />
}

const StoreNavigator = createStackNavigator(
    {
        Main: {
            screen: props => <Main filtered={true} {...props} />,
            navigationOptions: {
                //header: (props) => <StoreHeader {...props} />,
                header: (props) => _getHeader({ props: props, root: true })
            }
        },
        Search: {
            screen: props => <Main filtered={true} {...props} />,
        },
        Detail: {
            screen: props => <Detail {...props} />,
            navigationOptions: {
                header: (props) => _getHeader({ props: props })
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
);

export default StoreNavigator;