import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import { ICONS } from "root/app/helper/Constant";

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
        const _self = this,
            { txt, btn } = styles,
            { more = 'Daha fazla', less = 'Daha az', numberOfLines = 6 } = _self.props,
            num = _self.state.expanded ? null : (numberOfLines || null),
            buttonLabel = _self.state.expanded ? less : more,
            ico = _self.state.expanded ? 'upArrow' : 'bottomArrow';

        return (
            <View>
                <Text numberOfLines={num} style={txt}>
                    {_self.props.children}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    onPress={_self._onPressButton}>
                    <Text style={btn}>{buttonLabel}</Text>
                    <Image style={{ width: 9, height: 5, marginLeft: 7 }} source={ICONS[ico]} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    txt: {
        color: 'rgb(108, 108, 108)',
        fontSize: 16,
        marginBottom: 20,
        fontFamily: 'RegularTyp2'
    },
    btn: {
        color: '#000000',
        fontFamily: 'RegularTyp2',
        fontSize: 16,
    }
});

export { ReadMoreText };