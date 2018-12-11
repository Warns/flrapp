import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Image,
  PanResponder,
  Keyboard
} from "react-native";
import { Constants, Permissions } from "expo";
import Chat from "./components/ChatScreen";
import Widget from "./components/Widget";

// Mock Data
/* const Utils = { getURL: () => {} };
const Globals = {
  AJX: (_, cb) =>
    cb({
      data: {
        suggestions: [
          {
            productId: 584654,
            productName: "MATTE KISSES LIPSTICK",
            productPageName: "/matte-kisses-lipstick-rose-up/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313106-002_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313106-002.jpg"
          },
          {
            productId: 584652,
            productName: "DAZZLE UP LIP GLOSS",
            productPageName: "/dazzle-up-lip-gloss-provocative-bronze/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313107-002_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313107-002.jpg"
          },
          {
            productId: 584519,
            productName: "CARING LIP COLOR",
            productPageName: "/caring-lip-color-center/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313103-002_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313103-002.jpg"
          },
          {
            productId: 584517,
            productName: "CARING LIP PRIMER",
            productPageName: "/caring-lip-primer/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313104-000_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313104-000.jpg"
          },
          {
            productId: 584230,
            productName: "LACQUER LIP TUBE",
            productPageName: "/lacquer-lip-tube-peach-punch/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313097-002_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313097-002.jpg"
          },
          {
            productId: 581741,
            productName: "METALLIC LIP CHARMER GLAZE",
            productPageName: "/metallic-lip-charmer-glaze-invitation/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313092-005_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313092-005.jpg"
          },
          {
            productId: 581731,
            productName: "METALLIC LIP CHARMER MATTE",
            productPageName: "/metallic-lip-charmer-matte-charmer/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313091-004_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313091-004.jpg"
          },
          {
            productId: 581377,
            productName: "HD WEIGHTLESS MATTE LIPSTICK",
            productPageName: "/hd-weightless-lipstick-cool-purple/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313084-012_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313084-012.jpg"
          },
          {
            productId: 573087,
            productName: "COLOR UP LIP CRAYON",
            productPageName: "/color-up-lip-crayon-salmon/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0313079-002_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0313079-002.jpg"
          },
          {
            productId: 572727,
            productName: "LIP BRUSH",
            productPageName: "/lip-brush-056/",
            smallPicture:
              "/UPLOAD/Flormar/mobile_image_1/thumb/0911000-056_small.jpg",
            thumbPicture: "/UPLOAD/Flormar/mobile_image_1/thumb/0911000-056.jpg"
          }
        ]
      },
      innerMessage: null,
      message: null,
      status: 200
    })
}; */

// Production
const Utils = require("root/app/helper/Global.js");
const Globals = require("root/app/globals.js");

const { height, width } = Dimensions.get("window");
const maxHeight = height - Constants.statusBarHeight;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    bottom: 0
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.3
  },
  wrapper: {
    position: "absolute",
    top: Constants.statusBarHeight || 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  arrow: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    //borderTopLeftRadius: 10,
    //borderTopRightRadius: 10,
    height: 24,
    padding: 3
  },
  arrowCenter: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  },
  arrowImage: {
    height: 18,
    width: 18,
    transform: [{ rotate: "180deg" }]
  }
});

export default class DahiChat extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      bottom: new Animated.Value(height),
      backdrop: new Animated.Value(0),
      height: new Animated.Value(height / 2)
    };
    this.fullscreen = this.fullscreen.bind(this);
    this.openChat = this.openChat.bind(this);
    this.on = this.on.bind(this);
    this._chat = React.createRef();
    /* setTimeout(() => {
      this.openChat();
    }, 200); */
  }
  componentDidMount() {
    const _self = this,
      { onRef } = _self.props;

    _self._isMounted = true;

    if (onRef) onRef(this);

    //--> _self._search('Ruj');
  }
  componentWillUnmount() {
    const _self = this,
      { onRef } = _self.props;

    _self._isMounted = false;

    if (onRef) onRef(null);
  }
  _search = searchText => {
    const _self = this;
    Globals.AJX(
      {
        _self: _self,
        uri: Utils.getURL({
          key: "product",
          subKey: "getSearchSuggestionList"
        }),
        data: { searchText: searchText }
      },
      res => {
        const { status, data = {} } = res,
          { suggestions = [] } = data;

        if (status == 200) {
          let values = [];
          for (let i = 0; i < suggestions.length; i++) {
            const it = suggestions[i];
            values.push({
              title: it.productName,
              //subtitle: "Soyulabilen bant ve tırnak koruyucusu.",
              image_url: "http://www.flormar.com.tr" + it.smallPicture,
              default_action: {
                type: "web_url",
                title: "Ürünü Gör",
                url: `action://assistant?event=external&id=${
                  it.productId
                }&labels=product`
              }
            });
          }
          _self.chat.sendCustom({ type: "horizontalslimarray", values }, true);
        } else _self.chat.sendCustom({ type: "event", text: "start" });
      }
    );
  };

  get chat() {
    let chat = this._chat && this._chat.current;
    if (chat && chat.chatRef) return chat.chatRef();
  }

  translateY = new Animated.Value(0);
  _panResponder = PanResponder.create({
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: Animated.event([null, { dy: this.translateY }]),
    onPanResponderRelease: (e, { vy, dy }) => {
      let newHeight = this.state.height.__getValue();
      this.state.height.setValue(newHeight - dy);
      this.translateY.setValue(0);
      if (dy > 20) {
        this.openChat();
      } else if (dy < -20) {
        this.fullscreen();
      } else this.state.height.setValue(newHeight);
    }
  });

  on(type, data = {}) {
    switch (type) {
      case "chatStatus":
        this.setState({ ready: true });
        break;
      case "inputfocus":
        if (!this.state.fullscreen) this.fullscreen();
        break;
      case "dahi":
        if (data.type === "search" && data.query) this._search(data.query);

        break;
      default:
        this.props.event(type, data);
        break;
    }
  }

  onReady() {
    this.setState({ ready: true });
  }

  openChat(e, cb) {
    let open = !this.state.open;
    const openSpeed = 200,
      closeSpeed = 100;
    const slideHeight = 300;
    if (open) {
      this.translateY.setValue(0);
      this.state.bottom.setValue(slideHeight);
      Animated.parallel([
        Animated.timing(this.state.bottom, {
          toValue: 0,
          duration: openSpeed
        }),
        Animated.timing(this.state.backdrop, {
          toValue: 0.3,
          duration: openSpeed
        })
      ]).start();
      this.setState({ open });
      setTimeout(() => {
        this.translateY.setValue(1);
      }, openSpeed + 100);
    } else {
      Animated.parallel([
        Animated.timing(this.state.bottom, {
          toValue: slideHeight,
          duration: closeSpeed
        }),
        Animated.timing(this.state.backdrop, {
          toValue: 0,
          duration: closeSpeed
        })
      ]).start(() => {
        this.state.bottom.setValue(maxHeight);
        this.state.height.setValue(maxHeight / 2);
        this.setState({ open, fullscreen: false });
        Keyboard.dismiss();
      });
    }
  }

  fullscreen() {
    if (this.state.fullscreen) return this.openChat();
    Animated.timing(this.state.height, {
      toValue: maxHeight - (this.props.header ? 0 : 40),
      duration: 200
    }).start();
    setTimeout(() => {
      this.setState({ fullscreen: true });
    }, 100);
  }

  render() {
    return (
      <React.Fragment>
        {this.state.ready && <Widget open={this.openChat} />}
        {this.state.open && (
          <TouchableWithoutFeedback onPress={this.openChat.bind(this)}>
            <Animated.View
              style={[styles.backdrop, { opacity: this.state.backdrop }]}
            />
          </TouchableWithoutFeedback>
        )}

        <View style={styles.wrapper} pointerEvents="box-none">
          <Animated.View
            style={{
              backgroundColor: "white",
              //borderTopLeftRadius: 10,
              //borderTopRightRadius: 10,
              overflow: "hidden",
              height: Animated.add(
                this.state.height,
                Animated.multiply(this.translateY, -1)
              ),
              bottom: 0,
              maxHeight: "100%",
              marginTop: "auto",
              transform: [
                {
                  translateY: this.state.bottom
                }
              ]
            }}
          >
            {this.state.fullscreen ? (
              this.props.header || null
            ) : (
              <Animated.View
                {...this._panResponder.panHandlers}
                style={styles.arrow}
              >
                <TouchableWithoutFeedback onPress={this.fullscreen}>
                  <View style={styles.arrowCenter}>
                    <Image
                      style={styles.arrowImage}
                      source={require("./assets/down-arrow.png")}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            )}
            <Chat
              user={this.props.user}
              token={this.props.token}
              event={this.on}
              voice={this.props.voice}
              ref={this._chat}
            />
          </Animated.View>
        </View>
      </React.Fragment>
    );
  }
}
