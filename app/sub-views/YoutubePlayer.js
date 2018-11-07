import React from 'react';
import { 
  View,
  WebView,
  Dimensions,
} from 'react-native';

import { MinimalHeader } from 'root/app/components';

export default class PhoneConfirmation extends React.Component{

  _onBackPress = ()=>{
    this.props.navigation.navigate('Phone');
  }

  _onSubmit = ( obj )=>{
    console.log(obj.data.mobilePhone.replace(/\)/g, '').replace(/\(/g, '').replace(/\ /g, '').substr(1) );
    this._Continue();
  }

  _Continue = ()=>{
    this.props.navigation.navigate('Email');
  }

  render(){

    return(
      <View style={{flex:1}}>
        <MinimalHeader title="" right={<View />} />
        <WebView
            style={{flex:1, width:'100%', maxHeight:Dimensions.get('window').width * .65}}
            javaScriptEnabled={true}
            source={{uri: 'https://www.youtube.com/embed/ZZ5LpwO-An4?rel=0&autoplay=0&showinfo=0&controls=1'}}
        />
      </View>
    )
  }
}