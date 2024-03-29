import { Notifications } from 'expo';
import React from 'react';
import {
  Platform,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import SplashPage from '../app/views/Splash';
import CategoryPage from '../app/views/Category';
import StoreNavigation from './StoreNavigation';
import ExtraNavigation from './ExtraNavigation';
import HomeTabNavigator from './HomeTabNavigation';

//import ProductPage from '../app/views/Product';

import { DefaultHeader } from '../app/components';

//import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

class CartPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return null;
  }
}

const RootStackNavigator = createStackNavigator(
  {
    Splash: {
      screen: SplashPage,
    },

    Home: {
      screen: HomeTabNavigator,
      navigationOptions: {
        header: () => <DefaultHeader />,
      }
    },

    Category: {
      screen: CategoryPage,
    },

    Extra: {
      screen: ExtraNavigation,
      navigationOptions: {
        header: () => <DefaultHeader />,
      }
    },

    Cart: {
      screen: CartPage,
    },

    Store: {
      screen: props => <StoreNavigation />,
      navigationOptions: {
        header: () => null,
      }
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

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(RootStackNavigator);