import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    Image,
    Platform,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Viewer } from 'root/app/viewer/';
import { ElevatedView } from 'root/app/components/';
import {
    ICONS,
    DATA_LOADED,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';

const Utils = require('root/app/helper/Global.js');
const DATA = {
    itemType: 'cartList',
    uri: { key: 'cart', subKey: 'getCart' },
    keys: {
        id: 'cartItemId',
        arr: 'products',
    },
    refreshing: false
};

class CartFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <ElevatedView>
                <View style={{ backgroundColor: '#FFFFFF' }}>

                </View>
            </ElevatedView>
        );
    }
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _callback = ({ type, data }) => {
        /*if (type === DATA_LOADED)
            console.log(data);*/
    }

    render() {
        const _self = this;
        console.log('asdasd', _self.props);
        return (
            <View style={{ flex: 1 }}>
                <Viewer {..._self.props} style={{ paddingLeft: 10, paddingRight: 10 }} config={DATA} callback={this._callback} />
                <CartFooter />
            </View>
        )
    }
}

const CartNavigation = createStackNavigator(
    {
        Main: {
            screen: props => <Main {...props} />,
        }
    },
    {
        navigationOptions: {
            header: null
        },
        cardStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
        }
    }
);

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(CartNavigation);