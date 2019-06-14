import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import Carousel from "react-native-snap-carousel";
//this is to clean up html content
const Entities = require("html-entities").AllHtmlEntities;
import {
  ICONS,
  CLOSE_PRODUCT_DETAILS,
  OPEN_PRODUCT_DETAILS,
  ADD_CART_ITEM,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  OPEN_VIDEO_PLAYER
} from "root/app/helper/Constant";
import {
  HorizontalProducts,
  VideosList,
  MinimalHeader,
  Palette
} from "root/app/components";
import { DefaultButton } from "root/app/UI";

globals = require("root/app/globals.js");
let SCREEN_DIMENSIONS = Dimensions.get("screen");

class ProductDetails extends React.Component {
  state = {
    anim: new Animated.Value(0),
    opacity: new Animated.Value(0),
    animationDone: false,
    productRenderDone: false,
    showVeil: true,
    detailIsOpen: false,
    videosIsOpen: false,
    canScroll: false,
    favoriteButton: { status: false, a: "FAVORİME EKLE", b: "FAVORİME EKLENDİ" }
  };

  componentDidMount() {
    this.props.dispatch({
      type: "UPDATE_PRODUCT_OBJECT",
      value: { callback: this._initAnimation }
    });
  }

  _initAnimation = () => {
    Animated.timing(this.state.anim, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
      onComplete: this._initDetails
    }).start();

    console.log("init animation");
  };

  _initDetails = () => {
    let _self = this;
    this.setState({ animationDone: true });

    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      onComplete: () => _self.setState({ showVeil: false })
    }).start();
  };

  _close = () => {
    this.props.dispatch({ type: CLOSE_PRODUCT_DETAILS, Value: {} });

    this.setState({
      animationDone: false,
      productRenderDone: false,
      showVeil: true,
      anim: new Animated.Value(0),
      opacity: new Animated.Value(0),
      detailIsOpen: false,
      videosIsOpen: false,
      favoriteButton: { ...this.state.favoriteButton, status: false }
    });
  };

  _renderItem({ item, index }) {
    return (
      <View>
        <Image
          source={{ uri: item.mediumImageUrl }}
          style={{ width: 270, height: 337, resizeMode: "cover" }}
        />
      </View>
    );
  }

  _showProductInfo = () => {
    this.setState({
      detailIsOpen: !this.state.detailIsOpen
    });
    this.productScrollView.scrollTo({ y: 360 });
  };

  _showVideos = () => {
    this.setState({
      videosIsOpen: !this.state.videosIsOpen
    });
  };

  _changeColor = id => {
    this.props.dispatch({
      type: OPEN_PRODUCT_DETAILS,
      value: { id: id, measurements: {}, animate: false, sequence: 0 }
    });
    console.log("----->", id);
  };

  _changeProduct = id => {
    this.setState({ canScroll: true });
    this.props.dispatch({
      type: OPEN_PRODUCT_DETAILS,
      value: { id: id, measurements: {}, animate: false, sequence: 0 }
    });
    console.log("p----->", id);
  };

  _addToCart = () => {
    this.props.dispatch({
      type: ADD_CART_ITEM,
      value: { id: this.props.product.item.productId, quantity: 1 }
    });
    console.log("add");
  };

  _renderProduct = () => {
    let {
      anim,
      detailIsOpen,
      opacity,
      canScroll,
      videosIsOpen,
      favoriteButton,
      animationDone
    } = this.state;
    let {
      item,
      sequence,
      measurements,
      animate,
      colors,
      videos
    } = this.props.product;

    if (item && animationDone) {
      setTimeout(() => {
        this.setState({ productRenderDone: true });
      }, 1000);

      const images = [];
      for (var k in item.productImages) {
        if (item.productImages[k].imageUrl.indexOf("mobile_texture") < 0) {
          images.push(item.productImages[k]);
        }
      }

      if (animate && !this.state.animationDone) {
      }

      let palette =
        colors.length > 1 ? (
          <Palette
            width={SCREEN_DIMENSIONS.width}
            items={colors}
            selected={item.shortCode}
            onPress={this._changeColor}
          />
        ) : null;

      let videosButton =
        videos.length > 0 ? (
          <ProductActionButton
            name="Videolar"
            count={videos.length}
            expanded={videosIsOpen}
            onPress={this._showVideos}
          />
        ) : null;

      let _videos =
        videosIsOpen && videos.length > 0 ? (
          <VideosList items={videos} callback={this._onVideoPress} />
        ) : null;

      let recommendations =
        item.productRecommends.length > 0 ? (
          <View style={{ marginTop: 35 }}>
            <Text
              style={[
                styles.sectionHeader,
                { marginLeft: 20, marginBottom: 15 }
              ]}
            >
              İLGİLİ ÜRÜNLER
            </Text>
            <HorizontalProducts
              items={item.productRecommends}
              onPress={this._changeProduct}
            />
          </View>
        ) : null;

      let listPrice =
        item.discountRate > 0 ? (
          <Text
            style={{
              fontSize: 18,
              color: "#989898",
              fontFamily: "brandon",
              fontWeight: "bold",
              marginLeft: 15,
              textDecorationLine: "line-through"
            }}
          >
            ₺{item.listPrice}
          </Text>
        ) : null;

      let productTags = [];
      for (var i in item.productAttributes) {
        productTags.push(
          <View
            key={i}
            style={{
              backgroundColor: "#eeeeee",
              borderRadius: 10,
              marginRight: 5,
              marginBottom: 5,
              height: 36,
              justifyContent: "center",
              alignItems: "center",
              paddingRight: 10,
              paddingLeft: 10,
              borderRadius: 10
            }}
          >
            <Text style={{ color: "#4A4A4A" }}>
              {item.productAttributes[i].value}
            </Text>
          </View>
        );
      }

      const desc = Entities.decode(
        (item.description || "").replace(/<[^>]*>/g, "")
      );

      let details = detailIsOpen ? (
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#D8D8D8",
            paddingBottom: 50
          }}
        >
          <Text style={{ fontSize: 13, color: "#A9A9A9" }}>Bu ürün</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 10,
              marginBottom: 20
            }}
          >
            {productTags}
          </View>
          <Text style={styles.defautText}>{desc}</Text>
          <Text style={[styles.defautText, { marginTop: 15, fontSize: 14 }]}>
            Ürün kodu: {item.integrationId}
          </Text>
        </View>
      ) : null;

      let _favoriteButton = favoriteButton.status ? (
        <DefaultButton
          callback={this._addToFavorites}
          name={favoriteButton.b}
          borderColor="#FF2B94"
        />
      ) : (
        <DefaultButton
          callback={this._addToFavorites}
          name={favoriteButton.a}
        />
      );

      return (
        <View>
          <View>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={images}
              renderItem={this._renderItem}
              sliderWidth={SCREEN_DIMENSIONS.width}
              sliderHeight={337}
              itemWidth={270}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              activeSlideAlignment="start"
            />
          </View>
          {palette}
          <View
            style={{
              padding: 20,
              paddingBottom: 0,
              paddingTop: 0,
              borderTopWidth: 1,
              borderTopColor: "#d8d8d8"
            }}
          >
            <View
              style={{ flexDirection: "row", height: 55, alignItems: "center" }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "brandon",
                  fontWeight: "bold"
                }}
              >
                ₺{item.salePrice}
              </Text>
              {listPrice}
              <Text
                style={{
                  fontSize: 16,
                  color: "#4A4A4A",
                  position: "absolute",
                  right: 0
                }}
              >
                Hızla tükeniyor
              </Text>
            </View>

            <View style={{ flexDirection: "row", height: 80 }}>
              <View style={{ flex: 1, marginRight: 5, height: 50 }}>
                <DefaultButton
                  callback={this._addToCart}
                  name="SEPETE AT"
                  boxColor="#000000"
                  textColor="#ffffff"
                  borderColor="#000000"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>{_favoriteButton}</View>
            </View>

            <View>
              <Text style={styles.defautText}>{item.shortDescription}</Text>
              <ProductActionButton
                name="Ürün Detayı"
                expanded={detailIsOpen}
                onPress={this._showProductInfo}
              />
              {details}
              <ProductActionButton
                name="Yorumlar"
                count={34}
                onPress={() => {}}
              />
              {videosButton}
            </View>
          </View>
          {_videos}
          {recommendations}
          <View style={{ height: 60 }} />
        </View>
      );
    } else null;
  };

  render() {
    let { item, screenshot, sequence, measurements } = this.props.product;
    let { width, height, pageY, pageX } = measurements;
    let { canScroll, opacity, anim, productRenderDone, showVeil } = this.state;

    let _title = item ? item.productName : "";

    const _width = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 270]
    });

    const _height = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [width * 1.25, 337]
    });

    const _top = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [pageY - 60, 0]
    });

    const _left = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.ceil(pageX), 0 + sequence * 270]
    });

    const _scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.9]
    });

    const _alpha = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });

    const _opacity = opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });

    let _screenshot =
      screenshot && !productRenderDone ? (
        <Animated.Image
          source={{ uri: screenshot }}
          style={{
            position: "absolute",
            zIndex: 2,
            left: 0,
            top: 0,
            width: "100%",
            height: SCREEN_DIMENSIONS.height - 57,
            resizeMode: "contain",
            opacity: _alpha,
            transform: [{ scale: _scale }]
          }}
        />
      ) : null;
    let _animatedImage =
      item && !productRenderDone ? (
        <Animated.Image
          style={{
            width: _width,
            height: _height,
            top: _top,
            left: _left,
            position: "absolute",
            zIndex: 3,
            resizeMode: "contain"
          }}
          source={{ uri: item.productImages[sequence].mediumImageUrl }}
        />
      ) : null;
    let _veil = showVeil ? (
      <Animated.View
        style={{
          width: SCREEN_DIMENSIONS.width,
          height: SCREEN_DIMENSIONS.height,
          top: 0,
          left: 0,
          position: "absolute",
          zIndex: 1,
          opacity: _opacity,
          backgroundColor: "#ffffff"
        }}
      />
    ) : null;

    return (
      <View style={{ flex: 1 }}>
        <MinimalHeader
          onPress={this._close}
          title={_title}
          noMargin={this.props.SCREEN_DIMENSIONS.OS == "android" ? true : false}
        />
        <ScrollView
          style={{ flex: 1 }}
          ref={ref => (this.productScrollView = ref)}
          onContentSizeChange={() => {
            if (canScroll) {
              this.productScrollView.scrollTo({ y: 0 });
              this.setState({ canScroll: false });
            }
          }}
        >
          <View style={{ flex: 1, minHeight: SCREEN_DIMENSIONS.height }}>
            {this._renderProduct()}
            {
              //screenshot
            }
            {
              //_veil
            }
            {_screenshot}
            {_animatedImage}
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return state.general;
}
const Details = connect(mapStateToProps)(ProductDetails);

export { Details };

class ProductActionButton extends React.Component {
  _onPress = () => {
    this.props.onPress();
  };

  render() {
    let count = this.props.count ? (
      <View
        style={{
          padding: 5,
          backgroundColor: "#dddddd",
          borderRadius: 20,
          height: 24,
          minWidth: 24,
          marginLeft: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 12 }}>{this.props.count}</Text>
      </View>
    ) : null;

    let icon = ICONS["rightArrow"],
      borderColor = "#D8D8D8";

    if (this.props.expanded) {
      icon = ICONS["downArrow"];
      borderColor = "#ffffff";
    }

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this._onPress}>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: borderColor,
            height: 60,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {this.props.name}
          </Text>
          {count}
          <Image
            source={icon}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              position: "absolute",
              right: 0,
              top: 10
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defautText: {
    fontSize: 16,
    color: "#6c6c6c",
    lineHeight: 24
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: "Bold"
  }
});
