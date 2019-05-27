import React from 'react';
import { Animated, KeyboardAvoidingView, SafeAreaView, Text, View } from 'react-native';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { FORMDATA } from 'root/app/helper/Constant';
import { connect } from 'react-redux';

class PhoneConfirmation extends React.Component {

  state = {
    time: 120,
    message: '',
    canClick: true,
    email: null,
    canGoBack: false,
  }

  componentDidMount() {
    this.setState({ message: '', canGoBack: false });
    this._startTimer();
  }

  interval = null;

  _startTimer = () => {
    let { time } = this.state;
    this.interval = setInterval(() => {
      if (time > 0)
        this.setState({
          time: time--,
        })
      else
        this.props.navigation.goBack();

    }, 1000);
  }

  _onBackPress = () => {
    let { canGoBack } = this.state;
    if (canGoBack) {
      this.props.navigation.navigate('Phone');
    }
  }

  _onSubmit = (obj) => {

    let { time, canClick } = this.state;
    let { phone_verification } = this.props.optin;

    if (canClick) {

      this.setState({ canClick: false });

      if (time > 0) {
        if (obj.data.mobilePhone == phone_verification) {
          this.setState({ canClick: true });
          clearInterval(this.interval);
          this._Continue();
          //this._checkEmosPhoneNumber();
        }
        else {
          this.setState({ canClick: true, canGoBack: true });
          this.setState({ message: "Onay kodu geçerli değil, Lütfen kontrol edip tekrar dene." })
        }
      }
    }
  }

  /*
  _checkEmosPhoneNumber = () => {
    let { phone_formatted } = this.props.optin;

    globals.fetch(
      Utils.getURL({ key: 'user', subKey: 'CheckUserPhoneNumber' }),
      JSON.stringify({
        "phoneNumber": '' + phone_formatted,
      }),
      this._fetchResultHandler
    );
  }

  _fetchResultHandler = (answer) => {

    if (answer.status == 200 && answer.data.isRegisteredUser == true) {
      this.setState({ email: answer.data.email[0] });
      this._Continue();
    }
    else {
      this._Continue();
    }
  }
  */

  _Continue = () => {
    this.props.dispatch({ type: 'UPDATE_OPTIN', value: { email: this.state.email, phone_checked: true } });
    this.props.navigation.navigate('Email');
  }

  _onChangeText = () => {
    this.setState({ message: '' });
  }

  render() {
    let { phone } = this.props.optin;
    let { time, message } = this.state;

    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    let countdown = 0 + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    let error = message == '' ? null : <Text style={{ color: '#FF2B94', marginTop: 10, fontSize: 15 }}>{message}</Text>;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={{ padding: 40, paddingBottom: 10, paddingTop: 20 }}>
            <Text style={{ color: '#000000', lineHeight: 18, fontSize: 15 }}>Lütfen {phone} numarali cep telefonuna SMS ile gelen onay kodunu gir.</Text>
            <Text style={{ color: '#FF2B94', marginTop: 10 }}>{countdown}</Text>
            {error}
          </View>
          <Form callback={this._onSubmit} onChangeText={this._onChangeText} data={FORMDATA['optin_phoneConfirmation']} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

// filter state
function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(PhoneConfirmation);