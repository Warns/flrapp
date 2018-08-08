import React, { Component } from 'react';
import {
    View,
    Image,
    Modal,
    Animated,
    Easing,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { LineButton } from 'root/app/UI';

class Navigation extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = (obj) => {
        alert(JSON.stringify(obj));
    }

    _add = () => {
        const _self = this,
            items = _self.props.items || [];
        if (items.length == 0)
            return null;
        return items.map((item, ind) => {
            return <LineButton sequence={ind} item={item} key={'btn-' + ind} onPress={this._onPress}>{item.title}</LineButton>
        });
    }

    render() {
        return this._add();
    }
}

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anim: new Animated.Value(0),
        }
    }
    componentDidMount() {
        this._animate();
    }

    /* https://gist.github.com/dabit3/19844207dc9f64a4cbd70f31734353e6 */
    _animate = () => {
        const _self = this;
        Animated.timing(
            _self.state.anim,
            {
                toValue: 1,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
            }
        ).start();
    }

    _onClose = () => {
        const { onClose } = this.props;
        if (onClose)
            onClose();
    }

    _header = () => {
        const _self = this,
            dir = _self.props.direction || 'left',
            alignSelf = dir == 'right' ? 'flex-start' : 'flex-end';

        return (
            <View style={{ height: 60, justifyContent: 'center', alignSelf: alignSelf }}>
                <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity activeOpacity={0.4} onPress={this._onClose}>
                        <Image source={require("root/assets/icons/close.png")} style={{ width: 18, height: 18 }} />
                    </TouchableOpacity>
                </View>
            </View>
        );

    }

    _footer = () => {
        return null;
    }

    render() {
        const _self = this,
            dir = _self.props.direction || 'left',
            items = _self.props.items,
            header = _self._header(),
            footer = _self._footer(),
            pos = _self.state.anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-100%', '0%']
            }),
            op = _self.state.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, .3]
            }),
            alignSelf = dir == 'left' ? 'flex-start' : 'flex-end';

        let direction = { left: pos };
        if (dir == 'right')
            direction = { right: pos };

        return (
            <View style={{ flex: 1 }}>
                <Animated.View style={{ opacity: op, zIndex: 1, flex: 1, position: 'absolute', backgroundColor: '#000000', left: 0, right: 0, top: 0, bottom: 0, width: '100%', height: '100%' }}></Animated.View>

                <View style={{ flex: 1, alignSelf: alignSelf, flexDirection: 'column', zIndex: 2, position: 'relative' }}>
                    <Animated.View style={{ ...direction, zIndex: 2, width: 320, flex: 1, backgroundColor: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }}>
                        {header}
                        <Navigation items={items} />
                        {footer}
                    </Animated.View>
                </View>
            </View>
        )
    }
}

class TopMenu extends Component {
    constructor(props) {
        super(props);
    }

    _onClose = () => {
        this.props.dispatch({ type: 'HIDE_MENU' });
    }

    render() {
        const _self = this,
            { settings = {} } = _self.props,
            menu = settings['menu'] || {},
            { isVisible, direction, type } = _self.props.menu;

        return (
            <View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={isVisible}
                >
                    <Menu onClose={_self._onClose} direction={direction} items={menu[type]} />
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(TopMenu);