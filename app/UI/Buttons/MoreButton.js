
import React, { Component } from 'react';
import {
    Image,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

class MoreBtn extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        this.props.dispatch({ type: 'SHOW_MENU', value: { direction: 'right', type: 'extra' } });
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.4} onPress={this._onPress}>
                <Image source={require('root/assets/images/icons/more.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
            </TouchableOpacity>
        );
    }
}

function mapStateToProps(state) { return state }
const MoreButton = connect(mapStateToProps)(MoreBtn);
export { MoreButton };