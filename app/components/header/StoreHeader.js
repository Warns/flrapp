import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import {
    ICONS,
} from 'root/app/helper/Constant';
import { IconButton } from 'root/app/UI';

const Translation = require('root/app/helper/Translation.js');

class StoreHeader extends Component {
    constructor(props) {
        super(props);
    }

    _onBack = () => {

    }

    _onGotoScene = () => {
        const _self = this,
            { navigation } = _self.props;

        if (navigation)
            navigation.navigate('Detail', {});
    }

    render() {

        return (
            <View style={styles.wrapper}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                    <IconButton callback={this._onBack} ico={'back'} icoStyle={{ width: 40, height: 40, resizeMode: 'contain' }} style={{ width: 40, height: 40 }} />

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.title}>{Translation['store']['headerTitle']}</Text>
                    </View>

                    <IconButton callback={this._onGotoScene} ico={'map'} icoStyle={{ width: 40, height: 40, resizeMode: 'contain' }} style={{ width: 40, height: 40 }} />
                </View>
            </View>
        );
    }
}

export { StoreHeader };

const styles = StyleSheet.create({
    wrapper: {
        height: 70,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingRight: 10,
        paddingLeft: 10,
    },
    title: {
        fontFamily: 'brandon',
        fontSize: 16,
    }
});