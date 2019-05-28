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
  SET_NAVIGATION,
  SET_SCREEN_DIMENSIONS,
  ASSISTANT_SHOW,
  OPEN_VIDEO_PLAYER,
} from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');
const DIMENSIONS = Dimensions.get('window');

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
    images: [
      { thumb: Utils.prefix + "/UPLOAD/APP/assets/slider-1.png", curve: require('../../assets/images/splash-white-background-2.png'), title: 'HOŞ GELDİN!', text: 'Yenilenen Flormar Mobil uygulaması ile sana özel içerik ve kampanyalarla mobil alışveriş deneyiminin keyfini çıkar.', video: false },
      { thumb: Utils.prefix + "/UPLOAD/APP/assets/slider-2.png", curve: require('../../assets/images/splash-white-background-1.png'), title: 'FLORMAR EXTRA', text: 'Flormar Extra üyesi olmak için mobil uygulamaya giriş yap, her siparişte %5 Extra TL* kazan.\n\n*1 Extra TL = 1 TL' },
      { thumb: Utils.prefix + "/UPLOAD/APP/assets/slider-3.png", curve: require('../../assets/images/splash-white-background-2.png'), title: 'HEMEN ÜYE OL', text: 'Online’a özel ilk siparişinde tüm ürünlerde net 40% indirim kazan! \n\n*Kargo bedava ' }
    ],
    activeSlide: 0,
  }

  componentDidMount() {

  }

  _continueToHome = () => {
    this.props.navigation.navigate("Home");
    this.props.dispatch({ type: ASSISTANT_SHOW, value: true });
  }

  _onLoginPressed = () => {
    this.props.navigation.navigate('Phone');
  };

  _onSignupPressed = () => {

    /*this.props.dispatch({type:UPDATE_PRODUCT_VIDEOS, value:{visibility:true, selected:1, items:[
      {
        "provider": "youtube",
        "text": "Doğal Görünümlü Kaş Nasıl Elde Edilir?",
        "thumbnail": "/UPLOAD/collection/Thumbnail_dogal_görünümlü_kas.jpg",
        "videoId": "D3ty3l4x2GA",
      },
      {
        "provider": "youtube",
        "text": "Seyrek Kaşlar Nasıl Doldurulur?",
        "thumbnail": "/UPLOAD/collection/Thumbnail_seyrek_kaslar_nasıl_dolgunlastirilir copy copy.jpg",
        "videoId": "nQYHmB8EKyk",
      }
    ]}});*/

    this.props.navigation.navigate('Signup');
  };

  _renderItem = (obj, parallaxProps) => {
    let media = obj.item.video ? (
      <Video
        source={require('../../assets/loop.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay={this.state.videoIsPlaying}
        isLooping={this.state.videoIsPlaying}
        style={styles.backgroundImage}
      />
    ) : (
        <ParallaxImage
          source={{ uri: obj.item.thumb }}
          parallaxFactor={0.3}
          containerStyle={{ flex: 1 }}
          style={{ resizeMode: 'cover' }}
          showSpinner={true}
          {...parallaxProps}
        />
      );

    return (
      <View style={{ flex: 1, width: DIMENSIONS.width, height: DIMENSIONS.height }}>
        {media}
        <View style={{ position: 'absolute', bottom: 0, width: '100%', }}>
          <Image source={obj.item.curve} style={{ width: DIMENSIONS.width, height: DIMENSIONS.width * .1, resizeMode: 'cover' }} />
          <View style={{ backgroundColor: '#ffffff', padding: 35, paddingTop: 20, alignItems: 'center', height: 300 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Bold', color: '#000000' }}>{obj.item.title}</Text>
            <Text style={{ color: '#000000', fontSize: 15, textAlign: 'center', }}>{obj.item.text}</Text>
          </View>
        </View>
      </View>
    );
  }

  _onCarouselSnap = (index) => {
    this.setState({
      activeSlide: index,
      videoIsPlaying: this.state.images[index].video != true ? false : true,
    });
  }

  get pagination() {
    const { images, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeSlide}
        containerStyle={{ position: 'absolute', width: '100%', bottom: 110 }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: 'rgba(150, 150, 150, 0.9)'
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
          ref={(c) => { this._carousel = c; }}
          data={images}
          onSnapToItem={this._onCarouselSnap}
          renderItem={this._renderItem}
          sliderWidth={DIMENSIONS.width}
          sliderHeight={DIMENSIONS.height}
          itemWidth={DIMENSIONS.width}
          itemHeight={DIMENSIONS.height}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          activeSlideAlignment='center'
          hasParallaxImages={true}
          layoutCardOffset={0}
          enableSnap={true}
        />
        {this.pagination}
        <Image style={{ width: 180, position: 'absolute', top: 30, resizeMode: 'contain', alignSelf: 'center', zIndex: 1 }} source={require('../../assets/images/logo-w.png')} />
        {/*<Image style={{ opacity: .3, width: '100%', height: 340, position: 'absolute', bottom: 0, resizeMode: 'cover', zIndex: 1 }} source={require('../../assets/images/splash-white-background.png')} />*/}

        <Animated.View style={{ width: '100%', position: 'absolute', bottom: 0, flexDirection: "column-reverse", padding: 30, paddingBottom: 10, opacity: reverseFadeAnim }}>
          <DefaultButton
            callback={this._continueToHome}
            name="Atla"
            boxColor="transparent"
            textColor="#000000"
            borderColor='rgba(0,0,0,0)'

          />
          <View style={{ flex: 1, maxHeight: 70, flexDirection: 'row', marginBottom: 5 }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <DefaultButton
                callback={this._onLoginPressed}
                name="GİRİŞ YAP / ÜYE OL"
                boxColor="#000000"
                textColor="#ffffff"
                borderColor="rgba(0,0,0,0)"
              />
            </View>
            { /* <View style={{ flex: 1, marginLeft: 5 }}>
              <DefaultButton
                callback={this._onSignupPressed}
                name="ÜYE OL"
                boxColor="#ffffff"
                textColor="#000000"
                borderColor="rgba(0,0,0,0)"
              />
    </View> */ }
          </View>
        </Animated.View>

        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.loginIsVisible}
          onRequestClose={() => { }}
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