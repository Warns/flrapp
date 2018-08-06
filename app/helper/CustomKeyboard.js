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
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                    {this.props.children}
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }
}

export { CustomKeyboard };