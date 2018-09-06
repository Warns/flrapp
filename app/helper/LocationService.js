import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    LOCATION_SERVICE,
    SET_LOCATION,
} from 'root/app/helper/Constant';

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