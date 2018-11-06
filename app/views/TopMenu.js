import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Image,
    Modal,
    Animated,
    Easing,
    TouchableOpacity,
    Linking,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { LineButton, IconButton } from 'root/app/UI';
import { GestureRecognizer } from 'root/app/helper';
import { NAVIGATE, HIDE_MENU, ITEMTYPE, REMOVE_USER, ICONS } from 'root/app/helper/Constant';
import { store } from 'root/app/store';

const Utils = require('root/app/helper/Global.js');
const Globals = require('root/app/globals.js');

class CustomModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const _self = this,
            { animationType = 'none', transparent = true, visible = 'false' } = _self.props;
        return (
            <Modal
                animationType={animationType}
                transparent={transparent}
                visible={visible}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    {_self.props.children}
                </SafeAreaView>
            </Modal>

        );
    }
}

class ExtraButton extends Component {
    constructor(props) {
        super(props);
    }
    _onPress = () => {

    }
    render() {
        const _self = this;
        return (
            <TouchableOpacity activeOpacity={1} onPress={_self._onPress}>
                <View style={{ backgroundColor: '#2dccd3', height: 70, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Image
                        style={{ width: 113, height: 70 }}
                        source={ICONS['flormarExtra']}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#FFFFFF', fontFamily: 'RegularTyp2', fontSize: 16 }}>{Utils.getPriceFormat(23)}</Text>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={ICONS['rightArrowWhite']}
                        />
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}


class Navigation extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = (obj) => {
        this.props.onMenuClicked(obj);
    }

    _add = () => {
        const _self = this,
            items = _self.props.items || [];
        if (items.length == 0)
            return null;
        return items.map((item, ind) => {
            /*
            showMenu değerini settings json üzerinden alıyor. menude gözüküp, gözükmeme olayı
            */
            const { fontStyle = {}, ico = '', showMenu = true, type } = item;
            if (showMenu) {
                if (type == 'flormarExtra')
                    return <ExtraButton key={'btn-' + ind} />
                else
                    return <LineButton ico={ico} fontStyle={fontStyle} sequence={ind} item={item} key={'btn-' + ind} onPress={this._onPress}>{item.title}</LineButton>
            } else
                return null;
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
        this._animate({ type: 'show' });
    }

    /* https://gist.github.com/dabit3/19844207dc9f64a4cbd70f31734353e6 */
    _animate = ({ typ = 'show' }, callback) => {
        const _self = this;
        Animated.timing(
            _self.state.anim,
            {
                toValue: typ == 'show' ? 1 : 0,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
            }
        ).start(() => {
            if (typeof callback !== 'undefined')
                callback();
        });
    }

    /* menu closed */
    _onClose = () => {
        const _self = this,
            { onClose } = _self.props;
        _self._animate({ typ: 'hide' }, () => {
            if (onClose)
                onClose();
        });
    }

    /* menu item clicked */
    _onMenuClicked = (obj) => {
        const _self = this,
            { onMenuClicked } = _self.props;
        _self._animate({ typ: 'hide' }, () => {
            if (onMenuClicked)
                onMenuClicked(obj);
        });
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

    _socialButtonClick = ({ item }) => {
        const _self = this,
            { settings = {} } = store.getState(),
            { social = {} } = settings;
        Linking.openURL(social[item['type'] || ''] || '');
    }

    _getSocialButton = () => {
        const _self = this,
            arr = ['facebook', 'instagram', 'youtube', 'twitter'],
            btn = arr.map((k, ind) => {
                const m = ind > 0 ? 20 : 0;
                return <IconButton callback={_self._socialButtonClick} item={{ type: k }} key={k} ico={k} icoStyle={{ width: 40, height: 40 }} style={{ marginLeft: m, width: 40, height: 40 }} />;
            });
        return btn;
    }

    _footer = () => {
        const _self = this,
            dir = _self.props.direction || 'left';

        let view = null;
        if (dir == 'right')
            view = (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {_self._getSocialButton()}
                </View>
            );

        return view;
    }

    /* Gesture */
    _onSwipe = (k) => {
        const _self = this,
            dir = _self.props.direction || 'left';

        if (k == dir)
            _self._onClose();
    }

    render() {
        const _self = this,
            config = {
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
            },
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
            alignSelf = dir == 'left' ? 'flex-start' : 'flex-end',
            direction = dir == 'right' ? { right: pos } : { left: pos };

            let{ isX, window, OS } = store.getState().general.SCREEN_DIMENSIONS;

            let _top = OS == 'android' ? -28: isX ? -12 : 0;

        return (

            <View style={{ flex: 1, top:_top, minHeight: window.height - 25 }}>
                <Animated.View style={{ opacity: op, zIndex: 1, flex: 1, position: 'absolute', backgroundColor: '#000000', left: 0, right: 0, top: 0, bottom: 0, width: '100%', height: '100%' }}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={this._onClose}></TouchableOpacity>
                </Animated.View>

                <View style={{ flex: 1, alignSelf: alignSelf, flexDirection: 'column', zIndex: 2, position: 'relative' }}>
                    <Animated.View style={{ ...direction, zIndex: 2, width: 320, flex: 1, backgroundColor: '#FFFFFF', paddingLeft: 10, paddingRight: 10, paddingBottom: 56 }}>
                        {header}
                        <ScrollView style={{ flex: 1, }}>
                            <GestureRecognizer
                                onSwipeLeft={() => _self._onSwipe('left')}
                                onSwipeRight={() => _self._onSwipe('right')}
                                config={config}
                                style={{
                                    flex: 1,
                                }}
                            >
                                <View style={{ flex: 1, }}>
                                    <Navigation onMenuClicked={this._onMenuClicked} items={items} />
                                </View>

                            </GestureRecognizer>
                        </ScrollView>
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
        this.state = {

        };
    }

    componentDidMount() {
        const _self = this;
        _self._isMounted = true;
    }

    componentWillUnmount() {
        const _self = this;
        _self._isMounted = false;
    }

    _onClose = () => {
        this.props.dispatch({ type: HIDE_MENU });
    }

    _onMenuClicked = (obj) => {
        const _self = this,
            { type, uri = {}, itemType } = obj['item'] || {};
        _self.props.dispatch({ type: HIDE_MENU });/* modal komple kapatıyor */

        /* setting.json ile oluşturulan button tipine göre işlem yapmak */
        if (type == ITEMTYPE['TRIGGERBUTTON'])
            Globals.AJX({ _self: _self, uri: Utils.getURL(uri) }, (res) => {
                const { status } = res;
                if (status == 200) {
                    /* ÇIKIŞ BUTONUNA ÖZEL İŞLEM */
                    if (ITEMTYPE['EXITBUTTON'] == itemType)
                        _self.props.dispatch({ type: REMOVE_USER });
                }
            });
        else
            _self.props.dispatch({ type: NAVIGATE, value: obj });
    }

    render() {
        const _self = this,
            { settings = {} } = _self.props,
            menu = settings['menu'] || {},
            { isVisible, direction, type } = _self.props.menu;

        return (
            <CustomModal visible={isVisible}>
                <Menu onMenuClicked={this._onMenuClicked} onClose={_self._onClose} direction={direction} items={menu[type]} />
            </CustomModal>
        );
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(TopMenu);