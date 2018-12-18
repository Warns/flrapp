
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

styles = require('root/app/styles.js');

import TextButton from 'root/app/UI/TextButton';

// Let's go

class ReadMoreText extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      showMore: false,

    }
  }

  _onPress = () => {
    var current = this.state.showMore;
    this.setState({ showMore: !current });
  }

  render() {

    const { more, less, numberOfLines, style } = this.props;

    var buttonLabel = this.state.showMore ? (less || "SHOW LESS") : (more || "SHOW MORE");
    var num = this.state.showMore ? null : (numberOfLines || null);

    return (
      <View>
        <Text style={style} numberOfLines={num}>{this.props.children}</Text>
        <TouchableOpacity callback={this._onPress}>
          <Text style={style}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export { ReadMoreText }