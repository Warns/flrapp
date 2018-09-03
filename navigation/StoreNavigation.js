import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import { LocationService, } from 'root/app/helper/';
import { Viewer } from 'root/app/viewer/';
import { SERVICE_LIST_CLICKED, LOCATION_SERVICE } from 'root/app/helper/Constant';

class StorePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return null;
    }
}

const data = {
    itemType: 'serviceList',
    uri: { key: 'service', subKey: 'getServiceList' },
    keys: {
        id: 'serviceId',
        arr: 'services',
    }
};

class Main extends Component {
    constructor(props) {
        super(props);
    }

    _callback = (obj) => {
        const _self = this,
            { type } = obj;

        if (type == SERVICE_LIST_CLICKED)
            _self.props.navigation.navigate('Detail', obj);
    }

    render() {
        const _self = this;
        return <Viewer config={data} callback={_self._callback} />
    }
}

const StoreNavigator = createStackNavigator(
    {
        Main: {
            screen: props => <Main {...props} />,
        },
        Detail: {
            screen: props => <StorePage {...props} />,
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

export default StoreNavigator;