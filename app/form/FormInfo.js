
import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Container } from './';

class FormInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      selection: -1,

    }
  }

  render() {

    let { style } = this.props;
    let { desc } = this.props.data;

    return (
      <Container showErrorIco={false} titleShow={true} wrapperStyle={{ backgroundColor: "transparent", paddingTop: 20, paddingBottom: 20, paddingRight: 0, paddingLeft: 0, borderWidth: 0, height: 'auto' }}>
        <View style={[style]}>
          <Text>{desc}</Text>
        </View>
      </Container>
    );
  }
}

export { FormInfo }