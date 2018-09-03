import React from 'react';
import {
  Platform,
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { store } from '../../app/store';
import { BlackButton, LineButton } from '../UI';

const width = Dimensions.get('window').width;

class Navigation extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          navigation: [],
          currentIndex: 0,
          modalVisible: false,
          modalData: [],
      }
  }

  componentDidMount() {
      const { settings } = store.getState();
      this.setState({ navigation: settings['menu']['main'] });
  }

  _onPressButton = (o) => {
      this.setModalVisible(({ visible: true, data: o }));
  }

  // Modal
  setModalVisible({ visible = false, data = [] }) {
      this.setState({ modalVisible: visible, modalData: data });
  }

  // scrollView
  ScrollView = null;

  componentDidUpdate(){
    this.ScrollView.scrollTo({
        x: this.props.scrollValue * width,
        animated: false,
    });
  }

  _onMove = (value) => {
    console.log( value );
      /*
      const { navigation } = this.state;
      const currentOffset = this.state.currentIndex * width;
      let resolvedOffset = currentOffset - (value * 1.7);
      const maxOffset = width * (navigation.length - 1);

      if (resolvedOffset < 0)
          resolvedOffset = 0;

      if (resolvedOffset > maxOffset)
          resolvedOffset = maxOffset;

      this.ScrollView.scrollTo({
          x: resolvedOffset,
          animated: false,
      });

      const { onMove } = this.props;
      if (onMove)
          onMove();
          */
  }

  _onIndexChange = ({ index }) => {
      const _self = this;
      _self.setState(() => ({ currentIndex: index }));
      setTimeout(() => { _self._focused(); }, 10);

      const { onRelease } = this.props;
      if (onRelease)
          onRelease();
  }

  _focused = () => {
      this.ScrollView.scrollTo({
          x: this.state.currentIndex * width,
          animated: true,
      });
  }

  _callback = (o) => {
      const { callback } = this.props;
      if (callback)
        callback(o);
    }

  // ana basliklar
  _getMainThumb = () => {
      const { navigation } = this.state;
      const arr = [];
      for (let i = 0; i < navigation.length; ++i) {
          const k = navigation[i];
          arr.push({ id: i, title: k['title'], src: k['img'] });
      }
      return arr;
  }

  _getContent = () => {
      const { navigation } = this.state;
      const main = [];
      for (let i = 0; i < navigation.length; ++i) {
          const obj = navigation[i],
              k = obj['children'],
              arr = [],
              lng = k.length;
          for (let j = 0; j < lng; ++j) {
              const n = k[j];
              const b = <LineButton item={n} key={'btn-' + j} style={{ borderBottomWidth: (j == lng - 1) ? 1 : 0 }} onPress={this._onPressButton}>{n.title}</LineButton>
              arr.push(b);
          }

          const wrp = (
              <View key={'wrp-' + i} style={[{ width }, { paddingLeft: 30, paddingRight: 30, paddingTop: 8 }]}>
                  <ScrollView>
                      {arr}
                  </ScrollView>
                  <View style={{ paddingLeft: 37, paddingRight: 37, justifyContent: 'center', alignItems: 'center', height: 100 }}>
                      {/*<BlackButton item={{ id: obj.id }} onPress={this._onAllPrdPress}>TÜM {obj.title} ÜRÜNLERİ</BlackButton>*/}
                  </View>
              </View>
          );

          main.push(wrp);
      }

      return (
          <ScrollView ref={ref => this.ScrollView = ref} scrollEnabled={false} horizontal style={{ flex: 1, flexDirection: 'row', }}>
              {main}
          </ScrollView>
      );
  }
  

  render() {
      const { navigation } = this.state;

      if (navigation.length == 0)
          return null;

      const itemWidth = 220, offset = (width - itemWidth) * .5;
      //const modal = <NavigationModal mainTitle={navigation[this.state.currentIndex].title} data={this.state.modalData} onClose={() => { this.setModalVisible({ visible: false }); }} visible={this.state.modalVisible} />

      return (
              <View style={{flex:1, borderWidth:0}}>{this._getContent()}</View>
      );
  }
}

export default class Discover extends React.Component{

  state = {
    enteries: [
      {title:'MAKYAJ', key:'a1', thumbnail: require('../../assets/images/menu-makeup.png') },
      {title:'CILT BAKIMI', key:'a2', thumbnail: require('../../assets/images/menu-skincare.png')},
      {title:'AKSESUAR', key:'a3', thumbnail: require('../../assets/images/menu-accessories.png')},
    ],
    dimensions: null,
    ActiveSlide: 0,
    scrollValue: new Animated.Value(0),
  }

  componentWillMount(){
    this.setState({
      dimensions: store.getState().general.SCREEN_DIMENSIONS
    });

    //width = store.getState().general.SCREEN_DIMENSIONS.width;
  }

  _renderItem({item, index}, parallaxProps){
    
    let thumbnail = 'image!'+item.thumbnail;

    return(
      <View style={{width:width*.7, height:200, paddingLeft:3, paddingRight:3}}>
        <ParallaxImage
          source={item.thumbnail}
          parallaxFactor={0.3}
          containerStyle={{flex:1}}
          style={{resizeMode:'cover'}}
          showSpinner={true}
          {...parallaxProps}
          />
          <Text style={{fontFamily:'brandon', fontSize:18, alignSelf:'center', margin:10}}>{item.title}</Text>
      </View>
    );
  }

  _navigation = null;

  _onScroll = (event) => {
    //console.log(event.nativeEvent.contentOffset.x / (width * .7));
    this.setState({scrollValue: event.nativeEvent.contentOffset.x / (width * .7)});
    //console.log(event.nativeEvent.contentOffset.x);
    //this._navigation(event.nativeEvent.contentOffset.x);
  }

  _setState = ( obj ) => {
    this.setState( obj );
  }

  _onBeforeSnapToItem( index ){
    _setState({
      selectedItem: index,
    });
  }

  _onSnapToItem( index ){
    console.log(index);
  }

  render(){

    const { ActiveSlide } = this.state;

    //console.log(this.state.scrollValue,'-----');

    return( 
        <View style={{flex:1}}>
          <View style={{marginTop:10}}>
          <Carousel
            ref={(c) => {this._carousel = c;}}
            data={this.state.enteries}
            renderItem={this._renderItem}
            sliderWidth={this.state.dimensions.width}
            itemWidth={this.state.dimensions.width * .7}
            
            onScroll={this._onScroll}

            onBeforeSnapToItem={(index) => this.setState({ ActiveSlide: index }) }
            hasParallaxImages={true}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            />
            {/*
            <Pagination
                  dotsLength={this.state.enteries.length}
                  activeDotIndex={ActiveSlide}
                  containerStyle={{paddingVertical:2}}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={{marginHorizontal:0}}
                  //inactiveDotColor={colors.black}
                  
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.8}
                  //carouselRef={this._slider1Ref}
                  //tappableDots={!!this._slider1Ref}
                  
                />
            */}
            </View>
            <Navigation scrollValue={this.state.scrollValue} />
        </View>
    );
  }
}