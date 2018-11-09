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
import EmailPage from 'root/app/sub-views/Email';
import PasswordPage from 'root/app/sub-views/Password';
import PasswordResetPage from 'root/app/sub-views/PasswordReset';
import SignupPage from 'root/app/sub-views/Signup';

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
  render(){ return <EmailPage {...this.props} /> }
}

class Password extends React.Component{
  render(){ return <PasswordPage {...this.props} /> }
}

class Signup extends React.Component{
  render(){ return <SignupPage {...this.props} /> }
}

class PasswordReset extends React.Component{
  render(){ return <PasswordResetPage {...this.props} /> }
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
    initialRouteName:'Splash',
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

