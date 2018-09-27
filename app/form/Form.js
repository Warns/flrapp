import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { FormInput, SelectBox, CheckBox, RadioGroup, DateTimePicker, ErrorBox, CountryPicker, HiddenObject } from './';
import { CustomKeyboard } from 'root/app/helper';
import { LoadingButton } from 'root/app/UI';
const Validation = require('root/app/helper/Validation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validation: false,
            loading: false,
            errMsg: [],
            defaultData: [],
            show: true, // form gizle-goster
        };
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
        _self.setAjx();
    }

    componentWillUnmount() {
        const _self = this,
            { data = {} } = _self.props;
        _self._isMounted = false;

        /*  
            not: Form Modalda açıldığında hatalı giriş yapılmışsa ve modal kapatılıp tekrar açılmışsa hata mesajını resetlemek için kullanılır 
        */
        data['fields'].map((item, ind) => {
            item['items'].map((itm) => {
                const { type } = itm;
                if (type == 'countryPicker')
                    itm['errorState'] = {
                        countryId: { error: false, errorMsg: null },
                        cityId: { error: false, errorMsg: null },
                        districtId: { error: false, errorMsg: null }
                    }
                else{
                    itm['error'] = false;
                    itm['errorMsg'] = null;
                }  
            });
        });
    }

    setAjx = () => {
        const _self = this,
            { defValue = '' } = _self.props.data;
        if (defValue != '') {
            /* default value varsa formu gizleriz serverdan default dataları çektikten sonra formu tekrardan gösteririz. */
            const { postData = {} } = _self.props;
            _self.setState({ show: false });
            _self.ajx({ uri: defValue.uri || '', data: postData }, function ({ type, d }) {
                if (type == 'success') {
                    const keys = defValue['keys'] || '';
                    let data = [];
                    if (keys != '')
                        data = d.data[keys['arr']][0] || [];
                    else
                        data = d.data || [];

                    _self.setState({ defaultData: data, show: true });
                }
            })
        }
    }

    ajx = ({ uri, data = {} }, callback) => {
        const _self = this;
        _self.setState({ loading: true });
        Globals.fetch(uri, JSON.stringify(data), (answer) => {
            console.log(answer);
            if (_self._isMounted) {
                if (answer === 'error') {
                    console.log('fatalllll error: could not get access token');
                } else {
                    if (answer.status == 200) {
                        if (typeof callback !== 'undefined')
                            callback({ type: 'success', d: answer });
                    } else {
                        if (typeof callback !== 'undefined')
                            callback({ type: 'error', d: answer });
                    }
                }
                _self.setState({ loading: false });
            }
        });
    }

    totalCount = 0
    count = 0
    arr = []

    _checkArr = (obj) => {
        /* multi value gibi özel durumlarda dönen çoklu datayı tekilleştirmek. Örneğin countrypicker dan dönen data. */
        const arr = [];
        obj.forEach((item) => {
            const k = item['multiValue'] || [];
            if (k.length > 0)
                k.forEach((itm) => {
                    arr.push(itm);
                });
            else
                arr.push(item)
        });
        return arr;
    }

    _callback = (obj) => {
        const _t = this;
        _t.arr.push(obj);
        _t.count++;
        if (_t.count >= _t.totalCount) {
            _t._validation(_t.arr);
            _t.count = 0;
            _t.arr = [];
        }
    }

    /* 
    birden fazla boşluk bırakınca post datasında hata dönüyordu fazla boşlukları sildiriyoruz. örnek hata
    
    {
        "Message": "The request is invalid.",
        "ModelState": {
            "request.Address": [
            "Unsafe Value :Address"
            ]
    }
}
    
    */
    _clear = (val) => {
        if (typeof val == 'string')
            return val.replace(/(\s)+/g, "$1");
        else
            return val;
    }

    _validation = (obj) => {
        let control = true;
        const _t = this,
            allErrMsg = [],
            err = {},
            success = {},
            { fields, allErrMessage = false } = _t.props.data;

        obj = _t._checkArr(obj);

        obj.forEach((item) => {
            const title = item['title'], key = item['key'], val = _t._clear(item['value']), validation = item['validation'] || [];

            if (validation.length > 0)
                validation.forEach((n) => {
                    const b = Validation[n['key']]({ title: title, value: val, rule: n['value'] || '', allData: obj });
                    if (!b['state'] && !err[key]) {
                        n['msg'] = b['msg'] || '';
                        if (allErrMessage)
                            allErrMsg.push(n['msg']);
                        err[key] = n;
                        control = false;
                        return true;
                    } else
                        success[key] = val;
                });
            else
                success[key] = val;
        });

        const check = ({ key, itm }) => {
            if (err[key]) {
                itm['error'] = true;

                if (!allErrMessage)
                    itm['errorMsg'] = err[key]['msg'];
                else
                    itm['errorMsg'] = null;

            } else {
                itm['error'] = false;
                itm['errorMsg'] = null;
            }
        }

        fields.forEach((item) => {
            item['items'].map((itm) => {
                const errorState = itm['errorState'] || {},
                    arr = Object.entries(errorState);
                if (arr.length > 0) {
                    arr.forEach(([ky, tm]) => {
                        check({ key: ky, itm: tm });
                    });
                } else {
                    check({ key: itm['id'], itm: itm });
                }
            });
        });

        setTimeout(() => {
            _t.setState({ validation: false, errMsg: allErrMsg });
            if (control)
                _t._send(success);
        }, 1);
    }

    _send = (obj) => {
        const _self = this;

        /* objeye fix olarak eklenmek istenen alanlar varsa addfields bölümde tanımlanır. Tanımlanan key valuelar success objesine eklenir. */
        const { addFields = [], uri } = _self.props.data;
        if (Utils.detect(addFields))
            addFields.forEach((n) => {
                obj[n['id']] = n['value'];
            });

        console.log(JSON.stringify(obj));
        _self.ajx({ uri: uri, data: obj }, function ({ type, d }) {
            const { callback } = _self.props;
            if (callback)
                callback({ type: type, data: d });
        });
    }

    addField = (obj) => {
        const _self = this,
            { id, type } = obj,
            { theme = 'DARK' } = _self.props.data,
            validation = this.state.validation,
            _callback = this._callback;

        switch (type) {
            case 'text':
                return <FormInput theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'select':
                return <SelectBox theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'chekbox':
                return <CheckBox theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'radio':
                return <RadioGroup theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'dataTimePicker':
                return <DateTimePicker theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'countryPicker':
                return <CountryPicker theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'hiddenObject':
                return <HiddenObject callback={_callback} control={validation} key={id} data={obj} />;
            default:
                return null;
        }
    }

    /* serverdan dönen json ile form datasının default değerlerini eşitlemek */
    _setDefault = (itm) => {
        const _self = this,
            id = itm['id'] || '',
            type = itm.type,
            { defaultData } = _self.state;

        let def = defaultData[id];

        if (def == undefined)
            def = '';

        /* formatlı gelen telefon alanındaki () ve +90 temizlemek için kullanırız. */
        if (id == 'mobilePhone' || id == 'phone') {
            def = def.replace(/\)/g, '').replace(/\(/g, '');
            if (def.substr(0, 2) === '90')
                def = def.substr(2, def.length);
        }

        if (type == 'countryPicker') {
            itm['value']['country'] = defaultData['countryId'] || -1;
            itm['value']['city'] = defaultData['cityId'] || -1;
            itm['value']['district'] = defaultData['districtId'] || -1;
        } else
            itm['value'] = def;

        return itm;
    }

    add = () => {
        const _self = this,
            { show } = this.state,
            { data } = _self.props;
        _self.totalCount = 0;

        if (show)
            return data['fields'].map((item, ind) => {
                const items = item['items'].map((itm) => {

                    /* default değer varsa atanması için gönderilir */
                    if ((data['defValue'] || '') != '')
                        itm = _self._setDefault(itm);

                    _self.totalCount = _self.totalCount + 1;
                    return _self.addField(itm);
                }),
                    css = item['items'].length > 1 ? styles.row : styles.field;
                return <View key={ind} style={css}>{items}</View>;
            });
        else
            return null;
    }

    _getAllErrMsg = () => {
        return <ErrorBox data={this.state.errMsg} />
    }

    _onPress = () => {
        this.setState({ validation: true });
    }

    render() {
        const _self = this,
            { theme = 'DARK' } = _self.props.data,
            { scrollEnabled = true } = _self.props;

        return (
            <ScrollView scrollEnabled={scrollEnabled} style={[{ flex: 1 }]}>
                <CustomKeyboard style={[{ flex: 1 }]}>
                    <View style={[{ flex: 1, paddingLeft: 40, paddingRight: 40, paddingBottom: 40 }, { ..._self.props.style }]}>
                        {_self._getAllErrMsg()}
                        {_self.add()}
                        <LoadingButton theme={theme} onPress={_self._onPress.bind(_self)}>{'GİRİŞ YAP'}</LoadingButton>
                    </View>
                </CustomKeyboard >
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        //flexDirection: 'row',
        flex: 1
    },
    field: {

    }
});

export { Form };