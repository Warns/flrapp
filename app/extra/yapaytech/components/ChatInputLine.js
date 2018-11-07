import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  Image,
  Platform
} from "react-native";
import { Permissions } from "expo";
import { MaterialIcons } from "@expo/vector-icons";
import I18n from "../Language";

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" }
});

export default class ChatInputLine extends React.Component {
  constructor() {
    super();
    this.input = React.createRef();
    this.state = { s: false,
      l: []};
  }

  bootvoice(voice) {
    this.voice = voice;
    this.voice.onSpeechEnd = this.stop.bind(this);
    this.voice.onSpeechResults = this.result.bind(this);
    this.micStart = this.micStart.bind(this);
  }

  componentWillMount() {
    if (this.props.voice) this.bootvoice(this.props.voice);
  }

  start() {
    if (Platform.OS === "ios") {
      this.time = setTimeout(() => {
        this.voice.stop();
      }, 5000);
      this.voice.start("tr");
      this.setState({ s: true });
    } else {
      Permissions.getAsync(Permissions.AUDIO_RECORDING)
        .then(({ status }) => {
          if (status !== "granted")
            return Permissions.askAsync(Permissions.AUDIO_RECORDING);
          return { status };
        })
        .then(({ status }) => {
          if (status !== "granted") return;
          this.voice.start("tr");
          this.setState({ s: true });
          //this._playAnimation();
        });
    }
  }

  stop() {
    if (Platform.OS === "ios") clearTimeout(this.time);
    let text = this.state.l && this.state.l[0];
    this.setState({ l: [], s: false });
    if (text)
      this.chat.sendCustom({
        type: "text",
        text,
        speech: true
      });
  }

  result(e) {
    this.setState({ l: e.value });
    if (Platform.OS === "ios") {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.voice.stop();
      }, 1000);
    } else this.stop();
  }

  micStart() {
    if (this.state.s) {
      this.setState({ l: [], s: false });
      this.voice.cancel();
    } else this.start();
  }

  get chat() {
    return this.props.chat();
  }

  onChangeText = (text, time = 100) => {
    if (this.timeoutUpdate) clearTimeout(this.timeoutUpdate);
    this.timeoutUpdate = setTimeout(() => {
      this.input.current.setNativeProps({ text });
    }, time);
    this.props.setter({ text });
  };

  sendMessage = (event, text) => {
    text = text || this.props.text;
    if (!text) return;
    this.chat.sendMessage(text);
    this.onChangeText("");
    //this.props.sendMessage();
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row"
        }}
      >
        {this.state.s ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#000000aa" }}>
              {this.state.l.join(" ") || I18n.t("nowlistening")}
            </Text>
          </View>
        ) : (
          <TextInput
            placeholder={I18n.t("sendmessage")}
            style={{
              paddingLeft: 5,
              flex: 1,
              borderWidth: 1,
              borderColor: "#d4d4d4",
              borderRadius: 6
            }}
            autoCorrect={false}
            blurOnSubmit={false}
            domStorageEnabled
            returnKeyType="send"
            underlineColorAndroid="transparent"
            onFocus={() => {
              this.chat.run(
                "window.dahiKeeper.chat.client.assistant.closeList()"
              );
              this.props.onEvent("inputfocus");
            }}
            onChangeText={this.onChangeText}
            //value={this.props.text}
            ref={this.input}
            onSubmitEditing={this.sendMessage}
          />
        )}
        {this.props.text || !this.voice ? (
          <TouchableOpacity style={styles.center} onPress={this.sendMessage}>
            <Text style={{ width: 50, fontSize: 15, textAlign: "center" }}>
              <MaterialIcons
                name="send"
                size={30}
                color={this.props.text ? "#fc3394" : "#aaa"}
              />
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.center} onPress={this.micStart}>
            <Text style={{ width: 50, fontSize: 15, textAlign: "center" }}>
              <MaterialIcons
                name="mic"
                size={30}
                color={this.state.s ? "red" : "#fc3394"}
              />
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
