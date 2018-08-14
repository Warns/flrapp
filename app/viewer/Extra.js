import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Minus99HorizontalTabs } from 'root/app/components';
import { connect } from 'react-redux';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Viewer, MapViewer, OrderViewer } from 'root/app/viewer';
import { Form } from 'root/app/form';
import { DATA_LOADED, ORDER_LIST_CLICKED, VIEWERTYPE, FORMDATA } from 'root/app/helper/Constant';


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

    _callback = (obj) => {
        const _self = this,
            { type } = obj;

        if (type != DATA_LOADED)
            _self.props.navigation.navigate('ExtraDetail', obj);
    }

    /* ilgili componentleri tipine göre çağırmak */
    _getComponent = ({ props = {}, item }) => {
        const _self = this,
            { type, itemType = '' } = item;
        let view = null;

        if (type == VIEWERTYPE['LIST'] || type == VIEWERTYPE['HTMLTOJSON'] || type == VIEWERTYPE['HTML'] || type == VIEWERTYPE['WEBVIEW'])
            view = <Viewer {...props} config={item} callback={this._callback} />
        else if (type == VIEWERTYPE['FORM'])
            view = <Form data={FORMDATA[itemType]} callback={this._callback} />;

        return view;
    }

    _getScreen = () => {
        const _self = this,
            type = _self.props.menu.type || 'extra', // menu type değerini redux üstünden alıyor   
            data = _self.props.settings.menu[type],
            obj = {};

        data.map((item, ind) => {
            /*
            showCategory değerini settings json üzerinden alıyor. kategoride gözüküp, gözükmeme olayı
            */
            const { title, showCategory = true } = item;
            if (showCategory)
                obj[title] = {
                    screen: props => _self._getComponent({ item: item, props: props }),
                    navigationOptions: {
                        title: title,
                    }
                }
        });
        return obj;
    }

    _getRouteName = () => {
        /* başlangıç route ayarlıyoruz. değerini topmenu.js _onMenuClicked gönderilen object içinden alıyor alıyor. */
        const params = this.props.navigation.state.params || {};
        return params.item.title;
    }

    TabNavigator = createMaterialTopTabNavigator(
        this._getScreen(),
        {
            lazy: true,
            tabBarPosition: 'top',
            tabBarComponent: CustomHorizontalTabs,
            initialRouteName: this._getRouteName(),
        }
    );

    render() {
        const _self = this;
        return <this.TabNavigator />
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(Extra);