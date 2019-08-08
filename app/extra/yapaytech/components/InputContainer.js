import React from "react";
import { StyleSheet, View } from "react-native";
import ChatInputLine from "./ChatInputLine";

const styles = StyleSheet.create({
  inputCont: {
    //elevation: 10,
    //shadowOffset: { height: 1, width: 1 },
    //shadowOpacity: 0.2,
    //shadowRadius: 2,
    flex: 0,
    height: 40,
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    marginTop: 0
  }
});
let i = 0;
export default class InputContainer extends React.PureComponent {
  state = { text: "" };

  get chat() {
    return this.props.chat();
  }

  render() {
    return (
      <View style={styles.inputCont}>
        <ChatInputLine
          text={this.state.text}
          chat={this.props.chat}
          setter={it => this.setState(it)}
          voice={this.props.voice}
          event={this.props.event}
        />
      </View>
    );
  }
}
