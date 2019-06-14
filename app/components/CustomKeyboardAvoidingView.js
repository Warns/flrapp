import React, { Component } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

/*
        expoda androidde default olarak KeyboardAvoidingView softinputmode otomatik olarak tetiklendiği için 2 kere tetikleniyordu
*/
class CustomKeyboardAvoidingView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const _self = this,
      { style = {} } = _self.props;

    if (Platform.OS == "ios")
      return (
        <KeyboardAvoidingView
          behavior={"padding"}
          pointerEvents="box-none"
          style={[{ flex: 1 }, style]}
        >
          {_self.props.children}
        </KeyboardAvoidingView>
      );
    else
      return <View style={[{ flex: 1 }, style]}>{_self.props.children}</View>;
  }
}
export { CustomKeyboardAvoidingView };
