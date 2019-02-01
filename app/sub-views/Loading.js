import React from 'react';
import {
  View,
  Image,
  Easing,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {
  SET_SCREEN_DIMENSIONS,
  SET_NAVIGATION,
  ASSISTANT_SHOW,
  SET_USER,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';

const Utils = require('root/app/helper/Global.js');
globals = require('root/app/globals.js');

const DIMENSIONS = Dimensions.get('window');
const TOP_MARGIN = (Platform.OS === 'ios') ? (DIMENSIONS.height == 812 || DIMENSIONS.height == 896) ? 30 : 20 : Expo.Constants.statusBarHeight;

class Loading extends React.Component {
  state = {
    backgroundColor: '#FF2B94',
    anim: new Animated.Value(0),
    password: null,
  };

  componentDidMount() {

    // this is used in all pages
    this.props.dispatch({ type: SET_SCREEN_DIMENSIONS, value: { window: DIMENSIONS, topMargin: TOP_MARGIN, OS: Platform.OS, isX: TOP_MARGIN == 30 } });
    this.props.dispatch({ type: SET_NAVIGATION, value: this.props.navigation });

    Animated.timing(
      this.state.anim, {
        toValue: 1,
        duration: 800,
        delay: 500,
        easing: Easing.out(Easing.cubic),
      }
    ).start();

    this.setState({
      backgroundColor: '#ffffff',
    });

    this._loadInitialState();

    /* registered push notification */
    globals.registerForPushNotificationsAsync();
  }

  _loadInitialState = async () => {

    globals.getSecureStorage('__OPTIN__', (answer) => {

      if (answer !== 'no') {

        let _optin = JSON.parse(answer);

        console.log('-----> secure ===>', _optin);

        this.setState({ password: _optin.password });

        if (_optin.userLoggedOut == true)
          this._getOut(false);
        else {
          globals.fetch(
            Utils.getURL({ key: 'user', subKey: 'login' }),
            JSON.stringify({
              "email": _optin.email,
              "password": _optin.password,

            }),
            this._fetchResultHandler
          );
        }


      }
      else
        setTimeout(() => {
          this._getOut(false);
        }, 2000);
    });
  }

  _fetchResultHandler = (answer) => {

    if (answer.status == 200) {

      this.props.dispatch({ type: SET_USER, value: { user: { ...answer.data, password: this.state.password } || {} } });
      this._Continue(true)

    } else {
      this._getOut(false);
    }
  }

  _getOut = (login) => {

    let _self = this;

    Animated.timing(
      this.state.anim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        onComplete: () => _self._Continue(login)
      }
    ).start();
  }

  _Continue = (login) => {

    if (login) {
      let _self = this;
      setTimeout(() => {
        _self.props.navigation.navigate("Home");
        _self.props.dispatch({ type: ASSISTANT_SHOW, value: true });
      }, 10);
    }
    else
      this.props.navigation.navigate('Splash');
  }

  render() {

    let { anim } = this.state;

    const _scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 1],
    });

    const _opacity = anim.interpolate({
      inputRange: [0.6, 1],
      outputRange: [0, 1],
    });

    const _image = anim.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [1.5, 1.5, 1],
    });

    const _absolute = { width: 150, height: 150, borderRadius: 75, position: 'absolute', left: '50%', top: '50%', marginLeft: -75, marginTop: -75 };

    return (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={[{ zIndex: 2, opacity: _opacity, transform: [{ scale: _image }] }, _absolute]}>
          <Image source={require('root/assets/images/logo-cp.png')} style={{ width: 150, height: 150, resizeMode: 'contain' }} />
        </Animated.View>
        <Animated.View style={[{ backgroundColor: '#FF2B94', borderRadius: 75, zIndex: 1, transform: [{ scale: _scale }] }, _absolute]}></Animated.View>
        <Image source={require('root/assets/gifs/three-dots.gif')} style={{ resizeMode: 'cover', width: 60, height: 60, borderRadius: 30, position: 'absolute', bottom: 120, left: '50%', marginLeft: -30, }} />
      </View>
    )
  }
}

// filter state
function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(Loading);