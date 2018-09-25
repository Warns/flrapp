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

class StoreHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ padding: 5, paddingRight: 0 }} onPress={this._onBackPress}>
                    <Image source={ICONS['back']} style={{width:40, height:40, resizeMode:'contain'}} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.title}>{'YAKIN MAĞAZALAR'}</Text>
                    </View>
                    <View style={{ padding: 5, paddingRight: 10 }}>

                    </View>
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
    },
    title: {
        fontFamily: 'brandon',
        fontSize: 16,
    }
});