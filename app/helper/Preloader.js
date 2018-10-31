
import React, { PureComponent } from 'react';
import { View, Platform, Image, Dimensions, StyleSheet, Modal } from 'react-native';
import { connect } from 'react-redux';


class PreloadIndicator extends React.Component{
    render(){

      //console.log('this is preloader', this.props.preloading )


        return(
          <Modal
            visible={this.props.preloading}
            transparent={true}
          >
            <View style={{flex:1, backgroundColor:'rgba(0,0,0,.05)', alignItems:'center', justifyContent:'center'}}>
              <View style={[styles.circle, {}]}>
                  <Image source={require('../../assets/gifs/goo.gif')} style={{resizeMode:'cover', width:60, height:60, borderRadius:30}} />
              </View>
            </View>
          </Modal>
        );
    }
}


// filter state
function mapStateToProps(state){ return state.general; }
export default connect(mapStateToProps)( PreloadIndicator );


//export { Preloader }

const styles = StyleSheet.create({
    wrapper:{
      width: 60,
      height: 60,
      position: 'absolute',
      ...Platform.select({
        ios:{
          zIndex: 9,
        },
        android:{
          elevation: 999,
        }
      }),
    },
    circle:{
      width:60,
      height:60,
      //borderColor:'rgba(0,0,0,.1)',
      //borderWidth:1,
      borderRadius:25,
      overflow:'hidden',
      ...Platform.select({
        ios:{
          zIndex: 9,
        },
        android:{
          elevation: 999,
        }
      }),
    },
    area:{
      position:'absolute', 
      top:0, 
      left:0, 
      bottom:0, 
      right:0, 
      flex:1, 
      zIndex:1,
    }
  });