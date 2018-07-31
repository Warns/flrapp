
import React from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

styles = require('../../app/styles.js');

import TextButton from '../../app/UI/TextButton';

// Let's go

export default class BoxButton extends React.Component{

  constructor(props){
    super(props);
    this.state = {

      showMore: false,

    }
  }

  _onPress = () => {
    var current = this.state.showMore;
    this.setState({ showMore: !current });
  }

  render(){

    const { more, less, numberOfLines } = this.props;

    var buttonLabel = this.state.showMore ? ( less || "SHOW LESS" ) : ( more || "SHOW MORE" );
    var num = this.state.showMore ? null : (numberOfLines || null);

    return(
      <View>
        <Text numberOfLines={num} style={[styles.normal, {lineHeight:24}]}>{this.props.children}</Text>
        <View style={{height:10}} />
        <TextButton name={buttonLabel} callback={this._onPress} />
      </View>
    );
  }
}
