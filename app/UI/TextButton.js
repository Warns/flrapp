
import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';

styles = require('../../app/styles.js');

// Let's go

export default class TextButton extends React.Component{
  _onPress = () => {
    this.props.callback(this.props.name);
  }
  render(){

    const { color } = this.props;
    const colorStyle = color ? {color: color} : styles.mainColor;

    return(
      <TouchableOpacity onPress={this._onPress}>
          <Text style={[styles.bold, colorStyle]}>{this.props.name}</Text>
      </TouchableOpacity>
    );
  }
}
