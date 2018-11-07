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
    bottom: 10,
    right: 10,
    overflow: "hidden"
  },
  widgetImage: { width: WidgetSize, height: WidgetSize }
});
export default class Widget extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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
