import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import { CartPage, AddressPage, PaymentPage, ExtraPageDetail } from 'root/app/viewer/';

const CartNavigation = createStackNavigator(
    {
        Cart: {
            screen: props => <CartPage {...props} />,
        },
        Address: {
            screen: props => <AddressPage {...props} />,
        },
        Payment: {
            screen: props => <PaymentPage {...props} />,
        },
        Detail: {
            screen: props => <ExtraPageDetail {...props} />,
        },
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