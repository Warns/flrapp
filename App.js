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

import { Form } from 'root/app/form';

// navigation
import RootNavigation from './navigation/RootNavigation';

//redux
import { Provider } from 'react-redux';
import { store } from './app/store.js';

import Assistant from './app/components/Assistant';

const Utils = require('root/app/helper/Global.js');
const filters = [
  {
    "filterGroupName": "FORMÜL",
    "filterId": "p6053230",
    "filterName": "KREMSİ ",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 6,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053237",
    "filterName": "HAFİF RENK",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 15,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053238",
    "filterName": "ISLAK GÖRÜNÜM",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 24,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053239",
    "filterName": "IŞILTILI",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 37,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053241",
    "filterName": "MAT",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 40,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053303",
    "filterName": "METALİK",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 17,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053244",
    "filterName": "PARLAK",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 99,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053245",
    "filterName": "PARLAK RENK",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 9,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "GÖRÜNÜM",
    "filterId": "p6053246",
    "filterName": "SATEN",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 76,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "KAPATICILIK",
    "filterId": "p6053252",
    "filterName": "ORTA",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 6,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "KAPATICILIK",
    "filterId": "p6053254",
    "filterName": "YÜKSEK",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 6,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "ÖZELLİK",
    "filterId": "p6053261",
    "filterName": "KADİFEMSİ",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 83,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "ÖZELLİK",
    "filterId": "p6053263",
    "filterName": "NEMLENDİRİCİ",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 160,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "ÖZELLİK",
    "filterId": "p6053270",
    "filterName": "UZUN SÜRE KALICI",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 104,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "ÖZELLİK",
    "filterId": "p6053272",
    "filterName": "YOĞUN RENK",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 184,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053276",
    "filterName": "BEJ",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 13,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053278",
    "filterName": "BORDO",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 25,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053285",
    "filterName": "KAHVE",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 7,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053286",
    "filterName": "KAHVERENGİ",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 24,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053287",
    "filterName": "KIRMIZI",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 32,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053290",
    "filterName": "LİLA",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 1,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053293",
    "filterName": "METALİK",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 5,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053294",
    "filterName": "MIXED",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 3,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053295",
    "filterName": "MOR",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 18,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053296",
    "filterName": "PEMBE",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 49,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053297",
    "filterName": "SARI",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 1,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053300",
    "filterName": "ŞEFTALİ",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 8,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  },
  {
    "filterGroupName": "RENK",
    "filterId": "p6053301",
    "filterName": "TURUNCU",
    "filterType": "9",
    "filterClass": "",
    "isSelected": false,
    "count": 10,
    "filterUrl": "https://www.flormar.com.tr/ruj/?ps=50"
  }
];

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

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

            <Form callback={this._filterCallback} data={Utils.filterToSelectObject(filters)} />

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
