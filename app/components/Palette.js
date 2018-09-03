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

class Palette extends React.Component{

  state = {
    selected: 0,
    items: [],
  }

  componentDidMount(){
    //console.log(this.props.items);
    this.setState({
      items: this.props.items,
      selected: this.props.selected,
    });
  }

  _keyExtractor = (item, index) => index + 'k';

  _renderItem = ({item, index}) => {
    //console.log(this.state.selected);
    let sel = item.shortCode === this.state.selected? true : false;
    return(
      <ListItem isSelected={sel} item={item} index={index} onPressItem={this._onPressItem} />
    )
  }

  _onPressItem = (index, item, measurements) => {
    //this.props.navigation.navigate('Details', {user: index});

    console.log('on presss');

    let data = [];
    for(var i=0; i<this.props.items.length; ++i){
      data.push(this.props.items[i]);
    }

    this.setState({
      items: data,
      selected: item.shortCode,
      selectedDetail: index,
      animatingUri: this.state.items[index].mediumImageUrl,
      measurements: measurements,
    });

  }

  render(){

   //console.log('render list');

    return(
      <View style={{flex:1, backgroundColor:'#ffffff', maxHeight:65,}}>
        <FlatList
          //style={{borderWidth:1, borderColor:'red'}}
          scrollEnabled={true}
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          horizontal={true}
        />
      </View>
    )
  }
}

class ListItem extends React.Component {

  state = {
    anim: new Animated.Value(0),
    imageHeight: 60,
  }

  _onPress = (measurements) => {
    this.props.onPressItem(this.props.index, this.props.item, measurements);
    this.setState({
      imageHeight: 65,
    })
  }

  componentDidMount(){
    if( this.props.isSelected )
      this.setState({
        imageHeight: 65,
      });
  }

  render(){

    const { item, index, } = this.props;
    const { imageHeight } = this.state;

    let thumbnail = item.smallImageUrl.replace('mobile_image_1', 'mobile_texture').replace('http', 'https');

    return(
      <TouchableOpacity
        activeOpacity={0.9}
        ref='Single'
        onPress={this._onPress}>
        <View style={{width:50, height:65, flexDirection:'column-reverse'}}>
          <Image
            style={{width: 50, height: imageHeight, resizeMode:'cover',}}
            source={{uri: thumbnail }}
          />
        </View>
      </TouchableOpacity>
    );
  }
};

export { Palette };