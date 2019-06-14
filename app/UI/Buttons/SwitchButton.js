
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Image,
} from 'react-native';

// Let's go

const SwitchButton = class SwitchButton extends React.Component{

  state = {
    anim: new Animated.Value(0),
    on: false,
  }

  _onPress = () => {
    this.props.callback(this.props.name);

    if(this.state.on){
      this.setState({on:false});
      Animated.timing(
        this.state.anim,
        {
          toValue:0,
          easing: Easing.elastic(),
          duration:222,
        }
      ).start();
    }
    else {
      this.setState({on:true});
      Animated.timing(
        this.state.anim,
        {
          toValue:16,
          easing: Easing.elastic(),
          duration:222,
        }
      ).start();
    }
  }

  render(){

    let { anim, on } = this.state;
    let { icon } = this.props;

    const interpolateColor = this.state.anim.interpolate({
      inputRange:[0, 16],
      outputRange: ['rgb(146,147,159)', 'rgb(116,16,224)']
    });

    //const buttonIcon = icon || <Image source={require('../../assets/icons/pin.png')} />;

    const textStyle = on ? [] : null;

    return(
      <TouchableOpacity activeOpacity={1} onPress={this._onPress}>
      <View style={{flexDirection:"row", alignItems:"center", padding:5}}>
        <View style={{height:20}}>
          <View style={{backgroundColor:"silver", width:36, height:8, borderRadius:4, top:6}}>
          </View>
          <Animated.View style={{backgroundColor:interpolateColor, width:20, height:20, borderRadius:10, top:-8, justifyContent:"center", alignItems:"center", left:anim}}>
          </Animated.View>
        </View>
        <View style={{height:20, justifyContent:"center", marginLeft:7}}>
          <Text style={textStyle}>{this.props.name}</Text>
        </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export { SwitchButton };