import React, { Component } from 'react';
import {
  View,
  Modal,
  KeyboardAvoidingView,
  WebView,
} from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader, } from 'root/app/components';
import {
  SHOW_CUSTOM_POPUP,
  SET_VIEWER,
  SET_FORM,
  SET_VIDEO_PLAYER,
  FORMDATA,
  SET_INSTAGRAM,
  SET_WEBVIEW,
  ORDER_LIST_CLICKED,
} from 'root/app/helper/Constant';
import {
  Viewer,
  InstagramDetail,
  OrderViewer,
} from 'root/app/viewer/';
import { Form } from 'root/app/form';
import YoutubePlayer from 'root/app/sub-views/YoutubePlayer';

/*

const data = {
                        "title": "KULLANICI SÖZLEŞMESİ",
                        "type": "webViewer",
                        "uri": {
                            "key": "user",
                            "subKey": "getAgreement"
                        },
                        "keys": {
                            "arr": "agreementHtml"
                        }
                    };

store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: true, type: SET_VIEWER, data: data } });


const form = {
  "type": "SET_FORM",
  "itemType": "changePassword"
}

store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: true, type: SET_FORM, data: form } });


const video = { 
  visibility: true, 
  type: SET_VIDEO_PLAYER, 
  data: {
    selected: 0,
    items: [
        {
            "provider": "youtube",
            "text": "text",
            "thumbnail": "thumbnail",
            "videoId": '"videoId"',
        }
    ]
  } 
};

store.dispatch({ type: SHOW_CUSTOM_POPUP, value: video });


*/

class CustomModals extends Component {

  constructor(props) {
    super(props);
  }

  _onClose = () => {
    const _self = this;
    _self.props.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: false, data: {}, type: '', itemType: '', refreshing: '' } });
  }

  _formCallback = ({ type, data }) => {
    const _self = this,
      { refreshing = false } = _self.props.customModal;

    if (refreshing)
      refreshing();

    setTimeout(() => {
      _self._onClose();
    }, 100);
  }

  _getViewer = () => {
    const _self = this,
      { type, itemType, data = {}, postData = {}, modalTitle = 'KAPAT' } = _self.props.customModal;

    let view = null;
    if (type == ORDER_LIST_CLICKED)
      view = <OrderViewer data={data} />;
    else if (type == SET_VIEWER)
      view = <Viewer postData={postData} config={data} />;
    else if (type == SET_FORM)
      view = (<KeyboardAvoidingView
        behavior={"padding"}
        pointerEvents="box-none"
        style={{
          flex: 1
        }}
      >
        <Form callback={_self._formCallback} postData={postData} data={FORMDATA[itemType]} />
      </KeyboardAvoidingView>);
    else if (type == SET_VIDEO_PLAYER) {
      const { items = [], selected = 0 } = data;
      view = <YoutubePlayer items={items} selected={selected} />;
    } else if (type == SET_INSTAGRAM)
      view = <InstagramDetail data={data} />;
    else if (type == SET_WEBVIEW)
      view = (
        <WebView
          scalesPageToFit={false}
          automaticallyAdjustContentInsets={false}
          source={{ uri: data.url || '' }}
        />
      );



    return (
      <View style={{ flex: 1 }}>
        <MinimalHeader onPress={this._onClose} title={modalTitle} right={<View />} />
        {view}
      </View>
    );
  }

  render() {
    const _self = this;
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={_self.props.customModal.visibility}
        onRequestClose={() => { }}
      >
        {_self._getViewer()}
      </Modal>
    )
  }
}

function mapStateToProps(state) { return state.general; }
const CustomModal = connect(mapStateToProps)(CustomModals);
export { CustomModal }