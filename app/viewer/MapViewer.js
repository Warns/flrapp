import React, { Component } from 'react';
import {
    View,
    Modal,
    Animated,
    Text,
    Image,
} from 'react-native';
import { Viewer } from './';
import { MapView } from 'expo';
import { LocationService, } from 'root/app/helper/';
import {
    ICONS,
    LOCATION_SERVICE,
    SERVICE_LIST_CLICKED,
    DATA_LOADED,
} from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');
const DATA = {
    itemType: 'serviceList',
    uri: { key: 'service', subKey: 'getServiceList' },
    keys: {
        id: 'serviceId',
        arr: 'services',
    }
};
const CONFIG = {
    initialRegion: {
        latitude: 39.08719,
        longitude: 35.177914,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }
};

/*
                            
    {
      "address": "Batı Mah.19 Mayıs cad.no:43  Pendik/İstanbul",
      "cityId": 1,
      "countryId": 1,
      "districtName": " Pendik 19 Mayıs Cad",
      "fax": "",
      "phoneNo": "5307672993",
      "picture": "http://mcdn.flormar.com.tr",
      "serviceId": 13874,
      "serviceLatitude": "40.8776112",
      "serviceLongitude": "29.2293183",
      "serviceName": " Pendik 19 Mayıs Cad",
    }
                
*/

class AddressDetail extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const _self = this,
            { serviceName, address, phoneNo } = _self.props.data;
        return (
            <Animated.View style={{ position: 'absolute', bottom: 0, zIndex: 2, backgroundColor: '#FFFFFF', width: '100%', minHeight: 100, paddingLeft: 30, paddingBottom: 20, paddingTop: 30, paddingRight: 20 }}>
                <Text style={{ fontFamily: 'Medium', fontSize: 16, marginBottom: 6 }}>{serviceName}</Text>
                <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15, marginBottom: 12 }}>{address}</Text>
                <Text>{phoneNo}</Text>
            </Animated.View>
        );
    }
}

class MapViewer extends Component {
    constructor(props) {
        super(props);
        this.Map = null;
        this.state = {
            markers: [],
            coords: [],
            isVisible: false, // modal show, hide
            showDetail: false, // address detail show, hide
            detail: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!Utils.isArrEqual(this.state.markers, nextState.markers) || this.state.isVisible != nextState.isVisible || this.state.showDetail != nextState.showDetail || this.state.detail != nextState.detail)
            return true;
        return false;
    }

    _callback = (obj) => {
        const _self = this,
            { type, data = [] } = obj;
        if (type == DATA_LOADED)
            _self.setState({ markers: data, });
        else if (type == SERVICE_LIST_CLICKED) {
            /*const { serviceLatitude, serviceLongitude } = data,
                coords = { latitude: parseFloat(serviceLatitude), longitude: parseFloat(serviceLongitude) };

            _self.Map.animateToRegion(_self._getRegionForCoordinates([coords]), 555);*/

            _self.setState({ isVisible: true, showDetail: true, detail: obj['data'] || {} });
        } else if (type == LOCATION_SERVICE) {
            console.log(obj['data']['permission'], obj['data']['location']['coords']);
        }
    }

    _getRegionForCoordinates = (points) => {

        let minX, maxX, minY, maxY;

        // init first point
        ((point) => {
            minX = point.latitude;
            maxX = point.latitude;
            minY = point.longitude;
            maxY = point.longitude;
        })(points[0]);

        // calculate rect
        points.map((point) => {
            minX = Math.min(minX, point.latitude);
            maxX = Math.max(maxX, point.latitude);
            minY = Math.min(minY, point.longitude);
            maxY = Math.max(maxY, point.longitude);
        });

        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;
        const deltaX = (maxX - minX);
        const deltaY = (maxY - minY);

        return {
            latitude: midX,
            longitude: midY,
            latitudeDelta: deltaX,
            longitudeDelta: deltaY
        };
    }

    _onMarkerClicked = (evt, index) => {
        const _self = this,
            { markers } = _self.state;

        _self.setState({ showDetail: true, detail: markers[index] });
    }

    _addressDetail = () => {
        const _self = this,
            { showDetail = false, detail } = _self.state;
        let view = null;
        if (showDetail)
            view = <AddressDetail data={detail} />;
        return view;
    }


    renderCluster = (cluster, onPress) => {
        const pointCount = cluster.pointCount,
            coordinate = cluster.coordinate,
            clusterId = cluster.clusterId

        return (
            <MapView.Marker identifier={`cluster-${clusterId}`} coordinate={coordinate} onPress={onPress}>
                <View style={styles.clusterContainer}>
                    <Text style={styles.clusterText}>
                        {pointCount}
                    </Text>
                </View>
            </MapView.Marker>
        )
    }

    renderMarker = (item) => {
        const { serviceLatitude, serviceLongitude, serviceName, address } = item;
        if (serviceLatitude != '' && serviceLongitude != '') {
            const coords = { latitude: parseFloat(serviceLatitude), longitude: parseFloat(serviceLongitude) };
            coordsArr.push(coords);
            return (
                <MapView.Marker
                    key={index}
                    coordinate={coords}
                    onPress={e => _self._onMarkerClicked(e.nativeEvent, index)}
                >
                    <View>
                        <Image source={ICONS['storeLocation']} style={{ width: 40, height: 40 }} />
                    </View>
                </MapView.Marker>
            );
        } else
            return null;
    }

    _getViewer = () => {
        const _self = this,
            { markers } = _self.state;
        let view = null;

        if (markers.length > 0) {
            const coordsArr = [],
                items = markers.map((item, index) => {
                    const { serviceLatitude, serviceLongitude, serviceName, address } = item;
                    if (serviceLatitude != '' && serviceLongitude != '') {
                        const coords = { latitude: parseFloat(serviceLatitude), longitude: parseFloat(serviceLongitude) };
                        coordsArr.push(coords);
                        return (
                            <MapView.Marker
                                key={index}
                                coordinate={coords}
                                onPress={e => _self._onMarkerClicked(e.nativeEvent, index)}
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
                    initialRegion={CONFIG['initialRegion']}
                    ref={(ref) => { this.Map = ref }}
                    onLayout={() => this.Map.fitToCoordinates(coordsArr, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}
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
        const _self = this,
            modal = (
                <Modal
                    animationType="none"
                    transparent={false}
                    visible={_self.state.isVisible}
                    >
                    <View style={{ position: 'relative', flex: 1 }}>
                        {_self._addressDetail()}
                        {_self._getViewer()}
                    </View>
                </Modal>
            );
        return (
            <View style={{ flex: 1 }}>
                <LocationService callback={this._callback} />
                <Viewer {..._self.props} style={{ paddingLeft: 10, paddingRight: 10 }} config={DATA} callback={this._callback} />
                {modal}
            </View>
        )
    }
}

export { MapViewer };