import React, { Component } from 'react';
import {
  View,
  WebView,
  Dimensions,
  Modal,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader, } from 'root/app/components';
import {
  SHOW_CUSTOM_POPUP,
  SET_VIEWER,
} from 'root/app/helper/Constant';
import { Viewer } from 'root/app/viewer/';

class CustomModals extends Component {

  constructor(props) {
    super(props);
  }

  _onClose = () => {
    this.props.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: false, data: {}, type: '' } });
  }

  _getViewer = () => {
    const _self = this,
      { type, data = {}, postData = {} } = _self.props.customModal;

    let view = null;
    if (type == SET_VIEWER)
      view = <Viewer postData={postData} config={data} />;

    return (
      <View style={{ flex: 1 }}>
        <MinimalHeader onPress={this._onClose} title="KAPAT" right={<View />} />
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
      >
        {_self._getViewer()}
      </Modal>
    )
  }
}

function mapStateToProps(state) { return state.general; }
const CustomModal = connect(mapStateToProps)(CustomModals);
export { CustomModal }