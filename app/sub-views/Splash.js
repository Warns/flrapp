import React from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { SplashHeader } from '../components';
import { DefaultButton, DefaultInput, LoadingButton } from '../UI';
import { Video, Constants } from 'expo';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';

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
    images:[
      {thumb:"https://www.flormar.com.tr/UPLOAD/APP/assets/slider-1.png", title:'RENK DOLU DÜNYA', text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.', video:false},
      {thumb:"https://www.flormar.com.tr/UPLOAD/APP/assets/slider-2.png", title:'EKSTRA FIRSAT', text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'},
      {thumb:"https://www.flormar.com.tr/UPLOAD/APP/assets/slider-3.png", title:'İLHAM VERİCİ', text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
    ],
    activeSlide: 0,
  }

  componentDidMount() {

    this.props.dispatch({ type: SET_SCREEN_DIMENSIONS, value:{window: DIMENSIONS, topMargin:TOP_MARGIN, OS:Platform.OS, isX: TOP_MARGIN == 30 } });
    this.props.dispatch({ type: SET_NAVIGATION, value: this.props.navigation });
  
    _loadInitialState(this._routeAccordingToAsyncStorage);

  }

  _routeAccordingToAsyncStorage = () => {

    if (globals.CLIENT.Login != null) {
      //auto login
    }
    else {
      console.log('there is no login info')
    }
  }

  _continueToHome = () => {
    this.props.navigation.navigate("Home");
  }

  _onLoginPressed = () => {
    //this.props.navigation.navigate('Phone');
  };

  _onSignupPressed = () => {
    //this.props.navigation.navigate('Signup');
  };

  _renderItem = ( obj, parallaxProps )=>{

    if(obj.item.video)
    return(
      <View style={{flex:1, width:DIMENSIONS.width, height:DIMENSIONS.height}}>
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
        <View style={{position:'absolute', bottom:190, left:DIMENSIONS.width*.1, alignItems:'center', width:DIMENSIONS.width*.8}}>
            <Text style={{fontSize:20, fontFamily:'Bold', color:'#ffffff'}}>{obj.item.title}</Text>
            <Text style={{color:'#ffffff', fontSize:15, textAlign: 'center',}}>{obj.item.text}</Text>
          </View>
      </View>
    );
    else
    return( 
      <View style={{flex:1, width:DIMENSIONS.width, height:DIMENSIONS.height}}>
        <ParallaxImage
          source={{uri: obj.item.thumb }}
          parallaxFactor={0.3}
          containerStyle={{flex:1}}
          style={{resizeMode:'cover'}}
          showSpinner={true}
          {...parallaxProps}
          >
          </ParallaxImage>
          <View style={{position:'absolute', bottom:190, left:DIMENSIONS.width*.1, alignItems:'center', width:DIMENSIONS.width*.8}}>
            <Text style={{fontSize:20, fontFamily:'Bold', color:'#ffffff'}}>{obj.item.title}</Text>
            <Text style={{color:'#ffffff', fontSize:15, textAlign: 'center'}}>{obj.item.text}</Text>
          </View>
      </View>
    )
  }

  get pagination () {
      const { images, activeSlide } = this.state;
      return (
          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            containerStyle={{ position:'absolute', width:'100%', bottom:130 }}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            inactiveDotStyle={{
                // Define styles for inactive dots here
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
      );
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
      <View style={{ backgroundColor: "#FF2B94", flex: 1 }}>
        <Carousel
                  ref={(c) => {this._carousel = c;}}
                  data={images}
                  onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                  renderItem={this._renderItem}
                  sliderWidth={DIMENSIONS.width}
                  sliderHeight={DIMENSIONS.height}
                  itemWidth={DIMENSIONS.width}
                  itemHeight={DIMENSIONS.height}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={.5}
                  activeSlideAlignment='center'
                  hasParallaxImages={true}
                  layoutCardOffset={0}
                  enableSnap={true}
                  />
                  {this.pagination}
        <Image style={{ width: 180, position: 'absolute', top: 30, resizeMode: 'contain', alignSelf: 'center', zIndex:1 }} source={require('../../assets/images/logo-w.png')} />
        
        <Animated.View style={{ width:'100%', position:'absolute', bottom:0, flexDirection: "column-reverse", padding: 30, opacity: reverseFadeAnim }}>
          <DefaultButton
            callback={this._continueToHome}
            name="ÜYELİKSİZ DEVAM ET"
            boxColor="transparent"
            textColor="#ffffff"
            borderColor='rgba(0,0,0,0)'
            
          />
          <View style={{ flex: 1, maxHeight: 70, flexDirection: 'row', marginBottom:5 }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <DefaultButton
                callback={this._onLoginPressed}
                name="GİRİŞ YAP"
                boxColor="#ffffff"
                textColor="#000000"
                borderColor="rgba(0,0,0,0)"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <DefaultButton
                callback={this._onSignupPressed}
                name="ÜYE OL"
                boxColor="#ffffff"
                textColor="#000000"
                borderColor="rgba(0,0,0,0)"
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


async function _loadInitialState(callback) {
  globals.getSecureStorage('__USER__', (answer) => {
    if (answer !== 'no')
      globals.CLIENT = JSON.parse(answer);
    callback();
  });
}