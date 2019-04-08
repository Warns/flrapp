import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Container } from './';
import { TextInputMask } from 'react-native-masked-text';
import { FORMSTYLE } from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');

class FormInput extends Component {
    constructor(props) {
        super(props);
        const _self = this,
            {
                placeholder = '',
                value = '',
                title,
                showTitle = false //-> bu deger true gelirse placeholder yapısı olmadan direk title gösterilecek
            } = _self.props.data;

        _self.state = {
            value: value,
            placeholder: showTitle ? placeholder : (value != '' ? '' : title),
            titleShow: showTitle ? true : (value != '' ? true : false),
            counter: null,
        }
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

    /* 
        selectbox seçim yapıldığında inputtaki değeri güncellemesi için ekstradan willUpdate kontrolü eklendi
        normalde inputlar için bu fonk. çalışmaması lazım
    */
    componentWillUpdate(nextProps, nextState) {
        const { value, willUpdate } = nextProps['data'];
        if (willUpdate)
            if (value != this.state.value)
                this.setState({ value: value, });
    }

    input = null

    _onPress = () => {
        const _self = this;
        if (_self.input && _self.input.focus)
            _self.input.focus();
    }

    _onFocus = () => {
        const _self = this,
            { onFocus, id = '' } = _self.props,
            { showTitle = false } = _self.props.data;

        if (onFocus)
            onFocus({ key: id });

        setTimeout(() => {
            const { value } = _self.state;
            if (value == '' && !showTitle)
                _self.setState({ placeholder: '', titleShow: true });
        }, 5);
    }
    _onBlur = () => {
        const _self = this,
            { onBlur, id = '' } = _self.props,
            { title, showTitle = false } = _self.props.data;

        if (onBlur)
            onBlur({ key: id });

        setTimeout(() => {
            const { value } = _self.state;
            if (value == '' && !showTitle)
                _self.setState({ placeholder: title, titleShow: false });
        }, 5)
    }
    _onChangeText = (value) => {

        const { regex = '', id = '' } = this.props.data;
        const { onChangeText } = this.props;

        const _self = this;
        _self.setState({ value: value, });
        setTimeout(() => {
            if (regex != '') {
                value = Utils.getRegex({ key: regex, value: value });
                _self.setState({ value: value, });
            }

            if (onChangeText)
                onChangeText({ key: id, value: value });

        }, 1);
    }

    _callback = () => {
        const { title, id, validation, customFormat } = this.props.data;
        const { callback } = this.props;
        let value = this.state.value;
        if (customFormat)
            value = customFormat(value);

        if (callback)
            callback({ key: id, title: title, value: value, validation: validation });
    }

    _onReset = () => {
        const _self = this;
        _self._onChangeText('');
        _self._onBlur();
    }

    render() {
        const _self = this,
            {
                inputSty
            } = styles,
            {
                title,
                disabled = false,
                secureTextEntry = false,
                keyboardType = 'default',
                multiline = false,
                maxLength = 1000,
                error = false,
                errorMsg = null,
                autoCorrect = false,
                mask = null,
                showHeader = true,
            } = _self.props.data,
            {
                control = false,
                theme,
                creditCart = false,
                containerStyle = {},
                wrapperStyle = {},
                errorMsgStyle = {},
                counter,
            } = _self.props,
            { TITLE_COLOR = '#9b9b9b' } = FORMSTYLE[theme],
            {
                placeholder,
                titleShow,
            } = _self.state;

        let disabledObj = {};
        if (disabled)
            disabledObj = { editable: false, selectTextOnFocus: false };

        let _counter = counter ? <View style={{ position: 'absolute', right: 5, bottom: 5, }}><Text style={{ fontSize: 12, color: '#cccccc' }}>{_self.state.value.length}/{counter}</Text></View> : null;

        let input = null;

        if (creditCart)
            input = (
                <TextInputMask
                    refInput={element => {
                        this.input = element
                    }}
                    {...disabledObj}
                    autoCorrect={autoCorrect}
                    maxLength={19}
                    multiline={multiline}
                    underlineColorAndroid={'transparent'}
                    style={inputSty}
                    placeholder={placeholder}
                    value={this.state.value}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    placeholderTextColor={TITLE_COLOR}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    onChangeText={this._onChangeText}
                    type={'credit-card'}
                    options={{
                        obfuscated: false
                    }}
                />
            );
        else if (mask)
            input = (
                <TextInputMask
                    refInput={element => {
                        this.input = element
                    }}
                    {...disabledObj}
                    autoCorrect={autoCorrect}
                    maxLength={mask.length}
                    multiline={multiline}
                    underlineColorAndroid={'transparent'}
                    style={inputSty}
                    placeholder={placeholder}
                    value={this.state.value}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    placeholderTextColor={TITLE_COLOR}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    onChangeText={this._onChangeText}
                    type={'custom'}
                    options={{
                        mask: mask,
                        validator: function (value, settings) {
                            return true
                        }
                    }}
                />
            );
        else
            input = (
                <TextInput
                    ref={element => {
                        this.input = element
                    }}
                    {...disabledObj}
                    autoCapitalize={'none'}
                    autoCorrect={autoCorrect}
                    maxLength={maxLength}
                    multiline={multiline}
                    underlineColorAndroid={'transparent'}
                    style={inputSty}
                    placeholder={placeholder}
                    value={this.state.value}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    placeholderTextColor={TITLE_COLOR}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    onChangeText={this._onChangeText}
                />
            );

        if (control)
            this._callback();

        return (
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7} onPress={this._onPress.bind(this)}>
                <Container
                    errorMsgStyle={{ ...errorMsgStyle }}
                    containerStyle={{ ...containerStyle }}
                    wrapperStyle={{ ...wrapperStyle }}
                    showHeader={showHeader}
                    titleShow={titleShow}
                    theme={theme}
                    title={title}
                    error={error}
                    errorMsg={errorMsg}
                >
                    {input}
                    {_counter}
                </Container>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    inputSty: {
        color: '#000000',
        fontSize: 16,
        flex: 1,
    },
});

export { FormInput };