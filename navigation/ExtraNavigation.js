import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import ExtraPage from 'root/app/views/Extra';
import ExtraPageDetail from 'root/app/views/ExtraPageDetail';

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
        }
    }
);

export default ExtraPageNavigator;