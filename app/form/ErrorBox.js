import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
const Utils = require('root/app/helper/Global.js');

class ErrorBox extends Component {
    constructor(props) {
        super(props);
    }

    _err = () => {
        const { container } = styles; 
        let err = this.props.data;

        if (!Utils.detect(err))
            return null;
            
        err = err.map((itm, ind) => {
            return <Text key={ind}>{itm}</Text>;
        });

        err = <View style={[container]}>{err}</View>

        return err;
    }

    render() {
        return this._err();
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: 'red'
    },
});

export { ErrorBox };