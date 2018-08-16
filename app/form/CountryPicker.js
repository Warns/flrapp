import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { Minus99MultipleSelect } from 'root/app/components/';
import { Container } from './';
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
            value: this.props.data.value.country || -1
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
            value: this.props.data.value.city || -1
        },
        district: {
            uri: Utils.getURL({ key: 'address', subKey: 'district' }),
            keys: {
                arr: 'districts',
                id: 'districtId',
                name: 'districtName'
            },
            name: '',
            value: this.props.data.value.district || -1
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
        _self.setAjx({ key: 'country', data: { countryId: countryId } });
        _self.setAjx({ key: 'city', data: { countryId: countryId } });
        _self.setAjx({ key: 'district', data: { countryId: countryId, cityId: cityId } });

    }

    /* https://medium.com/@TaylorBriggs/your-react-component-can-t-promise-to-stay-mounted-e5d6eb10cbb */
    componentWillUnmount() {
        this._isMounted = false;
    }

    _unshift = ({ key, data = [] }) => {
        /* dönen arrayın ilk elemanına seçiniz eklemek için */
        const _self = this,
            { keys } = _self.config[key] || {},
            obj = {};
        obj[keys['id']] = -1;
        obj[keys['name']] = 'Seçiniz';
        data = [obj, ...data];

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
                _self.setState({ loading: false });
            }
        });
    }

    setAjx = ({ key, data = {} }, callback) => {
        const _self = this,
            { uri, rel, keys } = _self.config[key] || {};
        _self.ajx({ uri: uri, data: data }, function (d) {
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
            _self.setAjx({ key: 'city', data: { countryId: id } }, function () {
                _self.setState({ district: _self._unshift({ key: 'district' }) })
            });
        } else if (key == 'city') {
            _self.config['district']['value'] = -1;
            _self.setAjx({ key: 'district', data: { countryId: countryId, cityId: cityId } });
        } else if (key == 'district') {

        }
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
        const { title, error = false, errorMsg = null, errorState } = this.props.data,
            { countryId, cityId, districtId } = errorState,
            { control = false, } = this.props;

        if (control)
            this._callback();

        return (
            <View>
                <Container titleShow={true} title={'Ülke'} error={countryId['error']} errorMsg={countryId['errorMsg']}>
                    <Minus99MultipleSelect slug={'country'} callback={this._closed} selected={this._getIndex({ key: 'country' })} multiple={false} items={this._getItems({ key: 'country' })} />
                </Container>

                <Container titleShow={true} title={'İl'} error={cityId['error']} errorMsg={cityId['errorMsg']}>
                    <Minus99MultipleSelect slug={'city'} callback={this._closed} selected={this._getIndex({ key: 'city' })} multiple={false} items={this._getItems({ key: 'city' })} />
                </Container>

                <Container titleShow={true} title={'İlçe'} error={districtId['error']} errorMsg={districtId['errorMsg']}>
                    <Minus99MultipleSelect slug={'district'} callback={this._closed} selected={this._getIndex({ key: 'district' })} multiple={false} items={this._getItems({ key: 'district' })} />
                </Container>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

export { CountryPicker };