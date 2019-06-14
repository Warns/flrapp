import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Container } from './';

class Item extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        const { onPress, value } = this.props;
        if (onPress)
            onPress({ value: value });
    }

    render() {
        const { label, active } = this.props;

        let color = '#adabab';
        if (active)
            color = '#ff0000';

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this._onPress}>
                <Text style={{ color: color }}>{label}</Text>
            </TouchableOpacity>
        )
    }
}

class RadioGroup extends Component {
    constructor(props) {
        super(props);
        const { value = -1 } = this.props.data;
        this.state = {
            value: value,
        }
    }

    _callback = () => {
        const { title, id, validation } = this.props.data;
        const { callback } = this.props;
        if (callback)
            callback({ key: id, title: title, value: this.state.value, validation: validation });
    }

    _onPress = ({ value }) => {
        this.setState({ value: value });
    }

    _add = () => {
        const { values = [] } = this.props.data;
        return values.map((item) => {
            const bool = this.state.value == item['value'] ? true : false; 
            return <Item onPress={this._onPress} active={bool} key={item['value']} label={item['key']} value={item['value']} />
        });
    }

    render() {
        /*const { } = styles;*/
        const { title, error = false, errorMsg = null } = this.props.data;
        const { control = false, } = this.props;

        if (control)
            this._callback();

        return (
            <Container  showErrorIco={false} titleShow={true} title={title} error={error} errorMsg={errorMsg}>
                <View style={{ flexDirection: 'row' }}>
                    {this._add()}
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({

});

export { RadioGroup };