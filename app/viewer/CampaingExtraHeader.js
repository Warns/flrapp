import React from 'react';
import {
    View,
    Text,
    Image,
} from 'react-native';
import {
    ICONS,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';

const Utils = require('root/app/helper/Global.js');

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const _self = this,
            { user = {} } = _self.props.user || {},
            { points = '0', userId = '' } = user;

        if (userId == '') return null;

        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ position: 'absolute', alignItems: 'center', zIndex: 2 }}>
                    <Image
                        style={{
                            width: 120,
                            height: 43,
                            marginTop: 31,
                            marginBottom: 15
                        }}
                        source={ICONS['campaingTitle']}
                    />
                    <View style={{ borderColor: '#FFFFFF', borderWidth: 3, backgroundColor: '#4acacf', width: 101, height: 101, borderRadius: 101, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#FFFFFF', fontFamily: 'RegularTyp2' }}>Bakiyeniz</Text>
                        <Text style={{ fontSize: 30, color: '#FFFFFF', fontFamily: 'Regular' }}>{Utils.getPriceFormat(points)}</Text>
                    </View>
                </View>
                <Image
                    style={{
                        width: '100%',
                        height: 220,
                        resizeMode: 'cover',
                    }}
                    source={ICONS['campaingRectangle']}
                />
                <Text style={{ fontSize: 18, color: '#4a4a4a', fontFamily: 'RegularTyp2', paddingBottom: 10 }}>Size özel kazanç dolu kampanyalar</Text>
            </View>
        );
    }
}

function mapStateToProps(state) { return state }
const CampaingExtraHeader = connect(mapStateToProps)(Main);
export { CampaingExtraHeader }