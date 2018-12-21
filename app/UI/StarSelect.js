
import React from 'react';
import {
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

class StarSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      selection: -1,

    }
  }

  _onPress = (index) => {
    this.setState({
      selection: index
    })
    this.props.callback(index);
  }

  render() {

    const { selection } = this.state;
    const { range = 5, style = { padding: 30 } } = this.props;

    let _stars = [];
    let n = range;

    while (n--) {
      _stars.push(
        <Star style={n <= selection ? "full" : "empty"} key={"n" + n} index={n} callback={this._onPress} />
      );
    }

    return (
      <View style={[{ flexDirection: "row-reverse" }, style]}>
        {_stars}
      </View>
    );
  }
}

export { StarSelect }

class Star extends React.Component {

  _onPress = () => {
    this.props.callback(this.props.index);
  }

  render() {

    let { style } = this.props;

    _icon = style === "full" ? require('root/assets/icons/star-full.png') : require('root/assets/icons/star-empty.png');

    return (
      <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
        <TouchableOpacity activeOpacity={0.7} onPress={this._onPress}>
          <Image source={_icon} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
    );
  }
}