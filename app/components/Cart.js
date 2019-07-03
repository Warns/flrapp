import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Modal,
  TouchableOpacity
} from "react-native";
import { SecureStore } from "expo";
import { connect } from "react-redux";
import { NAVIGATE, CLOSE_PRODUCT_DETAILS } from "root/app/helper/Constant";

globals = require("../globals.js");

class Cart extends React.Component {
  state = {};

  componentDidMount() {}

  _onPress = () => {
    const { onCardPress } = this.props;

    if (onCardPress) onCardPress();

    this.props.dispatch({
      type: NAVIGATE,
      value: { item: { navigation: "Cart" } }
    });
    this.props.dispatch({ type: CLOSE_PRODUCT_DETAILS, Value: {} });
  };

  render() {
    const _self = this,
      bubble =
        this.props.cartProductsNumber > 0 ? (
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              {this.props.cartProductsNumber}
            </Text>
          </View>
        ) : null;

    return (
      <View>
        <TouchableOpacity activeOpacity={0.8} onPress={_self._onPress}>
          <Image
            style={{ width: 40, height: 40, resizeMode: "contain" }}
            source={require("../../assets/images/icons/cart.png")}
          />
          {bubble}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: "#ffffff",
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    left: 20,
    top: 20,
    borderWidth: 1,
    borderColor: "#FE136F",
    justifyContent: "center",
    alignItems: "center"
  },
  bubbleText: {
    color: "#FE136F",
    fontSize: 11
  }
});

// filter state
function mapStateToProps(state) {
  return state.cart;
}

export default connect(mapStateToProps)(Cart);
