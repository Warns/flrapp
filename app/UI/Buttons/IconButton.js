import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import {
    ICONS,
} from 'root/app/helper/Constant';

class IconButton extends Component {
    constructor(props) {
        super(props);
    }

    _onPressButton = () => {
        const { callback, item = {}, sequence = 0 } = this.props;
        if (callback)
            callback({ item, sequence });
    }

    _measureDimensions = (e) => {
        const { onDimensions, sequence = 0 } = this.props;
        if (onDimensions)
            onDimensions({ layout: e.nativeEvent.layout, sequence });
    }

    render() {
        const _self = this,
            { ico, icoStyle = {}, style = {}, buttonStyle = {} } = _self.props;

        return (
            <TouchableOpacity style={buttonStyle} activeOpacity={0.8} onPress={_self._onPressButton} onLayout={e => _self._measureDimensions(e)}>
                <View style={[{ width: 12, height: 12, justifyContent: 'center', alignItems: 'center' }, style]}>
                    <Image
                        style={[{ width: 12, height: 12 }, icoStyle]}
                        source={ICONS[ico]}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

export { IconButton };