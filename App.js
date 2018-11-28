import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Settings, OfflineNotice } from 'root/app/helper/';
import Preloader from 'root/app/helper/Preloader';
import TopMenu from 'root/app/views/TopMenu';

// custom modal
import { CustomModal } from 'root/app/viewer';

// navigation
import RootNavigation from './navigation/RootNavigation';

//redux
import { Provider } from 'react-redux';
import { store } from './app/store.js';

import Assistant from './app/components/Assistant';
import ProductView from './app/views/Product';
import YoutubePlayer from 'root/app/sub-views/YoutubePlayer';

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
          <KeyboardAvoidingView
            behavior={"padding"}
            pointerEvents="box-none"
            style={{
              flex: 1
            }}
          >
            <View style={styles.container}>
              {/*Platform.OS === 'ios' && <StatusBar barStyle="default" />*/}
              {/*Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />*/}
              <OfflineNotice />
              <TopMenu />
              <Settings />
              <RootNavigation />
              <ProductView />
              <Assistant />
              { /*<YoutubePlayer />*/}
              <CustomModal />
              <Preloader />
            </View>
          </KeyboardAvoidingView>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        //require('./assets/images/robot-dev.png'),
        //require('./assets/images/robot-prod.png'),
        require('root/assets/icons/rightArrow.png'),
        require('root/assets/icons/rightArrowGrey.png'),
        require('root/assets/icons/rightArrowWhite.png'),
        require('root/assets/icons/downArrow.png'),
        require('root/assets/icons/storeLocation.png'),
        require('root/assets/icons/location.png'),
        require('root/assets/icons/feedInstagram.png'),
        require('root/assets/icons/feedPromo.png'),
        require('root/assets/icons/feedVideo.png'),
        require('root/assets/icons/heartFull.png'),
        require('root/assets/icons/heartOutline.png'),
        require('root/assets/icons/close.png'),
        require('root/assets/icons/drpIco.png'),
        require('root/assets/icons/list_product.png'),
        require('root/assets/icons/list_texture.png'),
        require('root/assets/icons/filters.png'),
        require('root/assets/icons/list.png'),
        require('root/assets/icons/map.png'),
        require('root/assets/images/icons/back.png'),
        require('root/assets/icons/facebook.png'),
        require('root/assets/icons/instagram.png'),
        require('root/assets/icons/twitter.png'),
        require('root/assets/icons/youtube.png'),
        require('root/assets/icons/noConnection.png'),
        require('root/assets/icons/placeholder/feeds.png'),
        require('root/assets/icons/flormarExtra.png'),
        require('root/assets/icons/userWoman.png'),
        require('root/assets/icons/userMan.png'),
        require('root/assets/images/campaing-rectangle.png'),
        require('root/assets/images/campaing-title.png'),
        require('root/assets/icons/bottomArrow.png'),
        require('root/assets/icons/topArrow.png'),
        require('root/assets/icons/search-map.png'),
        require('root/assets/icons/myLocation.png'),
        require('root/assets/gifs/goo.gif'),
        require('root/assets/icons/error.png'),
        require('root/assets/icons/cartNoResult.png'),
        require('root/assets/icons/addressNoResult.png'),
        require('root/assets/icons/couponNoResult.png'),
        require('root/assets/icons/favoriteNoResult.png'),
        require('root/assets/icons/followListNoResult.png'),
        require('root/assets/icons/contentNoResult.png'),
        require('root/assets/icons/asistanButton.png'),
        require('root/assets/icons/button.png'),
        require('root/assets/icons/searchClose.png'),
        require('root/assets/icons/plus.png'),
        require('root/assets/icons/closedIco.png')
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
