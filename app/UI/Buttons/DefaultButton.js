
import React from 'react';
import {
  Text,
  Image,
  Easing,
  View,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';

import {
  ICONS,
} from "root/app/helper/Constant";

const SCREEN_DIMENSIONS = Dimensions.get("screen");

// Let's go

const DefaultButton = class DefaultButton extends React.Component {

  state = {
    anim: new Animated.Value(0),
    visibility: false,
    kisses: [],
  }

  _onPress = () => {
    this.props.callback(this.props.name);

    this.setState({ visibility: true });

    let { kisses } = this.state;

    for (var i = 0; i < 10; ++i) {
      kisses.push(
        <Image key={"a" + i} source={ICONS['lips' + Math.floor(Math.random() * 4)]} style={{ position: 'absolute', left: SCREEN_DIMENSIONS.width * Math.random() * .8, top: SCREEN_DIMENSIONS.height * Math.random() * .8, transform: [{ scale: Math.random() * .5 + .5 }, { rotate: (Math.random() * 45 - 45) + "deg" }], width: 100, height: 50, resizeMode: "cover" }} />
      );
    }

    Animated.timing(
      this.state.anim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.cubic),
        onComplete: this._onAnimComplete,
      }
    ).start();
  }

  _onAnimComplete = () => {
    this.setState({ anim: new Animated.Value(0), visibility: false, kisses: [] });
  }

  render() {

    let _opacity = this.state.anim.interpolate({
      inputRange: [0, .1, .9, 1],
      outputRange: [0, 1, 1, 0],
    });

    let _scale = this.state.anim.interpolate({
      inputRange: [0, .5, 1],
      outputRange: [1, 7, 7],
    });

    const boxColorStyle = this.props.boxColor ? this.props.boxColor : '#FFFFFF';
    const textColorStyle = this.props.textColor ? this.props.textColor : '#000000';
    const borderColorStyle = this.props.borderColor ? this.props.borderColor : '#DDDDDD';

    const { animateOnTap } = this.props;
    const { kisses, visibility } = this.state;

    let scene = null;

    let highlightColor = 'rgba(180,180,180,.4)';

    if (animateOnTap) {
      scene = (<Modal
        animationType='fade'
        transparent={true}
        visible={visibility}
        onRequestClose={() => { }} >
        {kisses}
      </Modal>
      );

      highlightColor = '#FF2B94'
    }

    return (
      <TouchableOpacity style={{ ...this.props.wrapperStyle }} activeOpacity={.96} onPress={this._onPress}>
        <View style={[{ alignItems: "center", justifyContent: "center", backgroundColor: boxColorStyle, borderWidth: 1, borderColor: borderColorStyle, height: 48, borderRadius: 3, overflow: 'hidden' }]}>
          <Animated.View style={{ position: 'absolute', opacity: _opacity, transform: [{ scale: _scale }], backgroundColor: highlightColor, width: 60, height: 60, top: '50%', left: '50%', borderRadius: 30, marginLeft: -30, marginTop: -30 }} />
          <Animated.View style={{ position: 'absolute', backgroundColor: '#3BC9A9', left: 0, right: 0, flex: 1 }} />
          <Text style={{ color: textColorStyle, fontSize: 16, fontFamily: 'Bold', fontWeight: '900' }}>{this.props.name}</Text>
          {scene}
        </View>
      </TouchableOpacity>
    );
  }
}

export { DefaultButton };