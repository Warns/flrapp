import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { connect } from 'react-redux';
import { ElevatedView } from 'root/app/components/';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const _self = this,
            { cartInfo = {} } = _self.props.cart,
            { total, subTotal, discountTotal } = cartInfo;
        
        return (
            <ElevatedView
                elevation={4}
                style={{
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    height: 125,
                    width: '100%',
                    left: 0,
                    bottom: 0
                }}>
                <View style={{ backgroundColor: '#FFFFFF' }}>
                    <Text>ARA TOPLAM: {subTotal}</Text>
                    <Text>İNDİRİM: {discountTotal}</Text>
                    <Text>TOPLAM: {total}</Text>
                </View>
            </ElevatedView>
        );
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(Main);;