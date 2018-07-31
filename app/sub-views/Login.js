import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Modal,
} from 'react-native';
import{ SecureStore } from 'expo';

import BoxButton from '../UI/BoxButton';
import FieldInput from '../UI/FieldInput';

styles = require('../styles.js');
globals = require('../globals.js');

export default class Splash extends React.Component{

  state = {
    fadeAnim: new Animated.Value(0),
    loginIsVisible: true,
    videoIsPlaying: true,
  }

  componentDidMount(){
  }

  _requestLogin = () => {

    globals.fetchURL(
      "https://www.flormar.com.tr/webapi/v3/User/login",
      JSON.stringify({
        "email": "alacaesar@gmail.com",
        "password": "seventhy"
      }),
      this._loginResultHandler
    );

  }

  _loginResultHandler = ( answer ) => {

    console.log( answer );

  }

  render(){

    let { fadeAnim } = this.state;

    const newFadeAnim = fadeAnim.interpolate({
      inputRange: [0.8, 1],
      outputRange: [0, 1],
    });

    return(
      <Animated.View style={{flex:1, padding:30, paddingTop:180, opacity: 1 /*fadeAnim*/ }}>
        <FieldInput label="Email" />
        <FieldInput label="Şifre" />
        <BoxButton
            callback={this._skipLogin}
            name="GİRİŞ YAP"
            boxColor="#ffffff"
            textColor="#000000"
            />
      </Animated.View>
    )
  }
}
