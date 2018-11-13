import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { connect } from 'react-redux';
import { Viewer, OrderViewer } from 'root/app/viewer';
import { ORDER_LIST_CLICKED, SET_FORM, FORMDATA, SET_VIEWER } from 'root/app/helper/Constant';
import { Form } from 'root/app/form';

class ExtraDetail extends Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params.title,
        };
    };

    _getParams = () => {
        const { navigation } = this.props,
            obj = navigation.state.params;
        return obj;
    }

    _callback = ({ type, data }) => {
        const _self = this,
            { navigation = {} } = _self.props,
            { params = {} } = navigation.state || {},
            { refreshing } = params;

        if (refreshing)
            refreshing();

        if (navigation)
            navigation.goBack();
    }

    _getContent = () => {
        const _self = this,
            obj = _self._getParams(),
            { type, data = {} } = obj,
            { itemType, postData = {} } = data;

        switch (type) {
            case ORDER_LIST_CLICKED:
                return <OrderViewer data={obj} />;
            case SET_FORM:
                return <Form callback={_self._callback} postData={postData} data={FORMDATA[itemType]} />;
            case SET_VIEWER:
                return <Viewer postData={postData} config={data} />;
            default:
                return null;
        }
    }

    render() {
        const _self = this;
        return _self._getContent();
    }
}

function mapStateToProps(state) { return state }
const ExtraPageDetail = connect(mapStateToProps)(ExtraDetail);
export { ExtraPageDetail }

