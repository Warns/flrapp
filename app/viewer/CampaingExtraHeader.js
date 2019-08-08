import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { 
  ICONS,
  SHOW_CUSTOM_POPUP,
  SET_WEBVIEW,
} from "root/app/helper/Constant";
import { connect } from "react-redux";
import { store } from "root/app/store";
import HTML from "react-native-render-html";

const Translation = require("root/app/helper/Translation.js");
const Utils = require("root/app/helper/Global.js");
const _getTranslation = ({ key }) => {
  const _self = this,
    { settings = {} } = store.getState() || {},
    trns = settings['translation'] || {};
  return trns[key] || Translation[key] || {};
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
  }

  CUSTOM_STYLE = {
    tagsStyles: {
      p: {
        fontSize: 16,
        color: "#6c6c6c",
        lineHeight: 24,
        fontFamily: "RegularTyp2"
      },
      b: {
        fontSize: 16,
        color: "#000000",
        lineHeight: 24,
        fontFamily: "RegularTyp2"
      }
    },
    imagesMaxWidth: Dimensions.get("window").width,
    onLinkPress: (evt, href) => {
      Linking.openURL(href);
    },
    debug: false
  };

  _onExpand = () => {
    const _self = this,
      { expand } = _self.state;
    _self.setState({ expand: !expand });
  };

  /* 
    özel duyurular
  */
  _extraOpportunity = () => {
    let _self = this,
      { user = {} } = _self.props.user || {},
      { userId = "" } = user,
      { settings = {} } = _self.props || {},
      obj = settings['extraOpportunity'] || {},
      view = [];

    if (userId == "")
      obj = obj['logoff'] || [];
    else
      obj = obj['login'] || [];


    if (obj.length > 0)
      Object.entries(obj).forEach(([ind, value]) => {
        view.push(<Text key={'key-' + ind} style={{ fontSize: 16, color: "#4a4a4a", fontFamily: "Bold", paddingBottom: 10, textAlign: "center" }}>{value}</Text>);
      });

    return view;
  }

  _onExtraTLQueries = () => {
    const _self = this;

    _self.props.dispatch({
      type: SHOW_CUSTOM_POPUP,
      value: {
        visibility: true,
        type: SET_WEBVIEW,
        data: {
            url: Utils.getURL({ key: "staticPageURI", subKey: "extraTL" })
        }
      }
    });
  }

  /* 
    flormar extra nedir
  */
  _getDesc = () => {
    const _self = this,
      { expand = false } = _self.state,
      desc = _getTranslation({ key: 'extra' })['desc'];

    let view = null;
    if (expand)
      view = (
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 30,
            paddingBottom: 30
          }}
        >
          <HTML {..._self.CUSTOM_STYLE} html={desc} />
          <TouchableOpacity activeOpacity={0.8} onPress={_self._onExtraTLQueries}>
            <Text style={{ paddingTop: 10, textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: "#000" }}>Extra TL sorgulamak için tıklayınız</Text>
          </TouchableOpacity>
        </View>
      );

    return view;
  };

  _extraDesc = () => {
    const _self = this,
      title = _getTranslation({ key: 'extra' })['title'];

    return (
      <View style={{ alignItems: "center", width: "100%" }}>

        <TouchableOpacity activeOpacity={0.8} onPress={_self._onExpand}>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 15,
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "RegularTyp2",
                fontSize: 16,
                color: "#4a4a4a"
              }}
            >
              {title}
            </Text>
            <Image
              style={{ width: 40, height: 40 }}
              source={ICONS["downArrow"]}
            />
          </View>
        </TouchableOpacity>

        {_self._getDesc()}
      </View>
    );
  }

  render() {
    const _self = this,
      { user = {} } = _self.props.user || {},
      { points = "0", userId = "" } = user;

    if (userId == "")
      return (
        <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
          {_self._extraOpportunity()}
          {_self._extraDesc()}
        </View>
      );

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ position: "absolute", alignItems: "center", zIndex: 2 }}>
          <Image
            style={{
              width: 120,
              height: 43,
              marginTop: 31,
              marginBottom: 15
            }}
            source={ICONS["campaingTitle"]}
          />
          <View
            style={{
              borderColor: "#FFFFFF",
              borderWidth: 3,
              backgroundColor: "#FF2B94",
              width: 101,
              height: 101,
              borderRadius: 101,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#FFFFFF",
                fontFamily: "RegularTyp2"
              }}
            >
              Bakiyeniz
            </Text>
            <Text
              style={{ fontSize: 30, color: "#FFFFFF", fontFamily: "Regular" }}
            >
              {Utils.getPriceFormat(points)}
            </Text>
          </View>
        </View>
        <Image
          style={{
            width: "100%",
            height: 220,
            resizeMode: "cover"
          }}
          source={ICONS["campaingRectangle"]}
        />
        <Text
          style={{
            fontSize: 16,
            color: "#4a4a4a",
            fontFamily: "RegularTyp2",
            paddingBottom: 10
          }}
        >
          Size özel kazanç dolu kampanyalar
        </Text>
        {_self._extraOpportunity()}
        {_self._extraDesc()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
const CampaingExtraHeader = connect(mapStateToProps)(Main);
export { CampaingExtraHeader };