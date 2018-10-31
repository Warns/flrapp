import React from 'react';
import {
  View,
  Image,
  Animated,
  FlatList,
  TouchableOpacity,
} from 'react-native';

class Palette extends React.Component{

  state = {
    selected: 0,
    items: [],
    index:0,
    width: 50,
  }

  componentWillMount(){
    let index = 0;
    let {items, selected, width} = this.props;

    for( i in items )
      if(items[i].shortCode === selected)
        break;
        index = i;

    if( items.length * this.state.width < width ){
      this.setState({
        width: Math.ceil( width / items.length ),
      })
    }

    this.setState({
      items: items,
      selected: selected,
      index: index,
    });
  }

  _keyExtractor = (item, index) => index + 'k';

  _renderItem = ({item, index}) => {
    let sel = item.shortCode === this.state.selected ? true : false;
    return(
      <ListItem isSelected={sel} width={this.state.width} item={item} index={index} onPressItem={this._onPressItem} />
    )
  }

  //_listRef = null;

  _onPressItem = (index, item) => {

    this.props.onPress(item.productId);

    //this.refs.flatList.scrollToEnd();

    //console.log('pps>', this.listRef);

    /*
    let data = [];
    for(var i=0; i<this.props.items.length; ++i){
      data.push(this.props.items[i]);
    }

    this.setState({
      items: data,
      selected: item.shortCode,
      index: index,
      selectedDetail: index,
      animatingUri: this.state.items[index].mediumImageUrl,
    });
    */
  }

  layout = (data, index) => {
    return { length: 50, offset: 50 * index, index }
  };

  render(){
    return(
      <View style={{flex:1, backgroundColor:'#ffffff', maxHeight:65,}}>
        <FlatList
          //style={{borderWidth:1, borderColor:'red'}}
          scrollEnabled={true}
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}

          onsco
          
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          
          ref='flatList'
        />
      </View>
    )
  }
}

class ListItem extends React.Component {

  state = {
    isSelected: false,
  }

  _onPress = () => {
    this.props.onPressItem(this.props.index, this.props.item);
  }

  componentDidMount(){
    this.setState({
        isSelected: this.props.isSelected,
    });
  }

  render(){

    const { item, index, width } = this.props;

    let thumbnail = item.smallImageUrl.replace('mobile_image_1', 'mobile_texture').replace('http', 'https');

    return(
      <TouchableOpacity
        activeOpacity={0.9}
        ref='Single'
        onPress={this._onPress}>
        <View style={{width:width, height:60, flexDirection:'column-reverse'}}>
          <Image
            style={{width: width, height: 60, resizeMode:'cover',}}
            source={{uri: thumbnail }}
          />
        </View>
      </TouchableOpacity>
    );
  }
};

export { Palette };