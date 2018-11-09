import React from 'react';
import { 
  View,
  WebView,
  Dimensions,
  Modal,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader, VideosList } from 'root/app/components';

import {
  UPDATE_PRODUCT_VIDEOS,
} from 'root/app/helper/Constant';

class YoutubePlayer extends React.Component{

  state = {
    selected: 0,
  }

  _onClose = ()=>{
    this.props.dispatch({type:UPDATE_PRODUCT_VIDEOS, value:{visibility:false, items:[], selected:0}});
  }

  _renderVideos = () =>{

    let { items, selected = 0 } = this.props.video,
        {videoId = '', text = ''} = items[selected] || {}

    let videoSource = items.length > 0 ? {uri: "https://www.youtube.com/embed/" + videoId + "?rel=0&autoplay=0&showinfo=0&controls=1"} : null;

    let _videos = items.length > 1 ? <VideosList items={items} /> : null;

    return(
    <View style={{flex:1}}>
      <MinimalHeader onPress={this._onClose} title="KAPAT" right={<View />} />
        <WebView
              style={{flex:1, width:'100%', maxHeight:Dimensions.get('window').width * .65, backgroundColor:'#dddddd', borderWidth:1, borderColor:'#dddddd'}}
              javaScriptEnabled={true}
              source={ videoSource }
        />
        
        <Text>{text}</Text>
        {_videos}
    </View>
    )
  }

  render(){

    return(
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.props.video.visibility}
      >
        {this._renderVideos()}
      </Modal>
    )
  }
}

/*
{
"videoId": "pl92KOsacOc",
"provider": "youtube",
"thumbnail": "/UPLOAD/BtonzMakyaj_650x365.png",
"text": "Bronz Tene Yaz Akşamı Makyajı"
}
*/

// filter state
function mapStateToProps(state){ return state.general; }
export default connect(mapStateToProps)(YoutubePlayer);