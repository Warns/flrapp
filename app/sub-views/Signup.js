import React from 'react';
import { 
  SafeAreaView, 
  Text, 
  ScrollView,
  View, 
  Image,
} from 'react-native';
import { MinimalHeader } from 'root/app/components';
import { Form } from 'root/app/form';
import { FORMDATA, SET_USER, ASSISTANT_SHOW } from 'root/app/helper/Constant';
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

    if(obj.type == 'success'){
      this._Continue( obj.postData )
    }else{
      this.setState({message: obj.data.message});
    }

  }

  _Continue = ( data )=>{
    let _self = this;
    this.props.dispatch({type:SET_USER, value:{ user: data || {} }});
    setTimeout(()=>{
      _self.props.navigation.navigate("Home");
      _self.props.dispatch({ type: ASSISTANT_SHOW, value: true });
    }, 10);
  }

  render(){

    let formData = FORMDATA['optin_signup'];
        //formData.fields[0].items[0].value = this.props.optin.phone_formatted;

    return(
      <SafeAreaView style={{flex:1}}>
        <MinimalHeader title="" right={<View />} onPress={this._onBackPress} />
        <ScrollView 
        keyboardShouldPersistTaps='handled'
        style={{flex:1}}>
          <View style={{alignItems:'center'}}>
            <Image source={require('../../assets/images/seni-taniyalim.png')} style={{ resizeMode: 'contain', width: 200, height: 100 }} />
          </View>
          <Form callback={this._onSubmit} data={formData} scrollEnabled={false} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

// filter state
function mapStateToProps(state){
  return state.user;
}

export default connect(mapStateToProps)(Signup);