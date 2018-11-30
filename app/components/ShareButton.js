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

    render() {
        const _self = this;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[{
                    flexDirection: "row",
                    alignItems: "center"
                }, { ..._self.props.style }]}
                onPress={_self._onPress}>
                <Text>{'Paylaş'}</Text>
            </TouchableOpacity>
        );
    }
}

export { ShareButton };