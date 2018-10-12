import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import { CartPage } from 'root/app/viewer/';

const CartNavigation = createStackNavigator(
    {
        Cart: {
            screen: props => <CartPage {...props} />,
        }
    },
    {
        navigationOptions: {
            header: null
        },
        cardStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
        }
    }
);

export default CartNavigation;