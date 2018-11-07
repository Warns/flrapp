import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    LOCATION_SERVICE,
    SET_LOCATION,
} from 'root/app/helper/Constant';

async function getLocationAsync() {
    const { Location, Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
        return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    } else {
        throw new Error('Location permission not granted');
    }
}

class LocationServices extends Component {

    componentDidMount() {
        this._getLocationAsync();
    }

    /* https://docs.expo.io/versions/latest/sdk/permissions */

    _getLocationAsync = async () => {

        const _self = this,
            { Location, Permissions } = Expo,
            { status } = await Permissions.askAsync(Permissions.LOCATION);

        let permission = true,
            location = {};

        if (status === 'granted')
            location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
        else
            permission = false;

        _self.props.dispatch({ type: SET_LOCATION, value: { permission: permission, location: location } });

        const { callback } = _self.props;
        if (callback)
            callback({ type: LOCATION_SERVICE, data: { permission: permission, location: location } });

    }

    render() {
        return null;
    }
}

function mapStateToProps(state) { return state }
const LocationService = connect(mapStateToProps)(LocationServices);
export { LocationService }