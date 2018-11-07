import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Modal,
  WebView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { connect } from 'react-redux';
import { MinimalHeader } from '../components/header/MinimalHeader';
import Dahi from 'root/app/extra/yapaytech';

//globals = require('../globals.js');

class Assistant extends React.Component {

  state = {
    expanded: false,
    assistantIsVisible: false,
    boxAnim: new Animated.Value(0),
    opacity: 0,
  }

  _openModal = () => {
    this.setState({ assistantIsVisible: true });
    this._animateBox();
  }

  _animateBox = () => {
    Animated.timing(
      this.state.boxAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }
    ).start();
  };

  _closeModal = () => {
    this.setState({
      assistantIsVisible: false,
      expanded: false
    });
    this.state.boxAnim.setValue(0);
  }

  _expand = () => {
    this.setState({ expanded: true });
  }

  _onMessage = (m) => {
    console.log(m);
  }

  render() {

    const _self = this,
      { user = {}, segmentify = {}, assistant = {} } = _self.props,
      userID = user.userId || segmentify['userID'] || "",
      { show } = assistant;

    if (show)
      return (
          <Dahi
            user={userID}
            token="89400cde1b7e4df233b195554d93c69f"
            event={(type, data) => {
              switch (type) {
                case "Webview":
                  break;

                default:
                  break;
              }
              console.log("@", type, data);
            }}
          />
      );
    else
      return null;


   /* let topMargin = this.state.boxAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    let vailHeight = this.state.expanded ? 0 : null;
    let area = this.state.expanded ? null : <TouchableOpacity style={styles.area} activeOpacity={1} onPress={this._expand} />;

    let header = this.state.expanded ? <MinimalHeader title="" onBackPress={this._closeModal} /> : null;

      
    return (

      <View style={styles.wrapper}>
        <TouchableOpacity activeOpacity={.9} onPress={this._openModal}>
          <View style={styles.circle}>
            <Image source={require('../../assets/images/assistant.gif')} style={{ resizeMode: 'contain', width: 50, height: 50, borderRadius: 25 }} />
          </View>
        </TouchableOpacity>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.assistantIsVisible}
        >
          <View style={{ backgroundColor: 'rgba(0,0,0,.4)', flex: 1 }}>
            <View style={{ flex: 1, maxHeight: vailHeight }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={this._closeModal} />
            </View>
            {header}
            <Animated.View style={{ flex: 1, marginTop: topMargin, backgroundColor: '#ffffff' }}>
              <Image source={require('../../assets/images/loader.gif')} style={{ position: 'absolute', alignSelf: 'center', bottom: 100, width: 250, height: 151, }} />
              {area}
              <WebView
                source={{ uri: 'https://www.minus99.com/lab/misc/flormar-assistant.html' }}
                style={{ margin: 0, opacity: this.state.opacity }}
                onLoadEnd={() => { this.setState({ opacity: 1 }) }}
                onMessage={this._onMessage}
              />
            </Animated.View>
          </View>
        </Modal>
      </View>

    )
    */
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0,0,0,.1)',
    width: 52,
    height: 52,
    position: 'absolute',
    overflow: 'hidden',
    bottom: 15,
    right: 15,
    borderRadius: 26,
    padding: 1,
    ...Platform.select({
      ios: {
        zIndex: 9,
      },
      android: {
        elevation: 999,
      }
    }),
  },
  circle: {
    backgroundColor: '#dddddd',
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        zIndex: 9,
      },
      android: {
        elevation: 999,
      }
    }),
  },
  area: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    zIndex: 1,
  }
});


// filter state
function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Assistant);