import React, { Component } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Alert,
    Platform,
    Image,
    Keyboard,
    TouchableOpacity,
    Text
} from 'react-native';
import { FormInput, SelectBox, CheckBox, RadioGroup, DateTimePicker, ErrorBox, CountryPicker, HiddenObject, StarSelect, FormInfo } from './';
import { CustomKeyboard } from 'root/app/helper';
import { DefaultButton } from 'root/app/UI';
import {
    ICONS,
    SHOW_PRELOADING,
    SHOW_CUSTOM_POPUP,
    SET_FORM
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

const Validation = require('root/app/helper/Validation.js');
const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');
const preload = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{
                width: 60,
                height: 60,
                borderRadius: 25,
                overflow: 'hidden',
                ...Platform.select({
                    ios: {
                        zIndex: 9,
                    },
                    android: {
                        elevation: 999,
                    }
                }),
            }}>
                <Image source={ICONS['loading']} style={{ resizeMode: 'cover', width: 60, height: 60, borderRadius: 30 }} />
            </View>
        </View>
    );
};

class Button extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        const _self = this,
            { callback, data } = _self.props;
        if (callback)
            callback(data);
    }

    render() {
        const _self = this,
            { title = '', fontStyle = {}, wrapperStyle = {} } = _self.props.data;

        return (
            <View style={[{ ...wrapperStyle }]}>
                <TouchableOpacity onPress={this._onPress}>
                    <Text style={[{ ...fontStyle }]} > {title}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validation: false,
            loading: false,
            errMsg: [],
            defaultData: [],
            disabledFormMsg: [],
            show: true, // form gizle-goster
            control: true, // hata durumu için
        };

        this._clicklable = true;
    }

    componentDidMount() {
        const _self = this,
            { onRef } = _self.props;

        _self._isMounted = true;
        _self.setAjx();

        if (onRef)
            onRef(this);
    }

    componentWillUnmount() {
        const _self = this,
            { data = {}, onRef } = _self.props;
        _self._isMounted = false;

        if (onRef)
            onRef(null);

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
                else {
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
                    _self._setDisabledForm();
                }
            })
        }
    }

    ajx = ({ uri, data = {} }, callback) => {
        const _self = this;
        _self.setState({ loading: true });
        Globals.fetch(uri, JSON.stringify(data), (answer) => {
            if (_self._isMounted) {
                if (answer === 'error') {
                    if (typeof callback !== 'undefined')
                        callback({ type: 'error', d: answer });
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
            else
                _t._clicklableState('active');

            _t.setState({ control: control });
        }, 1);
    }

    _preload = (b) => {
        store.dispatch({ type: SHOW_PRELOADING, value: b });
    }

    _alert = (message) => {
        setTimeout(() => {
            Alert.alert(message);
        }, 333);
    }

    _send = (obj) => {
        const _self = this,
            { callback } = _self.props,
            { sendAjx = true, successMessage = '', resetForm = false } = _self.props.data;

        /* objeye fix olarak eklenmek istenen alanlar varsa addfields bölümde tanımlanır. Tanımlanan key valuelar success objesine eklenir. */
        const { addFields = [], uri } = _self.props.data;
        if (Utils.detect(addFields))
            addFields.forEach((n) => {
                obj[n['id']] = n['value'];
            });

        console.log('form post', JSON.stringify(obj));
        if (sendAjx) {
            _self._preload(true);
            _self.ajx({ uri: uri, data: obj }, function ({ type, d }) {
                console.log('form response', JSON.stringify(d));

                _self._preload(false);

                if (type == 'error') {
                    const { message = 'HATA...' } = d;
                    _self._alert(Utils.clearHtmlTag(message));
                } else {
                    if (successMessage != '')
                        _self._alert(successMessage);

                    if (resetForm)
                        _self._onResetForm();
                }

                //Keyboard.dismiss();

                if (callback)
                    callback({ type: type, data: d, postData: obj });


                _self._clicklableState('active');

            });
        } else {
            if (callback)
                callback({ data: obj });

            _self._clicklableState('active');
        }
    }

    /* anlık form callback */
    _onChangeText = (obj) => {
        const _self = this,
            { onChangeText } = _self.props;
        if (onChangeText)
            onChangeText(obj);
    }

    _formElement = [];

    addField = (obj) => {
        const _self = this,
            { id, type, css = {}, showHeader = true, constantValue = false, counter = null } = obj,
            { errorMsgStyle = {}, containerStyle = {}, wrapperStyle = {}, fontStyle = {}, defaultTitleStyle = {} } = css,
            { theme = 'DARK' } = _self.props.data,
            validation = this.state.validation,
            _callback = this._callback,
            objCallback = constantValue ? {} : { callback: _self._callback };

        /* 
            setuser şifremi değiştir alanı için yapıldı.
            constantValue: defValue değeri aktifse bir input ve değeri görünürde var ama herhangi bir şekilde 
            işleme dahil olmayacaksa kullanılıyor ve jsonda verilen valueyu kullanıyor.
        */
        if (!constantValue)
            _self.totalCount = _self.totalCount + 1;

        switch (type) {
            case 'creditCart':
                return <FormInput
                    onRef={ref => (_self._formElement.push(ref))}
                    errorMsgStyle={{ ...errorMsgStyle }}
                    containerStyle={{ ...containerStyle }}
                    wrapperStyle={{ ...wrapperStyle }}
                    onChangeText={_self._onChangeText}
                    creditCart={true}
                    theme={theme}
                    callback={_callback}
                    control={validation}
                    key={id}
                    data={obj}
                />;
            case 'text':
                return <FormInput
                    onRef={ref => (_self._formElement.push(ref))}
                    errorMsgStyle={{ ...errorMsgStyle }}
                    containerStyle={{ ...containerStyle }}
                    wrapperStyle={{ ...wrapperStyle }}
                    onChangeText={_self._onChangeText}
                    theme={theme}
                    counter={counter}
                    {...objCallback}
                    //callback={_callback}
                    control={validation}
                    key={id}
                    data={obj}
                />;
            case 'select':
                return <SelectBox
                    onRef={ref => (_self._formElement.push(ref))}
                    showHeader={showHeader}
                    defaultTitleStyle={{ ...defaultTitleStyle }}
                    fontStyle={{ ...fontStyle }}
                    containerStyle={{ ...containerStyle }}
                    wrapperStyle={{ ...wrapperStyle }}
                    theme={theme}
                    callback={_callback}
                    control={validation}
                    key={id}
                    data={obj}
                />;
            case 'chekbox':
                return <CheckBox containerStyle={{ ...containerStyle }} wrapperStyle={{ ...wrapperStyle }} theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'radio':
                return <RadioGroup containerStyle={{ ...containerStyle }} wrapperStyle={{ ...wrapperStyle }} theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'dataTimePicker':
                return <DateTimePicker containerStyle={{ ...containerStyle }} wrapperStyle={{ ...wrapperStyle }} theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'countryPicker':
                return <CountryPicker theme={theme} callback={_callback} control={validation} key={id} data={obj} />;
            case 'hiddenObject':
                return <HiddenObject callback={_callback} control={validation} key={id} data={obj} />;
            case 'button':
                return <Button callback={_self._modalButtonClick} key={id} data={obj} />;
            case 'stars':
                return <StarSelect callback={_callback} control={validation} key={id} data={obj} />
            case 'info':
                return <FormInfo callback={_callback} control={validation} key={id} data={obj} />
            default:
                return null;
        }
    }

    _modalButtonClick = (obj) => {
        store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: true, ...obj['modal'] } });
    }

    /* 
        default değerlerde belirtilen case gerçekleşirse form disabled oluyor  
    */
    _setDisabledForm = () => {
        const _self = this,
            { defValue = {} } = _self.props.data || {},
            { defaultData = '' } = _self.state,
            { disableForm = '' } = defValue;

        if (disableForm != '' && defaultData != '') {
            const arr = Object.entries(disableForm),
                msg = [];
            if (arr.length > 0) {
                arr.forEach(([key, item]) => {
                    if (defaultData[key] == item['value'])
                        msg.push(item['msg'] || '');
                });
            }

            if (msg.length > 0)
                _self.setState({ disabledFormMsg: msg });
        }
    }

    _getDisabledMsg = () => {
        const _self = this,
            { disabledFormMsg = [] } = _self.state;

        let view = [];
        if (disabledFormMsg.length > 0) {
            Object
                .entries(disabledFormMsg)
                .forEach(([key, value]) => {
                    view.push(<Text style={{ marginBottom: 5, fontWeight: 'bold' }} key={key}>{value}</Text>);
                });

            view = <View style={{ paddingBottom: 15 }}>{view}</View>
        }

        return view;
    }

    /* serverdan dönen json ile form datasının default değerlerini eşitlemek */
    _setDefault = (itm) => {
        const _self = this,
            { constantValue = false } = itm, /* constantValue; def. value eşitlenirken burdaki değeri baz alsın */
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

        if (constantValue) {
            // nothing
        } else if (type == 'countryPicker') {
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
                const { wrapperStyle = {} } = item,
                    items = item['items'].map((itm) => {

                        /* default değer varsa atanması için gönderilir */
                        if ((data['defValue'] || '') != '')
                            itm = _self._setDefault(itm);

                        return _self.addField(itm);
                    }),
                    css = item['items'].length > 1 ? styles.row : styles.field;
                return <View key={ind} style={[css, { ...wrapperStyle }]}>{items}</View>;
            });
        else
            return null;
    }

    _getAllErrMsg = () => {
        return <ErrorBox data={this.state.errMsg} />
    }

    /* public fonk. */
    _formValidation = (callback) => {
        const _self = this;
        _self._onPress();
        setTimeout(() => {
            if (typeof callback !== 'undefined') {
                const { control = true } = _self.state;
                callback(control)
            }
        }, 100);
    }

    _clicklableState = (k) => {
        const _self = this;
        if (k == 'active')
            setTimeout(() => {
                _self._clicklable = true;
            }, 200);
        else
            _self._clicklable = false;
    }

    _onPress = () => {
        const _self = this;
        if (_self._clicklable) {
            _self._clicklableState('passive');
            _self.setState({ validation: true });
        }
    }

    _onResetForm = () => {
        const _self = this,
            arr = _self._formElement,
            total = arr.length;
        /* form elemanlarını onRef ile array kaydedip sonrasında component içerisindeki reset tetikliyoruz. */
        for (var i = 0; i < total; ++i)
            arr[i]._onReset();
    }

    _onPressCancel = () => {
        const _self = this,
            { cancelForm } = this.props;
        if (cancelForm)
            cancelForm();
    }

    _getCancelButton = () => {
        const _self = this,
            { disabledFormMsg = [] } = _self.state,
            { cancelButtonText = 'İPTAL' } = _self.props.data,
            button = disabledFormMsg.length > 0 ? <DefaultButton name={cancelButtonText} textColor="#ffffff" boxColor="#000000" borderColor="#000000" callback={_self._onPressCancel.bind(_self)}>{cancelButtonText}</DefaultButton> : null;

        return button;
    }

    _getButton = () => {
        const _self = this,
            { disabledFormMsg = [] } = _self.state,
            { buttonText = 'GİRİŞ YAP', showButton = true } = _self.props.data,
            button = (showButton && disabledFormMsg.length == 0) ? <DefaultButton name={buttonText} textColor="#ffffff" boxColor="#000000" borderColor="#000000" callback={_self._onPress.bind(_self)}>{buttonText}</DefaultButton> : null;

        return button;
    }

    _getViewer = () => {
        const _self = this,
            { show } = _self.state,
            { scrollEnabled = true } = _self.props,
            button = _self._getButton(),
            cancelButton = _self._getCancelButton();

        if (!show)
            return preload();
        else
            return (
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={scrollEnabled}
                    style={{ flex: 1, }}>
                    <CustomKeyboard style={[{ flex: 1 }]}>
                        <View style={[{ flex: 1, paddingLeft: 40, paddingRight: 40, paddingBottom: 40 }, { ..._self.props.style }]}>
                            {_self._getDisabledMsg()}
                            {_self._getAllErrMsg()}
                            {_self.add()}
                            {button}
                            {cancelButton}
                        </View>
                    </CustomKeyboard >
                </ScrollView>
            );
    }

    render() {
        const _self = this,
            view = _self._getViewer();

        return (
            <View style={{ flex: 1, }}>
                {view}
            </View>
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