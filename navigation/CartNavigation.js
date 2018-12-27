import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import { CartPage, AddressPage, PaymentPage, ExtraPageDetail, OrderSuccess } from 'root/app/viewer/';
import { MinimalHeader } from 'root/app/components/';
import {
    NAVIGATE
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

export default class CartNavigation extends Component {
    constructor(props) {
        super(props);
        _self = this;
    }

    _getHeader = ({ props, root = false }) => {
        const _onClose = () => {
            const { navigation } = props;
            if (root)
                store.dispatch({ type: NAVIGATE, value: { item: { navigation: 'Home' } } });
            else
                navigation.goBack(null);
        },
        { cart } = store.getState(),
        { progress = "1/3" } = cart;
        
        return <MinimalHeader onPress={_onClose} title="Sepetim" progress={progress} />
    }

    navigator = createStackNavigator(
        {
            Cart: {
                screen: props => <CartPage {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props, root: true })
                }
            },
            Address: {
                screen: props => <AddressPage {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props })
                }
            },
            Payment: {
                screen: props => <PaymentPage {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props })
                }
            },
            Detail: {
                screen: props => <ExtraPageDetail {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props })
                }
            },
            OrderSuccess: {
                screen: props => <OrderSuccess {...props} />,
                navigationOptions: {
                    header: (props) => _self._getHeader({ props: props })
                }
            }
        },
        {
            //initialRouteName:'OrderSuccess',
            navigationOptions: {
                header: null
            },
            cardStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
            }
        }
    )

    render() {
        return <this.navigator />
    }
}