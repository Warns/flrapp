import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    Image,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { LocationService, } from 'root/app/helper/';
import { Viewer } from 'root/app/viewer/';
import {
    ICONS,
    SERVICE_LIST_CLICKED,
    DATA_LOADED,
    LOCATION_SERVICE
} from 'root/app/helper/Constant';
import { MapView } from 'expo';

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

    render() {
        const _self = this,
            { serviceName, address, phoneNo } = _self.props.data;
        return (
            <Animated.View style={{ position: 'absolute', bottom: 0, zIndex: 2, backgroundColor: '#FFFFFF', width: '100%', minHeight: 100, paddingLeft: 30, paddingBottom: 20, paddingTop: 30, paddingRight: 20 }}>
                <Text style={{ fontFamily: 'Medium', fontSize: 16, marginBottom: 6 }}>{serviceName}</Text>
                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15, marginBottom: 12 }}>{address}</Text>
                <Text style={{ fontFamily: 'Regular', fontSize: 15, }}>{_self.state.distance}   {_self.state.duration}</Text>
                <Text>{phoneNo}</Text>
            </Animated.View>
        );
    }
}

class Detail extends React.Component {

    constructor(props) {
        super(props);
        const _self = this,
            { activeItem = null, data = {}, location, permission } = _self.props.navigation.state.params;
        _self.Map = null;
        _self.state = {
            markers: data['data'], // all data
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
            { markers, showDetail, detail = {} } = _self.state;
        let view = null;

        if (markers.length > 0) {
            const coordsArr = [],
                items = markers.map((item, index) => {
                    const { serviceId, serviceLatitude, serviceLongitude, serviceName, address } = item;
                    if (serviceLatitude != '' && serviceLongitude != '') {
                        const coords = { latitude: parseFloat(serviceLatitude), longitude: parseFloat(serviceLongitude) };
                        coordsArr.push(coords);

                        let op = 1;
                        if (showDetail && serviceId != detail['serviceId'])
                            op = 0.5;

                        return (
                            <MapView.Marker
                                key={index}
                                coordinate={coords}
                                onPress={e => { e.stopPropagation(); _self._onMarkerClicked(e.nativeEvent, index) }}
                                style={{ opacity: op }}
                            >
                                <View>
                                    <Image source={ICONS['storeLocation']} style={{ width: 40, height: 40 }} />
                                </View>
                            </MapView.Marker>
                        );
                    }
                });
            view = (
                <MapView
                    style={{ flex: 1 }}
                    onPress={() => _self._reset()}
                    ref={(ref) => { _self.Map = ref }}
                    onLayout={() => _self.Map.fitToCoordinates(coordsArr, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}
                    maxZoomLevel={13}
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
            { permission, location = {} } = _self.state;

        let view = null;
        if (permission === true) {
            const { latitude = '', longitude = '' } = location['coords'] || {};
            
            DATA['data'] = {
                latitude: latitude,
                longitude: longitude
            };
            
            DATA['filterData'] = {
                id: 'country',
                value: {  
                    country: 1,
                    city: 0,
                    district: 0,
                }
            };

            view = <Viewer config={DATA} callback={_self._callback} />;
        } else if (permission === false)
            view = <Warning />;
        else
            view = <LocationService callback={_self._callback} />;

        return (
            <View style={{ flex: 1 }}>
                {view}
            </View>
        )
    }
}

const StoreNavigator = createStackNavigator(
    {
        Main: {
            screen: props => <Main {...props} />,
        },
        Detail: {
            screen: props => <Detail {...props} />,
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