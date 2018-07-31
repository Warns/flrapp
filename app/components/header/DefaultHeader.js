
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

export { DefaultHeader };