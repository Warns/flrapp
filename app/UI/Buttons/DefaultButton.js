
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

    const boxColorStyle = this.props.boxColor ? this.props.boxColor : '#FFFFFF';
    const textColorStyle = this.props.textColor ? this.props.textColor : '#000000';
    const borderColorStyle = this.props.borderColor ? this.props.borderColor : '#DDDDDD';

    return(
      <TouchableOpacity activeOpacity={0.9} onPress={this._onPress}>
        <View style={{ alignItems:"center", justifyContent:"center", backgroundColor: boxColorStyle, borderWidth:1, borderColor:borderColorStyle, height:48, borderRadius:3 }}>
          <Text style={{color:textColorStyle, fontSize:16, fontFamily:'Bold', fontWeight:'900'}}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export { DefaultButton };