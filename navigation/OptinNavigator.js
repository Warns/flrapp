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


class Loading extends React.Component{
  render(){ return <LoadingPage {...this.props} /> }
}

class Splash extends React.Component{
  render(){ return <SplashPage {...this.props} /> }
}

class Phone extends React.Component{
  render(){
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Phone</Text></View>
  }
}

class PhoneConfirmation extends React.Component{
  render(){
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>PHone Confirmation</Text></View>
  }
}

class Email extends React.Component{
  render(){
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Email</Text></View>
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
      gesturesEnabled: false
    }
  }
);

//function mapStateToProps(state) { return state.user }
//export default connect(mapStateToProps)( OptinNavigator );

export default OptinNavigator;

