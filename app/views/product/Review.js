import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import { MinimalHeader } from 'root/app/components';
import { DefaultButton } from 'root/app/UI';

import { ICONS } from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');


class ProductReview extends React.Component {


  componentDidMount() {

  }

  _onBackPress = () => {
    this.props.navigation.goBack();
  }

  render() {

    let { item } = this.props.product;
    //let { items, selected } = this.props.navigation.state.params;

    let _title = item ? item.productName : '';

    return (
      <View style={{ flex: 1 }}>
        <MinimalHeader title={_title} onPress={this._onBackPress} title={_title} noMargin={this.props.SCREEN_DIMENSIONS.OS == 'android' ? true : false} />
        <View style={{ flex: 1 }}>

          <Text>Review form</Text>

        </View>
      </View>
    )
  }
}

function mapStateToProps(state) { return state.general; }
const Review = connect(mapStateToProps)(ProductReview);

export { Review }