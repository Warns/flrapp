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

        const _self = this,
            { desc, error = false, errorMsg = null } = _self.props.data,
            { control = false } = _self.props,
            { value } = _self.state,
            active = value ? { borderColor: '#000000', backgroundColor: '#000000' } : {};
        check = <View style={[{ width: 18, height: 18, borderRadius: 3, borderWidth: 1, borderColor: '#dddddd', backgroundColor: '#FFFFFF' }, active]} />;

        if (control)
            _self._callback();
        
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
