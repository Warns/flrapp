
import React from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

styles = require('../../app/styles.js');

// Let's go

export default class IconButton extends React.Component{
  _onPress = () => {
    this.props.callback(this.props.name);
  }
  render(){

    const icon = this.props.icon;

    return(
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.iconButton}>
          {icon}
        </View>
      </TouchableOpacity>
    );
  }
}
