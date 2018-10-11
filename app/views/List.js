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
import { TabNavigator, TabBarBottom } from 'react-navigation';

import { ICONS, SET_TEXTURE_DISPLAY } from 'root/app/helper/Constant';
import { store } from '../../app/store';

var RCTUIManager = require('NativeModules').UIManager;

import ProductView from './Product';

styles = require('../../app/styles.js');
globals = require('../../app/globals.js');

const SCREEN_DIMENSIONS = {};
const HEADER_HEIGHT = Platform.OS === 'android' ? 80 : 65;
const TOP = Platform.OS === 'android' ? 10 : 0;
const DETAIL_HEADER_HEIGHT = Platform.OS === 'android' ? 52 : 65;


export default class List extends React.Component{

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'hellp',
    };
  };

  state = {
    fadeAnim: new Animated.Value(0),
    items: [],
    itemsAll: [],
    sliceNumber: 0,
    sliceSize: 4,
    animatingUri: null,
    imageAnim: new Animated.Value(0),
    measurements: {},
    selectedDetail: null,
    detailIsVisible: false,
    filters: [],
    totalProductCount: null,
    textureDisplay: false,
  }

  _animateImage = () => {

    Animated.timing(
      this.state.imageAnim, {
        toValue:1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        onComplete: this._openDetail,
      }
    ).start();

  };

  onDidFocus = () => {
    const _self = this,
        { navigation } = _self.props;
    if (navigation)
        _self._Listener.remove();

    this._updateList();
  }

  componentDidMount() {
      const _self = this,
          { navigation } = _self.props;
      _self._isMounted = true;
      if (navigation)
          _self._Listener = navigation.addListener('didFocus', _self.onDidFocus);
      else
          _self.onDidFocus();

          SCREEN_DIMENSIONS = Dimensions.get('screen');
  }

  /* https://medium.com/@TaylorBriggs/your-react-component-can-t-promise-to-stay-mounted-e5d6eb10cbb */
  componentWillUnmount() {
      const _self = this,
          { navigation } = _self.props;
      _self._isMounted = false;
      if (navigation)
          _self._Listener.remove();
  }

  /*
  componentDidMount(){

    console.log(this.props);

    this._updateList();
    SCREEN_DIMENSIONS = Dimensions.get('screen');
  }
*/
  _updateList = () => {
    globals.fetch(
      "https://www.flormar.com.tr/webapi/v3/Product/getProductList",
      JSON.stringify({
        "page": 1,
        "pageSize": 100,
        "catId": this.props.category.id,
      }),
      this._listResultHandler
    );
  }

  _listResultHandler = ( answer ) => {

    console.log(answer.data);

    this.setState({
      itemsAll: answer.data.products,
      filters: answer.data.filters,
      totalProductCount: answer.data.totalProductCount,
    });
    this._updateItems();
  }

  _updateItems = () => {
    let {sliceNumber, sliceSize, itemsAll, items} = this.state;
    this.setState({
      items: itemsAll,
      //items: [...items, ...itemsAll.slice(sliceNumber, sliceNumber+sliceSize)],
      //sliceNumber: sliceNumber+sliceSize,
    })

    //console.log(items.length, sliceNumber);
  }

  _handleOnEndReached = () => {
    this._updateItems();
  }

  _onDisplayChange = ( bool ) => {
    this.setState({textureDisplay: bool});
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({item, index}) => {
    return(
      <ListItem item={item} index={index} onPressItem={this._onPressItem} onSwiping={this._onSwiping} textureDisplay={this.state.textureDisplay} />
    )
  }

  _onPressItem = (index, measurements) => {
    //this.props.navigation.navigate('Details', {user: index});

    this.setState({
      selectedDetail: index,
      animatingUri: this.state.items[index].mediumImageUrl,
      measurements: measurements,
    });

    globals.fetch(
      "https://www.flormar.com.tr/webapi/v3/Product/getProductDetail",
      JSON.stringify({
        "productId": this.state.items[index].productId,
      }),
      this._detailResultHandler
    );

  }

  _detailResultHandler = ( answer ) => {

    this.setState({
      selectedDetail: answer.data,
    });
    this._animateImage();
  }

  _openDetail = () => {

    this.setState({
      detailIsVisible: true,
    })

    setTimeout(()=>{
      this.setState({
        animatingUri: null,
        imageAnim: new Animated.Value(0),
      });
    }, 1300);
  }

  _closeDetail = () => {
    this.setState({
      detailIsVisible: false,
    })
  }

  render(){

    let { animatingUri, imageAnim, measurements, totalProductCount, filters } = this.state;

    const _width = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [measurements.width, SCREEN_DIMENSIONS.width],
    });

    const _height = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [measurements.height, SCREEN_DIMENSIONS.width * 5/4],
    });

    const _top = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [measurements.pageY - HEADER_HEIGHT - 40, -90],
    });

    const _left = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.ceil(measurements.pageX), 0],
    });

    const animatingImage = animatingUri != null ? <Animated.Image style={{width: _width, height: _height, position:'absolute', top: _top, left:_left, resizeMode:'contain'}}
                                  source={{uri: animatingUri }} /> : null;
    const vail = animatingUri != null ? <Animated.View style={{flex:1, position:'absolute', top:0, left:0, bottom:0, right:0, backgroundColor:'#ffffff', opacity:imageAnim}} /> : null;

    const detailContent = <ProductView screenDimensions={SCREEN_DIMENSIONS} item={this.state.selectedDetail} onClose={this._closeDetail} />;

    return(
      <View style={{flex:1, backgroundColor:'#ffffff'}}>
        <ListHeader totalProductCount={totalProductCount} filters={filters} onDisplayChange={this._onDisplayChange} textureDisplay={this.state.textureDisplay} />
        <FlatList
          style={{flex:1, flexDirection:'column'}}
          scrollEnabled={true}
          data={this.state.items}
          numColumns='2'
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing={false}
          onRefresh={this._onRefresh}
          onEndReached={this._handleOnEndReached}
        />
        {vail}
        {animatingImage}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.detailIsVisible}
          onRequestClose={() => {}}
        >
          {detailContent}
        </Modal>
      </View>
    )
  }
}

class ListHeader extends React.Component{

  _onProductDisplay = () => {
    this.props.onDisplayChange( false );
  };

  _onTextureDisplay = () => {
    this.props.onDisplayChange( true );
  }

  render(){

    let { totalProductCount, textureDisplay } = this.props;

    if( textureDisplay ){
      productOpacity = .2;
      textureOpacity = 1;
    }
    else
    {
      productOpacity = 1;
      textureOpacity = .2;
    }

    return(
      <View style={{flex:1, maxHeight:50, flexDirection:'row', backgroundColor:'#ffffff', shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      zIndex:2,
      elevation: 1, justifyContent:'center', alignItems:'center'}}>
        <View style={{width:100}}>
          <Text>Filters</Text>
        </View>
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
          <Text style={{color:"#afafaf", fontSize:16}}>{totalProductCount} ürün</Text>
        </View>
        <View style={{flexDirection:"row", width:100,}}>
          <TouchableOpacity activeOpacity={0.8} onPress={this._onProductDisplay} style={{marginRight:10}}>
            <Image source={ICONS['listProduct']} style={{ width: 40, height: 40, opacity:productOpacity }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={this._onTextureDisplay}>
            <Image source={ICONS['listTexture']} style={{ width: 40, height: 40, opacity:textureOpacity }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class ListItem extends React.Component {

  _onPress = (measurements) => {
    this.props.onPressItem(this.props.index, measurements);
  }

  render(){

    const { item, index, textureDisplay } = this.props;


    let _width = Math.floor( SCREEN_DIMENSIONS.width *.5 );
    let _height = Math.floor( _width * 5/4 );
    let _boxHeight = _height + 105;

    let borderStyle = index % 2 == 0 ? {} : {borderLeftWidth:1, borderLeftColor:'#dddddd'};

    let numOfColors = item.productTypes.length;

    let newFlag = item.isNew == true ? null :
      <Text style={{position:'absolute', left:15, top:10, fontSize:13, fontFamily:'proxima'}}>Yeni</Text>;

    let trigger = item.isCampaignFl == true ? item.stockStatus : null;

    let thumbnail = textureDisplay ? item.mediumImageUrl.replace('mobile_image_1', 'mobile_image_2') : item.mediumImageUrl;


    return(
      <TouchableOpacity
        activeOpacity={0.8}
        ref='Single'
        onPress={(nativeEvent) => {
          this.refs.Single.measure((x, y, width, height, pageX, pageY) => {
            this._onPress({x:x, y:y, width:width, height:height, pageX:pageX, pageY:pageY});
          });
        }} >
        
        <View style={[{flex:1, minHeight:_boxHeight,borderBottomWidth:1, borderBottomColor:'#dddddd'}, borderStyle]}>
          <Image
            style={{width: _width, height: _height, resizeMode:'contain'}}
            source={{uri: thumbnail }}
            onError={() => { this.props.source = item.mediumImageUrl }}
          />
          {newFlag}
          
          <View style={{padding:15, paddingTop:5, paddingBottom:10, height:105, flexDirection:'column'}}>
            <Text style={{ fontSize:18, fontFamily:'brandon', fontWeight:'bold'}}>₺{item.salePrice}</Text>
            <Text numberOfLines={2} style={{marginTop:5, width:_width-30, fontSize:13, fontFamily:'proxima'}}>{item.productName}</Text>
            <Text style={{position:'absolute', left:15, bottom:23, fontSize:13, fontFamily:'proxima', color:'#9B9B9B'}}>{numOfColors} Renk</Text>
            <Text style={{position:'absolute', left:15, bottom:7, fontSize:13, fontFamily:'proxima', color:'#BE1066'}}>{trigger}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};