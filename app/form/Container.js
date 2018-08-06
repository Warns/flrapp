import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

const BORDER_COLOR = '#dddddd',
    TITLE_COLOR = '#9b9b9b',
    ERROR_COLOR = '#d3838d';

class Container extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const _self = this,
            {
                container,
                wrapper,
                titleSty,
                errorMsgSty
            } = styles,
            children = _self.props.children;

        let {
            title = null,
            error = false,
            errorMsg = null
        } = _self.props,
            color = BORDER_COLOR;

        if (error) {
            errorMsg = <Text style={[errorMsgSty]}>{errorMsg}</Text>
            color = ERROR_COLOR;
        }

        if (title)
            title = <Text style={[titleSty]}>{title}</Text>

        return (
            <View style={[container]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    {title} {errorMsg}
                </View>
                <View style={[wrapper, { borderColor: color }]}>
                    {children}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 13,
        position: 'relative',
    },
    wrapper: {
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        height: 50,
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
    },
    titleSty: {
        fontSize: 13,
        color: TITLE_COLOR,
    },
    errorMsgSty: {
        color: ERROR_COLOR,
        fontSize: 13,
    },
});

export { Container };