
import React, { Component } from 'react';
import {
    TouchableOpacity,
} from 'react-native';
import {
    CLICK,
    DOUBLE_CLICK,
} from 'root/app/helper/Constant';

class DoubleClickButton extends Component {

    constructor(props) {
        super(props);
    }

    _stm = null;

    _onPress = () => {
        const _self = this,
            { callback } = _self.props,
            time = new Date().getTime(),
            delta = time - this.lastPress,
            DOUBLE_PRESS_DELAY = 400;

        let clicked = CLICK;
        if (delta < DOUBLE_PRESS_DELAY)
            clicked = DOUBLE_CLICK;

        _self.lastPress = time;

        if (_self._stm != null)
            clearTimeout(_self._stm)

        _self._stm = setTimeout(() => {
            if (callback)
                callback({ type: clicked });
        }, 410)

    }

    render() {
        const _self = this;
        return (
            <TouchableOpacity activeOpacity={1} onPress={_self._onPress}>
                {_self.props.children}
            </TouchableOpacity>
        );
    }
}

export { DoubleClickButton };