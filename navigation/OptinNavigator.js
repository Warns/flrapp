import React from 'react';
import {
  View,
  Text,
  Image,
  Easing,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { store } from 'root/app/store';
import { NAVIGATE } from 'root/app/helper/Constant';

import LoadingPage from 'root/app/sub-views/Loading';
import SplashPage from 'root/app/sub-views/Splash';
import PhonePage from 'root/app/sub-views/Phone';
import PhoneConfirmationPage from 'root/app/sub-views/PhoneConfirmation';

import { CartHeader, DefaultHeader, MinimalHeader } from 'root/app/components/';


class Loading extends React.Component{
  render(){ return <LoadingPage {...this.props} /> }
}

class Splash extends React.Component{
  render(){ return <SplashPage {...this.props} /> }
}

class Phone extends React.Component{
  render(){ return <PhonePage {...this.props} /> }
}

class PhoneConfirmation extends React.Component{
  render(){ return <PhoneConfirmationPage {...this.props} /> }
}

class Email extends React.Component{
  render(){
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Voila! Email</Text></View>
  }
}

class Password extends React.Component{
  render(){
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Password</Text></View>
  }
}

class Signup extends React.Component{
  render(){
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Signup</Text></View>
  }
}

class PasswordReset extends React.Component{
  render(){
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Password Reset</Text></View>
  }
}

const OptinNavigator = createStackNavigator(
  {
    Loading: { screen: Loading },
    Splash: { screen: Splash },
    Phone: { screen: Phone },
    PhoneConfirmation: { screen: PhoneConfirmation },
    Email: { screen: Email },
    Password: { screen: Password },
    Signup: { screen: Signup },
    PasswordReset: { screen: PasswordReset },
  },
  {
    index:0,
    lazy: true,
    initialRouteName:'Loading',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
    cardStyle:{
      backgroundColor:'#ffffff',
      elevation:0,
    }
  }
);

//function mapStateToProps(state) { return state.user }
//export default connect(mapStateToProps)( OptinNavigator );

export default OptinNavigator;

