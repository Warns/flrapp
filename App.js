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
import Preloader from 'root/app/helper/Preloader';
import TopMenu from 'root/app/views/TopMenu';

// navigation
import RootNavigation from './navigation/RootNavigation';

//redux
import { Provider } from 'react-redux';
import { store } from './app/store.js';

import Assistant from './app/components/Assistant';
<<<<<<< HEAD
import ProductView from './app/views/Product';
=======
>>>>>>> 947f2ca06069358790bd0612b9ba339e91b9a65f

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  f
  componentDidMount() {

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
            <ProductView />
            <Assistant />
            <Preloader />
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
