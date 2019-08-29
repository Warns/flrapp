import React from 'react';
import { Platform, Linking } from 'react-native';
import {
    OPEN_PRODUCT_DETAILS,
    SHOW_CUSTOM_POPUP, 
    SET_VIEWER
} from "root/app/helper/Constant";
import { store } from 'root/app/store';

class DeepLinking extends React.Component {

    constructor(props) {
        super(props);

        /* 
            deeplink ile gelebilecek tipler tanımlanır
        */
        this.routes = {
            product: 'product',
            blog: 'blog'
        };
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
            ex:
            this.handleOpenURL({ url: 'flormarapp://product/571336' });
            this.handleOpenURL({ url: 'flormarapp://blog/21904' });
        */

        this.handleOpenURL({ url: 'flormarapp://blog/21904' });
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = (event) => {
        const { url = '' } = event;
        this.navigate(url);
    }

    navigate = (url) => {
        const _self = this,
            route = url.replace(/.*?:\/\//g, ''),
            id = route.indexOf('/') != -1 ? route.match(/\/([^\/]+)\/?$/)[1] : '',
            routeName = route.split('/')[0] || '';

        _self.gotoRoute({ id: id, name: routeName });
    }

    /* 
        projedeki kurguya göre bu fonk. içeriği değişebilir.
    */
    gotoRoute = ({ name = '', id = '' }) => {
        const _self = this;
        switch (name) {
            case _self.routes['product']:
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

            case _self.routes['blog']:
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

            default:
                break;
        }
    }

    render() {
        return null
    }
}

export { DeepLinking };
