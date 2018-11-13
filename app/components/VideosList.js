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
import { ICONS } from 'root/app/helper/Constant';

globals = require('root/app/globals.js');

class VideosList extends React.Component{

  state = {
    items: [],
  }

  componentDidMount(){
    this.setState({items: this.props.items });
  }

  _keyExtractor = (item, index) => index + 'k';

  _renderItem = ({item, index}) => {
    return(
      <ListItem item={item} index={index} onPressItem={this._onPressItem} />
    )
  }

  _onPressItem = ( index, item ) => {
    
    if(this.props.callback)
      this.props.callback( index, item );

  }

  render(){

    return(
      <View style={{paddingBottom:20}}>
        <FlatList
          //style={{borderWidth:1, borderColor:'red'}}
          scrollEnabled={true}
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <View style={{marginLeft:20, marginRight:20, marginTop:15, borderBottomWidth:1, borderColor:'#D8D8D8', }} />
      </View>
    )
  }
}

class ListItem extends React.Component {

  state = {
      item: null,
  }

  _onPress = () => {
    this.props.onPressItem(this.props.index, this.props.item);
  }

  render(){

    const { index, item } = this.props;
    
    product = item ? <ProductRender item={item} /> : <ProductSkeleton item={item} />;

    leftSpace = index == 0 ? 20 : 0;

    //let thumbnail = item.smallImageUrl.replace('mobile_image_1', 'mobile_texture').replace('http', 'https');

    return(
      <TouchableOpacity
        activeOpacity={0.9}
        ref='Single'
        onPress={this._onPress}>
        <View style={{width:240, minHeight:190, marginRight:10, marginLeft:leftSpace, flexDirection:'column-reverse',}}>
          {product}
        </View>
      </TouchableOpacity>
    );
  }
};

class ProductSkeleton extends React.Component{
    render(){
        return(
           <View style={{flex:1}}>
               <View style={{width:240, height:135, backgroundColor:'#dddddd',}}></View>
               <Image source={ICONS['feedVideo']} style={{ width: 40, height: 40, position:'absolute', right:6, top:90 }} />
               <View style={{width:200, height:15, marginTop:5, backgroundColor:'#eee',}}></View>
           </View>
        )
    }
}

class ProductRender extends React.Component{
    render(){
        return(
            <View style={{flex:1}}>
                <Image
                    style={{width: 240, height: 135, resizeMode:'cover',}}
                    source={{uri: 'https://www.flormar.com.tr'+this.props.item.thumbnail }}
                />
                <Image source={ICONS['feedVideo']} style={{ width: 40, height: 40, position:'absolute', right:6, top:90 }} />
               <Text style={{fontSize:15, marginTop:5}}>{this.props.item.text}</Text>
           </View>
        )
    }
}

export {VideosList};