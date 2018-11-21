import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

class ReadMoreText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    _onPressButton = () => {
        this.setState((prevState) => ({
            expanded: !prevState.expanded
        }));
    }

    render() {
        const { txt, btn } = styles;
        const { more = '+ okumaya devam et', less = 'daha kısa', numberOfLines = 3 } = this.props;
        const num = this.state.expanded ? null : (numberOfLines || null);
        const buttonLabel = this.state.expanded ? less : more;

        return (
            <View>
                <Text numberOfLines={num} style={txt}>
                    {this.props.children}
                </Text>
                <TouchableOpacity activeOpacity={0.8} onPress={this._onPressButton}>
                    <Text style={btn}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    txt: {
        color: '#231f20',
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    btn: {
        color: '#231f20',
        fontFamily: 'Medium',
        fontSize: 14,
        marginBottom: 20
    }
});

export { ReadMoreText };