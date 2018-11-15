import { Notifications } from 'expo';
import React from 'react';
import {
  Platform,
  StatusBar,
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
        header: null
      }
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

    ExtraUser: {
      screen: ExtraNavigation,
      navigationOptions: {
        header: () => <DefaultHeader />,
      }
    },

    Cart: {
      screen: props => <CartNavigation />,
      navigationOptions: {
        header: (props) => {
          const { cart } = store.getState(),
            { progress = "1/3" } = cart,
            _onBack = () => {
              const { navigation } = props;
              navigation.goBack(null);
            };

          return <MinimalHeader onPress={_onBack} title="Sepetim" progress={progress} />;
        }
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
      gesturesEnabled: false,
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