import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { ICONS } from 'root/app/helper/Constant';

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

    _getIcons = () => {
        let { ico = null } = this.props;
        if (ico != null)
            ico = <Image source={ICONS[ico]} style={{ width: 40, height: 40 }} />
        return ico;
    }

    render() {
        const _self = this,
            { active = false, fontStyle = {} } = _self.props;
        let { wrapper, txt } = styles;

        if (active) {
            wrapper = styles.activeWrapper;
            txt = styles.activeTxt;
        }

        return (
            <TouchableOpacity onLayout={e => this._measureDimensions(e)} style={[wrapper, { ...this.props.style }]} activeOpacity={0.8} onPress={this._onPressButton}>
                <Text style={[txt, { ...fontStyle }]}>{this.props.children}</Text>
                {_self._getIcons()}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        borderTopWidth: 1,
        borderColor: '#d8d8d8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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