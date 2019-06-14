import React from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  Text,
  View,
  Linking
} from "react-native";
import { MinimalHeader } from "root/app/components";
import { DefaultButton } from "root/app/UI";
import { Form } from "root/app/form";
import { FORMDATA } from "root/app/helper/Constant";
import { connect } from "react-redux";

const Utils = require("root/app/helper/Global.js");
const globals = require("root/app/globals.js");

class Email extends React.Component {
  state = {
    email: null,
    message: ""
  };

  _onBackPress = () => {
    this.props.navigation.navigate("Phone");
    this.props.dispatch({
      type: "UPDATE_OPTIN",
      value: { phone_verification: null }
    });
  };

  _onSubmit = obj => {
    let { registered_email } = this.props.optin;

    console.log("testt", registered_email, this.props.optin, obj.data.email);

    if (registered_email != "" && registered_email != null) {
      if (obj.data.email == registered_email) {
        this._handleEmail(obj);
      } else {
        this.setState({
          message:
            "Bu telefon numarası farklı bir e-mail adresine ait bir hesap ile bağlanmıştır. Lütfen bu telefon ile bağlanmış e-mail adresinizi deneyiniz. Bu konuyla ilgili olarak talep ve istekleriniz için 0 850 333 0 319 numaralı çağrı merkezimiz ile mesai saatleri içerisinde iletişime geçebilirsiniz."
        });
      }
    } else this._handleEmail(obj);
  };

  _handleEmail = obj => {
    this.setState({
      email: obj.data.email,
      message: ""
    });

    globals.fetch(
      Utils.getURL({ key: "user", subKey: "checkGuestMail" }),
      JSON.stringify({
        email: obj.data.email
      }),
      this._fetchResultHandler
    );
  };

  _fetchResultHandler = answer => {
    if (answer.status == 200) {
      if (answer.data.isRegisteredUser == true) {
        this._Continue();
      } else {
        this._gotoSignup();
      }
    } else {
      this.setState({ message: "Hata oluştu, lütfen tekrar dene!" });
    }
  };

  _Continue = () => {
    let { email } = this.state;

    this.props.dispatch({
      type: "UPDATE_OPTIN",
      value: { email: email, emos: true }
    });
    this.props.navigation.navigate("Password");

    console.log(this.props.optin);
  };

  _gotoSignup = () => {
    let { email } = this.state;

    this.props.dispatch({ type: "UPDATE_OPTIN", value: { email: email } });
    this.props.navigation.navigate("Signup");
  };

  _onCallCenterPress = () => {
    Linking.openURL("tel:08503330319");
  };

  render() {
    let { message } = this.state;
    let formData = FORMDATA["optin_email"];
    formData.fields[0].items[0].value = this.props.optin.email;

    let error =
      message == "" ? null : (
        <View>
          <Text
            style={{
              color: "#FF2B94",
              marginTop: 10,
              marginBottom: 10,
              fontSize: 15
            }}
          >
            {message}
          </Text>

          <DefaultButton
            callback={this._onCallCenterPress}
            name="ÇAĞRI MERKEZİNİ ARA"
            boxColor="#ffffff"
            textColor="#000000"
            borderColor="rgba(0,0,0,1)"
          />
        </View>
      );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <View style={{ flex: 1 }}>
          <View style={{ padding: 40, paddingBottom: 20, paddingTop: 20 }}>
            <Text style={{ color: "#000000", lineHeight: 18, fontSize: 15 }}>
              Flormar.com.tr üyeliğine ait email adresini gir.
            </Text>
            {error}
          </View>
          <Form callback={this._onSubmit} data={formData} />
        </View>
      </SafeAreaView>
    );
  }
}

// filter state
function mapStateToProps(state) {
  return state.user;
}

export default connect(mapStateToProps)(Email);
