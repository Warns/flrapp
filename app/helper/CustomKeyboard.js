import React, { Component } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';

class CustomKeyboard extends Component {

    render() {
        return (
            <TouchableWithoutFeedback style={{flex: 1}} onPress={() => Keyboard.dismiss()}>
                {this.props.children}
            </TouchableWithoutFeedback>
        );
    }
}

export { CustomKeyboard };