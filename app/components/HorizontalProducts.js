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

globals = require('root/app/globals.js');
const Utils = require('root/app/helper/Global.js');

class HorizontalProducts extends React.Component {

  state = {
    items: [],
  }

  componentDidMount() {

    let _self = this,
      { items = [], customItems = [] } = _self.props,
      Ids = [];

    if (items.length > 0) {
      for (var i in items)
        Ids.push(items[i].productId);

      _self._fetchItems(Ids);
    } else
      _self._handleFetchResults({ data: { products: customItems }, status: 200 });
  }

  _fetchItems = (Ids) => {

    globals.fetch(
      Utils.getURL({ key: 'product', subKey: 'getProductList' }),
      JSON.stringify({
        "productIds": Ids,
        "pageSize": 100,
        "hasStock": true,
      }),
      this._handleFetchResults
    );
  }

  _handleFetchResults = (answer) => {

    if (answer.status == 200)
      this.setState({
        items: answer.data.products,
      })
  }

  _keyExtractor = (item, index) => index + 'k';

  _renderItem = ({ item, index }) => {
    return (
      <ListItem item={item} index={index} onPressItem={this._onPressItem} />
    )
  }

  _onPressItem = (item) => {

    console.log(item);

    this.props.onPress(item.productId);

  }

  render() {

    //console.log('render list');

    return (
      <View>
        <FlatList
          //style={{borderWidth:1, borderColor:'red'}}
          scrollEnabled={true}
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }
}

class ListItem extends React.Component {

  state = {
    item: null,
  }

  _onPress = () => {
    this.props.onPressItem(this.props.item);
    this.setState({
      imageHeight: 65,
    })
  }

  render() {

    const { index, item } = this.props;

    product = item ? <ProductRender item={item} /> : <ProductSkeleton item={item} />;

    leftSpace = index == 0 ? 20 : 0;

    //let thumbnail = item.smallImageUrl.replace('mobile_image_1', 'mobile_texture').replace('http', 'https');

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        ref='Single'
        onPress={this._onPress}>
        <View style={{ width: 160, height: 260, marginRight: 10, marginLeft: leftSpace, flexDirection: 'column-reverse', }}>
          {product}
        </View>
      </TouchableOpacity>
    );
  }
};

class ProductSkeleton extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, borderWidth: 1, borderColor: "#eeeeee", borderRadius: 3, padding: 10 }}>
        <View style={{ width: 140, height: 175, backgroundColor: '#dddddd', }}></View>
        <View style={{ width: 40, height: 15, marginTop: 5, backgroundColor: '#eee', }}></View>
        <View style={{ width: 100, height: 12, marginTop: 5, backgroundColor: '#eee', }}></View>
      </View>
    )
  }
}

class ProductRender extends React.Component {
  render() {
    const { productGroups = [] } = this.props.item || {},
      numOfColors = productGroups.length + 1;

    return (
      <View style={{ flex: 1, borderWidth: 1, borderColor: "#eeeeee", borderRadius: 3, padding: 10, paddingTop: 5 }}>
        <Image
          style={{ width: 140, height: 175, resizeMode: 'cover', }}
          source={{ uri: this.props.item.smallImageUrl }}
        />
        <View>
          <Text style={{ fontFamily: 'Bold', fontSize: 14 }}>{Utils.getPriceFormat(this.props.item.salePrice)}</Text>
        </View>
        <Text style={{ fontSize: 12 }}>{this.props.item.productName}</Text>
        <Text style={{ fontSize: 12, color: '#9B9B9B' }}>{numOfColors} Renk</Text>
      </View>
    )
  }
}

export { HorizontalProducts };