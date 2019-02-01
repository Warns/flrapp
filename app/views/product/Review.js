import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  Animated,
  Easing
} from "react-native";
import { connect } from "react-redux";
import { MinimalHeader } from "root/app/components";
import { Form } from "root/app/form";
import { FORMDATA, ICONS } from "root/app/helper/Constant";
import { DefaultButton } from "root/app/UI";

const Utils = require("root/app/helper/Global.js");

class ProductReview extends React.Component {
  state = {
    message: "",
    success: false,
    anim1: new Animated.Value(0),
    anim2: new Animated.Value(0)
  };

  _initAnimation = () => {
    let { anim1, anim2 } = this.state;
    Animated.timing(anim1, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.back())
    }).start();

    setTimeout(() => {
      Animated.timing(anim2, {
        toValue: 1,
        duration: 400,
        easing: Easing.elastic()
      }).start();
    }, 200);
  };

  _onBackPress = () => {
    this.props.navigation.goBack();
  };

  _onBackToDetailsPress = () => {
    this.props.navigation.navigate("productDetails", {});
  };

  _onSubmit = obj => {
    //let { integrationId } = this.props.general.product.item;
    let { userBazaarvoiceToken } = this.props.user;
    let { data } = obj;

    Utils.ajx(
      {
        method: "POST",
        uri:
          "https://stg.api.bazaarvoice.com/data/submitreview.json" +
          "?apiversion=5.4" +
          "&passkey=carF2u1HidJWt3HKndfcCctCD4pXmjz9vzavhSM7ldgPA" +
          "&Filter=ProductId:" +
          "dslfhsdkjhgs" + //+ integrationId +
          "&Action=submit" +
          "&ReviewText=" +
          data.comment +
          "&Title=" +
          data.title +
          "&Rating=" +
          data.points +
          "&User=" +
          userBazaarvoiceToken +
          "&agreedtotermsandconditions=" +
          data.agreement +
          "&isrecommended=" +
          data.recommends
      },
      result => {
        if (result["type"] == "success") {
          this.setState({ message: "", success: true });
          this._initAnimation();
        } else {
          this.setState({
            message: "Geçici bir hata oluştu. Daha sonra tekrar dene."
          });
        }
      }
    );
  };

  render() {
    let { item } = this.props.general.product;
    let { message, success, anim1, anim2 } = this.state;

    let _content = null;

    const _rotate = anim1.interpolate({
      inputRange: [0, 1],
      outputRange: ["-20deg", "0deg"]
    });

    const _top = anim1.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    });

    const _top2 = anim2.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0]
    });

    const _opacity = anim2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    if (success) {
      _content = (
        <View style={{ padding: 40 }}>
          <View
            style={{
              marginBottom: 60,
              alignSelf: "center",
              position: "relative",
              width: 150,
              height: 150
            }}
          >
            <Animated.Image
              source={ICONS["reviewSuccess"]}
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                marginTop: _top,
                transform: [{ rotate: _rotate }],
                resizeMode: "contain"
              }}
            />
            <Animated.Image
              source={ICONS["reviewHeart"]}
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                opacity: _opacity,
                marginTop: _top2,
                resizeMode: "contain"
              }}
            />
          </View>
          <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 70 }}>
            Yorumun başarı ile gönderildi.
          </Text>
          <DefaultButton
            name="GERİ DÖN"
            callback={this._onBackToDetailsPress}
            boxColor="#000000"
            textColor="#ffffff"
            borderColor="#ffffff"
          />
        </View>
      );
    } else {
      _content = (
        <Form callback={this._onSubmit} data={FORMDATA["review_submission"]} />
      );
    }

    let error =
      message == "" ? null : (
        <Text style={{ color: "#FF2B94", marginTop: 10, fontSize: 15 }}>
          {message}
        </Text>
      );

    let _title = item ? item.productName : "";

    return (
      <View style={{ flex: 1 }}>
        <MinimalHeader
          title={_title}
          right={<View />}
          onPress={this._onBackPress}
          noMargin={
            this.props.general.SCREEN_DIMENSIONS.OS == "android" ? true : false
          }
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: "#F6F0EF" }}>
            <View style={{ padding: 40, paddingBottom: 5, paddingTop: 20 }}>
              {error}
            </View>
            {_content}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
const Review = connect(mapStateToProps)(ProductReview);

export { Review };
