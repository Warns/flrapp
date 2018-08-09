import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Minus99HorizontalTabs } from 'root/app/components';
import { connect } from 'react-redux';
import { createMaterialTopTabNavigator } from 'react-navigation';



class Test extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const _self = this,
            { title = 'sadasdasd' } = _self.props;
        return (
            <View>
                <Text>{title}</Text>
            </View>
        );
    }
}

class CustomHorizontalTabs extends React.Component {

    jumpToIndex = this.props.jumpTo;

    _onTabsPress = (obj, index) => {
        this.jumpToIndex(obj.routeName);
    }

    render() {
        const routes = this.props.navigationState.routes,
            i = this.props.navigationState.index;

        return (
            <Minus99HorizontalTabs items={routes} selected={i} callback={this._onTabsPress} />
        )
    }
}

class Extra extends Component {
    constructor(props) {
        super(props);
    }

    /* ilgili componentleri tipine göre çağırmak */
    _getContent = ({ props = {}, item }) => {
        const _self = this,
            { title, type } = item;

        return <Test {...props} key={title} title={title} />
    }

    _add = () => {
        const _self = this,
            data = _self.props.settings.menu.extra,
            obj = {};

        data.map((item, ind) => {
            const { title } = item;
            obj[title] = {
                screen: props => _self._getContent({ item: item, props: props }),
                navigationOptions: {
                    title: title,
                }
            }
        });
        return obj;
    }

    TabNavigator = createMaterialTopTabNavigator(
        this._add(),
        {
            lazy: true,
            tabBarPosition: 'top',
            tabBarComponent: CustomHorizontalTabs,
        }
    );

    render() {
        const _self = this;
        return <this.TabNavigator />
    }
}

/*
function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(Extra);
*/


//////////////// TEST
data = [
    {
        "title": "MAĞAZALAR",
        "type": "serviceList",
        "fontStyle": {
            "color": "#7c3993"
        },
        "ico": "location"
    },
    {
        "title": "KURUMSAL",
        "type": "htmlViewer",
        "uri": {
            "key": "export",
            "subKey": "getExport"
        },
        "keys": {
            "arr": "html"
        },
        "data": {
            "exportType": "coporateEXP",
            "customParameters": [
                {
                    "key": "icr",
                    "value": "19224"
                }
            ]
        },
        "siteURI": "/biz-kimiz/"
    },

    {
        "title": "İADE İŞLEMLERİ",
        "type": "htmlViewer",
        "uri": {
            "key": "export",
            "subKey": "getExport"
        },
        "keys": {
            "arr": "html"
        },
        "data": {
            "exportType": "coporateEXP",
            "customParameters": [
                {
                    "key": "icr",
                    "value": "19225"
                }
            ]
        },
        "siteURI": "/iade-islemleri/"
    },

    {
        "title": "MESAFELİ SATIŞ SÖZLEŞMESİ",
        "type": "htmlViewer",
        "uri": {
            "key": "export",
            "subKey": "getExport"
        },
        "keys": {
            "arr": "html"
        },
        "data": {
            "exportType": "coporateEXP",
            "customParameters": [
                {
                    "key": "icr",
                    "value": "19219"
                }
            ]
        },
        "siteURI": "/mesafeli-satis-sozlesmesi/"
    },

    {
        "title": "SIKÇA SORULAN SORULAR",
        "type": "htmlViewer",
        "uri": {
            "key": "content",
            "subKey": "getContent"
        },
        "keys": {
            "arr": "html"
        },
        "data": {
            "contentId": 19236
        },
        "siteURI": "/sss/"
    },
    {
        "title": "İNSAN KAYNAKLARI",
        "type": "htmlViewer",
        "uri": {
            "key": "content",
            "subKey": "getContent"
        },
        "keys": {
            "arr": "html"
        },
        "data": {
            "contentId": 19275
        },
        "siteURI": "/insan-kaynaklari-politikasi/"
    },

    {
        "title": "KİŞİSEL VERİLERİN KORUNMASI",
        "type": "htmlViewer",
        "uri": {
            "key": "export",
            "subKey": "getExport"
        },
        "keys": {
            "arr": "html"
        },
        "data": {
            "exportType": "coporateEXP",
            "customParameters": [
                {
                    "key": "icr",
                    "value": "19638"
                }
            ]
        },
        "siteURI": "/kvk/"
    },

];

_getContent = ({ props = {}, item }) => {
    const { title, type } = item;

    return <Test {...props} key={title} title={title} />
}

_add = () => {
    const obj = {};

    data.map((item) => {
        const { title } = item;
        obj[title] = {
            screen: props => _getContent({ item: item, props: props }),
            navigationOptions: {
                title: title,
            }
        }
    });
    return obj;
}

TabNavigator = createMaterialTopTabNavigator(
    _add(),
    {
        lazy: true,
        tabBarPosition: 'top',
        tabBarComponent: CustomHorizontalTabs,
    }
);

export default TabNavigator;