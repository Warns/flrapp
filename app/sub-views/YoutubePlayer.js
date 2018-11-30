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
import { VideosList } from 'root/app/components';

class YoutubePlayer extends React.Component {

  state = {
    selected: 0,
    userAction: false,
    headerTitle: 'KAPAT',
  }

  _onVideoPress = (index, item) => {
    this.setState({ selected: index, userAction: true });
  }

  render() {

    let { items, selected = 0 } = this.props;

    let _selected = this.state.userAction ? this.state.selected : selected;
    let { videoId = '', text = '' } = items[_selected] || {};
    let _videoId = videoId.indexOf('&') > 0 ? videoId.substring(0, videoId.indexOf('&')) : videoId;

    let videoSource = items.length > 0 ? { uri: "https://www.youtube.com/embed/" + _videoId + "?rel=0&autoplay=0&showinfo=0&controls=1" } : null;

    let _videos = items.length > 1 ? <View><Text style={[styles.sectionHeader, { marginLeft: 20, marginBottom: 15, }]}>İLGİLİ VİDEOLAR</Text><VideosList items={items} callback={this._onVideoPress} /></View> : null;

    text = text != '' ? <Text style={{ fontSize: 18, marginLeft: 20, marginRight: 20, marginBottom: 50, }}>{text}</Text> : null;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, height: Dimensions.get('window').width * .65, maxHeight: Dimensions.get('window').width * .65, backgroundColor: '#dddddd', }}>
            <WebView
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              source={videoSource}
            />
          </View>
          <View style={{ flex: 1, paddingTop: 10 }}>
            {text}
            {_videos}
          </View>
        </ScrollView>
      </View>
    )
  }
}

// filter state
function mapStateToProps(state) { return state.general; }
export default connect(mapStateToProps)(YoutubePlayer);


const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'Bold',
  }
});