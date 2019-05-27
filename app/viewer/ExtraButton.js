import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native';
import { connect } from 'react-redux';
import { ICONS, ITEMTYPE } from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');

class ExtraBtn extends Component {
    constructor(props) {
        super(props);
    }
    _onPress = () => {
        const _self = this,
            { onPress } = _self.props;
        if (onPress)
            onPress({ item: { type: ITEMTYPE['TRIGGERBUTTON'], itemType: ITEMTYPE['EXTRABUTTON'] } });
    }
    render() {
        const _self = this,
            { user = {} } = _self.props.user || {},
            { points = '0' } = user;

        return (
            <TouchableOpacity activeOpacity={1} onPress={_self._onPress}>
                <View style={{ backgroundColor: '#000000', height: 70, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Image
                        style={{ width: 113, height: 70 }}
                        source={ICONS['flormarExtra']}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#FFFFFF', fontFamily: 'RegularTyp2', fontSize: 16 }}>{Utils.getPriceFormat(points)}</Text>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={ICONS['rightArrowWhite']}
                        />
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}

function mapStateToProps(state) { return state }
const ExtraButton = connect(mapStateToProps)(ExtraBtn);
export { ExtraButton }