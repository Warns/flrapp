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
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

let SCREEN_DIMENSIONS  = Dimensions.get('screen');
const HEADER_HEIGHT = Platform.OS === 'android' ? 80 : 65;
const TOP = Platform.OS === 'android' ? 10 : 0;
const DETAIL_HEADER_HEIGHT = Platform.OS === 'android' ? 52 : 65;

import { ICONS } from 'root/app/helper/Constant';
import { DefaultButton } from '../UI';
import { Palette } from '../components/';
import { MinimalHeader } from '../components';
import { HorizontalProducts } from '../components/';

globals = require('root/app/globals.js');
const Utils = require('root/app/helper/Global.js');

class ProductView extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      header: null,
    };
  };

  state = {
    data: null,
    anim: new Animated.Value(0),
    item: {},
    colors: [],
    productRecommendations: [],
    videos: [],
    detailIsOpen: false,
  }

  _animateContent = () => {

    Animated.timing(
      this.state.anim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }
    ).start();
  };

  componentWillMount() {

    console.log(this.props.imageMeasurements, this.props.item);

    var json = require('../../data/product.json');

    let colors = json.data.product.productGroups;
    colors.push({
      productId: json.data.product.productId,
      productUrl: json.data.product.productUrl,
      shortCode: json.data.product.shortCode,
      smallImageUrl: json.data.product.productImages[0].smallImageUrl,
      mediumImageUrl: json.data.product.productImages[0].mediumImageUrl,
      hasStock: json.data.product.stockQty > 0 ? true : false,
      name: json.data.product.shortName
    });

    colors.sort(function (a, b) { return a.shortCode - b.shortCode });

    //console.log( colors );

    //this._getVideos();
    var vidz = require('../../data/product-videos.json');

    this.setState({
      item: json.data,
      colors: colors,
      productRecommendations: json.data.product.productRecommends,
      videos: vidz.data.videos,
    });
    //this._animateContent();

  }


  _getVideos = () => {
    globals.fetch(
      Utils.getURL({ key: 'product', subKey: 'getProductVideos' }),
      JSON.stringify({
        "urn": 569867, //this.props.item.productId,
      }),
      this._videoResultHandler
    );
  }

  _videoResultHandler = (answer) => {
    console.log(answer.data.videos);
  }

  _renderItem({ item, index }) {
    return (
      <View style={{ overflow: 'visible' }}>
        <Image source={{ uri: item.mediumImageUrl }} style={{ left: -(SCREEN_DIMENSIONS.width - 270) * .5, width: 270, height: 337, resizeMode: 'cover' }} />
      </View>
    );
  }

  _showProductInfo = () => {
    this.setState({
      detailIsOpen: !this.state.detailIsOpen,
    })
  }

  _onClose = () => {
    this.props.onClose();
  }

  render() {

    const { item, colors, productRecommendations, videos, detailIsOpen } = this.state;

    //console.log(item.product.productImages);

    let videosButton = videos.length > 0 ? <ProductActionButton name="Videolar" count={videos.length} /> : null;

    let palette = colors.length > 1 ? <Palette items={colors} selected={item.product.shortCode} /> : null;

    let listPrice = item.product.discountRate > 0 ? <Text style={{ fontSize: 18, color: '#989898', fontFamily: 'brandon', fontWeight: 'bold', marginLeft: 15, textDecorationLine: 'line-through' }}>₺{item.product.listPrice}</Text> : null;

    console.log(productRecommendations.length, '>>>');

    let recommendations = productRecommendations.length > 0 ? (
      <View style={{ marginTop: 35 }}>
        <Text style={[styles.sectionHeader, { marginLeft: 20, marginBottom: 15, }]}>İLGİLİ ÜRÜNLER</Text>
        { //<HorizontalProducts items={productRecommendations} /> 
        }
      </View>
    ) : null;

    let productTags = [];
    for (var i in item.product.productAttributes) {
      productTags.push(
        <View key={i} style={{ backgroundColor: '#eeeeee', borderRadius: 10, marginRight: 5, height: 36, justifyContent: 'center', alignItems: 'center', paddingRight: 10, paddingLeft: 10, borderRadius: 10 }}>
          <Text style={{ color: '#4A4A4A' }}>{item.product.productAttributes[i].value}</Text>
        </View>
      );
    }

    let details = detailIsOpen ? (
      <View style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', paddingBottom: 50 }}>
        { //<Text style={[styles.defautText, {marginBottom:20}]}>{item.product.shortDescription}</Text>
        }
        <Text style={{ fontSize: 13, color: '#A9A9A9' }}>Bu ürün</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 20 }}>
          {productTags}
        </View>
        <Text style={styles.defautText}>{item.product.description}</Text>
        <Text style={[styles.defautText, { marginTop: 15, fontSize: 14 }]}>Ürün kodu: {item.product.integrationId}</Text>
      </View>
    ) : null;

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <MinimalHeader title={item.product.productName} onPress={this._onClose} />
        <ScrollView>
          <View>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={item.product.productImages}
              renderItem={this._renderItem}
              sliderWidth={SCREEN_DIMENSIONS.width}
              sliderHeight={337}
              itemWidth={270}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
            />
          </View>
          {palette}

          <View style={{ padding: 20, paddingTop: 0 }}>

            <View style={{ flexDirection: 'row', height: 55, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: 'brandon', fontWeight: 'bold' }}>₺{item.product.salePrice}</Text>
              {listPrice}
              <Text style={{ fontSize: 16, color: '#4A4A4A', position: 'absolute', right: 0 }}>Hızla tükeniyor</Text>
            </View>

            <View style={{ flexDirection: 'row', height: 80 }}>
              <View style={{ flex: 1, marginRight: 5, height: 50 }}>
                <DefaultButton
                  callback={this._openLoginForm}
                  name="SEPETE AT"
                  boxColor="#000000"
                  textColor="#ffffff"
                  borderColor="#000000"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <DefaultButton
                  callback={this._updateCart2}
                  name="FAVORİME EKLE"
                />
              </View>
            </View>

            <View>
              <Text style={styles.defautText}>{item.product.shortDescription}</Text>
              <ProductActionButton name="Ürün Detayı" expanded={detailIsOpen} onPress={this._showProductInfo} />
              {details}
              <ProductActionButton name="Yorumlar" count={34} />
              {videosButton}
            </View>

          </View>
          {recommendations}
        </ScrollView>
      </View>
    );
  }
}

class ProductActionButton extends React.Component {

  _onPress = () => {
    this.props.onPress();
  };

  render() {

    let count = this.props.count ? (
      <View style={{ padding: 5, backgroundColor: '#dddddd', borderRadius: 20, height: 24, minWidth: 24, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, }}>{this.props.count}</Text>
      </View>
    ) : null;

    let icon = ICONS['rightArrow'],
      borderColor = '#D8D8D8';

    if (this.props.expanded) {
      icon = ICONS['downArrow'];
      borderColor = '#ffffff';
    }

    return (
      <TouchableOpacity activeOpacity={.8} onPress={this._onPress}>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: borderColor, height: 60, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.props.name}</Text>
          {count}
          <Image source={icon} style={{ width: 40, height: 40, resizeMode: 'contain', position: 'absolute', right: 0, top: 10, }} />
        </View>
      </TouchableOpacity>
    )
  }
}

/*

onPressClose = () => {
  this.props.onClose();
}

render(){

  const { item, screenDimensions } = this.props;
  const { anim } = this.state;

  const _marginTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  let _width = screenDimensions.width;
  let _height = Math.floor( _width * 5/4 );

  console.log(item);

  let palette = <Palette items={item.product.productGroups} />;

  return(
    <View style={{flex:1}}>
      <TouchableOpacity onPress={this.onPressClose}>
      <View style={{height:DETAIL_HEADER_HEIGHT, flexDirection:'column-reverse'}}>
      <Image
        style={{width: 40, height: 40, resizeMode:'contain', marginBottom:5}}
        source={require('../../assets/images/icons/arrow-left.png')}
      />
      </View>
      </TouchableOpacity>
      <ScrollView style={{backgroundColor:'#ffffff'}}>
      
      <Image
        style={{width: _width, height: _height, resizeMode:'contain'}}
        source={{uri: item.product.productImages[0].mediumImageUrl }}
      />
      {palette}
      <Animated.View style={{padding:20, opacity: anim, marginTop: _marginTop}}>
      <Text style={{fontSize:18, fontFamily:'brandon'}}>{item.product.productName}</Text>
      <Text style={{fontSize:18, fontFamily:'brandon'}}>₺{item.product.salePrice}</Text>
      <Text style={{fontSize:16, color:'#888888'}}>{item.product.description}</Text>
      </Animated.View>
      </ScrollView>
      <Animated.View>
      
      <DefaultButton
          callback={this._addToCart}
          name="SEPETE AT"
          boxColor="#000000"
          textColor="#ffffff"
          />
      </Animated.View>
    </View>
  )
}
}
*/

// filter state
function mapStateToProps(state) {
  return state.cart;
}

export default connect(mapStateToProps)(ProductView);

const styles = StyleSheet.create({
  defautText: {
    fontSize: 16,
    color: '#6c6c6c',
    lineHeight: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'Bold',
  }
});
