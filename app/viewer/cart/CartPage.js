import React, { Component } from "react";
import { ScrollView, View, Alert } from "react-native";
import { Viewer } from "root/app/viewer/";
import {
  SET_CART_INFO,
  DATA_LOADED,
  SET_CART_NO_RESULT,
  RESET_CART,
  SET_CART_PROGRESS,
  ASSISTANT_SHOW,
  SET_CART_ITEMS,
  NAVIGATE,
  CART_FOOTER_MARGIN_BOTTOM,
  CART_BACKGROUND_COLOR_1,
  CART_BACKGROUND_COLOR_2,
  SHOW_PRELOADING
} from "root/app/helper/Constant";
import { connect } from "react-redux";
import Footer from "./Footer";
import UnderSide from "./UnderSide";
import { store } from "root/app/store";

const DATA = {
  type: "scrollView",
  itemType: "cartList",
  uri: { key: "cart", subKey: "getCart" },
  keys: {
    id: "cartItemId",
    arr: "products"
  },
  refreshing: false
};

/* footer config */
const CONFIG = {
  buttonText: "ALIŞVERİŞİ TAMAMLA",
  coupon: true,
  opportunity: true
};

/*  */
const PRELOAD = async b => {
  store.dispatch({ type: SHOW_PRELOADING, value: b });
};

/*
    NOT:

    1- <Viewer config={DATA} response={this._response} />; sepet silme ve update işlemlerinde her seferinde içeriği update ediyoruz içerik update oldukça response ile son hali dönüyor ve reduxa bağlı cart refresh ediyoruz.

    2- Kullanıcı eğer UnderSide içerisindeki kupon kodunu girmişse viewer update ediyoruz. böylece sepet güncelleniyor ve redux cart güncelleniyor.
*/

const Cart = class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paddingBottom: CART_FOOTER_MARGIN_BOTTOM,
      loaded: false
    };
  }

  _begining = false;
  onWillFocus = () => {
    const _self = this;
    _self.props.dispatch({
      type: SET_CART_PROGRESS,
      value: { activeTitle: "SEPETİM", progress: "1/3", cartLocation: "basket" }
    });

    /*

            NOT: ilk açılışta sepetin 2 kere tetiklenmemesi için kontrol ekliyoruz.
                 Böylece kullanıcı bir sonraki sayfada kargo seçimi yapınca fiyat
                 güncelleneceği için tekrar buraya döndüğünde sepetin tekrardan
                 update edilmesi lazım.

        */

    if (_self._begining) _self._onUpdate();
    _self._begining = true;
  };

  componentDidMount() {
    const _self = this,
      { navigation } = _self.props;

    if (navigation)
      _self._Listener = navigation.addListener("willFocus", _self.onWillFocus);

    _self.props.dispatch({ type: ASSISTANT_SHOW, value: false });
  }

  componentWillUnmount() {
    const _self = this,
      { navigation } = _self.props;

    _self.props.dispatch({ type: RESET_CART });

    if (navigation) _self._Listener.remove();

    _self.props.dispatch({ type: ASSISTANT_SHOW, value: true });
  }

  _callback = ({ type, data }) => {
    const _self = this;
    if (type === DATA_LOADED) {
      if (data.length > 0) _self.setState({ loaded: true });
    }
  };

  /* redux cartInfo ve cartItems update */
  _response = ({ type, data }) => {
    const _self = this;
    if (type === DATA_LOADED) {
      _self.props.dispatch({
        type: SET_CART_ITEMS,
        value: Utils.getCartCount(data || {})
      });
      _self.props.dispatch({ type: SET_CART_INFO, value: data });
    }
  };

  _onUpdate = () => {
    const _self = this;
    _self.child._onUpdateItem();
  };

  _onPress = () => {
    const _self = this,
      { navigation, user = {}, cart = {} } = _self.props,
      { userId = "" } = user["user"],
      { cartNoResult = false } = cart;

    if (userId == "") {
      //--> logoff
      if (cartNoResult) {
        //--> sepet boş anasayfaya dön
        //_self.props.dispatch({ type: NAVIGATE, value: { item: { navigation: "Home" } } });
      } else {
        //--> sepet dolu logine git
        const { rootNavigation = {} } = _self.props || {},
            { optinNav } = rootNavigation;
          if (optinNav)
            optinNav.navigate("Phone", {});
      }
    } else if (userId != "") {
      //--> login
      if (cartNoResult) {
        //--> sepet boş anasayfaya dön
        //_self.props.dispatch({ type: NAVIGATE, value: { item: { navigation: "Home" } } });
      } else {
        //--> sepet dolu bir sonraki aşama
        PRELOAD(true);
        globals.fetch(
          Utils.getURL({ key: "cart", subKey: "validateCart" }),
          JSON.stringify({}),
          answer => {
            const { status, message } = answer;
            setTimeout(() => {
              if (status == 400) {
                Alert.alert(message);
              } else {
                if (navigation) navigation.navigate("Address", {});
              }
            }, 300);
            PRELOAD(false);
          }
        );
      }
    }
  };

  _onCouponCallback = ({ type, data = {} }) => {
    const _self = this,
      { status } = data;
    if (status == 200) _self._onUpdate();
  };

  _noResult = () => {
    const _self = this;
    _self.props.dispatch({ type: SET_CART_NO_RESULT, value: true });
  };

  _onExpand = b => {
    const _self = this;

    /* PROMOSYON KODU AÇILINCA SAYFA SCROLL */
    //_self.scrollView.scrollTo({ y: 360 });
  };

  render() {
    const _self = this,
      { paddingBottom, loaded = false } = _self.state,
      backgroundColor = loaded
        ? CART_BACKGROUND_COLOR_1
        : CART_BACKGROUND_COLOR_2,
      underside = loaded ? (
        <UnderSide
          expand={_self._onExpand}
          data={CONFIG}
          onCouponCallback={_self._onCouponCallback}
          opportunity={CONFIG["opportunity"]}
        />
      ) : null,
      { cartNoResult = false } = _self.props.cart,
      flexible = !loaded ? true : cartNoResult ? true : false;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          ref={ref => (_self.scrollView = ref)}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            flex: 1,
            marginBottom: paddingBottom,
            backgroundColor: backgroundColor
          }}
        >
          <Viewer
            flexible={flexible}
            noResult={_self._noResult}
            onRef={ref => (_self.child = ref)}
            {..._self.props}
            config={DATA}
            response={this._response}
            callback={this._callback}
            wrapperStyle={{ backgroundColor: backgroundColor }}
            style={{ backgroundColor: CART_BACKGROUND_COLOR_2 }}
          />
          {underside}
        </ScrollView>
        <Footer onPress={_self._onPress} data={CONFIG} />
      </View>
    );
  }
};

function mapStateToProps(state) {
  return state;
}
const CartPage = connect(mapStateToProps)(Cart);
export { CartPage };
