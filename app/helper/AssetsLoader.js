import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import {
    Font,
    AppLoading,
    Asset
} from 'expo';

import { ICONS, } from 'root/app/helper/Constant.js';

const AssetsLoader = class AssetsLoader extends Component {

    _loadResourcesAsync = async () => {
        
        const arr = Object.keys(ICONS).map((key) => { return ICONS[key]; });
        
        return Promise.all([
            Asset.loadAsync(arr),
            Font.loadAsync({
                'Medium': require('root/assets/fonts/brandongrotesque-medium-webfont.ttf'),
                'Bold': require('root/assets/fonts/brandongrotesque-bold-webfont.ttf'),
                'Regular': require('root/assets/fonts/brandongrotesque-regular-webfont.ttf'),

                'RegularTyp2': require('root/assets/fonts/proximanova-regular-webfont.ttf'),
            })
        ]);
    };

    _handleLoadingError = err => {
        const { error } = this.props;
        if (error)
            error(err);
    };

    _handleFinishLoading = () => {
        const { loaded } = this.props;
        if (loaded)
            loaded();
    };

    render() {
        return (
            <AppLoading
                startAsync={this._loadResourcesAsync}
                onError={this._handleLoadingError}
                onFinish={this._handleFinishLoading}
            />
        );
    }
}

export { AssetsLoader };