import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
} from 'react-native';
import { Container, Minus99MultipleSelect } from './';
import {
    ICONS,
} from 'root/app/helper/Constant';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

class CountryPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            country: [],
            city: [],
            district: [],
            loading: false,
        }
    }

    _addServices = ({ type, obj }) => {
        const _self = this,
            { services = false } = _self.props.data;
        if (services) {
            if (type == 'country')
                obj['countryOfServiceFl'] = true;
            else if (type == 'city')
                obj['cityOfServiceFl'] = true;
            else if (type == 'district')
                obj['districtOfServiceFl'] = true;
        }
        return obj;
    }

    _getDefValue = (key) => {
        const _self = this,
            { value = {} } = _self.props.data || {},
            k = value[key];
        return typeof k !== 'undefined' ? k : -1;
    }

    config = {
        country: {
            uri: Utils.getURL({ key: 'address', subKey: 'country' }),
            rel: ['city', 'district'],
            keys: {
                arr: 'countries',
                id: 'countryId',
                name: 'countryName'
            },
            name: '',
            value: this._getDefValue('country'),
            drpChoose: this.props.countryChoose || Translation['dropdown']['choose']
        },
        city: {
            uri: Utils.getURL({ key: 'address', subKey: 'city' }),
            rel: ['district'],
            keys: {
                arr: 'cities',
                id: 'cityId',
                name: 'cityName'
            },
            name: '',
            value: this._getDefValue('city'),
            drpChoose: this.props.cityChoose || Translation['dropdown']['choose']
        },
        district: {
            uri: Utils.getURL({ key: 'address', subKey: 'district' }),
            keys: {
                arr: 'districts',
                id: 'districtId',
                name: 'districtName'
            },
            name: '',
            value: this._getDefValue('district'),
            drpChoose: this.props.districtChoose || Translation['dropdown']['choose']
        },
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!Utils.isArrEqual(this.state.country, nextState.country) || !Utils.isArrEqual(this.state.city, nextState.city) || !Utils.isArrEqual(this.state.district, nextState.district) || nextProps.control != this.props.control)
            return true;
        return false;
    }

    componentDidMount() {
        const _self = this,
            countryId = _self.config['country']['value'],
            cityId = _self.config['city']['value'];

        _self._isMounted = true;
        _self.setAjx({ key: 'country', data: _self._addServices({ type: 'country', obj: { countryId: 0 } }) });
        _self.setAjx({ key: 'city', data: _self._addServices({ type: 'city', obj: { countryId: countryId } }) });
        _self.setAjx({ key: 'district', data: _self._addServices({ type: 'district', obj: { countryId: countryId, cityId: cityId } }) });
    }

    /* https://medium.com/@TaylorBriggs/your-react-component-can-t-promise-to-stay-mounted-e5d6eb10cbb */
    componentWillUnmount() {
        this._isMounted = false;
    }

    _unshift = ({ key, data = [] }) => {
        /* dönen arrayın ilk elemanına seçiniz eklemek için */
        const _self = this,
            { keys, drpChoose } = _self.config[key] || {},
            obj = {};
        obj[keys['id']] = -1;
        obj[keys['name']] = drpChoose;
        data = [obj, ...data];

        return data;
    }

    setAjx = ({ key, data = {} }, callback) => {
        const _self = this,
            { uri, rel, keys } = _self.config[key] || {};
        Globals.AJX({ _self: _self, uri: uri, data: data }, function (d) {
            let obj = {},
                arr = d['data'][keys['arr']];

            obj[key] = _self._unshift({ key: key, data: arr });

            _self.setState(obj);

            if (typeof callback !== 'undefined')
                callback();
        });
    }

    _getIndex = ({ key }) => {
        /* multipleSelect başlangıç değerini belirlemek */
        let arr = [];
        const _self = this,
            data = this.state[key],
            { keys, value } = _self.config[key] || {};

        data.forEach((item, ind) => {
            if (value == item[keys['id']]) {

                _self.config[key]['name'] = item[keys['name']];

                arr.push(ind);
            }

        });

        return arr;
    }

    _getItems = ({ key }) => {
        /* dönen datayı multipleSelect istediği formata çevirmek */
        let _self = this,
            data = this.state[key],
            { keys } = _self.config[key] || {};

        return data.map((item, order) => {
            return { order: order, id: item[keys['id']], name: item[keys['name']] };
        });
    }

    _closed = ({ selected, key }) => {
        const _self = this,
            id = selected[0]['id'],
            name = selected[0]['name'],
            { rel = [], keys } = _self.config[key] || {};

        _self.config[key]['value'] = id;
        _self.config[key]['name'] = name;

        const countryId = _self.config['country']['value'],
            cityId = _self.config['city']['value'],
            districtId = _self.config['district']['value'];

        if (key == 'country') {
            _self.config['city']['value'] = -1;
            _self.config['district']['value'] = -1;
            _self.setAjx({ key: 'city', data: _self._addServices({ type: 'city', obj: { countryId: id } }) }, function () {
                _self.setState({ district: _self._unshift({ key: 'district' }) })
            });
        } else if (key == 'city') {
            _self.config['district']['value'] = -1;
            _self.setAjx({ key: 'district', data: _self._addServices({ type: 'district', obj: { countryId: countryId, cityId: cityId } }) });
        } else if (key == 'district') {

        }

        /* her bir seçimde dışarı callback döndürmek için kullanılır */
        const { selectionValue = false } = this.props;
        if (selectionValue)
            _self._callback();
    }

    _callback = () => {
        const _self = this,
            obj = {},
            arr = [];

        Object.entries(_self.config).forEach(([key, item]) => {
            const { id, name } = item['keys'];
            obj[id] = item['value'];
            obj[name] = item['name'];


        });

        Object.entries(obj).forEach(([key, value]) => {
            arr.push({ key: key, title: 'İl', value: value, validation: [{ key: 'isSelection' }] })
        });

        const { callback } = this.props;
        if (callback)
            callback({
                multiValue: arr
            });

    }

    render() {
        const _self = this,
            { errorState = {} } = _self.props.data,
            { countryId = {}, cityId = {}, districtId = {} } = errorState,
            { control = false, countryHeaderShow = true, cityHeaderShow = true, districtHeaderShow = true, } = _self.props,
            ico = <Image source={ICONS['drpIco']} style={{ width: 12, height: 8 }} />;

        if (control)
            _self._callback();

        return (
            <View style={{ ..._self.props.style }}>
                <Container
                    containerStyle={{ ..._self.props.countryContainerStyle }}
                    wrapperStyle={{ ..._self.props.countryWrapperStyle }}
                    showHeader={countryHeaderShow}
                    title={'Ülke'}
                    error={countryId['error'] || false}
                    errorMsg={countryId['errorMsg'] || null}
                >
                    <Minus99MultipleSelect
                        slug={'country'}
                        callback={_self._closed}
                        selected={_self._getIndex({ key: 'country' })}
                        multiple={false}
                        items={_self._getItems({ key: 'country' })}
                    />
                    {ico}
                </Container>

                <Container
                    containerStyle={{ ..._self.props.cityContainerStyle }}
                    wrapperStyle={{ ..._self.props.cityWrapperStyle }}
                    showHeader={cityHeaderShow}
                    title={'İl'}
                    error={cityId['error'] || false}
                    errorMsg={cityId['errorMsg'] || null}
                >
                    <Minus99MultipleSelect
                        slug={'city'}
                        callback={_self._closed}
                        selected={_self._getIndex({ key: 'city' })}
                        multiple={false}
                        items={_self._getItems({ key: 'city' })}
                    />
                    {ico}
                </Container>

                <Container
                    containerStyle={{ ..._self.props.districtContainerStyle }}
                    wrapperStyle={{ ..._self.props.districtWrapperStyle }}
                    showHeader={districtHeaderShow}
                    title={'İlçe'}
                    error={districtId['error'] || false}
                    errorMsg={districtId['errorMsg'] || null}
                >
                    <Minus99MultipleSelect
                        slug={'district'}
                        callback={_self._closed}
                        selected={_self._getIndex({ key: 'district' })}
                        multiple={false}
                        items={_self._getItems({ key: 'district' })} />
                    {ico}
                </Container>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

export { CountryPicker };