import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import ExtraPage from 'root/app/viewer/Extra';
import ExtraPageDetail from 'root/app/viewer/ExtraPageDetail';

/* Extra Page: user ve extra menuleri için navigator */
const ExtraPageNavigator = createStackNavigator(
    {
        Extra: {
            screen: props => <ExtraPage {...props} />,
        },
        ExtraDetail: {
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

export default ExtraPageNavigator;