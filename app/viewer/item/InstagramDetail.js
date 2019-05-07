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
    SHOW_CUSTOM_POPUP, 
    OPEN_PRODUCT_DETAILS,
} from 'root/app/helper/Constant';
import YoutubePlayer from 'root/app/sub-views/YoutubePlayer';
import {
    HorizontalProducts,
} from 'root/app/components';
import { store } from 'root/app/store';

const Translation = require('root/app/helper/Translation.js');
const Utils = require('root/app/helper/Global.js');

class InstagramDetail extends Component {
    constructor(props) {
        super(props);
    }

    /* 
    
        {
        "caption": "%d9%85%d8%b3%d8%a7%d8%a1+%d8%a7%d9%84%d9%81%d9%84+%d9%8a%d8%a7+%d8%a8%d9%86%d8%a7%d8%aa+%e2%9d%a4%ef%b8%8f%0a.%0a.%0a.%0a%f0%9f%8c%b8%d8%a7%d9%84%d9%84%d9%89+%d9%8a%d8%b4%d9%88%d9%81+%d8%a7%d9%84%d8%a8%d9%88%d8%b3%d8%aa+%d9%8a%d8%b9%d9%85%d9%84+%d9%84%d8%a7%d9%8a%d9%83+%d8%b9%d8%b4%d8%a7%d9%86+%d9%8a%d9%88%d8%b5%d9%84+%d9%84%d8%a7%d9%83%d8%a8%d8%b1+%d8%b9%d8%af%d8%af+%e2%9d%a4%ef%b8%8f%0a.%0a.%0a.%0a%f0%9f%8c%b8%d8%b1%d9%8a%d9%81%d9%8a%d9%88+%d8%a7%d9%84%d9%86%d9%87%d8%a7%d8%b1%d8%af%d9%87+%d8%b9%d9%86+%d9%83%d9%88%d9%86%d8%b3%d9%8a%d9%84%d8%b1+perfect+coverage+%d9%85%d9%86+%d9%81%d9%84%d9%88%d8%b1%d9%85%d8%a7%d8%b1+.%0a.%0a.%0a%f0%9f%8c%b8%d9%81%d9%84%d9%88%d8%b1%d9%85%d8%a7%d8%b1+%d9%85%d9%86+%d8%a7%d9%84%d8%a8%d8%b1%d8%a7%d9%86%d8%af%d8%a7%d8%aa+%d8%a7%d9%84%d9%85%d8%ad%d8%aa%d8%b1%d9%85%d9%87+%d8%b5%d9%86%d8%a7%d8%b9%d9%87+%d8%aa%d8%b1%d9%83%d9%89+%d9%88%d9%85%d8%aa%d9%88%d9%81%d8%b1%d9%87+%d9%81%d9%89+%d9%83%d9%84+%d8%a7%d9%84%d8%a8%d9%84%d8%af%d8%a7%d9%86+%d9%88%d8%a7%d8%b3%d8%b9%d8%a7%d8%b1%d9%87%d8%a7+%d9%85%d9%86%d8%a7%d8%b3%d8%a8%d9%87+.%0a.%0a.%0a%f0%9f%8c%b8%d8%a7%d9%84%d9%83%d9%88%d9%86%d8%b3%d9%8a%d9%84%d8%b1+%d8%af%d9%87+%d8%a8%d8%ac%d8%af+%d8%b1%d9%88%d8%b9%d9%87+%d8%a7%d9%88%d9%84%d8%a7+%d8%a7%d9%84%d8%aa%d8%ba%d8%b7%d9%8a%d9%87+%d9%85%d9%86+%d9%85%d8%aa%d9%88%d8%b3%d8%b7%d9%87+%d9%84%d8%b9%d8%a7%d9%84%d9%8a%d9%87+.%0a.%0a.%0a%f0%9f%8c%b8%d9%86%d8%a7%d8%b9%d9%85+%d8%ac%d8%af%d8%a7+%d8%aa%d8%ad%d8%aa+%d8%a7%d9%84%d8%b9%d9%8a%d9%86+%d8%a8%d9%8a%d8%aa%d9%81%d8%b1%d8%af+%d8%a8%d8%b3%d9%87%d9%88%d9%84%d9%87+.%0a.%0a.%0a%f0%9f%8c%b8%d9%85%d8%b4+%d8%a8%d9%8a%d9%86%d8%b4%d9%81+%d8%aa%d8%ad%d8%aa+%d8%a7%d9%84%d8%b9%d9%8a%d9%86+%d9%88%d9%81%d9%89+%d9%86%d9%81%d8%b3+%d8%a7%d9%84%d9%88%d9%82%d8%aa+%d9%85%d8%b4+%d9%8a%d9%8a%d8%af%d8%ae%d9%84+%d9%81%d9%89+%d8%a7%d9%84%d8%ae%d8%b7%d9%88%d8%b7+.%0a.%0a.%0a%f0%9f%8c%b8%d9%84%d9%88+%d8%b9%d8%a7%d9%8a%d8%b2%d9%8a%d9%86+%d8%aa%d8%ba%d8%b7%d9%8a%d9%87+%d8%b9%d8%a7%d9%84%d9%8a%d9%87+%d8%a7%d9%81%d8%b1%d8%af%d9%88%d9%87+%d8%aa%d8%ad%d8%aa+%d8%a7%d9%84%d8%b9%d9%8a%d9%86+%d9%88%d8%b3%d9%8a%d8%a8%d9%88%d9%87+%d8%af%d9%82%d9%8a%d9%82%d9%8a%d9%87+.%0a.%0a.%0a%f0%9f%8c%b8%d8%a7%d9%86%d8%b5%d8%ad%d9%83%d9%85+%d8%a8%d9%8a%d9%87+%d8%ac%d8%af%d8%a7%d8%a7%d8%a7%d8%a7%d8%a7+%d9%88%d8%aa%d9%82%d9%8a%d9%8a%d9%85%d9%89+%d9%84%d9%8a%d9%87+%d9%a1%d9%a0%2f%d9%a1%d9%a0+%d8%af%d8%b1%d8%ac%d8%aa%d9%89+04.%0a.%0a.%0a%f0%9f%8c%b8%d8%b3%d8%b9%d8%b1%d9%87+%d9%83%d8%a7%d9%86+%d9%a2%d9%a1+%d8%b1%d9%8a%d8%a7%d9%84+%d9%81%d9%89+%d8%a7%d9%84%d8%aa%d8%ae%d9%81%d9%8a%d8%b6%d8%a7%d8%aa+%d9%85%d9%86+%40lifestylegulf+.%0a.%0a.%0a%40flormarturkiye+%40flormar.egy+%40flormar.arabia+.%0a.%0a.%0a%23concealer+%23flormar+%23beauty+%23beautybloggers+%23%d8%a8%d9%86%d8%a7%d8%aa+%23%d8%b9%d9%86%d8%a7%d9%8a%d9%87+%23jeddah+%23makkah+%23egypt",
        "comments": "27",
        "id": "a00e51eed49fb87552ce1dd9207a7ad18f3d4da2",
        "likes": "209",
        "media_type": "image",
        "profile_pic": "https://instagram.fist2-3.fna.fbcdn.net/vp/2b1b5e2fc6693fb4e0e09dfe17209a5a/5D384AC5/t51.2885-19/s150x150/31136818_210362722899719_3864997484342280192_n.jpg?_nc_ht=instagram.fist2-3.fna.fbcdn.net",
        "shortcode": "BwSsj_aBdMf",
        "url": "https://instagram.fist2-3.fna.fbcdn.net/vp/3abfb0ffc94d98cdb86b00ff9623eb89/5D38C908/t51.2885-15/sh0.08/e35/p640x640/55945329_799413713747789_3884845009539146245_n.jpg?_nc_ht=instagram.fist2-3.fna.fbcdn.net",
        "username": "dee.blog90",
        }
    
    */

    _getHead = () => {
        const _self = this,
            { video = '', url = '' } = _self.props.data,
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
                    "thumbnail": url,
                    "videoId": video
                }
            ];
            view = <YoutubePlayer items={items} selected={0} />;
        }
        else if (url != '')
            view = (
                <Image
                    style={{ height: 300, resizeMode: 'cover' }}
                    source={{ uri: url }}
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
            { username = '', caption = '', likes, profile_pic } = _self.props.data;

        if (caption == '')
            return null;

        return (
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <View style={{ height: 36, width: 36, borderRadius: 36, overflow: 'hidden' }}>
                    <Image
                        style={{ height: 36, width: 36 }}
                        source={{ uri: profile_pic }}
                    />
                </View>
                <View style={{ flex: 1, paddingLeft: 9 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'RegularTyp2' }}>{username}</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'RegularTyp2', color: 'rgb(108, 108, 108)', marginBottom: 10 }}>{decodeURIComponent(caption)}</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'RegularTyp2' }}>{likes}{' Likes'}</Text>
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

    _changeProduct = (id) => {
        store.dispatch({ type: SHOW_CUSTOM_POPUP, value: { visibility: false, data: {}, type: '', itemType: '' } });
        store.dispatch({ type: OPEN_PRODUCT_DETAILS, value: { id: id, measurements: {}, animate: false, sequence: 0 } });
    }

    _getProducts = () => {
        let _self = this,
            view = null,
            { productIds = '' } = _self.props.data,
            products = Utils.getPrdCodeToArr(productIds);
        if (products.length > 0)
            view = (
                <View style={{ marginTop: 30, marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'Bold', fontSize: 16, marginBottom: 20, marginLeft: 20 }}>İLGİLİ ÜRÜNLER</Text>
                    <HorizontalProducts items={products} onPress={this._changeProduct} />
                </View>
            );

        return view;
    }

    render() {
        const _self = this;
        return (
            <ScrollView style={{ flex: 1 }}>
                {_self._getHead()}
                {_self._getBody()}
                {_self._getProducts()}
            </ScrollView>
        );
    }
}

export { InstagramDetail };