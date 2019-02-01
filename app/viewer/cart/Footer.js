import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { ElevatedView } from "root/app/components/";
import { LoadingButton } from "root/app/UI";
const Utils = require("root/app/helper/Global.js");

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCoupon: false
    };
  }

  _onPress = () => {
    const _self = this,
      { onPress } = _self.props;
    if (onPress) onPress();
  };

  _getFoot = () => {
    const _self = this,
      { cartInfo = {} } = _self.props.cart,
      { netTotal = 0 } = cartInfo,
      view = (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{ fontFamily: "Bold", fontSize: 15 }}>TOPLAM</Text>
          <Text style={{ fontFamily: "Bold", fontSize: 15 }}>{Utils.getPriceFormat(netTotal)}</Text>
        </View>
      );

    return view;
  };

  render() {
    let _self = this,
      { buttonText = "" } = _self.props.data,
      { cartNoResult = false, optin } = _self.props.cart,
      { order3dButton = false } = optin || {},
      buttonStyle = cartNoResult
        ? { backgroundColor: "#999999" }
        : { backgroundColor: "#000000" };

    buttonText = order3dButton ? 'ÖDEME YAP (3D)' : buttonText;

    return (
      <ElevatedView
        elevation={2}
        style={{
          position: "absolute",
          width: "100%",
          left: 0,
          bottom: 0
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            width: "100%",
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 7
          }}
        >
          {_self._getFoot()}
          <View>
            <LoadingButton style={buttonStyle} onPress={_self._onPress}>
              {buttonText}
            </LoadingButton>
          </View>
        </View>
      </ElevatedView>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Main);
