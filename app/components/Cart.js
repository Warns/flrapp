import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Modal,
} from 'react-native';
import{ SecureStore } from 'expo';
import { connect } from 'react-redux';

globals = require('../globals.js');

class Cart extends React.Component{

  state = {
  }

  componentDidMount(){
  }

  render(){

    const bubble = this.props.cartProductsNumber > 0 ?
                    <View style={styles.bubble}>
                      <Text style={styles.bubbleText}>{this.props.cartProductsNumber}</Text>
                    </View> 
                  : null;

    return(
      <View>
        <Image style={{width:40, height:40, resizeMode:'contain'}} source={require('../../assets/images/icons/cart.png')} />
        {bubble}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bubble:{
    backgroundColor:'#FE136F',
    width:20,
    height:20,
    borderRadius:10,
    position: 'absolute',
    left:20,
    top:20,
    borderWidth:1,
    borderColor: '#ffffff',
    justifyContent:'center',
    alignItems:'center',
  },
  bubbleText:{
    color:'#ffff',
    fontSize: 11,
  }
});

// filter state
function mapStateToProps(state){
  return state.cart;
}

export default connect(mapStateToProps)(Cart);
