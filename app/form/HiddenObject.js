import React, { Component } from 'react';

class HiddenObject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data.value,
        }
    }

    _callback = () => {
        const { title, id, validation } = this.props.data;
        const { callback } = this.props;
        if (callback)
            callback({ key: id, title: title, value: this.state.value, });
    }

    render() {
        const { control = false, } = this.props;

        if (control)
            this._callback();

        return null;
    }
}

export { HiddenObject };