import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';

/* BU COMPONENTE ÖZEL THEME SEÇİMİ */
export const FORMSTYLE = {
    LIGHT: {
        TEXT_COLOR: '#000000',
        BACKGROUND_COLOR: '#FFFFFF'
    },
    DARK: {
        TEXT_COLOR: '#FFFFFF',
        BACKGROUND_COLOR: '#000000'
    }
};

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
        const _self = this,
            { theme = 'DARK', contentStyle = {} } = _self.props,
            { TEXT_COLOR, BACKGROUND_COLOR } = FORMSTYLE[theme],
            { wrapper, txt } = styles;
        return (
            <TouchableOpacity style={contentStyle} onLayout={e => this._measureDimensions(e)} activeOpacity={0.8} onPress={this._onPressButton}>
                <View style={[wrapper, { backgroundColor: BACKGROUND_COLOR }, { ..._self.props.style }]}>
                    <Text style={[txt, { color: TEXT_COLOR }, { ..._self.props.fontStyle }]}>{this.props.children}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderRadius: 3,
    },
    txt: {
        fontSize: 13,
        fontFamily: 'brandon',
        lineHeight: 50
    },
});

export { LoadingButton };