import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { FORMDATA } from 'root/app/helper/Constant';

import { ICONS } from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');


class ProductReview extends React.Component {

  state = {
    message: ""
  }


  componentDidMount() {

  }

  _onBackPress = () => {
    this.props.navigation.goBack();
  }

  _onSubmit = (obj) => {
    console.log(obj.data);
  }

  render() {

    let { item } = this.props.product;
    let { message } = this.state;

    let error = message == '' ? null : <Text style={{ color: '#FF2B94', marginTop: 10, fontSize: 15 }}>{message}</Text>;

    let _title = item ? item.productName : '';

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MinimalHeader title={_title} right={<View />} onPress={this._onBackPress} />
        <View style={{ flex: 1, backgroundColor: '#F6F0EF' }}>
          <View style={{ padding: 40, paddingBottom: 20, paddingTop: 20 }}>
            <Text style={{ color: '#000000', lineHeight: 18, fontSize: 15 }}>Email adresini yaz.</Text>
            {error}
          </View>
          <Form callback={this._onSubmit} data={FORMDATA['review_submission']} />
          <View>

          </View>
        </View>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) { return state.general; }
const Review = connect(mapStateToProps)(ProductReview);

export { Review }