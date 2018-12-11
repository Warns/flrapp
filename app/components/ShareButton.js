import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Share
} from 'react-native';
import { ICONS } from "root/app/helper/Constant";

class ShareButton extends Component {
    constructor(props) {
        super(props);
    }

    /* https://medium.com/bam-tech/sharing-content-with-react-native-e92c591c7c38 */
    _onPress = () => {
        const _self = this,
            { message = '', url = '', title = '', dialogTitle = 'Paylaş' } = _self.props;
        Share.share(
            {
                message: message,
                url: url,
                title: title
            },
            {
                // Android only:
                dialogTitle: dialogTitle,
                // iOS only:
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.PostToTwitter'
                ]
            }
        );
    }

    _getView = () => {
        const _self = this,
            { url = '' } = _self.props;
        let view = null;
        if (url != '')
            view = (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[{
                        flexDirection: "row",
                        alignItems: "center"
                    }, { ..._self.props.style }]}
                    onPress={_self._onPress}>
                    <Text style={{ fontFamily: 'Regular', fontSize: 12, textDecorationLine: 'underline', color: 'rgb(130, 130, 130)' }}>{'Paylaş'}</Text>
                </TouchableOpacity>
            );

        return view;
    }

    render() {
        const _self = this;
        return _self._getView();
    }
}

export { ShareButton };