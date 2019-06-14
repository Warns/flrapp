
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

const SplashHeader = class SplashHeader extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      // state
    }
  }

  _onPress = () => {
      this.props.onCloseLogin();
  }

  render(){

    return(
        <View style={styles.wrapper}>
          <View style={{flex:1}}>
          <TouchableOpacity onPress={this._onPress}>
            <Text>Back</Text>
          </TouchableOpacity>
          </View>
          <View style={{padding:10}}>
            <Text>Yeni Üyelik</Text>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper:{
    flex:1,
    maxHeight: 80,
    flexDirection: 'row',
    paddingTop:20,
  },
  logo:{
    width:124, height:28, resizeMode:'contain', marginLeft:20,
  },
});

export { SplashHeader };