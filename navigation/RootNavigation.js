import { Notifications } from 'expo';
import React from 'react';
import {
  Platform,
  StatusBar,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';

import SplashPage from '../app/views/Splash';
import CategoryPage from '../app/views/Category';
import ShopMenuPage from '../app/views/ShopMenu';
//import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

export default RootStackNavigator = createStackNavigator(
  {
    Splash: {
      screen: SplashPage,
    },
    Category: {
      screen: CategoryPage,
    },
    ShopMenu: {
      screen: ShopMenuPage,
    }
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
    cardStyle: {
      //paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
      backgroundColor: '#F6F7F7',
      elevation: 0,
    }
  }
);
