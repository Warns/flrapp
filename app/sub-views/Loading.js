import React from 'react';
import {
  View,
  Image,
  Easing,
  Animated,
} from 'react-native';

export default class Loading extends React.Component{
  state = {
    backgroundColor: '#FF2B94',
    anim: new Animated.Value(0),
  };

  componentDidMount(){
    Animated.timing(
      this.state.anim, {
        toValue: 1,
        duration: 800,
        delay:500,
        easing: Easing.out(Easing.cubic),
      }
    ).start();
    this.setState({
      backgroundColor:'#ffffff',
    });

    setTimeout(() => {
      this._getOut();
    }, 2500);
  }

  _getOut = ()=>{
    Animated.timing(
      this.state.anim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        onComplete:this._Continue
      }
    ).start();
  }

  _Continue = ()=>{
    this.props.navigation.navigate('Splash');
  }

  render(){

    let { anim } = this.state;

    const _scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 1],
    });

    const _opacity = anim.interpolate({
      inputRange: [0.5, 1],
      outputRange: [0, 1],
    });

    const _image = anim.interpolate({
      inputRange: [0.5, 1],
      outputRange: [1.5, 1],
    });

    const _absolute = {width:150, height:150, borderRadius:75, position:'absolute', left:'50%', top:'50%', marginLeft:-75, marginTop:-75};

    return(
      <View style={{flex:1, backgroundColor:this.state.backgroundColor, justifyContent:'center', alignItems:'center'}}>
        <Animated.View style={[{zIndex:2, opacity:_opacity, transform: [{ scale: _image}]}, _absolute]}>
          <Image source={require('root/assets/images/logo-cp.png')} style={{width:150, height:150, resizeMode: 'contain'}} />
        </Animated.View>
        <Animated.View style={[{backgroundColor:'#FF2B94', borderRadius:75, zIndex:1, transform: [{ scale: _scale}]}, _absolute]}></Animated.View>
        <Image source={require('root/assets/gifs/three-dots.gif')} style={{resizeMode:'cover', width:60, height:60, borderRadius:30, position:'absolute', bottom:100, left:'50%', marginLeft:-30,}} />
      </View>
    )
  }
}