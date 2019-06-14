import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  WebView,
  Dimensions,
  Animated,
  PanResponder,
  Easing
} from "react-native";
import { Constants } from "expo";
const { height, width } = Dimensions.get("window");
const maxHeight = height - Constants.statusBarHeight;
const WidgetSize = 50;
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    bottom: 0
  },
  widget: {
    width: WidgetSize,
    height: WidgetSize,
    borderRadius: WidgetSize,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    alignItems: "center",
    justifyContent: "center",
    bottom: 15,
    right: 15,
    overflow: "hidden"
  },
  widgetImage: { width: WidgetSize, height: WidgetSize }
});
class Widget extends React.Component {
  render() {
    const _self = this,
      { assistant = {} } = _self.props,
      { show = true } = assistant,
      bottom = show ? 0 : -(WidgetSize * 2);

    return (
      <View style={[styles.container, { bottom }]}>
        <TouchableWithoutFeedback onPress={this.props.open}>
          <View style={styles.widget}>
            <Image
              style={styles.widgetImage}
              source={require("../assets/assistant.gif")}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(Widget);