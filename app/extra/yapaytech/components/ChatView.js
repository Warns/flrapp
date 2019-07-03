import React from "react";
import { WebView, Alert, Platform, View, Text } from "react-native";
import {
  Speech,
  Permissions,
  Location,
  Asset,
  Linking,
  IntentLauncherAndroid
} from "expo";
import _ from "lodash";
import I18n from "../Language";
const tryjson = val => {
  try {
    return JSON.parse(val);
  } catch (error) {
    return val;
  }
};
const sleep = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const WEBVIEW_PROPS = {
  style: { flex: 1 },
  javaScriptEnabled: true,
  scrollEnabled: false,
  allowFileAccess: true,
  allowUniversalAccessFromFileURLs: true,
  useWebKit: true,
  originWhitelist: ["*", "file://", "assets://", "asset://"],
  mixedContentMode: "always"
};

async function getLocation(props) {
  try {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return {
        success: false,
        message: "Permission to access location was denied"
      };
    }
    let service = await Location.getProviderStatusAsync();
    if (props && props.toast && props.toast.current)
      props.toast.current.show(I18n.t("sendinglocation"));
    if (service && !service.locationServicesEnabled)
      return {
        success: false,
        message: "Location service is disabled"
      };
    let location = await Location.getCurrentPositionAsync({});
    return { success: true, location };
  } catch (error) {
    console.error(error);
    //Sentry.captureException(error);
    return { success: false, message: error.message };
  }
}

class ChatView extends React.Component {
  constructor() {
    super();
    this.state = { fromLocal: true };
    this.eventLib = this.eventLib.bind(this);
    this.onError = this.onError.bind(this);
    this.web = React.createRef();
    this.randomId = Math.random();
    this.cache = [];
    this.fontfamily = Asset.fromModule(
      require("../assets/proximanova-regular.otf")
    ).uri;
  }

  componentDidMount() {
    Asset.fromModule(require("../assets/rn.html"))
      .downloadAsync()
      .then(() => {
        this.setState({ loaded: true });
      });
  }

  get nav() {
    return this.props.navigation.navigate;
  }

  sendMessage(text) {
    if (!text || text === "/") return;
    this.run(`dahiKeeper.chat.client.sendMessage("${text}")`);
    //this.setState({ text: '' });
  }

  sendCustom(data, bot) {
    this.run(
      `dahiKeeper.chat.client.sendCustom(${JSON.stringify(data)}${
        !bot ? "" : `,${JSON.stringify({ bot: true })}`
      })`
    );
  }

  run(code) {
    this.web.current.injectJavaScript(code);
  }

  onError(err) {
    if (this.state.fromLocal) this.setState({ fromLocal: false });
    //Sentry.captureException(err);
  }

  componentWillMount() {
    let user = { id: "user-" + (this.props.user || this.randomId) };
    const patchPostMessageFunction = function() {
      var originalPostMessage = window.postMessage;
      var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };
      patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace(
          "hasOwnProperty",
          "postMessage"
        );
      };
      window.postMessage = patchedPostMessage;
    };
    let temp = "";
    if (Platform.OS === "ios")
      temp += `(${String(patchPostMessageFunction)})();`;
    let pid = this.props.token || I18n.t("pid") || "";
    if (pid) pid = `window.dahiKeeper.opt.pid='${pid}';`;
    temp += `(function(){
			try {
					window.dahiDevice="dahiReact";
					window.dahiUser=${JSON.stringify(user)};
					if(window.dahiKeeper){
          window.dahiKeeper.opt.lang='${I18n.currentLocale()}';
          window.dahiKeeper.opt.fontfamily='${this.fontfamily}';
					${pid}
					window.dahiKeeper.normal();
				}
			}catch(err){
				alert(err.message);
			}
		})();`;
    this.injectScript = temp;
  }

  eventLib(e) {
    try {
      const regex = /^action:(\/\/)?/;
      let val = e.nativeEvent.data;
      //console.log('#', val);
      if (regex.test(val)) {
        val = val.replace(regex, "");
        val = tryjson(val);
        if (val && val.data && val.data.__json) val = val.data.__json;
        else if (val && val.__json) val = val.__json;
        if (val) this.action(val);
        else console.warn("Unknown event", val);
      } else console.log(val);
      if (this.props.read) Speech.speak(e.nativeEvent.data, { language: "tr" });
    } catch (error) {
      console.error(error);
      //Sentry.captureException(error);
    }
  }

  async action(val) {
    switch (val.event) {
      case "webview":
        this.props.event("Webview", { url: val.data });
        break;
      case "external":
      case "dahi":
      case "chatStatus":
        this.props.event(val.event, val);
        break;
      case "setState":
        this.props.setter(val.data);
        break;
      case "sendLocation":
        try {
          var val = await getLocation(this.props);
          if (val && val.success)
            this.sendMessage(
              `${val.location.coords.latitude},${val.location.coords.longitude}`
            );
          else
            Alert.alert(I18n.t("error"), val.message, [
              {
                text: "Open GPS Settings",
                onPress: () => {
                  if (Platform.OS === "ios") Linking.openURL("app-settings:");
                  else
                    IntentLauncherAndroid.startActivityAsync(
                      IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
                    );
                }
              }
            ]);
        } catch (error) {
          Alert.alert(I18n.t("error"), error.message);
          console.error(error);
        }
        break;
      default:
        break;
    }
  }

  get url() {
    let temp =
      this.html || (this.html = Asset.fromModule(require("../assets/rn.html")));
    return (
      (this.state.fromLocal && temp.localUri) || `${temp.uri}#__react_native`
    );
  }

  render() {
    if (!this.state.loaded) return null;
    return (
      <WebView
        source={{ uri: this.url }}
        injectedJavaScript={this.injectScript}
        ref={this.web}
        onMessage={this.eventLib}
        onError={this.onError}
        {...WEBVIEW_PROPS}
      />
    );
  }
}

export default ChatView;
