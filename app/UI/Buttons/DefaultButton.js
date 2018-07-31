
import React from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

// Let's go

const DefaultButton = class DefaultButton extends React.Component{
  _onPress = () => {
    this.props.callback(this.props.name);
  }
  render(){

    const boxColorStyle = this.props.boxColor ? {backgroundColor: this.props.boxColor} : null;
    const textColorStyle = this.props.textColor ? {color: this.props.textColor} : null;

    return(
      <TouchableOpacity activeOpacity={0.9} onPress={this._onPress}>
        <View style={{ alignItems:"center", justifyContent:"center", backgroundColor:"#FFFFFF", height:50 }}>
          <Text style={[]}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export { DefaultButton };