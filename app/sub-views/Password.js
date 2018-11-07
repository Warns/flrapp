import React from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { 
  FORMDATA,
  SET_USER } from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { DefaultButton } from 'root/app/UI';

const Utils = require('root/app/helper/Global.js');
const globals = require('root/app/globals.js');

class Password extends React.Component{
  
  state = {
    password: null,
    message: '',
  };

  _onBackPress = ()=>{
    this.props.navigation.navigate('Email');
    this.props.dispatch({type:'UPDATE_OPTIN', value:{emos: null}});
  }

  _onSubmit = ( obj )=>{
    let { email } = this.props.optin;

    this.setState({
      password: obj.data.password,
      message: '',
    });

    globals.fetch(
      "https://www.flormar.com.tr/webapi/v3/User/login",
      JSON.stringify({
        "email": email,
        "password": obj.data.password,

      }),
      this._fetchResultHandler
    );
  }

  _fetchResultHandler = ( answer )=>{

    console.log( answer );

    if(answer.status == 200){

      this._Continue( answer.data )

    }else{
      this.setState({message: "Hatalı şifre, lütfen kontrol et."});
    }
  }

  _Continue = ( data )=>{
    let _self = this;
    this.props.dispatch({type:SET_USER, value:{ user: data || {} }});
    setTimeout(()=>{
      _self.props.navigation.navigate("Home");
    }, 10);
  }

  _onResetPressed = ()=>{
    let { email } = this.state;

    this.props.dispatch({type:'UPDATE_OPTIN', value:{ email: email }});
    this.props.navigation.navigate('PasswordReset');
  }

  render(){
    let { message } = this.state;
    let error = message == '' ? <Text style={{color: '#000000', lineHeight:18, fontSize:15}}>şifreni gir.</Text> : <Text style={{color: '#FF2B94', fontSize:15}}>{message}</Text>;
    let resetPassword = message == '' ? null : <DefaultButton callback={this._onResetPressed} name="ŞİFREMİ UNUTTUM" boxColor="#ffffff" textColor="#000000" borderColor="rgba(0,0,0,0)" />;

    return(
      <SafeAreaView style={{flex:1}}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <View style={{flex:1}}>
          <View style={{padding:40, paddingBottom:20, paddingTop:20}}>
          <Text style={{fontFamily:'Bold', fontSize:20}}>EVET. SON ADIM!</Text>
          {error}
          </View>
          <Form callback={this._onSubmit} data={FORMDATA['optin_password']} />
          {resetPassword}
        </View>
      </SafeAreaView>
    )
  }
}

// filter state
function mapStateToProps(state){
  return state.user;
}

export default connect(mapStateToProps)(Password);