import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    SERVICE_LIST_CLICKED,
    DATA_LOADED,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';

const Utils = require('root/app/helper/Global.js');

class Warning extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const k = (Platform.OS === 'ios') ? 'IOS' : 'ANDROID';
        return (
            <View style={{ padding: 20 }}>
                <Text style={{ fontFamily: 'Medium' }}>Yakınlardaki mağazalar konusunda size yardımcı olabilmemiz için konumunuzu görmemize izin verin </Text>
                <Text style={{ fontFamily: 'Regular' }}>{k} ayarlarında Flormar konum hizmetlerini etkinleştirin veya manuel olarak adresi arayın</Text>
            </View>
        );
    }
}

class StoreListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            permission: null,
            location: null
        }
    }

    /* public func */
    _getData = () => {
        const _self = this;
        return { ..._self.state };
    }

    componentDidMount() {
        const _self = this,
            { onRef } = _self.props;

        if (onRef)
            onRef(this);
    }

    componentWillUnmount() {
        const _self = this,
            { onRef } = _self.props;

        if (onRef)
            onRef(null);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const _self = this,
            { permission } = _self.props.location,
            { data } = _self.state;
        if (!Utils.isArrEqual(data, nextState.data) || permission != nextProps.location.permission)
            return true;

        return false;
    }

    _callback = (obj) => {
        const _self = this,
            { type } = obj;

        if (type == SERVICE_LIST_CLICKED)
            _self.props.navigation.navigate('Detail', { activeItem: obj['data'], ..._self.state });
        else if (type == DATA_LOADED)
            _self.setState({ data: obj });
    }

    render() {
        const _self = this,
            { filtered = false } = _self.props,
            DATA = {
                itemType: 'serviceList',
                uri: { key: 'service', subKey: 'getServiceList' },
                keys: {
                    id: 'serviceId',
                    arr: 'services',
                },
                refreshing: false
            };

        let view = null;
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

            view = <Viewer config={DATA} callback={_self._callback} />;
        } else if (!filtered) {

            const { permission, location = {} } = _self.props.location || {};

            if (permission) {
                const { latitude = '', longitude = '' } = location['coords'] || {};
                DATA['data'] = {
                    latitude: latitude,
                    longitude: longitude,
                    distance: 5
                };
                view = <Viewer config={DATA} callback={_self._callback} />;
            } else
                view = <Warning />;
        }

        return (
            <View style={{ flex: 1 }}>
                {view}
            </View>
        )
    }
}

function mapStateToProps(state) { return state }
const StoreList = connect(mapStateToProps)(StoreListItem);
export { StoreList };
