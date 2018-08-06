import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { Container } from './';
import { Minus99MultipleSelect } from 'root/app/components/';


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
        if( arr.length == 0)
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
        /*const { } = styles;*/
        const { title, value, error = false, errorMsg = null, multiple = false } = this.props.data;
        const { control = false, } = this.props;

        if (control)
            this._callback();

        return (
            <Container title={title} error={error} errorMsg={errorMsg}>
                <Minus99MultipleSelect callback={this._closed} selected={this._getIndex()} multiple={multiple} items={this._getItems()} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({

});

export { SelectBox };