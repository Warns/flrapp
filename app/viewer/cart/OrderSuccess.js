import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';

class Main extends Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return null;
    }
}

function mapStateToProps(state) { return state }
const OrderSuccess = connect(mapStateToProps)(Main);
export { OrderSuccess };