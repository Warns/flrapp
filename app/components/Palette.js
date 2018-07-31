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
      items: this.props.items
    });
  }

  _keyExtractor = (item, index) => index + 'k';

  _renderItem = ({item, index}) => {
    return(
      <ListItem item={item} index={index} onPressItem={this._onPressItem} />
    )
  }

  _onPressItem = (index, measurements) => {
    //this.props.navigation.navigate('Details', {user: index});

    this.setState({
      selectedDetail: index,
      animatingUri: this.state.items[index].mediumImageUrl,
      measurements: measurements,
    });

  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:'#ffffff'}}>
        <FlatList
          style={{borderWidth:1, borderColor:'red'}}
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
    anim: new Animated.Value(0)
  }

  _onPress = (measurements) => {
    this.props.onPressItem(this.props.index, measurements);
  }

  render(){

    const { item, index } = this.props;

    let thumbnail = item.smallImageUrl.replace('mobile_image_1', 'mobile_texture').replace('http', 'https');

    return(
      <TouchableOpacity
        activeOpacity={0.9}
        ref='Single'
        onPress={() => {}}>
        <View style={{width:50, height:65}}>
          <Image
            style={{width: 50, height: 60, resizeMode:'cover', marginTop:5}}
            source={{uri: thumbnail }}
          />
        </View>
      </TouchableOpacity>
    );
  }
};

export { Palette };