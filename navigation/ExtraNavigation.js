import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import { ExtraPage, ExtraPageDetail } from 'root/app/viewer/';

/* Extra Page: user ve extra menuleri için navigator */
const ExtraPageNavigator = createStackNavigator(
    {
        Main: {
            screen: props => <ExtraPage {...props} />,
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

export default ExtraPageNavigator;