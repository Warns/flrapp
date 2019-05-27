import React from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { FORMDATA } from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import {
  SHOW_PRELOADING
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

const Utils = require('root/app/helper/Global.js');

class Phone extends React.Component {

  state = {
    mobileNumber: '',
    verificationNumber: '',
  };

  _onBackPress = () => {
    this.props.navigation.navigate('Splash');
    this.props.dispatch({ type: 'UPDATE_OPTIN', value: { phone: null, phone_formatted: null, phone_verification: null } });
  }

  _onSubmit = (obj) => {
    let formattedMobileNumber = obj.data.mobilePhone.replace(/\)/g, '').replace(/\(/g, '').replace(/\ /g, '').substr(1);
    let verificationNumber = Utils.generateSMSVerificationCode(6);

    this.setState({
      mobileNumber: obj.data.mobilePhone,
      formattedMobileNumber: formattedMobileNumber,
      verificationNumber: verificationNumber
    })

    let data = ""
      + "?user=flormarapp"
      + "&password=flormarapp456"
      + "&gsm=" + formattedMobileNumber
      + "&text=" + escape(verificationNumber + " koduyla FLORMAR'a giris yapabilirsin.");

    sendVerificationSMS(data, this._Continue);
    //setTimeout(() => { this._Continue(); }, 222);
  }

  _Continue = () => {

    let { mobileNumber, formattedMobileNumber, verificationNumber } = this.state;

    this.props.dispatch({ type: 'UPDATE_OPTIN', value: { phone: mobileNumber, phone_formatted: formattedMobileNumber, phone_verification: verificationNumber } });
    this.props.navigation.navigate('PhoneConfirmation');

  }

  render() {

    let formData = FORMDATA['optin_phone'];
    formData.fields[0].items[0].value = this.props.optin.phone_formatted;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <View style={{ flex: 1 }}>
          <View style={{ padding: 40, paddingBottom: 20, paddingTop: 20 }}>
            <Text style={{ fontFamily: 'Bold', fontSize: 20 }}>MERHABA</Text>
            <Text style={{ color: '#000000', lineHeight: 18, fontSize: 15 }}>Flormar olarak kişisel bilgilerinin güvenliğini önemsiyoruz, bu nedenle sadece ilk girişinde telefonuna gelen onay kodunu girerek telefonunu doğrula</Text>
          </View>
          <Form callback={this._onSubmit} data={formData} />
        </View>
      </SafeAreaView>
    )
  }
}

async function sendVerificationSMS(data, callback) {
  store.dispatch({ type: SHOW_PRELOADING, value: true });
  return fetch('http://www.postaguvercini.com/api_http/sendsms.asp' + data)
    .then((response) => {
      return response.text();
    })
    .then((responseJson) => {
      console.log(responseJson);
      callback();
      store.dispatch({ type: SHOW_PRELOADING, value: false });
    })
    .catch((error) => {
      console.error(error);
      store.dispatch({ type: SHOW_PRELOADING, value: false });
    });
}

// filter state
function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(Phone);