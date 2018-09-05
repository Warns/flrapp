import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { ICONS } from 'root/app/helper/Constant';

class RatingButton extends Component {

    constructor(props) {
        super(props);
        const _self = this,
            { value = true, userLike = false } = _self.props;

        _self.state = {
            userLike: userLike,
            value: value,
            defValue: userLike ? value - 1 : value
        };

        _self.anim = new Animated.Value(1);
    }

    _animate = (callback) => {
        const _self = this;

        _self.anim.setValue(0);
        Animated.timing(
            _self.anim,
            {
                toValue: 1,
                duration: 222,
                easing: Easing.inOut(Easing.quad)
            }
        ).start(() => {
            if (typeof callback !== 'undefined')
                callback();
        });
    }

    componentWillReceiveProps(nextProps) {
        const _self = this,
            { userLike } = _self.props,
            { defValue } = _self.state;

        if (!userLike && nextProps.userLike){
            _self.setState({ userLike: true, value: defValue + 1 });
            _self._animate();
        }
    }

    _onPress = () => {
        const _self = this,
            { id, onPress } = _self.props,
            { defValue, userLike } = _self.state;

        let obj = { value: defValue + 1, userLike: true };
        if (userLike)
            obj = { value: defValue, userLike: false };

        _self.setState(obj);
        _self._animate();

        if (onPress)
            onPress({ id: id, ...obj });
    }

    _getIcon = () => {
        const _self = this,
            { ratingButton } = styles,
            { userLike = false } = _self.state;

        let ico = 'unLike';
        if (userLike)
            ico = 'like';

        return (
            <Animated.Image
                style={[
                    ratingButton,
                    {
                        transform: [{
                            scale: _self.anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.7, 1]
                            }),
                        }]
                    }
                ]}
                source={ICONS[ico]}
            />
        );
    }

    _getValue = () => {
        const _self = this,
            { value = 0 } = _self.state;
        let view = null;
        if (value != 0)
            view = (
                <Text style={{ paddingRight: 10 }}>{value}</Text>
            );
        return view;
    }

    render() {
        const _self = this,
            { ratingButtonContainer } = styles,
            { value, userLike } = _self.state;

        return (
            <TouchableOpacity style={{ ..._self.props.style }} activeOpacity={0.9} onPress={_self._onPress.bind(_self)}>
                <View style={[ratingButtonContainer]}>
                    {_self._getIcon()}
                    {_self._getValue()}
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    ratingButton: {
        width: 30,
        height: 30,
    },
    ratingButtonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 30
    }
});

export { RatingButton }