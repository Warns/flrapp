import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

class LineButton extends Component {

    _onPressButton = () => {
        const { onPress, item, sequence } = this.props;
        if (onPress)
            onPress({ item: item || {}, sequence: sequence || 0 });
    }

    _measureDimensions = (e) => {
        const { onDimensions, sequence = 0 } = this.props;
        if (onDimensions)
            onDimensions({ layout: e.nativeEvent.layout, sequence: sequence || 0 });
    }

    render() {
        let { wrapper, txt } = styles;
        const { active = false } = this.props;
        if (active) {
            wrapper = styles.activeWrapper;
            txt = styles.activeTxt;
        }
        return (
            <TouchableOpacity onLayout={e => this._measureDimensions(e)} style={[wrapper, { ...this.props.style }]} activeOpacity={0.8} onPress={this._onPressButton}>
                <Text style={txt}>{this.props.children}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        borderTopWidth: 1,
        borderColor: '#d8d8d8'
    },
    txt: {
        color: '#000000',
        fontFamily: 'brandon',
        lineHeight: 50,
        paddingLeft: 10,
        paddingRight: 10,
    },

    activeWrapper: {

    },
    activeTxt: {

    },
});

export { LineButton };