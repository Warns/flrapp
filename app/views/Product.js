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

const SCREEN_DIMENSIONS = {};
const HEADER_HEIGHT = Platform.OS === 'android' ? 80 : 65;
const TOP = Platform.OS === 'android' ? 10 : 0;
const DETAIL_HEADER_HEIGHT = Platform.OS === 'android' ? 52 : 65;

import { DefaultButton } from '../UI';
import { Palette } from '../components/';

class ProductView extends React.Component {
  state = {
    data: null,
    anim: new Animated.Value(0),
  }

  _animateContent = () => {

    Animated.timing(
      this.state.anim, {
        toValue:1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }
    ).start();

  };

  componentDidMount(){
    this._animateContent();
  }

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

// filter state
function mapStateToProps(state){
  return state.cart;
}

export default connect(mapStateToProps)(ProductView);