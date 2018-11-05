import React from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  View,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { SplashHeader } from '../components';
import { DefaultButton, DefaultInput, LoadingButton } from '../UI';
import { Video, Constants } from 'expo';

import { Form } from 'root/app/form';
import {
  FORMDATA,
  SET_USER,
  SET_NAVIGATION,
  SET_SCREEN_DIMENSIONS
} from 'root/app/helper/Constant';

styles = require('../styles.js');
globals = require('../globals.js');

const DIMENSIONS = Dimensions.get('window');
const TOP_MARGIN = (Platform.OS === 'ios') ? ( DIMENSIONS.height == 812 || DIMENSIONS.height == 896 ) ? 30 : 20 : Expo.Constants.statusBarHeight;

function mapStateToProps(state) {
  return state
}

class Splash extends React.Component {

  static navigationOptions = {
    title: 'Flormar',
    header: null,
  }

  state = {
    fadeAnim: new Animated.Value(0),
    loginIsVisible: false,
    videoIsPlaying: true,
    localStorage: {},
  }

  componentDidMount() {

    this.props.dispatch({ type: SET_SCREEN_DIMENSIONS, value:{window: DIMENSIONS, topMargin:TOP_MARGIN, OS:Platform.OS, isX: TOP_MARGIN == 30 } });

    _loadInitialState(this._routeAccordingToAsyncStorage);

    /* root navigation redux bağlamak için kullanırız */
    this.props.dispatch({ type: SET_NAVIGATION, value: this.props.navigation });
  }

  _routeAccordingToAsyncStorage = () => {

    console.log('rooting');

    if (globals.CLIENT.Login != null) {

      //this._requestLogin();
      this._requestLogin();

    }
    else {

      console.log('there is no login info')

    }

  }

  _requestLogin = () => {

    globals.fetch(
      "https://www.flormar.com.tr/webapi/v3/User/login",
      JSON.stringify({
        "email": globals.CLIENT.Login.email,
        "password": "seventhy"
      }),
      this._loginResultHandler
    );

  }

  _loginResultHandler = (answer) => {

    globals.CLIENT.Login = answer;

    //console.log( 'logged in: ', answer.data.firstName );

    //console.log('rooting', globals.CLIENT );

    globals.refreshSecureStorage();

  }

  _updateCart = () => {
    let categories = [
      {
        selector: 'TÜMÜ',
        id: 'tumu',
      },
      {
        selector: 'YENİ',
        id: 'yeni',
      },
      {
        selector: 'GÖZ FARI',
        id: 'goz-fari',
      },
    ];

    this.props.dispatch({ type: 'SET_CATEGORIES', value: { categories: categories, selectedCategory: 'nails' } });
    this.props.navigation.navigate("Category");
  }

  _updateCart2 = () => {

    let categories = [
      {
        selector: 'TÜMÜ',
        id: 'tumu',
      },
      {
        selector: 'YENİ',
        id: 'yeni',
      },
      {
        selector: 'GÖZ FARI',
        id: 'goz-fari',
      },
      {
        selector: 'MASKARA',
        id: 'maskara',
      },
      {
        selector: 'KAŞ',
        id: 'kas',
      },
      {
        selector: 'GÖZ KALEMİ',
        id: 'goz-kalemi',
      },
      {
        selector: 'LİKİT EYELINER',
        id: 'likit-eyeliner',
      },
      {
        selector: 'GÖZ MAKYAJI TEMİZLEME',
        id: 'goz-makyaj-temizleme',
      },
      {
        selector: 'BAZ',
        id: 'baz',
      }
    ];

    //this.props.dispatch({type: 'SET_CATEGORIES', value: {categories: categories, selectedCategory: 'nails'}});
    this.props.navigation.navigate("Home");

    //this.props.dispatch({type: 'ADD_CART_ITEM', value: 1});
  }

  _openLoginForm = () => {

    this.setState({
      loginIsVisible: true,
      videoIsPlaying: false,
    });

    Animated.timing(
      this.state.fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
      }
    ).start();
  };

  _skipLogin = () => {

    this.props.navigation.navigate("Category");

    this.setState({
      loginIsVisible: false,
    });

    Animated.timing(
      this.state.fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.cubic),
      }
    ).start();
  };

  _onCloseLogin = () => {

    this.setState({
      loginIsVisible: false,
    });

    Animated.timing(
      this.state.fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.cubic),
      }
    ).start();
  }

  _onLoginStatus = ({ type, data = {} }) => {
    /* login durumu dönecek */
    const _self = this,
      { status, message } = data;
    if (type == 'success') {
      _self.props.dispatch({ type: SET_USER, value: data['data'] || {} });
      setTimeout(() => {
        _self._onCloseLogin();
        _self.props.navigation.navigate('Home');
      }, 10);
    } else
      alert(message);
  }

  render() {

    let { fadeAnim } = this.state;

    const scale = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1],
    });

    const reverseFadeAnim = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const newFadeAnim = fadeAnim.interpolate({
      inputRange: [0.8, 1],
      outputRange: [0, 1],
    });

    const boxPadding = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [210, 180],
    });

    return (
      <View style={{ backgroundColor: "#222222", flex: 1 }}>
      {/*
      <Video
        source={require('../../assets/loop.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay={this.state.videoIsPlaying}
        isLooping
        style={styles.backgroundImage}
      />
      */}
        <Animated.Image
          style={[
            styles.backgroundImage,
            {
              opacity: fadeAnim,
              transform: [{ translateY: 0 }, { scale: scale }],
            },
          ]}
          source={require('../../assets/images/welcome-blurred.png')}
        />
        <Image style={{ width: 180, position: 'absolute', top: 50, resizeMode: 'contain', alignSelf: 'center' }} source={require('../../assets/images/logo-w.png')} />
        <Animated.View style={{ flex: 1, flexDirection: "column-reverse", padding: 30, opacity: reverseFadeAnim }}>
          <DefaultButton
            callback={this._updateCart}
            name="ÜYELİKSİZ DEVAM ET"
            boxColor="transparent"
            textColor="#ffffff"
          />
          <View style={{ flex: 1, maxHeight: 70, flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <DefaultButton
                callback={this._openLoginForm}
                name="GİRİŞ YAP"
                boxColor="#ffffff"
                textColor="#000000"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <DefaultButton
                callback={this._updateCart2}
                name="ÜYE OL"
                boxColor="#ffffff"
                textColor="#000000"
              />
            </View>
          </View>
        </Animated.View>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.loginIsVisible}
        >
          <SplashHeader onCloseLogin={this._onCloseLogin} />
          <Animated.View style={{ flex: 1, padding: 30, paddingTop: boxPadding, opacity: 1 /*fadeAnim*/ }}>
            <Form scrollEnabled={false} style={{ paddingLeft: 0, paddingRight: 0 }} data={FORMDATA['login']} callback={this._onLoginStatus} />
          </Animated.View>
        </Modal>
      </View>
    )
  }
}

export default connect(mapStateToProps)(Splash);

// check Async Local Secure Storage for user information.
async function _loadInitialState(callback) {
  globals.getSecureStorage('__USER__', (answer) => {
    if (answer !== 'no')
      globals.CLIENT = JSON.parse(answer);
    callback();
  });
}
