import React from "react";
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
  ScrollView
} from "react-native";
import { TabNavigator, TabBarBottom } from "react-navigation";
import { Form } from "root/app/form";
import { LoadingButton } from "root/app/UI";

import {
  ICONS,
  SET_TEXTURE_DISPLAY,
  OPEN_PRODUCT_DETAILS,
  FEEDS_IMAGE_RATE
} from "root/app/helper/Constant";
import { store } from "../../app/store";
import { MinimalHeader } from "root/app/components";

import ProductView from "./Product";

import HTML from "react-native-render-html";

styles = require("../../app/styles.js");
globals = require("../../app/globals.js");
const Utils = require("root/app/helper/Global.js");

let SCREEN_DIMENSIONS = {};
const HEADER_HEIGHT = Platform.OS === "android" ? 80 : 65;
const TOP = Platform.OS === "android" ? 10 : 0;
const DETAIL_HEADER_HEIGHT = Platform.OS === "android" ? 52 : 65;

/* kategori açıklaması */
class CategoryDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
  }

  CUSTOM_STYLE = {
    tagsStyles: {
      p: {
        fontSize: 16,
        color: "#6c6c6c",
        lineHeight: 24,
        fontFamily: "RegularTyp2"
      },
      b: {
        fontSize: 16,
        color: "#000000",
        lineHeight: 24,
        fontFamily: "RegularTyp2"
      }
    },
    imagesMaxWidth: Dimensions.get("window").width,
    onLinkPress: (evt, href) => {
      Linking.openURL(href);
    },
    debug: false
  };

  _onExpand = () => {
    const _self = this,
      { expand } = _self.state;
    _self.setState({ expand: !expand });
  };

  _getDesc = () => {
    const _self = this,
      { desc = "", title = "" } = _self.props.data || {},
      { expand = false } = _self.state;

    let view = null;
    if (expand)
      view = (
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 30,
            paddingBottom: 30
          }}
        >
          <Text style={{ color: "#6c6c6c", fontSize: 16, fontFamily: "Bold" }}>
            {title}
          </Text>
          <HTML {..._self.CUSTOM_STYLE} html={desc} />
        </View>
      );

    return view;
  };

  render() {
    const _self = this,
      { desc = "", img = "" } = _self.props.data || {},
      w = Dimensions.get("window").width,
      h = w / FEEDS_IMAGE_RATE["promo"];

    if (desc == "") return null;
    else
      return (
        <View>
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: Utils.getImage(img) }}
              style={{ height: h }}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={_self._onExpand}>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  flexDirection: "row",
                  paddingLeft: 15,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "RegularTyp2",
                    fontSize: 16,
                    color: "#4a4a4a"
                  }}
                >
                  Kampanya koşulları
                </Text>
                <Image
                  style={{ width: 40, height: 40 }}
                  source={ICONS["downArrow"]}
                />
              </View>
            </TouchableOpacity>
          </View>
          {_self._getDesc()}
        </View>
      );
  }
}

export default class List extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: "Products List"
    };
  };

  state = {
    fadeAnim: new Animated.Value(0),
    items: [
      { productType: "fake" },
      { productType: "fake" },
      { productType: "fake" },
      { productType: "fake" },
      { productType: "fake" },
      { productType: "fake" }
    ],
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
    desc: ""
  };

  _animateImage = () => {
    Animated.timing(this.state.imageAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic)
      //onComplete: this._openDetail,
    }).start();
  };

  onDidFocus = () => {
    const _self = this,
      { navigation } = _self.props;
    if (navigation) _self._Listener.remove();

    this._updateList();
  };

  componentDidMount() {
    const _self = this,
      { navigation } = _self.props;
    _self._isMounted = true;
    if (navigation)
      _self._Listener = navigation.addListener("didFocus", _self.onDidFocus);
    else _self.onDidFocus();

    SCREEN_DIMENSIONS = Dimensions.get("screen");
  }

  /* https://medium.com/@TaylorBriggs/your-react-component-can-t-promise-to-stay-mounted-e5d6eb10cbb */
  componentWillUnmount() {
    const _self = this,
      { navigation } = _self.props;
    _self._isMounted = false;
    if (navigation) _self._Listener.remove();
  }

  /*
  componentDidMount(){

    console.log(this.props);

    this._updateList();
    SCREEN_DIMENSIONS = Dimensions.get('screen');
  }
*/

  _onFiltersChange = obj => {
    let opfs = [],
      sorts = "";
    for (i in obj.data) {
      if (obj.data[i] != -1) {
        if (i == "sorts") sorts = obj.data[i];
        else opfs = [...opfs, obj.data[i]];
      }
    }

    this._updateList({ filters: opfs.toString(), sorts: sorts });
  };

  _updateList = obj => {
    //console.log(store.getState().general.selectedCategory, store.getState().general.categories, this.props.category);
    obj = obj || {};
    const _self = this,
      filters = obj["filters"] || "",
      sorts = obj["sorts"] || "",
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


    const data = {
      page: 1,
      pageSize: 300,
      filter: filters,
      sortType: sorts,
      catId: category["id"] || "", //18775
      ...category
    };

    Utils.mapping({
      event: 'category_visited',
      data: data,
      keys: {
        title: 'category_name',
        catId: 'category_id',
        utpId: 'utp_id'
      }
    });

    globals.fetch(
      Utils.getURL({ key: "product", subKey: "getProductList" }),
      JSON.stringify(data),
      this._listResultHandler
    );
  };

  _getSorts = data => {
    const _self = this,
      arr = [],
      sorts = {
        newDesc: {
          sortName: "En Yeniler"
        },
        discDesc: {
          sortName: "İndirimliler"
        },
        bestSellers: {
          sortName: "En Çok Satanlar"
        },
        priceAsc: {
          sortName: "En Düşük Fiyatlılar"
        }
      };

    Object.entries(data).forEach(([key, item]) => {
      const sortType = item["sortType"],
        k = sorts[sortType] || "";
      if (k != "") {
        item["sortName"] = k["sortName"] || "";
        arr.push(item);
      }
    });

    return arr;
  };

  _listResultHandler = answer => {
    let _items = answer.data.products;
    //console.log("answer", answer);

    //console.log(answer.data.products[0]);

    if (this.props.category.desc == "") {
      if (
        this.props.category.img &&
        answer.data.filters.findIndex(obj => obj.isSelected == true) == -1
      ) {
        _items.splice(
          answer.data.totalProductCount < 4 ? 0 : 4,
          0,
          { productType: "cover", side: "left", img: this.props.category.img },
          { productType: "cover", side: "right", img: this.props.category.img }
        );
      }
    }
    //console.log('list loaded', answer);

    this.setState({
      itemsAll: answer.data.products,
      filters: answer.data.filters,
      sorts: this._getSorts(answer.data.sorts || {}),
      //sorts: answer.data.sorts || [],
      totalProductCount: answer.data.totalProductCount
    });
    this._updateItems();
  };

  _updateItems = () => {
    let { sliceNumber, sliceSize, itemsAll, items } = this.state;
    this.setState({
      items: itemsAll
      //items: [...items, ...itemsAll.slice(sliceNumber, sliceNumber+sliceSize)],
      //sliceNumber: sliceNumber+sliceSize,
    });

    //console.log(items.length, sliceNumber);
  };

  _handleOnEndReached = () => {
    this._updateItems();
  };

  _onDisplayChange = bool => {
    this.setState({ textureDisplay: bool });
  };

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => {
    if (item.productType == "fake") {
      return <ListItemSkeleton index={index} />;
    } else if (item.productType == "cover") {
      return (
        <View
          style={{
            height: 200,
            width: Math.floor(SCREEN_DIMENSIONS.width * 0.5),
            overflow: "hidden"
          }}
        >
          <Image
            source={{ uri: item.img }}
            style={{
              height: 200,
              width: SCREEN_DIMENSIONS.width,
              marginLeft: item.side == "right" ? "-100%" : 0,
              resizeMode: "cover"
            }}
          />
        </View>
      );
    } else {
      return (
        <ListItem
          item={item}
          index={index}
          onPressItem={this._onPressItem}
          onSwiping={this._onSwiping}
          textureDisplay={this.state.textureDisplay}
        />
      );
    }
  };

  _listView = null;

  _onPressItem = (index, measurements) => {
    Expo.takeSnapshotAsync(this._listView, { formar: "jpeg" }).then(result => {
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
  };

  _detailResultHandler = answer => {
    //console.log( answer );

    this.setState({
      selectedDetail: answer.data
    });
    this._animateImage();
  };

  _openDetail = () => {
    this.setState({
      detailIsVisible: true
    });

    setTimeout(() => {
      this.setState({
        animatingUri: null,
        imageAnim: new Animated.Value(0)
      });
    }, 1300);
  };

  _closeDetail = () => {
    this.setState({
      detailIsVisible: false
    });
  };

  //_flatList = null;

  _getDesc = () => {
    const _self = this,
      { desc = "" } = _self.state;

    let view = null;
    if (desc != "") view = <Text>{desc}</Text>;

    return view;
  };

  render() {
    let {
      animatingUri,
      imageAnim,
      measurements,
      totalProductCount,
      filters,
      sorts,
      textureDisplay
    } = this.state;

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
      outputRange: [measurements.width, 270 /*SCREEN_DIMENSIONS.width*/]
    });

    const _height = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        measurements.width * 1.25,
        337 /*SCREEN_DIMENSIONS.width * 5/4*/
      ]
    });

    const _top = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [measurements.pageY - HEADER_HEIGHT - 40, 0]
    });

    const _left = imageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.ceil(measurements.pageX), 0]
    });

    const _opacity = imageAnim.interpolate({
      inputRange: [0.5, 1],
      outputRange: [0, 1]
    });

    const animatingImage =
      animatingUri != null ? (
        <Animated.Image
          style={{
            width: _width,
            height: _height,
            position: "absolute",
            zIndex: 10,
            top: _top,
            left: _left,
            resizeMode: "contain"
          }}
          source={{ uri: animatingUri }}
        />
      ) : null;
    const vail =
      animatingUri != null ? (
        <Animated.View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 9,
            backgroundColor: "#ffffff",
            opacity: _opacity
          }}
        />
      ) : null;

    const detailContent = (
      <ProductView
        imageMeasurements={{
          width: width,
          height: height,
          top: pageY,
          left: pageX,
          type: textureDisplay ? 1 : 0
        }}
        screenDimensions={SCREEN_DIMENSIONS}
        item={this.state.selectedDetail}
        onClose={this._closeDetail}
      />
    );

    const desc = this._getDesc();

    return (
      <View
        ref={c => {
          this._listView = c;
        }}
        style={{ flex: 1, backgroundColor: "#ffffff" }}
      >
        <ListHeader
          onFiltersChange={this._onFiltersChange}
          totalProductCount={totalProductCount}
          sorts={sorts}
          filters={filters}
          onDisplayChange={this._onDisplayChange}
          textureDisplay={this.state.textureDisplay}
        />
        <FlatList
          style={{ flex: 1, flexDirection: "column" }}
          scrollEnabled={true}
          data={this.state.items}
          numColumns="2"
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing={false}
          onRefresh={this._onRefresh}
          onEndReached={this._handleOnEndReached}
          ref={list => (this.myFlatList = list)}
          ListHeaderComponent={<CategoryDesc data={this.props.category} />}
        />
        {vail}
        {animatingImage}
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.detailIsVisible}
          onRequestClose={() => { }}
        >
          {detailContent}
        </Modal>
      </View>
    );
  }
}

class ListHeader extends React.Component {
  state = {
    filterIsOpen: false
  };

  _onProductDisplay = () => {
    this.props.onDisplayChange(false);
  };

  _onTextureDisplay = () => {
    this.props.onDisplayChange(true);
  };

  _onFilterButton = () => {
    this.setState({ filterIsOpen: true });
  };

  _close = () => {
    this.setState({ filterIsOpen: false });
  };

  _filterCallback = obj => {
    this.setState({ filterIsOpen: false });
    this.props.onFiltersChange(obj);
  };

  _onFormApply = () => {
    const _self = this;
    /* formdaki public fonk. tetikleriz. */
    if (_self.child) _self.child._onPress();
  };

  _onFormReset = () => {
    const _self = this;

    if (_self.child) _self.child._onResetForm();
  };

  render() {
    const _self = this;
    let { totalProductCount, textureDisplay, filters, sorts } = this.props;

    if (textureDisplay) {
      productOpacity = 0.2;
      textureOpacity = 1;
    } else {
      productOpacity = 1;
      textureOpacity = 0.2;
    }

    let indicator =
      filters.findIndex(obj => obj.isSelected == true) > -1 ? (
        <View
          style={{
            width: 6,
            height: 6,
            backgroundColor: "#FF2B94",
            borderRadius: 3,
            marginRight: 5
          }}
        />
      ) : null;

    return (
      <View
        style={{
          flex: 1,
          maxHeight: 50,
          flexDirection: "row",
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          zIndex: 2,
          elevation: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View style={{ width: 120 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this._onFilterButton}
            style={{ marginRight: 10 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 20
              }}
            >
              {indicator}
              <Text style={{ fontSize: 16 }}>Düzenle</Text>
              <Image
                source={ICONS["filters"]}
                style={{ width: 40, height: 40 }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#afafaf", fontSize: 14 }}>
            {totalProductCount} ürün
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: 120,
            justifyContent: "flex-end",
            marginRight: 10
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this._onProductDisplay}
            style={{ marginRight: 10 }}
          >
            <Image
              source={ICONS["listProduct"]}
              style={{ width: 40, height: 40, opacity: productOpacity }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this._onTextureDisplay}
          >
            <Image
              source={ICONS["listTexture"]}
              style={{ width: 40, height: 40, opacity: textureOpacity }}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={this.state.filterIsOpen}
          animationType="slide"
          onRequestClose={() => { }}
        >
          <MinimalHeader
            onPress={this._close}
            title="KAPAT"
            right={
              <Text style={{ color: "#afafaf", fontSize: 14, marginRight: 10 }}>
                {totalProductCount} ürün
              </Text>
            }
            noMargin={
              store.getState().general.SCREEN_DIMENSIONS.OS == "android"
                ? true
                : false
            }
          />

          <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
            <Form
              onRef={ref => (_self.child = ref)}
              style={{
                flex: 1,
                paddingLeft: 0,
                paddingRight: 0,
                paddingBottom: 0
              }}
              callback={this._filterCallback}
              data={Utils.filterToSelectObject({
                filters: filters,
                sorts: sorts
              })}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 20
              }}
            >
              <LoadingButton
                style={{ borderWidth: 1, borderColor: "#000000" }}
                fontStyle={{ fontFamily: "Bold", fontSize: 16 }}
                onPress={_self._onFormApply}
                contentStyle={{ flex: 1, marginRight: 5 }}
              >
                {"UYGULA"}
              </LoadingButton>
              <LoadingButton
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#666666"
                }}
                fontStyle={{
                  fontFamily: "Bold",
                  fontSize: 16,
                  color: "#000000"
                }}
                onPress={_self._onFormReset}
                contentStyle={{ flex: 1, marginLeft: 5 }}
              >
                {"TEMİZLE"}
              </LoadingButton>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class ListItem extends React.Component {
  _onPress = measurements => {
    this.props.onPressItem(this.props.index, measurements);
  };

  render() {
    const { item, index, textureDisplay } = this.props;

    let _width = Math.floor(SCREEN_DIMENSIONS.width * 0.5);
    let _height = Math.floor((_width * 5) / 4);
    let _boxHeight = _height + 110;

    let borderStyle =
      index % 2 == 0
        ? { borderRightWidth: 1, borderRightColor: "#dddddd" }
        : {};

    const { productGroups = [] } = item;
    let numOfColors =
      productGroups.length > 0 ? productGroups.length + 1 + " Renk" : "";

    let newFlag =
      !item.isNew == true ? null : (
        <Text
          style={{
            position: "absolute",
            left: 15,
            top: 10,
            fontSize: 13,
            fontFamily: "proxima"
          }}
        >
          Yeni
        </Text>
      );

    let trigger = item.stockQty <= 20 ? "Tükenmek Üzere" : null;

    /* 
      texture image
    */
    const texture = textureDisplay ? <Image
      style={{ width: _width, height: _height, resizeMode: "contain", position: 'absolute', left: 0, top: 0, zIndex: 2 }}
      source={{ uri: item.mediumImageUrl.replace("mobile_image_1", "mobile_image_2") }}
      onError={() => {
        this.props.source = item.mediumImageUrl;
      }}
    /> : null;

    let thumbnail = <View style={{ position: 'relative' }}>
      <Image
        style={{ width: _width, height: _height, resizeMode: "contain" }}
        source={{ uri: item.mediumImageUrl }}
        onError={() => {
          this.props.source = item.mediumImageUrl;
        }}
      />
      {texture}
    </View>

    /* 
        price
    */
    let price =
      item.discountRate > 0 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            position: "relative"
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "brandon",
              fontWeight: "bold",
              color: "#BE1066"
            }}
          >
            {Utils.getPriceFormat(item.salePrice)}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "brandon",
              marginLeft: 7,
              textDecorationLine: "line-through"
            }}
          >
            {Utils.getPriceFormat(item.listPrice)}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "proxima",
              right: 0,
              position: "absolute"
            }}
          >
            %{item.discountRate}
          </Text>
        </View>
      ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ fontSize: 18, fontFamily: "brandon", fontWeight: "bold" }}
            >
              {Utils.getPriceFormat(item.salePrice)}
            </Text>
          </View>
        );

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        ref="Single"
        onPress={nativeEvent => {
          this.refs.Single.measure((x, y, width, height, pageX, pageY) => {
            this._onPress({
              x: x,
              y: y,
              width: width,
              height: height,
              pageX: pageX,
              pageY: pageY
            });
          });
        }}
      >
        <View
          style={[
            {
              flex: 1,
              minHeight: _boxHeight,
              borderBottomWidth: 1,
              borderBottomColor: "#dddddd"
            },
            borderStyle
          ]}
        >
          {thumbnail}
          {newFlag}

          <View
            style={{
              padding: 15,
              paddingTop: 5,
              paddingBottom: 10,
              height: 105,
              flexDirection: "column"
            }}
          >
            {price}
            <Text
              numberOfLines={2}
              style={{
                marginTop: 5,
                width: _width - 30,
                fontSize: 13,
                fontFamily: "proxima"
              }}
            >
              {item.productName}
            </Text>
            <Text
              style={{
                position: "absolute",
                left: 15,
                bottom: 21,
                fontSize: 13,
                fontFamily: "proxima",
                color: "#9B9B9B"
              }}
            >
              {numOfColors}
            </Text>
            <Text
              style={{
                position: "absolute",
                left: 15,
                bottom: 5,
                fontSize: 13,
                fontFamily: "proxima",
                color: "#BE1066"
              }}
            >
              {trigger}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class ListItemSkeleton extends React.Component {
  render() {
    let { index } = this.props;

    let _width = Math.floor(SCREEN_DIMENSIONS.width * 0.5);
    let _height = Math.floor((_width * 5) / 4);
    let _boxHeight = _height + 55;

    let borderStyle =
      index % 2 == 0
        ? { borderRightWidth: 1, borderRightColor: "#dddddd" }
        : {};

    return (
      <View
        style={[
          {
            flex: 1,
            minHeight: _boxHeight,
            borderBottomWidth: 1,
            borderBottomColor: "#dddddd"
          },
          borderStyle
        ]}
      >
        <View
          style={{
            width: _width - 60,
            height: _height - 60,
            margin: 30,
            backgroundColor: "#eeeeee"
          }}
        />
        <View
          style={{
            padding: 30,
            paddingTop: 0,
            flexDirection: "column",
            flex: 1
          }}
        >
          <View
            style={{
              width: 90,
              maxHeight: 10,
              flex: 1,
              marginBottom: 5,
              backgroundColor: "#dddddd"
            }}
          />
          <View
            style={{
              width: 40,
              maxHeight: 10,
              flex: 1,
              backgroundColor: "#dddddd"
            }}
          />
        </View>
      </View>
    );
  }
}
