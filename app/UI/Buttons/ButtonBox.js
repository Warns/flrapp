import React from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

styles = require('root/app/styles.js');

// Let's go

export default class BoxButton extends React.Component{
  _onPress = () => {
    this.props.callback(this.props.name);
  }
  render(){

    const boxColorStyle = this.props.boxColor ? {backgroundColor: this.props.boxColor} : null;
    const textColorStyle = this.props.textColor ? {color: this.props.textColor} : null;

    console.log(boxColorStyle, textColorStyle)

    return(
      <TouchableOpacity activeOpacity={0.9} onPress={this._onPress}>
        <View style={[styles.boxButton, boxColorStyle]}>
          <Text style={[styles.bold, styles.white, styles.small, textColorStyle]}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}