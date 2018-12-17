import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Container, Minus99MultipleSelect } from './';
import {
    ICONS,
} from 'root/app/helper/Constant';

class SelectBox extends Component {
    constructor(props) {
        super(props);
        const { key, value = -1 } = this._getSelected();

        this.state = {
            value: value,
            title: key,
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

    _callback = () => {
        const { title, id, validation } = this.props.data;
        const { callback } = this.props;
        if (callback)
            callback({ key: id, title: title, value: this.state.value, validation: validation });
    }

    _getSelected = () => {
        const { value, values = [], multiple = false } = this.props.data;
        let selected = {};
        if (!multiple)
            for (let i = 0; i < values.length; ++i) {
                if (values[i]['value'] == value) {
                    selected = values[i];
                    break;
                }
            }
        else {
            /* çoklu seçimde */
            const arr = [];
            values.forEach((item, ind) => {
                if (value != - 1 && value.includes(item['value']))
                    arr.push(item['value']);
            });

            selected['value'] = arr.join(',') || -1;
        }
        return selected;
    }

    _getItems = () => {
        const { values = [] } = this.props.data;
        return values.map((item, ind) => {
            return { order: ind, id: item['value'], name: item['key'] };
        });
    }

    _getIndex = () => {
        let arr = [];
        const { value, values = [], multiple = false } = this.props.data;
        values.forEach((item, ind) => {
            if (!multiple) {
                if (value == item['value'])
                    arr.push(ind);
            } else {
                if (value != - 1 && value.includes(item['value']))
                    arr.push(ind);
            }
        });

        /* tekli seçimde seçili kayıt bulamazsa ilkini seçili hale getirme */
        if (arr.length == 0 && !multiple)
            arr = [0];

        return arr;
    }

    _closed = (obj) => {
        const _self = this,
            { closed = false } = _self.props, /* closed true gönderildiğinde her kapanışta callback tetiklenecek */
            { multiple = false } = this.props.data;

        if (!multiple) {
            /* tekli seçim */
            obj = obj['selected'][0];
            this.setState({ value: obj['id'], title: obj['name'] })
        } else {
            const value = obj['selected'].map((val, ind) => { return val['id'] }).join(',');
            this.setState({ value: value, title: obj['key'] || '' });
        }

        setTimeout(() => {
            if (closed)
                _self._callback();
        }, 5);
    }

    _onReset = () => {
        const _self = this;
        _self.child._onReset();
    }

    _open = () => {
        const _self = this;
        /* Minus99MultipleSelect componenti selectbox açmak */
        _self.child._openSelectionBox();
    }

    render() {
        const _self = this,
            { title, error = false, errorMsg = null, multiple = false, defaultTitle = '', ico = 'drpIco', icoStyle = { width: 12, height: 8 }, modalTitle = 'KAPAT' } = _self.props.data,
            { control = false, containerStyle = {}, wrapperStyle = {}, showHeader = true, fontStyle = {}, defaultTitleStyle = {}, } = _self.props;

        if (control)
            _self._callback();

        return (
            <TouchableOpacity
                activeOpacity={0.4}
                onPress={_self._open}>
                <Container
                    showHeader={showHeader}
                    containerStyle={{ ...containerStyle }}
                    wrapperStyle={{ ...wrapperStyle }}
                    titleShow={true}
                    title={title}
                    error={error}
                    errorMsg={errorMsg}>
                    <Minus99MultipleSelect
                        name={modalTitle}
                        onRef={ref => (_self.child = ref)}
                        defaultTitleStyle={defaultTitleStyle}
                        fontStyle={fontStyle}
                        defaultTitle={defaultTitle}
                        callback={_self._closed}
                        selected={_self._getIndex()}
                        multiple={multiple}
                        items={_self._getItems()} />
                    <Image source={ICONS[ico]} style={icoStyle} />
                </Container>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

});

export { SelectBox };