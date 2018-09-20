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

class SelectBox extends Component {
    constructor(props) {
        super(props);
        const { key, value = -1 } = this._getSelected();

        this.state = {
            value: value,
            title: key,
        }
    }

    _callback = () => {
        const { title, id, validation } = this.props.data;
        const { callback } = this.props;
        if (callback)
            callback({ key: id, title: title, value: this.state.value, validation: validation });
    }

    _getSelected = () => {
        const { value, values = [] } = this.props.data;
        let selected = {};
        for (let i = 0; i < values.length; ++i) {
            if (values[i]['value'] == value) {
                selected = values[i];
                break;
            }
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
        const { value, values = [] } = this.props.data;
        values.forEach((item, ind) => {
            if (value == item['value'])
                arr.push(ind);
        });
        if (arr.length == 0)
            arr = [0];
        return arr;
    }

    _closed = (obj) => {
        const { multiple = false } = this.props.data;
        if (!multiple) {
            /* tekli seçim */
            obj = obj['selected'][0];
            this.setState({ value: obj['id'], title: obj['name'] })
        }
    }

    render() {
        const _self = this,
            { title, error = false, errorMsg = null, multiple = false } = _self.props.data,
            { control = false, } = _self.props;

        if (control)
            _self._callback();

        return (
            <Container titleShow={true} title={title} error={error} errorMsg={errorMsg}>
                <Minus99MultipleSelect callback={_self._closed} selected={_self._getIndex()} multiple={multiple} items={_self._getItems()} />
                <Image source={ICONS['drpIco']} style={{ width: 12, height: 8 }} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({

});

export { SelectBox };