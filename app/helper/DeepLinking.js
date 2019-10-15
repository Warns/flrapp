import React from 'react';
import { Platform, Linking } from 'react-native';
import {
    SET_VIDEO_PLAYER,
    OPEN_PRODUCT_DETAILS,
    SHOW_CUSTOM_POPUP,
    SET_VIEWER,
    SET_CATEGORIES,
    SET_SELECTED_CATEGORY,
    NAVIGATE
} from "root/app/helper/Constant";
import { store } from 'root/app/store';

const Utils = require("root/app/helper/Global.js");
const Globals = require("root/app/globals.js");
const routes = {
    _isMounted: true, // api istek yapıldığı için gerekli
    data: [],
    prefix: {
        product: 'product',
        blog: 'blog',
        video: 'video',
        collection: 'collection',
        promo: 'promo',
        category: 'category',
        customURL: 'customURL'
    },
    getData: function (id) {
        let _self = this, obj = {};
        Object
            .entries(_self.data)
            .forEach(([key, item]) => {
                if (item['id'] == id) {
                    obj = item;
                    return false;
                }
            });

        return obj;
    },
    navigation: function ({ name = '', id = '' }) {
        const _self = this;
        switch (name) {
            case _self.prefix['product']:
                if (id != '')
                    store.dispatch({
                        type: OPEN_PRODUCT_DETAILS,
                        value: {
                            id: id,
                            measurements: {},
                            animate: false,
                            sequence: 0
                        }
                    });
                break;

            case _self.prefix['blog']:
                if (id != '') {

                    const data = {
                        type: "htmlToJSON",
                        itemType: "customDetail",
                        uri: {
                            key: "export",
                            subKey: "getExport"
                        },
                        keys: {
                            id: "id",
                            arr: "html",
                            obj: "data",
                            objArr: "content"
                        },
                        data: {
                            exportType: "mobiAppFeedsDetail",
                            customParameters: [
                                {
                                    key: "icr",
                                    value: id
                                }
                            ]
                        }
                    };

                    store.dispatch({
                        type: SHOW_CUSTOM_POPUP,
                        value: { visibility: true, type: SET_VIEWER, data: data }
                    });
                }
                break;

            case _self.prefix['video']:
                if (id != '') {

                    const data = _self.getData(id) || {},
                        { youtubeId = '', videoName = '', imgMobile = '' } = data.attributes || {};

                    if (youtubeId != '')
                        store.dispatch({
                            type: SHOW_CUSTOM_POPUP,
                            value: {
                                visibility: true,
                                type: SET_VIDEO_PLAYER,
                                //modalTitle: videoName || '',
                                data: {
                                    selected: 0,
                                    items: [
                                        {
                                            provider: "youtube",
                                            text: videoName || '',
                                            thumbnail: Utils.getImage(imgMobile || ''),
                                            videoId: youtubeId || ''
                                        }
                                    ]
                                }
                            }
                        });
                }
                break;

            case _self.prefix['collection']:
                if (id != '') {
                    const data = _self.getData(id) || {},
                        { title, description } = data,
                        { catCode = '', utp = '', galleryImage } = data.attributes || {},
                        arr = [
                            {
                                title: title,
                                img: Utils.getImage(galleryImage),
                                utpId: utp,
                                //desc: description,
                                id: catCode
                            }
                        ];

                    if (catCode != '' || utp != '') {
                        setTimeout(() => {
                            store.dispatch({ type: SET_CATEGORIES, value: arr });
                            store.dispatch({ type: SET_SELECTED_CATEGORY, value: title });
                            store.dispatch({
                                type: NAVIGATE,
                                value: { item: { navigation: "Category" } }
                            });
                        }, 100);
                    }
                }
                break;

            case _self.prefix['promo']:
                if (id != '') {
                    const data = _self.getData(id) || {},
                        { title } = data,
                        { catCode = '', utp = '', galleryImage, desc } = data.attributes || {},
                        arr = [
                            {
                                title: title,
                                img: Utils.getImage(galleryImage),
                                utpId: utp,
                                desc: desc,
                                id: catCode
                            }
                        ];

                    if (catCode != '' || utp != '') {
                        setTimeout(() => {
                            store.dispatch({ type: SET_CATEGORIES, value: arr });
                            store.dispatch({ type: SET_SELECTED_CATEGORY, value: title });
                            store.dispatch({
                                type: NAVIGATE,
                                value: { item: { navigation: "Category" } }
                            });
                        }, 100);
                    }
                }
                break;

            case _self.prefix['category']:
                if (id != '') {
                    Globals.AJX(
                        {
                            _self: _self,
                            uri: Utils.getURL({ key: "product", subKey: "getCategoryList" }),
                            data: { catId: id }
                        },
                        res => {
                            const { status, message = "", data } = res;

                            if (status == 200) {
                                const { categories = [] } = data || {},
                                    { catId = '', catName = '', imageUrl = '' } = categories[0] || {};

                                if (catId != '') {
                                    const arr = [
                                        {
                                            title: catName,
                                            img: Utils.getImage(imageUrl),
                                            //utpId: utp,
                                            //desc: description,
                                            id: catId
                                        }
                                    ];

                                    setTimeout(() => {
                                        store.dispatch({ type: SET_CATEGORIES, value: arr });
                                        store.dispatch({ type: SET_SELECTED_CATEGORY, value: catName });
                                        store.dispatch({
                                            type: NAVIGATE,
                                            value: { item: { navigation: "Category" } }
                                        });
                                    }, 100);

                                }

                            }

                        });
                }
                break;

            case _self.prefix['customURL']: {
                if (id != '') {
                    Globals.AJX(
                        {
                            _self: _self,
                            uri: Utils.getURL({ key: 'content', subKey: 'getDataByUrl' }),
                            data: { Url: id.replace(Utils.prefix, '') } // API domain gönderilmemeli
                        },
                        res => {
                            const { status, message = "", data } = res;

                            if (status == 200) {
                                const { id = '', type = '' } = data || {};

                                if (id != '') {
                                    if (type == 'urn')
                                        _self.navigation({ name: _self.prefix['product'], id: id });
                                    else if (type == 'kat')
                                        _self.navigation({ name: _self.prefix['category'], id: id });


                                    console.log('dsadasdasdasdasd', data);
                                }



                            }

                        });
                }
                break;
            }


            default:
                break;
        }
    },
    init: function (o) {
        const _self = this;
        Utils.ajx({ uri: 'https://www.flormar.com.tr/mobiapp-all-data.txt' }, (res) => {
            if (res['type'] == 'success')
                _self.data = res['data'] || {};

            _self.navigation(o);
        });
    }
};

class DeepLinking extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }

        /* 
            not: deeplink url ile gelirse
            this.handleOpenURL({ url: 'flormarapp://product/571336' });
            this.handleOpenURL({ url: 'flormarapp://blog/21904' });
            this.handleOpenURL({ url: 'flormarapp://video/21937' });
            this.handleOpenURL({ url: 'flormarapp://collection/14841' });
            this.handleOpenURL({ url: 'flormarapp://promo/14787' });
            this.handleOpenURL({ url: 'flormarapp://category/18655' });
        */

        /*
            not: normal url ile gelirse, API gönderirken domain olmamalı
            this.handleOpenURL({ url: 'https://www.flormar.com.tr/illuminating-primer-make-up-base-white-classic/' });
            this.handleOpenURL({ url: 'https://www.flormar.com.tr/bb-krem/' });
        */
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = ({ url = '' }) => {
        this.navigate(url);
    }

    navigate = (url) => {
        const _self = this;

        if (_self._validateURL(url))
            routes.navigation({ name: routes.prefix['customURL'], id: url });
        else {
            const route = url.replace(/.*?:\/\//g, ''),
                id = route.indexOf('/') != -1 ? route.match(/\/([^\/]+)\/?$/)[1] : '',
                routeName = route.split('/')[0] || '';

            routes.init({ id: id, name: routeName });
        }
    }

    _validateURL = (value) => {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i.test(value);
    }

    render() {
        return null
    }
}

export { DeepLinking };
