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
import { Form } from 'root/app/form';
import { LoadingButton } from 'root/app/UI';

import { ICONS, SET_TEXTURE_DISPLAY, OPEN_PRODUCT_DETAILS } from 'root/app/helper/Constant';
import { store } from '../../app/store';
import { MinimalHeader } from 'root/app/components';

var RCTUIManager = require('NativeModules').UIManager;

import ProductView from './Product';

styles = require('../../app/styles.js');
globals = require('../../app/globals.js');
const Utils = require('root/app/helper/Global.js');

const SCREEN_DIMENSIONS = {};
const HEADER_HEIGHT = Platform.OS === 'android' ? 80 : 65;
const TOP = Platform.OS === 'android' ? 10 : 0;
const DETAIL_HEADER_HEIGHT = Platform.OS === 'android' ? 52 : 65;


export default class List extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Products List',
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
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        //onComplete: this._openDetail,
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

  _onFiltersChange = (obj) => {

    let opfs = [];
    for (i in obj.data) {
      if (obj.data[i] != -1)
        opfs = [...opfs, obj.data[i]];
    }

    this._updateList(opfs.toString());
  }

  _updateList = (filterValues) => {

    //console.log(store.getState().general.selectedCategory, store.getState().general.categories, this.props.category);

    filterValues = filterValues || '';
    const _self = this,
      { category = {} } = _self.props;
    /*  
      ex:
      [{
              title: name,
              img: Utils.getImage(image),
              utpId: utpCode
          }]

          veya 

          [{
              title: name,
              img: Utils.getImage(image),
              id: id
          }]
    */
    globals.fetch(
      Utils.getURL({ key: 'product', subKey: 'getProductList' }),
      JSON.stringify({
        "page": 1,
        "pageSize": 300,
        "filter": filterValues,
        "catId": category['id'] || '', //18775
        ...category
      }),
      this._listResultHandler
    );
  }

  _listResultHandler = (answer) => {

    let _items = answer.data.products;


    if (this.props.category.img && answer.data.filters.findIndex(obj => obj.isSelected == true) == -1) {
      _items.splice((answer.data.totalProductCount < 4 ? 0 : 4), 0,
        { productType: 'cover', side: 'left', img: this.props.category.img },
        { productType: 'cover', side: 'right', img: this.props.category.img });
    }
    //console.log('list loaded', answer);

    //console.log(answer.data);

    this.setState({
      itemsAll: answer.data.products,
      filters: answer.data.filters,
      totalProductCount: answer.data.totalProductCount,
    });
    this._updateItems();
  }

  _updateItems = () => {
    let { sliceNumber, sliceSize, itemsAll, items } = this.state;
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

  _onDisplayChange = (bool) => {
    this.setState({ textureDisplay: bool });
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => {

    if (item.productType == 'cover') {
      return (
        <View style={{ height: 200, width: Math.floor(SCREEN_DIMENSIONS.width * .5), overflow: 'hidden' }}>
          <Image source={{ uri: item.img }} style={{ height: 200, width: SCREEN_DIMENSIONS.width, marginLeft: item.side == 'right' ? '-100%' : 0, resizeMode: 'cover', }} />
        </View>
      )
    }
    else {
      return (
        <ListItem item={item} index={index} onPressItem={this._onPressItem} onSwiping={this._onSwiping} textureDisplay={this.state.textureDisplay} />
      )
    }
  }

  _listView = null;

  _onPressItem = (index, measurements) => {

    Expo.takeSnapshotAsync(this._listView, { formar: 'jpeg' })
      .then((result) => {

        store.dispatch({
          type: OPEN_PRODUCT_DETAILS,
          value: {
            screenshot: result,
            id: this.state.items[index].productId,
            measurements: measurements,
            animate: true,
            sequence: this.state.textureDisplay ? 1 : 0
          }
        });
      });
  }

  _detailResultHandler = (answer) => {

    //console.log( answer );

    this.setState({
      selectedDetail: answer.data,
    });
    this._animateImage();
  }

  _openDetail = () => {

    this.setState({
      detailIsVisible: true,
    })

    setTimeout(() => {
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

  //_flatList = null;

  render() {

    let { animatingUri, imageAnim, measurements, totalProductCount, filters, textureDisplay } = this.state;

    let { width, height, pageY, pageX } = measurements;

    /*
    const _width = measurements.width;
    const _height = measurements.width * 1.25;
    const _top = measurements.pageY - 64;
    const _left = Math.ceil(measurements.x);

    console.log(this._flatList);
*/

    const _width = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [measurements.width, 270/*SCREEN_DIMENSIONS.width*/],
    });

    const _height = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [measurements.width * 1.25, 337/*SCREEN_DIMENSIONS.width * 5/4*/],
    });

    const _top = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [measurements.pageY - HEADER_HEIGHT - 40, 0],
    });

    const _left = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.ceil(measurements.pageX), 0],
    });

    const _opacity = imageAnim.interpolate({
      inputRange: [.5, 1],
      outputRange: [0, 1],
    })

    const animatingImage = animatingUri != null ? <Animated.Image style={{ width: _width, height: _height, position: 'absolute', zIndex: 10, top: _top, left: _left, resizeMode: 'contain', }}
      source={{ uri: animatingUri }} /> : null;
    const vail = animatingUri != null ? <Animated.View style={{ flex: 1, position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 9, backgroundColor: '#ffffff', opacity: _opacity }} /> : null;

    const detailContent = <ProductView imageMeasurements={{ width: width, height: height, top: pageY, left: pageX, type: textureDisplay ? 1 : 0 }} screenDimensions={SCREEN_DIMENSIONS} item={this.state.selectedDetail} onClose={this._closeDetail} />;

    return (
      <View ref={(c) => { this._listView = c; }} style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ListHeader onFiltersChange={this._onFiltersChange} totalProductCount={totalProductCount} filters={filters} onDisplayChange={this._onDisplayChange} textureDisplay={this.state.textureDisplay} />
        <FlatList
          style={{ flex: 1, flexDirection: 'column' }}
          scrollEnabled={true}
          data={this.state.items}
          numColumns='2'
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing={false}
          onRefresh={this._onRefresh}
          onEndReached={this._handleOnEndReached}
          ref={(list) => this.myFlatList = list}
        />
        {vail}
        {animatingImage}
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.detailIsVisible}
        >
          {detailContent}
        </Modal>
      </View>
    )
  }
}

class ListHeader extends React.Component {

  state = {
    filterIsOpen: false,
  }

  _onProductDisplay = () => {
    this.props.onDisplayChange(false);
  };

  _onTextureDisplay = () => {
    this.props.onDisplayChange(true);
  }

  _onFilterButton = () => {
    this.setState({ filterIsOpen: true });
  }

  _close = () => {
    this.setState({ filterIsOpen: false });
  }

  _filterCallback = (obj) => {
    this.setState({ filterIsOpen: false });
    this.props.onFiltersChange(obj);
  }

  _onFormApply = () => {
    const _self = this;
    /* formdaki public fonk. tetikleriz. */
    if (_self.child)
      _self.child._onPress();
  }

  _onFormReset = () => {
    const _self = this;

    if (_self.child)
      _self.child._onResetForm();
  }

  render() {
    const _self = this;
    let { totalProductCount, textureDisplay, filters } = this.props;

    if (textureDisplay) {
      productOpacity = .2;
      textureOpacity = 1;
    }
    else {
      productOpacity = 1;
      textureOpacity = .2;
    }

    let indicator = filters.findIndex(obj => obj.isSelected == true) > -1 ? <View style={{ width: 6, height: 6, backgroundColor: '#FF2B94', borderRadius: 3, marginRight: 5 }}></View> : null;;

    return (
      <View style={{
        flex: 1, maxHeight: 50, flexDirection: 'row', backgroundColor: '#ffffff', shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 2,
        elevation: 1, justifyContent: 'center', alignItems: 'center'
      }}>
        <View style={{ width: 120 }}>
          <TouchableOpacity activeOpacity={0.8} onPress={this._onFilterButton} style={{ marginRight: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
              {indicator}
              <Text style={{ fontSize: 16 }}>Filters</Text>
              <Image source={ICONS['filters']} style={{ width: 40, height: 40 }} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#afafaf", fontSize: 14 }}>{totalProductCount} ürün</Text>
        </View>
        <View style={{ flexDirection: "row", width: 120, justifyContent: 'flex-end', marginRight: 10, }}>
          <TouchableOpacity activeOpacity={0.8} onPress={this._onProductDisplay} style={{ marginRight: 10 }}>
            <Image source={ICONS['listProduct']} style={{ width: 40, height: 40, opacity: productOpacity }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={this._onTextureDisplay}>
            <Image source={ICONS['listTexture']} style={{ width: 40, height: 40, opacity: textureOpacity }} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={this.state.filterIsOpen}
          animationType="slide"
        >
          <MinimalHeader onPress={this._close} title="KAPAT" right={<Text style={{ color: "#afafaf", fontSize: 14, marginRight: 10 }}>{totalProductCount} ürün</Text>} noMargin={store.getState().general.SCREEN_DIMENSIONS.OS == 'android' ? true : false} />

          <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
            <Form onRef={ref => (_self.child = ref)} style={{ flex: 1, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }} callback={this._filterCallback} data={Utils.filterToSelectObject(filters)} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, }}>
              <LoadingButton style={{ borderWidth: 1, borderColor: '#000000' }} fontStyle={{ fontFamily: 'Bold', fontSize: 16 }} onPress={_self._onFormApply} contentStyle={{ flex: 1, marginRight: 5 }}>{'UYGULA'}</LoadingButton>
              <LoadingButton style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#666666' }} fontStyle={{ fontFamily: 'Bold', fontSize: 16, color: '#000000' }} onPress={_self._onFormReset} contentStyle={{ flex: 1, marginLeft: 5 }}>{'TEMİZLE'}</LoadingButton>
            </View>
          </View>

        </Modal>

      </View>
    )
  }
}

class ListItem extends React.Component {

  _onPress = (measurements) => {
    this.props.onPressItem(this.props.index, measurements);
  }

  render() {

    const { item, index, textureDisplay } = this.props;


    let _width = Math.floor(SCREEN_DIMENSIONS.width * .5);
    let _height = Math.floor(_width * 5 / 4);
    let _boxHeight = _height + 107;

    let borderStyle = index % 2 == 0 ? { borderRightWidth: 1, borderRightColor: '#dddddd' } : {};

    const { productGroups = [] } = item;
    let numOfColors = productGroups.length + 1;

    let newFlag = item.isNew == true ? null :
      <Text style={{ position: 'absolute', left: 15, top: 10, fontSize: 13, fontFamily: 'proxima' }}>Yeni</Text>;

    let trigger = item.isCampaignFl == true ? item.stockStatus : null;

    let thumbnail = textureDisplay ? item.mediumImageUrl.replace('mobile_image_1', 'mobile_image_2') : item.mediumImageUrl;


    return (
      <TouchableOpacity
        activeOpacity={0.8}
        ref='Single'
        onPress={(nativeEvent) => {
          this.refs.Single.measure((x, y, width, height, pageX, pageY) => {
            this._onPress({ x: x, y: y, width: width, height: height, pageX: pageX, pageY: pageY });
          });
        }} >

        <View style={[{ flex: 1, minHeight: _boxHeight, borderBottomWidth: 1, borderBottomColor: '#dddddd' }, borderStyle]}>
          <Image
            style={{ width: _width, height: _height, resizeMode: 'contain' }}
            source={{ uri: thumbnail }}
            onError={() => { this.props.source = item.mediumImageUrl }}
          />
          {newFlag}

          <View style={{ padding: 15, paddingTop: 5, paddingBottom: 10, height: 105, flexDirection: 'column' }}>
            <Text style={{ fontSize: 18, fontFamily: 'brandon', fontWeight: 'bold' }}>₺{item.salePrice}</Text>
            <Text numberOfLines={2} style={{ marginTop: 5, width: _width - 30, fontSize: 13, fontFamily: 'proxima' }}>{item.productName}</Text>
            <Text style={{ position: 'absolute', left: 15, bottom: 23, fontSize: 13, fontFamily: 'proxima', color: '#9B9B9B' }}>{numOfColors} Renk</Text>
            <Text style={{ position: 'absolute', left: 15, bottom: 7, fontSize: 13, fontFamily: 'proxima', color: '#BE1066' }}>{trigger}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};