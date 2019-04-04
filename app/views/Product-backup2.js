import React from 'react';
import {
  Platform,
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
//import ViewOverflow from 'react-native-view-overflow';
const Entities = require('html-entities').AllHtmlEntities;

const SCREEN_DIMENSIONS = Dimensions.get('screen');

import { DefaultButton } from '../UI';
import { MinimalHeader, Palette } from '../components';
import { HorizontalProducts, VideosList } from '../components/';
import { 
  ICONS, 
  CLOSE_PRODUCT_DETAILS, 
  OPEN_PRODUCT_DETAILS, 
  ADD_CART_ITEM, 
  ADD_TO_FAVORITES, 
  REMOVE_FROM_FAVORITES,
  OPEN_VIDEO_PLAYER,
} from 'root/app/helper/Constant';
import { store } from '../../app/store';

globals = require('root/app/globals.js');

class ProductView extends React.Component {
  
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      header: null, 
    };
  };

  state = {
    anim: new Animated.Value(0),
    opacity: new Animated.Value(0),
    animationDone: false,
    detailIsOpen: false,
    videosIsOpen: false,
    canScroll: false,
    animationType: 'none',
    favoriteButton:{status:false, a:'FAVORİME EKLE', b:'FAVORİME EKLENDİ'},
  };

  componentDidMount(){
    this.props.dispatch({type:'UPDATE_PRODUCT_OBJECT', value:{callback:this._initAnimation}});
  }

  _initAnimation = () => {
    
    Animated.timing(
      this.state.anim, {
        toValue:1,
        duration: 600,
        easing: Easing.inOut(Easing.cubic),
        onComplete: this._initDetails,
      }
    ).start();

    console.log('init animation');
  }

  _animate = () => {
    Animated.timing(
      this.state.anim, {
        toValue:1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }
    ).start();

    Animated.timing(
      this.state.opacity, {
        toValue:1,
        duration: 300,
        easing: Easing.out(Easing.linear),
        delay: 400,
        onComplete: this._initDetails,
      }
    ).start();

  };

  _renderItem({item, index}){
    return(
      <View>
        <Image source={{uri:item.mediumImageUrl}} style={{width:270, height:337, resizeMode:'cover'}} />
      </View>
    );
  }

  _initDetails = ()=>{
    this.setState({animationDone: true });
  }

  _close = () =>{

    this.props.dispatch({type:CLOSE_PRODUCT_DETAILS, Value:{}});

    this.setState({
      animationDone: false, 
      //animationType:'none', 
      anim: new Animated.Value(0), 
      opacity: new Animated.Value(0), 
      detailIsOpen:false, 
      videosIsOpen:false,
      favoriteButton:{...this.state.favoriteButton, status:false},
    });

    /*
    //reset
    
    setTimeout(() => {
      this.setState({
        animationDone: false, 
        animationType:'none', 
        anim: new Animated.Value(0), 
        opacity: new Animated.Value(0), 
        detailIsOpen:false, 
        videosIsOpen:false,
        favoriteButton:{...this.state.favoriteButton, status:false},
      });
    }, 111);
    */

  }

  _showProductInfo = () => {
    this.setState({
      detailIsOpen:!this.state.detailIsOpen,
    })
    this.productScrollView.scrollTo({y: 360});
  }

  _showVideos = ()=> {
    this.setState({
      videosIsOpen:!this.state.videosIsOpen,
    })
  }

  _changeColor = ( id ) => {

    this.props.dispatch({type:OPEN_PRODUCT_DETAILS, value:{id:id, measurements:{}, animate:false, sequence: 0 }});
    console.log('----->', id);
  }

  _changeProduct = ( id ) => {

    this.setState({canScroll: true});
    this.props.dispatch({type:OPEN_PRODUCT_DETAILS, value:{id:id, measurements:{}, animate:false, sequence: 0 }});
    console.log('p----->', id);
  }

  _addToCart = () => {
    store.dispatch({type:ADD_CART_ITEM, value: {id: this.props.product.item.productId, quantity:1} });
    console.log('add');
  }

  _addToFavorites = () => {
    this.setState({
      favoriteButton:{...this.state.favoriteButton, status:!this.state.favoriteButton.status},
    });

    if(this.state.favoriteButton.status){
      store.dispatch({type:ADD_TO_FAVORITES, value: {id: this.props.product.item.productId} });
    }
    else{
      store.dispatch({type:REMOVE_FROM_FAVORITES, value: {id: this.props.product.item.productId} });
    }
  }

  _onVideoPress = (index, item) => {

    //console.log( this.props.product.item );
    
    this._close();
    this.props.dispatch({type:OPEN_VIDEO_PLAYER, value:{visibility:true, selected:index, items:this.props.product.videos}});
  }

  _renderAnimation = () => {
    let{ anim, detailIsOpen, opacity, canScroll, videosIsOpen, favoriteButton } = this.state;
    let { item, sequence, measurements, animate, colors, videos } = this.props.product;
    let animatedImage = null;
    let veil = null;

    if( item && animate ){

      let {width, height, pageY, pageX} = measurements;

      const _width = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 270],
      });
  
      const _height = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 1.25, 337],
      });
  
      const _top = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [pageY, 0],
      });
  
      const _left = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [Math.ceil(pageX), 0 + sequence * 270],
      });

      const _vail_top = anim.interpolate({
        inputRange: [0, .6, 1],
        outputRange: [SCREEN_DIMENSIONS.height, SCREEN_DIMENSIONS.height, 0],
      });
  
      const _opacity = anim.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [0, 1, 0],
      });

      animatedImage = <Animated.Image style={{width: _width, height: _height, top: _top, left: _left, position:'absolute', zIndex:10, resizeMode:'contain'}} source={{uri: item.productImages[sequence].mediumImageUrl }} />;
      veil = <Animated.View style={{width: SCREEN_DIMENSIONS.width, height: SCREEN_DIMENSIONS.height, top:0, left:0, position:'absolute', zIndex:9, opacity:1, backgroundColor:'#ffffff'}} />;

      if( !this.state.animationDone ){

        console.log('if not animation is done');
        
        this._animate();
      }
    }

    return(
      <View>
        {animatedImage}
        {veil
        }
      </View>
    );
  }

  _renderProduct = () => {
    let{ anim, detailIsOpen, opacity, canScroll, videosIsOpen, favoriteButton, animationDone } = this.state;
    let { item, sequence, measurements, animate, colors, videos } = this.props.product;
    if( item && animationDone ){
      

      const images = [];
      for( var k in item.productImages ){
        if(item.productImages[k].imageUrl.indexOf('mobile_texture') < 0){
          images.push(item.productImages[k]);
        }
      }

      
      
      if( animate && !this.state.animationDone ){
        
      }

      let palette = colors.length > 1 ? <Palette width={SCREEN_DIMENSIONS.width} items={colors} selected={item.shortCode} onPress={this._changeColor} /> : null;

      let videosButton = videos.length > 0 ? <ProductActionButton name="Videolar" count={videos.length} expanded={videosIsOpen} onPress={this._showVideos} /> : null;

      let _videos = videosIsOpen && videos.length > 0 ? <VideosList items={videos} callback={this._onVideoPress} /> : null;

      let recommendations = item.productRecommends.length > 0 ? (
        <View style={{marginTop:35}}>
          <Text style={[styles.sectionHeader, {marginLeft:20, marginBottom:15,}]}>İLGİLİ ÜRÜNLER</Text>
          <HorizontalProducts items={item.productRecommends} onPress={this._changeProduct} />
        </View>
       ) : null;

      let listPrice = item.discountRate > 0  ? <Text style={{ fontSize:18, color:'#989898', fontFamily:'brandon', fontWeight:'bold', marginLeft:15, textDecorationLine:'line-through'}}>₺{item.listPrice}</Text> : null;

      let productTags = [];
        for( var i in item.productAttributes){
          productTags.push(
          <View key={i} style={{backgroundColor:'#eeeeee', borderRadius:10, marginRight:5, marginBottom:5, height:36, justifyContent:'center', alignItems:'center', paddingRight:10, paddingLeft:10, borderRadius:10}}>
            <Text style={{color:'#4A4A4A'}}>{item.productAttributes[i].value}</Text>
          </View>
          );
        }

      const desc = Entities.decode( ( item.description || '' ).replace(/<[^>]*>/g, "") );

      let details = detailIsOpen ? (
          <View style={{borderBottomWidth:1, borderColor:'#D8D8D8', paddingBottom:50}}>
            <Text style={{fontSize:13, color:'#A9A9A9'}}>Bu ürün</Text>
            <View style={{flexDirection:'row', flexWrap: 'wrap', marginTop:10, marginBottom:20}}>
            {productTags}
            </View>
            <Text style={styles.defautText}>{desc}</Text>
            <Text style={[styles.defautText, { marginTop:15, fontSize:14}]}>Ürün kodu: {item.integrationId}</Text>
          </View>
        ) : null;

      let _favoriteButton = favoriteButton.status ? 
                            ( <DefaultButton callback={this._addToFavorites} name={favoriteButton.b} borderColor="#FF2B94" /> ):
                            ( <DefaultButton callback={this._addToFavorites} name={favoriteButton.a} /> );

      return( 
          <View>
            <View>
              <Carousel
                  ref={(c) => {this._carousel = c;}}
                  data={images}
                  renderItem={this._renderItem}
                  sliderWidth={SCREEN_DIMENSIONS.width}
                  sliderHeight={337}
                  itemWidth={270}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  activeSlideAlignment='start'
                  />
            </View>
            {palette}
            <View style={{padding:20, paddingBottom:0, paddingTop:0, borderTopWidth:1, borderTopColor:'#d8d8d8'}}>
              <View style={{flexDirection:'row', height:55, alignItems:'center'}}>
                <Text style={{ fontSize:18, fontFamily:'brandon', fontWeight:'bold'}}>₺{item.salePrice}</Text>
                {listPrice}
                <Text style={{fontSize:16, color:'#4A4A4A', position:'absolute', right:0}}>Hızla tükeniyor</Text>
              </View>

              <View style={{flexDirection:'row', height:80}}>
                <View style={{flex:1, marginRight:5, height:50}}>
                <DefaultButton
                    callback={this._addToCart}
                    name="SEPETE AT"
                    boxColor="#000000"
                    textColor="#ffffff"
                    borderColor="#000000"
                    />
                </View>
                <View style={{flex:1, marginLeft:5}}>
                {_favoriteButton}
                </View>
              </View>

              <View>
                <Text style={styles.defautText}>{item.shortDescription}</Text>
                <ProductActionButton name="Ürün Detayı" expanded={detailIsOpen} onPress={this._showProductInfo} />
                {details}
                <ProductActionButton name="Yorumlar" count={34} onPress={()=>{}} />
                {videosButton}
              </View>

            </View>
            {_videos}
            {recommendations}
            <View style={{height:60}} />
            </View>
      )
    }
    else
      null;
  }

  render(){

    let { item, screenshot, sequence, measurements } = this.props.product;
    let {width, height, pageY, pageX} = measurements;
    let{ canScroll, anim } = this.state;

    let _title = item ? item.productName : '';

      const _width = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 270],
      });
  
      const _height = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 1.25, 337],
      });
  
      const _top = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [pageY -60, 0],
      });
  
      const _left = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [Math.ceil(pageX), 0 + sequence * 270],
      });

    const _scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, .9],
    });

    const _alpha = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    let _screenshot = screenshot ? <Animated.Image source={{uri: screenshot }} style={{ position:'absolute', left:0, top:0, width:'100%', height:SCREEN_DIMENSIONS.height-57, resizeMode:'contain', opacity:_alpha, transform:[{scale:_scale}]}} /> : null;
    let _animatedImage = item ? <Animated.Image style={{width: _width, height: _height, top: _top, left: _left, position:'absolute', zIndex:10, resizeMode:'contain'}} source={{uri: item.productImages[sequence].mediumImageUrl }} />: null;

    return(
      <Modal
        animationType={this.state.animationType}
        transparent={false}
        visible={this.props.product.visibility}
      >
        <View style={{flex:1, backgroundColor:'#ffffff'}}>
          <MinimalHeader onPress={this._close} title={_title} noMargin={this.props.SCREEN_DIMENSIONS.OS == 'android' ? true : false } />
          <ScrollView
            ref={ref => this.productScrollView = ref}
            onContentSizeChange={() => {
              if( canScroll ){
                this.productScrollView.scrollTo({y: 0});
                this.setState({canScroll: false});
              }
            }}
          >
            {
              //this._renderAnimation()
            }
            {this._renderProduct()
            }
            {_screenshot}
            {_animatedImage}
          </ScrollView>
        </View>
      </Modal>
    )
  }
};

// filter state
function mapStateToProps(state){ return state.general; }
export default connect(mapStateToProps)(ProductView);

class ProductActionButton extends React.Component{
  
  _onPress = () => {
    this.props.onPress();
  };

  render(){

    let count = this.props.count ? ( 
      <View style={{padding:5, backgroundColor:'#dddddd', borderRadius:20, height:24, minWidth:24, marginLeft:10, justifyContent:'center', alignItems:'center'}}>
        <Text style={{fontSize:12,}}>{this.props.count}</Text>
      </View>
    ) : null;

    let icon = ICONS['rightArrow'],
        borderColor = '#D8D8D8'; 

    if( this.props.expanded ){
      icon = ICONS['downArrow'];
      borderColor = '#ffffff';
    }

    return(
      <TouchableOpacity activeOpacity={.8} onPress={this._onPress}>
      <View style={{flexDirection:'row', borderBottomWidth:1, borderColor:borderColor, height:60, alignItems:'center'}}>
        <Text style={{fontSize:16, fontWeight:'bold'}}>{this.props.name}</Text>
        {count}
        <Image source={icon} style={{width:40, height:40, resizeMode:'contain', position:'absolute', right:0, top:10,}} />
      </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  defautText:{
    fontSize: 16,
    color: '#6c6c6c',
    lineHeight:24,
  },
  sectionHeader:{
    fontSize: 16,
    fontFamily:'Bold',
  }
});