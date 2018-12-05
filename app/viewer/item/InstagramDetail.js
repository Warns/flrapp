import React, { Component } from 'react';
import {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    Image,
    Linking
} from 'react-native';
import {
    ICONS,
} from 'root/app/helper/Constant';
import YoutubePlayer from 'root/app/sub-views/YoutubePlayer';

const Translation = require('root/app/helper/Translation.js');

class InstagramDetail extends Component {
    constructor(props) {
        super(props);
    }

    _getHead = () => {
        const _self = this,
            { video = '', image_link = '' } = _self.props.data,
            icons = (
                <Image
                    style={{ width: 40, height: 40, position: 'absolute', bottom: 10, right: 10 }}
                    source={ICONS['feedInstagram']}
                />
            );

        let view = null;
        if (video != '') {
            const items = [
                {
                    "provider": "youtube",
                    "text": '',
                    "thumbnail": image_link,
                    "videoId": video
                }
            ];
            view = <YoutubePlayer items={items} selected={0} />;
        }
        else if (image_link != '')
            view = (
                <Image
                    style={{ height: 300 }}
                    source={{ uri: image_link }}
                />
            );

        return (
            <View>
                {view}
                {icons}
            </View>
        );
    }

    _onPress = () => {
        const _self = this,
            { link = '' } = _self.props.data;
        Linking.openURL(link);
    }

    _getLink = () => {
        let view = null;

        const _self = this,
            { link = '' } = _self.props.data,
            desc = Translation['feeds']['instagramDetail'] || '';

        if (link != '')
            view = (
                <TouchableOpacity onPress={_self._onPress} style={{ marginBottom: 10, alignItems: 'center', flexDirection: 'row', height: 50, borderColor: '#dcdcdc', borderBottomWidth: 1, }}>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontFamily: 'RegularTyp2', fontWeight: '500' }}>{desc}</Text>
                    </View>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={ICONS['rightArrow']}
                    />
                </TouchableOpacity>
            );
        return view;
    }

    _getDsc = () => {
        const _self = this,
            { user_name = '', description = '', count, user_image } = _self.props.data;

        if (description == '')
            return null;

        return (
            <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                <View style={{ height: 36, width: 36, borderRadius: 36, overflow: 'hidden' }}>
                    <Image
                        style={{ height: 36, width: 36 }}
                        source={{ uri: user_image }}
                    />
                </View>
                <View style={{ flex: 1, paddingLeft: 9 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'RegularTyp2' }}>{user_name}</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'RegularTyp2', color: 'rgb(108, 108, 108)', marginBottom: 10 }}>{description}</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'RegularTyp2' }}>{count}{' Likes'}</Text>
                </View>
            </View>
        );
    }

    _getBody = () => {
        const _self = this;
        return (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                {_self._getLink()}
                {_self._getDsc()}
            </View>
        );
    }

    render() {
        const _self = this;
        return (
            <ScrollView style={{ flex: 1 }}>
                {_self._getHead()}
                {_self._getBody()}
            </ScrollView>
        );
    }
}

export { InstagramDetail };