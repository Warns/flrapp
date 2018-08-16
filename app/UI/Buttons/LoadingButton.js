import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

class LoadingButton extends Component {

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
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#000000',
        paddingLeft: 10,
        paddingRight: 10,
    },
    txt: {
        fontSize: 13,
        fontFamily: 'brandon',
        color: '#FFFFFF',
        lineHeight: 50
    },

    activeWrapper: {

    },
    activeTxt: {

    },
});

export { LoadingButton };