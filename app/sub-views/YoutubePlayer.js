import React from 'react';
import { 
  View,
  WebView,
  Dimensions,
  Modal,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader, VideosList } from 'root/app/components';

import {
  OPEN_VIDEO_PLAYER,
} from 'root/app/helper/Constant';

class YoutubePlayer extends React.Component{

  state = {
    selected: 0,
    userAction: false,
    headerTitle: 'KAPAT',
  }

  _onClose = ()=>{
    this.props.dispatch({type:OPEN_VIDEO_PLAYER, value:{visibility:false, items:[], selected:0}});
  }

  _onVideoPress = (index, item) =>{
    this.setState({selected: index, userAction:true});
  }

  _renderVideos = () =>{

    let { items, selected = 0 } = this.props.video;

    //console.log('sakfhsdkjghfs', selected, this.props.video.visibility);


    let _selected = this.state.userAction ? this.state.selected : selected;
    let {videoId = '', text = ''} = items[_selected] || {};
    let _videoId = videoId.indexOf('&') > 0 ? videoId.substring(0, videoId.indexOf('&')) : videoId;

    let videoSource = items.length > 0 ? {uri: "https://www.youtube.com/embed/" + _videoId + "?rel=0&autoplay=0&showinfo=0&controls=1"} : null;

    let _videos = items.length > 1 ? <View><Text style={[styles.sectionHeader, {marginLeft:20, marginBottom:15,}]}>İLGİLİ VİDEOLAR</Text><VideosList items={items} callback={this._onVideoPress} /></View> : null;

    let _title = this.props.product.item ? this.props.product.item.productName : this.state.headerTitle;

    return(
    <View style={{flex:1}}>
      <MinimalHeader onPress={this._onClose} title={_title} right={<View />} />
        <ScrollView style={{flex:1}}>
        <View style={{flex:1, height:Dimensions.get('window').width * .65, maxHeight:Dimensions.get('window').width * .65, backgroundColor:'#dddddd',}}>
          <WebView
                style={{flex:1}}
                javaScriptEnabled={true}
                source={ videoSource }
          />
        </View>
        <View style={{flex:1, paddingTop:10}}>
        <Text style={{fontSize:18, marginLeft:20, marginRight:20, marginBottom:50, }}>{text}</Text>
        {_videos}
        </View>
        </ScrollView>
    </View>
    )
  }

  render(){

    return(
      <Modal
        animationType='none'
        transparent={false}
        visible={this.props.video.visibility}
      >
        {this._renderVideos()}
      </Modal>
    )
  }
}

// filter state
function mapStateToProps(state){ return state.general; }
export default connect(mapStateToProps)(YoutubePlayer);


const styles = StyleSheet.create({
  sectionHeader:{
    fontSize: 16,
    fontFamily:'Bold',
  }
});