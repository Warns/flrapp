import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Container } from './';

class CheckBox extends Component {
    constructor(props) {
        super(props);
        const { value = false } = this.props.data
        this.state = {
            value: value
        }
    }

    _onPress = () => {
        this.setState((prevState) => ({
            value: !prevState.value
        }));
    }

    _callback = () => {
        const { title, id, validation } = this.props.data;
        const { callback } = this.props;
        if (callback)
            callback({ key: id, title: title, value: this.state.value, validation: validation });
    }

    render() {
        const { desc, error = false, errorMsg = null } = this.props.data;
        const check = this.state.value ? <View style={{ width: 10, height: 10, backgroundColor: 'red' }} /> : <View style={{ width: 10, height: 10, backgroundColor: 'yellow' }} />;
        const { control = false, } = this.props;

        if (control)
            this._callback();

        return (
            <Container titleShow={true} error={error} errorMsg={errorMsg}>
                <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this._onPress}>
                    {check}
                    <Text>{desc}</Text>
                </TouchableOpacity>
            </Container>
        );
    }
}

const styles = StyleSheet.create({

});

export { CheckBox };
