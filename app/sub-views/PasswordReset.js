import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { FORMDATA } from 'root/app/helper/Constant';
import { DefaultButton } from 'root/app/UI';

const Utils = require('root/app/helper/Global.js');
const globals = require('root/app/globals.js');

class PasswordReset extends React.Component{
  
  state = {
    email:null,
    message: '',
    sent: true,
  };

  _onBackPress = ()=>{
    this.props.navigation.goBack();
  }

  _onSubmit = ( obj )=>{
    this.setState({
      email: obj.data.email,
      message: '',
      sent: false,
    });

    globals.fetch(
      "https://www.flormar.com.tr/webapi/v3/User/recoverPassword",
      JSON.stringify({
        "email": obj.data.email
      }),
      this._fetchResultHandler
    );
  }

  _fetchResultHandler = ( answer )=>{
    
    if(answer.status == 200){
      this.setState({sent: true})
    }else{
      this.setState({message: "Hata oluştu, lütfen tekrar dene!"})
    }
  }

  _Continue = ()=>{
    this.props.navigation.navigate("Home");
  }

  render(){
    let { message, sent, email } = this.state;
    let formData = FORMDATA['optin_resetpassword'];
        formData.fields[0].items[0].value = this.props.optin.email;

    let error = message == '' ? null : <Text style={{color: '#FF2B94', marginTop:10, fontSize:15}}>{message}</Text>;

    let form = sent ? (
        <View style={{flex:1}}>
          <View style={{padding:40, paddingBottom:20, paddingTop:20}}>
              <Text style={{color: '#000000', lineHeight:18, fontSize:15, marginBottom:30}}>Şifreni değiştirme linki {email} adresine gönderildi. Lütfen email adresini kontrol et.</Text>
              <DefaultButton callback={()=> this.setState({sent:false})} name="TEKRAR DENE" boxColor="#ffffff" textColor="#000000" borderColor="#cccccc" />
              <View style={{ height:10 }}></View>
              <DefaultButton callback={this._Continue} name="DEVAM ET" boxColor="#000000" textColor="#ffffff" borderColor="#000000" />
          </View>
        </View>
      ) : (
        <View style={{flex:1}}>
          <View style={{padding:40, paddingBottom:20, paddingTop:20}}>
            <Text style={{color: '#000000', lineHeight:18, fontSize:15}}>Üyelikte kullandığın Email adresini yaz.</Text>
            {error}
            </View>
          <Form callback={this._onSubmit} data={formData} />
        </View>
      );

    return(
      <SafeAreaView style={{flex:1}}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        
          {form}
        
      </SafeAreaView>
    )
  }
}

// filter state
function mapStateToProps(state){
  return state.user;
}

export default connect(mapStateToProps)(PasswordReset);