import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  View
} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Settings, OfflineNotice } from 'root/app/helper/';
import TopMenu from 'root/app/views/TopMenu';

// navigation
import RootNavigation from './navigation/RootNavigation';

//redux
import { Provider } from 'react-redux';
import { store } from './app/store.js';

import Assistant from './app/components/Assistant';

const Utils = require('root/app/helper/Global.js');

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  f
  componentDidMount() {
    /*fetch('https://dcetr9.segmentify.com/add/events/v1.json?apiKey=61c97507-5c1f-46c6-9b50-2aa9d1d73316', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ "name": "PAGE_VIEW", "userId": "XXXXXXXXXXXXXXXXX", "sessionId": "YYYYYYYYYYYYYYYY", "device": "IOS", "pageUrl": "https://flormar.com.tr","category": "Home Page"}),
})
    .then((response) => {
        console.log(response)
        return response.json();
    })
    .then(function (json) {
        console.log(json);
    })
    .catch(error => console.log('error', error));*/

    Utils.seg({
      data: {
        "name": "PAGE_VIEW",
        "userId": "XXXXXXXXXXXXXXXXX",
        "sessionId": "YYYYYYYYYYYYYYYY",
        "device": "IOS",
        "pageUrl": "https://flormar.com.tr",
        "category": "Home Page"
      }
    }, function (res) {
      console.log(JSON.stringify(res));
    });
  }

  _filterCallback = (o) => {
    console.log(o);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {/*Platform.OS === 'ios' && <StatusBar barStyle="default" />*/}
            {/*Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />*/}

            <OfflineNotice />
            <TopMenu />
            <Settings />
            <RootNavigation />
            <Assistant />
          </View>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        //require('./assets/images/robot-dev.png'),
        //require('./assets/images/robot-prod.png'),
        require('root/assets/icons/heartFull.png'),
        require('root/assets/icons/heartOutline.png'),
        require('root/assets/icons/storeLocation.png'),
        require('root/assets/icons/location.png'),
      ]),
      Font.loadAsync({
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'brandon': require('./assets/fonts/BrandonGrotesque-Medium.otf'),
        'proxima': require('./assets/fonts/proximanova-regular.otf'),


        'Medium': require('root/assets/fonts/BrandonGrotesque-Medium.otf'),
        'Bold': require('root/assets/fonts/brandongrotesque-bold-webfont.ttf'),
        'Regular': require('root/assets/fonts/BrandonGrotesque-Regular.otf'),
        'RegularTyp2': require('root/assets/fonts/proximanova-regular.otf'),

      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
