import React from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { FORMDATA } from 'root/app/helper/Constant';
import { connect } from 'react-redux';

const Utils = require('root/app/helper/Global.js');

class Signup extends React.Component{
  
  state = {
    mobileNumber: '',
    verificationNumber: '',
  };

  _onBackPress = ()=>{
    this.props.navigation.goBack();
  }

  _onSubmit = ( obj )=>{

  }

  _Continue = ()=>{
    
  }

  render(){

    let formData = FORMDATA['optin_phone'];
        formData.fields[0].items[0].value = this.props.optin.phone_formatted;

    return(
      <SafeAreaView style={{flex:1}}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text style={{color: '#000000', lineHeight:18, fontSize:15}}>{'Coding signup... 👨‍💻'}</Text>
        </View>
      </SafeAreaView>
    )
  }
}

// filter state
function mapStateToProps(state){
  return state.user;
}

export default connect(mapStateToProps)(Signup);