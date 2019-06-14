
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  nativeEvent,
  Easing,
  Image,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import {
  ICONS,
} from 'root/app/helper/Constant';

import Cart from '../Cart';

import { SHOW_MENU, NAVIGATE } from 'root/app/helper/Constant';

// Let's go

class DefaultHdr extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // state
    }
  }

  _onLogoPress = () => {
    this.props.dispatch({ type: NAVIGATE, value: { item: { navigation: "Home" } } });
  }

  _onLoginPress = () => {
    this.props.dispatch({ type: NAVIGATE, value: { item: { navigation: "Splash" } } });
  }

  _onUserMenuPress = () => {
    this.props.dispatch({ type: SHOW_MENU, value: { direction: 'left', type: 'user' } });
  }

  _getUserMenu = () => {

    const _self = this,
      { user = {} } = _self.props.user || {},
      { userId = '', gender = 'E' } = user,
      ico = gender == 'E' ? 'userMen' : 'userWomen';

    if (userId != '') {

      return (
        <TouchableOpacity style={{ padding: 5, paddingRight: 0 }} onPress={this._onUserMenuPress}>
          <Image
            style={{ width: 55, height: 40 }}
            source={ICONS[ico]}
          />
        </TouchableOpacity>
      );
    } else
      return null;
  }

  render() {
    const _self = this;

    let { topMargin } = this.props.general.SCREEN_DIMENSIONS,
      { user = {} } = _self.props.user || {},
      { userId = '' } = user;

    let _account = userId ? _self._getUserMenu() : (
      <TouchableOpacity activeOpacity={.8} onPress={this._onLoginPress}>
        <View style={{ backgroundColor: '#ffffff', borderColor: '#BBBBBB', borderWidth: 1, borderRadius: 5, height: 36, minWidth: 80, paddingLeft: 9, paddingRight: 9, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontFamily: 'Medium' }}>GİRİŞ YAP</Text>
        </View>
      </TouchableOpacity>
    );

    let _left = this.props.backButton == true ? (
      <TouchableOpacity onPress={this._onLogoPress}>
        <Image source={require('../../../assets/images/icons/back.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
      </TouchableOpacity>
    ) : _account;

    return (
      <View style={{ height: 60 + topMargin, paddingTop: topMargin, flexDirection: 'row', backgroundColor: '#ffffff' }}>
        <View style={{ width: 95, flexDirection: 'row', alignItems: 'center', paddingLeft: 10, }}>
          {_left}
          {/*<TouchableOpacity style={{ padding: 5, paddingRight: 0 }} onPress={this._onBackPress}>
            <Image source={require('../../../assets/images/icons/back.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </TouchableOpacity>
          {_self._getUserMenu()}*/}
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity activeOpacity={0.8} onPress={this._onLogoPress}>
            <Image style={styles.logo} source={require('../../../assets/images/logo-b.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 5, paddingRight: 10, width: 95, justifyContent: 'center', alignItems: 'flex-end' }}>
          <Cart />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 70,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  title: {
    fontFamily: 'brandon',
    fontSize: 16,
  },
  logo: {
    width: 124, height: 28, resizeMode: 'contain'
  },
});

function mapStateToProps(state) { return state }
const DefaultHeader = connect(mapStateToProps)(DefaultHdr);
export { DefaultHeader };


/*
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  nativeEvent,
  Easing,
  Image,
  StyleSheet,
} from 'react-native';

import Cart from '../Cart';

// Let's go

const DefaultHeader = class DefaultHeader extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      // state
    }
  }

  render(){

    return(
        <View style={styles.wrapper}>
          <View style={{flex:1, justifyContent:'center'}}>
            <Image style={styles.logo} source={require('../../../assets/images/logo-b.png')} />
          </View>
          <View style={{padding:10}}>
            <Cart />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper:{
    flex:1,
    maxHeight: 80,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingTop:20,
  },
  logo:{
    width:124, height:28, resizeMode:'contain', marginLeft:20,
  },
});

export { DefaultHeader };*/