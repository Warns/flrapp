
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

import { SHOW_MENU } from 'root/app/helper/Constant';

// Let's go

class DefaultHdr extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // state
    }
  }

  _onBackPress = () => {
    //this.props.nav.goBack();
  }

  _onUserMenuPress = () => {
    this.props.dispatch({ type: SHOW_MENU, value: { direction: 'left', type: 'user' } });
  }

  _getUserMenu = () => {
    const _self = this,
      { user = {} } = _self.props,
      { firstName = '', gender = 'E' } = user,
      ico = gender == 'E' ? 'userMen' : 'userWomen';

    if (firstName != '') {

      return (
        <TouchableOpacity style={{ padding: 5, paddingRight: 0 }} onPress={this._onUserMenuPress}>
          <Image
            style={{ width: 40, height: 40 }}
            source={ICONS[ico]}
          />
        </TouchableOpacity>
      );
    } else
      return null;
  }

  render() {
    const _self = this;
    //console.log( this.props );

    return (
      <View style={styles.wrapper}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity style={{ padding: 5, paddingRight: 0 }} onPress={this._onBackPress}>
            <Image source={require('../../../assets/images/icons/back.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </TouchableOpacity>
          {_self._getUserMenu()}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={styles.logo} source={require('../../../assets/images/logo-b.png')} />
          </View>
          <View style={{ padding: 5, paddingRight: 10 }}>
            <Cart />
          </View>
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