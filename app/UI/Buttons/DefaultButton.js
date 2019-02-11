
import React from 'react';
import {
  Text,
  Image,
  Easing,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

// Let's go

const DefaultButton = class DefaultButton extends React.Component{

  state = {
    anim: new Animated.Value(0),
  }

  _onPress = () => {
    this.props.callback(this.props.name);

    Animated.timing(
      this.state.anim, {
        toValue: 1,
        duration: 600,
        easing: Easing.inOut(Easing.cubic),
        onComplete: this._onAnimComplete,
      }
    ).start();
  }

  _onAnimComplete = () =>{
      this.setState({anim: new Animated.Value(0)});
  }

  render(){

    let _opacity = this.state.anim.interpolate({
      inputRange: [0, .1, .9, 1],
      outputRange: [0, 1, 1, 0],
    });

    let _scale = this.state.anim.interpolate({
      inputRange: [0, .5, 1],
      outputRange: [1, 7, 7],
    });

    const boxColorStyle = this.props.boxColor ? this.props.boxColor : '#FFFFFF';
    const textColorStyle = this.props.textColor ? this.props.textColor : '#000000';
    const borderColorStyle = this.props.borderColor ? this.props.borderColor : '#DDDDDD';

    return(
      <TouchableOpacity style={{...this.props.wrapperStyle}} activeOpacity={.96} onPress={this._onPress}>
        <View style={[{ alignItems:"center", justifyContent:"center", backgroundColor: boxColorStyle, borderWidth:1, borderColor:borderColorStyle, height:48, borderRadius:3, overflow:'hidden' }]}>
          <Animated.View style={{position:'absolute', opacity:_opacity, transform:[{scale: _scale}], backgroundColor:'rgba(180,180,180,.4)', width:60, height:60, top:'50%', left:'50%', borderRadius:30, marginLeft:-30, marginTop:-30}} />
          <Animated.View style={{position:'absolute', backgroundColor:'#3BC9A9', left:0, right:0, flex:1}} />
          <Text style={{color:textColorStyle, fontSize:16, fontFamily:'Bold', fontWeight:'900'}}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export { DefaultButton };