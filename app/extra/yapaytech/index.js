import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  PanResponder,
  Keyboard
} from "react-native";
import { Constants, Permissions } from "expo";
import Chat from "./components/ChatScreen";
import Widget from "./components/Widget";

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
    if (onRef)
      onRef(this);
  }
  componentWillUnmount() {
    const _self = this,
      { onRef } = _self.props;
    if (onRef)
      onRef(null);
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
        //this.state.height.setValue(height);
        this.fullscreen();
      } else this.state.height.setValue(newHeight);
      /* Animated.timing(this.state.height, {
        toValue: height / 2 - dy
      }).start(); */
      /* if (Math.abs(vy) >= 0.5 || Math.abs(dy) >= 0.5 * height) {
        Animated.timing(this.translateY, {
          toValue: dy > 0 ? height : -height,
          duration: 200
        }).start(this.props.onDismiss);
      } else {
      } */
    }
  });

  on(type, data = {}) {
    switch (type) {
      case "ready":
        this.setState({ ready: true });
        break;
      case "inputfocus":
        if (!this.state.fullscreen) this.fullscreen();
        break;
      default:
        console.log(type, data);
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
      toValue: maxHeight - 40,
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

        <View
          style={{
            position: "absolute",
            top: Constants.statusBarHeight || 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          pointerEvents="box-none"
        >
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
            <Animated.View
              {...this._panResponder.panHandlers}
              style={{
                alignItems: "center",
                backgroundColor: "white",
                justifyContent: "center",
                //borderTopLeftRadius: 10,
                //borderTopRightRadius: 10,
                height: 24,
                padding: 3
              }}
            >
              <TouchableWithoutFeedback onPress={this.fullscreen}>
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Animated.Image
                    style={{
                      height: 18,
                      width: 18,
                      transform: [
                        { rotate: this.state.fullscreen ? "0deg" : "180deg" }
                      ]
                    }}
                    source={require("./assets/down-arrow.png")}
                  />
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
            <Chat
              user={this.props.user}
              token={this.props.token}
              event={this.props.event}
              voice={this.props.voice}
              onEvent={this.on}
              ref={this._chat}
            />
          </Animated.View>
        </View>
      </React.Fragment>
    );
  }
}
