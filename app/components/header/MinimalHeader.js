
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
import { connect } from 'react-redux';
import Cart from '../Cart';

// Let's go

class MinimalHdr extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // state
    }
  }

  _onBackPress = () => {
    this.props.onPress();
    //this.props.nav.goBack();
  }

  render() {

    let { progress, right } = this.props;
    let { topMargin, window } = this.props.general.SCREEN_DIMENSIONS;

    let _right = right ? right : <Cart />;
    let _wrapperStyle = this.props.noMargin ? styles.wrapper : { height: 60 + topMargin, paddingTop: topMargin, backgroundColor: '#ffffff' };

    let _progressBar = progress ? (
      <View style={{ height: 5, backgroundColor: '#dcdcdc', position: 'relative' }}>
        <View style={{ height: 5, width: (window.width * eval(progress)), backgroundColor: '#FF2B94' }}></View>
        <View style={{ position: 'absolute', left: '50%', top: -40, height: 20, width: 50, marginLeft: -25, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>{progress}</Text>
        </View>
      </View>
    ) : null;

    return (
      <View>
        <View style={[_wrapperStyle, {...this.props.wrapperStyle}]}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={this._onBackPress}>
              <Image source={require('../../../assets/images/icons/back.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.title}>{this.props.title.toUpperCase()}</Text>
            </View>
            <View style={{ paddingRight: 10, justifyContent: 'center' }}>
              {_right}
            </View>
          </View>
        </View>
        {_progressBar}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontFamily: 'brandon',
    fontSize: 15,
    //lineHeight:17,
  }
});

function mapStateToProps(state) { return state }
const MinimalHeader = connect(mapStateToProps)(MinimalHdr);
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