import React from "react";
import { View, BackHandler, PixelRatio } from "react-native";
import { takeSnapshotAsync } from "expo";
import ChatView from "./ChatView";
import InputContainer from "./InputContainer";

export default class ChatScreen extends React.Component {
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
          urlCheck={this.urlCheck}
          startReview={this.startReview}
          onEvent={this.props.onEvent}
          ref={this.chat}
        />
        <InputContainer
          onSignOut={this.signout}
          chat={this.chatRef}
          pMenu={this.state.pMenu}
          voice={this.props.voice}
          onEvent={this.props.onEvent}
          bots={this.state.bots}
        />
      </View>
    );
  }
}