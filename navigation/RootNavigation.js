import { Notifications } from 'expo';
import React from 'react';
import {
  Platform,
  StatusBar,
} from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import SplashPage from '../app/views/Splash';
import CategoryPage from '../app/views/Category';
import ExtraPage from '../app/views/Extra';
import HomeTabNavigator from './HomeTabNavigation';

//import ProductPage from '../app/views/Product';

import { DefaultHeader } from '../app/components';

//import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';


export default RootStackNavigator = createStackNavigator(
  {
    Splash: {
      screen: SplashPage,
    },
    Home: {
      screen: HomeTabNavigator,
      navigationOptions:{
        header: () => <DefaultHeader />,
      }
    },
    Category: {
      screen: CategoryPage,
    },

    Extra: {
      screen: ExtraPage,
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
