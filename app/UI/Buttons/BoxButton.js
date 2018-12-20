import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

class BoxButton extends Component {
  constructor(props) {
    super(props);
  }

  _onPressButton = () => {
    const { callback, item = {}, sequence = 0 } = this.props;
    if (callback)
      callback({ item, sequence });
  }

  _measureDimensions = (e) => {
    const { onDimensions, sequence = 0 } = this.props;
    if (onDimensions)
      onDimensions({ layout: e.nativeEvent.layout, sequence });
  }

  render() {
    const _self = this;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={_self._onPressButton} onLayout={e => _self._measureDimensions(e)}>
        <View style={[{ alignItems: "center", justifyContent: "center", borderColor: '#666666', borderWidth: 1, backgroundColor: "#FFFFFF", borderRadius: 3, height: 36, paddingLeft: 30, paddingRight: 30 }, { ..._self.props.wrapperStyle }]}>
          <Text style={[{ fontFamily: 'Bold', fontSize: 14 }, { ..._self.props.textStyle }]}>{_self.props.children}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export { BoxButton };