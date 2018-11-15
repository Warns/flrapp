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
  SET_FORM,
  FORMDATA
} from 'root/app/helper/Constant';
import { Viewer } from 'root/app/viewer/';
import { Form } from 'root/app/form';

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


*/

class CustomModals extends Component {

  constructor(props) {
    super(props);
  }

  _onClose = () => {
    this.props.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: false, data: {}, type: '', itemType: '' } });
  }

  _getViewer = () => {
    const _self = this,
      { type, itemType, data = {}, postData = {}, modalTitle = 'KAPAT' } = _self.props.customModal;

    let view = null;
    if (type == SET_VIEWER)
      view = <Viewer postData={postData} config={data} />;
    else if (type == SET_FORM)
      view = <Form callback={_self._callback} postData={postData} data={FORMDATA[itemType]} />;

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
      >
        {_self._getViewer()}
      </Modal>
    )
  }
}

function mapStateToProps(state) { return state.general; }
const CustomModal = connect(mapStateToProps)(CustomModals);
export { CustomModal }