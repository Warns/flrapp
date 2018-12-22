import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Container } from './';
import {
    SHOW_CUSTOM_POPUP,
    SET_VIEWER,
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';
import {
    ParserHTML
} from 'root/app/helper/'


class CheckBox extends Component {
    constructor(props) {
        super(props);
        const { value = false } = this.props.data
        this.state = {
            value: value
        }
    }

    _onPress = () => {
        const _self = this,
            { closed = false } = _self.props;

        _self.setState((prevState) => ({
            value: !prevState.value
        }));

        setTimeout(() => {
            /* closed değeri true dönünce her bir tıklamada callback çalışsın */
            if (closed)
                _self._callback();
        }, 10);
    }

    _callback = () => {
        const { title, id, validation } = this.props.data;
        const { callback } = this.props;
        if (callback)
            callback({ key: id, title: title, value: this.state.value, validation: validation });
    }

    _onOpenModal = () => {
        const _self = this,
            { modal = {} } = _self.props.data;

        store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: true, type: SET_VIEWER, data: modal } });
    }

    render() {

        const _self = this,
            { error = false, errorMsg = null, desc = '', modal = '' } = _self.props.data,
            { control = false, containerStyle = {}, wrapperStyle = {} } = _self.props,
            { value } = _self.state,
            { checkBox } = styles,
            active = value ? { borderColor: '#000000', backgroundColor: '#000000' } : {};
        check = <View style={[checkBox, active]} />;

        if (control)
            _self._callback();

        let view = null;

        if (modal != '')
            view = (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this._onPress}>
                        {check}
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={this._onOpenModal}>
                        <ParserHTML wrapperStyle={{ flex: 1 }}>{desc}</ParserHTML>
                    </TouchableOpacity>
                </View>
            )
        else
            view = (
                <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this._onPress}>
                    {check}
                    <ParserHTML wrapperStyle={{ flex: 1 }}>{desc}</ParserHTML>
                </TouchableOpacity>
            );

        return (
            <Container showErrorIco={false} titleShow={true} error={error} errorMsg={errorMsg} containerStyle={{ ...containerStyle }} wrapperStyle={[{ paddingLeft: 0, borderWidth: 0, height: 'auto' }, { ...wrapperStyle }]}>
                {view}
            </Container>
        )


    }
}

const styles = StyleSheet.create({
    checkBox: {
        width: 18,
        height: 18,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#dddddd',
        backgroundColor: '#FFFFFF',
        marginRight: 10
    }
});

export { CheckBox };
