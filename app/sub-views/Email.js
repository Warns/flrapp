import React from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { FORMDATA } from 'root/app/helper/Constant';
import { connect } from 'react-redux';

const Utils = require('root/app/helper/Global.js');
const globals = require('root/app/globals.js');

class Email extends React.Component {

  state = {
    email: null,
    message: '',
  };

  _onBackPress = () => {
    this.props.navigation.navigate('Phone');
    this.props.dispatch({ type: 'UPDATE_OPTIN', value: { phone_verification: null } });
  }

  _onSubmit = (obj) => {
    this.setState({
      email: obj.data.email,
      message: '',
    });

    globals.fetch(
      Utils.getURL({ key: 'user', subKey: 'checkGuestMail' }),
      JSON.stringify({
        "email": obj.data.email
      }),
      this._fetchResultHandler
    );
  }

  _fetchResultHandler = (answer) => {
    if (answer.status == 200) {
      if (answer.data.isRegisteredUser == true) {
        this._Continue();
      }
      else {
        this._gotoSignup();
      }
    } else {
      this.setState({ message: "Hata oluştu, lütfen tekrar dene!" })
    }
  }

  _Continue = () => {
    let { email } = this.state;

    this.props.dispatch({ type: 'UPDATE_OPTIN', value: { email: email, emos: true } });
    this.props.navigation.navigate('Password');

    console.log(this.props.optin);

  }

  _gotoSignup = () => {
    let { email } = this.state;

    this.props.dispatch({ type: 'UPDATE_OPTIN', value: { email: email } });
    this.props.navigation.navigate('Signup');
  }

  render() {
    let { message } = this.state;
    let formData = FORMDATA['optin_email'];
    formData.fields[0].items[0].value = this.props.optin.email;

    let error = message == '' ? null : <Text style={{ color: '#FF2B94', marginTop: 10, fontSize: 15 }}>{message}</Text>;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <View style={{ flex: 1 }}>
          <View style={{ padding: 40, paddingBottom: 20, paddingTop: 20 }}>
            <Text style={{ color: '#000000', lineHeight: 18, fontSize: 15 }}>Email adresini yaz.</Text>
            {error}
          </View>
          <Form callback={this._onSubmit} data={formData} />
        </View>
      </SafeAreaView>
    )
  }
}

// filter state
function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(Email);