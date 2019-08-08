import React from "react";
import { View } from "react-native";
import ChatView from "./ChatView";
import InputContainer from "./InputContainer";

export default class ChatScreen extends React.PureComponent {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      text: "",
      keyboardsize: 0
    };

    this.chat = React.createRef();
  }

  chatRef = () => this.chat && this.chat.current;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ChatView
          setter={data => this.setState(data)}
          token={this.props.token}
          user={this.props.user}
          event={this.props.event}
          ref={this.chat}
        />
        <InputContainer
          chat={this.chatRef}
          event={this.props.event}
          voice={this.props.voice}
        />
      </View>
    );
  }
}
