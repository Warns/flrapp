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
import Carousel from 'react-native-snap-carousel';

import { Form } from 'root/app/form';
import {
  FORMDATA,
  SET_USER,
  SET_NAVIGATION,
  SET_SCREEN_DIMENSIONS
} from 'root/app/helper/Constant';

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
    images:[1,1,1]
  }

  componentDidMount() {

    this.props.dispatch({ type: SET_SCREEN_DIMENSIONS, value:{window: DIMENSIONS, topMargin:TOP_MARGIN, OS:Platform.OS, isX: TOP_MARGIN == 30 } });
    this.props.dispatch({ type: SET_NAVIGATION, value: this.props.navigation });
  
  }

  _continueToHome = () => {
    this.props.navigation.navigate("Home");
  }

  _openLoginForm = () => {

    this.setState({
      loginIsVisible: true,
      videoIsPlaying: false,
      images: [1,1,1],
    });

    Animated.timing(
      this.state.fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
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

  _renderItem = ()=>{
    return <View></View>
  }

  render() {

    let { fadeAnim, images } = this.state;

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
      outputRange: [150, 120],
    });

    return (
      <View style={{ backgroundColor: "#222222", flex: 1 }}>
        <Carousel
                  ref={(c) => {this._carousel = c;}}
                  data={images}
                  renderItem={this._renderItem}
                  sliderWidth={DIMENSIONS.width}
                  sliderHeight={337}
                  itemWidth={270}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  activeSlideAlignment='start'
                  />
      </View>
    )
  }
}

export default connect(mapStateToProps)(Splash);