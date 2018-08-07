import React, { Component } from 'react';
import { connect } from 'react-redux';

class TopMenu extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const { settings = {} } = this.props,
            menu = settings['menu'] || {};

        console.log('TopMenu', menu['extra'], menu['user']);
        return null;
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(TopMenu);