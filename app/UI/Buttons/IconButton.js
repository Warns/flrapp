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
            { ico, icoStyle = {}, style = {} } = _self.props;

        return (
            <TouchableOpacity
                style={style}
                activeOpacity={0.8}
                onPress={_self._onPressButton}
                onLayout={e => _self._measureDimensions(e)}>
                <Image
                    style={[{ width: 40, height: 40, resizeMode: 'contain' }, icoStyle]}
                    source={ICONS[ico]}
                />
            </TouchableOpacity>
        );
    }
}

export { IconButton };