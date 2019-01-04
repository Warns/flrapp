import { Notifications } from 'expo';
import React from 'react';
import {
  Platform,
  StatusBar,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import { store } from 'root/app/store';

import CategoryPage from '../app/views/Category';
import StoreNavigation from './StoreNavigation';
import CartNavigation from './CartNavigation';
import ExtraNavigation from './ExtraNavigation';
import HomeTabNavigator from './HomeTabNavigation';
import OptinNavigator from './OptinNavigator';


// this is for dev reasons
import ProductPage from '../app/views/Product';
import ListPage from '../app/views/List';
import YoutubePlayer from 'root/app/sub-views/YoutubePlayer';
import { CartHeader, DefaultHeader, MinimalHeader } from 'root/app/components/';

import { ReviewsList, Review } from '../app/views/product';


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
    Optin: {
      screen: OptinNavigator,
      navigationOptions: {
        gesturesEnabled: false,
        header: null
      }
    },

    Home: {
      screen: HomeTabNavigator,
      navigationOptions: {
        gesturesEnabled: false,
        header: () => <DefaultHeader />,
      }
    },

    Category: {
      screen: CategoryPage,
    },

    Extra: {
      screen: ExtraNavigation,
      navigationOptions: {
        header: () => <DefaultHeader backButton={true} />,
      }
    },

    ExtraUser: {
      screen: ExtraNavigation,
      navigationOptions: {
        header: () => <DefaultHeader backButton={true} />,
      }
    },

    Cart: {
      screen: props => <CartNavigation />,
      navigationOptions: {
        header: () => null,
      }
    },

    Store: {
      screen: props => <StoreNavigation />,
      navigationOptions: {
        header: () => null,
      }
    }

  },
  {
    navigationOptions: {
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    },
    cardStyle: {
      //paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
      backgroundColor: '#FFFFFF',
      elevation: 0,
    }
  }
);

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(RootStackNavigator);