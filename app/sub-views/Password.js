import React from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import {
  FORMDATA,
  UPDATE_OPTIN,
  ASSISTANT_SHOW,
  UPDATE_USER,
  SET_USER,
  SET_USER_CHANGE
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { DefaultButton } from 'root/app/UI';
import {
  SHOW_PRELOADING
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

const Utils = require('root/app/helper/Global.js');
const globals = require('root/app/globals.js');
const Analytics = require("root/app/analytics");

class Password extends React.Component {

  state = {
    password: null,
    message: '',
  };

  _onBackPress = () => {
    this.props.navigation.navigate('Email');
    this.props.dispatch({ type: UPDATE_OPTIN, value: { emos: null } });
  }

  _onSubmit = (obj) => {

    console.log('on submit');
    let { email } = this.props.optin;

    this.setState({
      password: obj.data.password,
      message: '',
    });

    store.dispatch({ type: SHOW_PRELOADING, value: true });

    globals.fetch(
      Utils.getURL({ key: 'user', subKey: 'login' }),
      JSON.stringify({
        "email": email,
        "password": obj.data.password,

      }),
      this._fetchResultHandler
    );
  }

  _fetchResultHandler = (answer) => {

    console.log('anser', answer);

    if (answer.status == 200) {

      this.props.dispatch({ type: UPDATE_OPTIN, value: { password: this.state.password } });
      this.props.dispatch({ type: SET_USER, value: { user: { ...answer.data, password: this.state.password } || {} } });
      this.props.dispatch({ type: SET_USER_CHANGE, value: { ...answer.data } });

      Analytics.send({ event: Analytics.events.login, data: answer.data });
      this._Continue(answer.data);

    } else {
      this.setState({ message: "Hatalı şifre, lütfen kontrol et." });
    }

    store.dispatch({ type: SHOW_PRELOADING, value: false });
  }

  _Continue = (data) => {
    let _self = this;

    if (data.isMailSubscribe && data.isSmsSubscribe) {
      setTimeout(() => {
        _self.props.navigation.navigate("Home");
        _self.props.dispatch({ type: ASSISTANT_SHOW, value: true });
        _self.props.dispatch({ type: UPDATE_USER, value: { updateSubscriptions: false } });
      }, 10);
    } else {
      _self.props.dispatch({ type: UPDATE_OPTIN, value: { isMailSubscribe: data.isMailSubscribe, isSmsSubscribe: data.isSmsSubscribe } });
      _self.props.navigation.navigate("Subscription");
    }
  }

  _onResetPressed = () => {
    this.props.navigation.navigate('PasswordReset');
  }

  render() {
    let { message } = this.state;
    let error = message == '' ? <Text style={{ color: '#000000', lineHeight: 18, fontSize: 15 }}>Flormar.com.tr üyeliğine ait şifreni gir.</Text> : <Text style={{ color: '#FF2B94', fontSize: 15 }}>{message}</Text>;
    let resetPassword = message == '' ? null : <DefaultButton callback={this._onResetPressed} name="ŞİFREMİ UNUTTUM" boxColor="#ffffff" textColor="#000000" borderColor="rgba(0,0,0,0)" />;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <View style={{ flex: 1 }}>
          <View style={{ padding: 40, paddingBottom: 20, paddingTop: 20 }}>
            {error}
          </View>
          <Form callback={this._onSubmit} data={FORMDATA['optin_password']} />
          {resetPassword}
        </View>
      </SafeAreaView>
    )
  }
}

// filter state
function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(Password);