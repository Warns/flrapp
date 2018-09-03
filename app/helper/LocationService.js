import React, { Component } from 'react';
import { Location, Permissions } from 'expo';
import { 
    LOCATION_SERVICE, 
} from 'root/app/helper/Constant';

class LocationService extends Component {

    componentDidMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        const _self = this;
        let { status } = await Permissions.askAsync(Permissions.LOCATION),
            location = await Location.getCurrentPositionAsync({}),
            permission = true;

        if (status !== 'granted')
            permission = false;


        const { callback } = _self.props;
        if (callback)
            callback({ type: LOCATION_SERVICE, data: { permission: permission, location: location } });
    };

    render() {
        return null;
    }
}

export { LocationService };