import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import { CartPage, AddressPage } from 'root/app/viewer/';

class Main extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return null;
    }
}

const CartNavigation = createStackNavigator(
    {
        Cart: {
            screen: props => <CartPage {...props} />,
        },
        Address: {
            screen: props => <AddressPage {...props} />,
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