import React, { Component } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

class Item extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data, index, animatedValue } = this.props;
        const { thumbnavWrp, thumbnavTxt } = styles;
        return (
            <View style={thumbnavWrp}>
                <Image
                    style={{ width: 215, height: 165 }}
                    source={{ uri: data.src }}
                />
                <Animated.Text style={[thumbnavTxt, {
                    opacity: animatedValue.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0, 1, 0],
                    }),
                }]}>{data.title}</Animated.Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    thumbnavWrp: {
        width: 220,
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnavTxt: {
        position: 'absolute',
        bottom: 30,
        color: '#FFFFFF',
        fontSize: 24,
        fontFamily: 'brandon'
    }
});

export { Item };