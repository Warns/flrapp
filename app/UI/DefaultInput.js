
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  nativeEvent,
  Easing,
} from 'react-native';

// Let's go

const DefaultInput = class DefaultInput extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      on: false,
      anim: new Animated.Value(15),
      placeholder: "",
      value: "",
      label: "",
    }
  }

  _onPress = () => {
    this.input.focus();
  }

  _onFocus = () => {
    if(this.state.value == "")
    {
      this.setState({ placeholder: "" });
      Animated.timing(
        this.state.anim,
        {
          toValue:7,
          duration:222,
        }
      ).start();
    }
      this.setState({ on: true });
  }

  _onBlur = (evet) => {
    //console.log(this.state.value);
    if(this.state.value === "")
    {
      //console.log("it is black");
      this.setState({placeholder: this.state.label });
      Animated.timing(
        this.state.anim,
        {
          toValue:15,
          duration:222,
        }
      ).start();
      this.setState({ on: false });
    }
  }

  _onChangeText = ( text ) => {
    this.setState({ value: text });
    if( this.props.onChangeText ) this.props.onChangeText( text );
  }

  componentWillMount(){
    this.setState({placeholder: this.props.label, label: this.props.label });
  }

  input = null;

  render(){

    const { on, anim, placeholder } = this.state;
    const topval = on ? 15 : 10;

    const interpolateOpacity = this.state.anim.interpolate({
      inputRange:[7, 15],
      outputRange: [1, 0]
    });

    //console.log(placeholder);

    return(
      <TouchableOpacity activeOpacity={0.7} onPress={this._onPress}>
        <View style={[{overflow:'hidden', paddingBottom:20, marginBottom:10, borderBottomColor:"rgba(255,255,255,.4)", borderBottomWidth:1}]}>
          <Animated.Text style={[{color:"#ffffff", position:'absolute', left:0, top:anim, opacity:interpolateOpacity, fontSize:10}]}>{this.props.label.toUpperCase()}</Animated.Text>
          <TextInput multiline={true} numberOfLines={5} style={{ fontSize:14, minHeight:20, padding:0, margin:0, marginTop:5, height:30, top:topval, color:'#ffffff'}}
          placeholder={placeholder}
          underlineColorAndroid='transparent'
          placeholderTextColor="#ffffff"
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          onChangeText={this._onChangeText}
          ref={(c) => { this.input = c }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export { DefaultInput };