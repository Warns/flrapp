import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
} from 'react-native';
import { Container } from './';
import { TextInputMask } from 'react-native-masked-text';
const Utils = require('root/app/helper/Global.js');

class FormInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data.value,
        }
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

    _onFocus = () => {
        const { onFocus, id = '' } = this.props;
        if (onFocus)
            onFocus({ key: id });
    }
    _onBlur = () => {
        const { onBlur, id = '' } = this.props;
        if (onBlur)
            onBlur({ key: id });
    }
    _onChangeText = (value) => {

        const { regex = '' } = this.props.data;
        const { onChangeText, id = '', } = this.props;

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

    render() {
        const {
            inputSty,
        } = styles;

        const {
            title,
            placeholder,
            secureTextEntry = false,
            keyboardType = 'default',
            multiline = false,
            maxLength = 1000,
            error = false,
            errorMsg = null,
            autoCorrect = false,
            mask = null
        } = this.props.data;

        const {
            control = false,
        } = this.props;

        let input = null;
        if (mask)
            input = (
                <TextInputMask

                    ref={element => {
                        this.input = element
                    }}
                    autoCorrect={autoCorrect}
                    maxLength={mask.length}
                    multiline={multiline}
                    underlineColorAndroid={'transparent'}
                    style={inputSty}
                    placeholder={placeholder}
                    value={this.state.value}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    placeholderTextColor={'#818181'}
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
                    autoCorrect={autoCorrect}
                    maxLength={maxLength}
                    multiline={multiline}
                    underlineColorAndroid={'transparent'}
                    style={inputSty}
                    placeholder={placeholder}
                    value={this.state.value}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    placeholderTextColor={'#818181'}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    onChangeText={this._onChangeText}
                />
            );

        if (control)
            this._callback();

        return (
            <Container title={title} error={error} errorMsg={errorMsg}>
                {input}
            </Container>
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