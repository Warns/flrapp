
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

const MinimalHeader = class DefaultHeader extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      // state
    }
  }

  _onBackPress = () => {
    this.props.onPress();
    //this.props.nav.goBack();
  }

  render(){

    let right = this.props.right ? this.props.right : <Cart />;

    //console.log( this.props );

    return(
        <View style={styles.wrapper}>
          <View style={{flex:1, flexDirection:'row'}}>
            <TouchableOpacity style={{padding:5, paddingRight:0}} onPress={this._onBackPress}>
              <Image source={require('../../../assets/images/icons/back.png')} style={{width:40, height:40, resizeMode:'contain'}} />
            </TouchableOpacity>
            <View style={{flex:1, justifyContent:'center'}}>
              <Text style={styles.title}>{this.props.title.toUpperCase()}</Text>
            </View>
            <View style={{padding:5, paddingRight:10, justifyContent:'center'}}>
              {right}
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper:{
    height: 70,
    backgroundColor: '#FFFFFF',
    paddingTop:20,
  },
  title:{
    fontFamily:'brandon',
    fontSize:16,
  }
});

export { MinimalHeader };

/*
class Head extends React.Component{
  render(){
    const { state } = this.props;
    let output = null;
    if(state.params)
    {
      if(state.params.isPinned)
        output = <Text style={styles.mainColor}>9 pinned tickets</Text>;
      else {
        output = <Text style={styles.lightColor}>17 active tickets</Text>
      }
    }
    else {
      output = <Text style={styles.lightColor}>17 active tickets</Text>
    }

    return(
      <View>
      {output}
      </View>
    );
  }
*/