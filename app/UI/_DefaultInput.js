
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

styles = require('../../app/styles.js');

// Let's go

const DefaultInput = class DefaultInput extends Component{
  _onPress = () => {
    this.props.callback(this.props.name);
  }
  render(){
    return(
      <TouchableOpacity activeOpacity={0.7} onPress={this._onPress}>
        <View style={[styles.input, {alignItems:"center", flexDirection:"row"}]}>
          <Text>{this.props.name}</Text>
          <Text numberOfLines={1} style={[styles.lightColor, { marginLeft:5, flex:1 }]}>{this.props.value}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export { DefaultInput };