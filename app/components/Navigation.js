import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    Modal,
    SafeAreaView,
} from 'react-native';
import { BlackButton, LineButton } from '../UI';
import { Carousel } from './Carousel';

const width = Dimensions.get('window').width;

class ModalHeader extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        const { onPress } = this.props;
        if (onPress)
            onPress();
    }

    render() {
        const { title } = this.props;
        return (
            <View style={{ height: 60, alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={this._onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        resizeMode="contain"
                        style={{ width: 22, height: 22, }}
                        source={require('root/assets/images/icons/back.png')}
                    />
                    <Text style={{ fontFamily: 'brandon' }}>{title}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


class NavigationModal extends Component {
    constructor(props) {
        super(props);
    }

    _onClose = () => {
        const { onClose } = this.props;
        if (onClose)
            onClose();
    }


    _getContent = () => {
        const { item } = this.props.data;
        const main = [];

        const obj = item,
            k = obj['children'],
            arr = [],
            lng = k.length;
        for (let j = 0; j < lng; ++j) {
            const n = k[j];
            const b = <LineButton item={n} key={'btn-' + j} style={{ borderBottomWidth: (j == lng - 1) ? 1 : 0 }} onPress={this._onPressButton}>{n.title}</LineButton>
            arr.push(b);
        }

        const wrp = (
            <View key={'btnWrp'} style={[{ paddingLeft: 20, paddingRight: 20, paddingTop: 8, flex: 1 }]}>
                <ScrollView>
                    <View>
                        {arr}
                    </View>
                </ScrollView>
                <View style={{ paddingLeft: 37, paddingRight: 37, justifyContent: 'center', alignItems: 'center', height: 100 }}>
                    <BlackButton item={{ id: obj.id }} onPress={this._onAllPrdPress}>TÜM {obj.title} ÜRÜNLERİ</BlackButton>
                </View>
            </View>
        );

        main.push(wrp);


        return main


    }


    render() {
        const { visible = false, data, mainTitle } = this.props;

        if (data.length == 0)
            return null;

        const { img, title } = data.item;

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={() => { }}
            >
                <SafeAreaView style={{ flex: 1, }}>
                    <View style={{ paddingLeft: 10, paddingRight: 10, flex: 1, }}>


                        <ModalHeader onPress={this._onClose} title={mainTitle} />

                        <View style={{ position: 'relative', }}>
                            <Image
                                style={{ height: 120 }}
                                source={{ uri: img }}
                            />
                            <Text style={{ fontFamily: 'brandon', fontSize: 20, color: '#FFFFFF', position: 'absolute', top: 45, left: 20, alignItems: 'center', justifyContent: 'center', }}>{title}</Text>
                        </View>

                        {this._getContent()}

                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: [],
            currentIndex: 0,
            modalVisible: false,
            modalData: [],
        }
    }

    componentDidMount() {
        let data = require('root/data/navigation.json');
        //this.setState({ navigation: data['data'] });
    }

    // AddEvents
    _onAllPrdPress = (o) => {

    }

    _onPressButton = (o) => {
        this.setModalVisible(({ visible: true, data: o }));
    }

    // Modal
    setModalVisible({ visible = false, data = [] }) {
        this.setState({ modalVisible: visible, modalData: data });
    }

    // scrollView
    ScrollView = null

    _onMove = ({ value }) => {
        const { navigation } = this.state;
        const currentOffset = this.state.currentIndex * width;
        let resolvedOffset = currentOffset - (value * 1.7);
        const maxOffset = width * (navigation.length - 1);

        if (resolvedOffset < 0)
            resolvedOffset = 0;

        if (resolvedOffset > maxOffset)
            resolvedOffset = maxOffset;

        this.ScrollView.scrollTo({
            x: resolvedOffset,
            animated: false,
        });

        const { onMove } = this.props;
        if (onMove)
            onMove();
    }

    _onIndexChange = ({ index }) => {
        const _self = this;
        _self.setState(() => ({ currentIndex: index }));
        setTimeout(() => { _self._focused(); }, 10);

        const { onRelease } = this.props;
        if (onRelease)
            onRelease();
    }

    _focused = () => {
        this.ScrollView.scrollTo({
            x: this.state.currentIndex * width,
            animated: true,
        });
    }

    _callback = (o) => {
        const { callback } = this.props;
        if (callback)
          callback(o);
      }

    // ana basliklar
    _getMainThumb = () => {
        const { navigation } = this.state;
        const arr = [];
        for (let i = 0; i < navigation.length; ++i) {
            const k = navigation[i];
            arr.push({ id: i, title: k['title'], src: k['img'] });
        }
        return arr;
    }

    _getContent = () => {
        const { navigation } = this.state;
        const main = [];
        for (let i = 0; i < navigation.length; ++i) {
            const obj = navigation[i],
                k = obj['children'],
                arr = [],
                lng = k.length;
            for (let j = 0; j < lng; ++j) {
                const n = k[j];
                const b = <LineButton item={n} key={'btn-' + j} style={{ borderBottomWidth: (j == lng - 1) ? 1 : 0 }} onPress={this._onPressButton}>{n.title}</LineButton>
                arr.push(b);
            }

            const wrp = (
                <View key={'wrp-' + i} style={[{ width }, { paddingLeft: 30, paddingRight: 30, paddingTop: 8 }]}>
                    <ScrollView>
                        {arr}
                    </ScrollView>
                    <View style={{ paddingLeft: 37, paddingRight: 37, justifyContent: 'center', alignItems: 'center', height: 100 }}>
                        <BlackButton item={{ id: obj.id }} onPress={this._onAllPrdPress}>TÜM {obj.title} ÜRÜNLERİ</BlackButton>
                    </View>
                </View>
            );

            main.push(wrp);
        }

        return (
            <ScrollView ref={ref => this.ScrollView = ref} scrollEnabled={false} horizontal style={{ flex: 1, flexDirection: 'row', }}>
                {main}
            </ScrollView>
        );
    }
    

    render() {
        const { navigation } = this.state;

        if (navigation.length == 0)
            return null;

        const itemWidth = 220, offset = (width - itemWidth) * .5;
        const modal = <NavigationModal mainTitle={navigation[this.state.currentIndex].title} data={this.state.modalData} onClose={() => { this.setModalVisible({ visible: false }); }} visible={this.state.modalVisible} />

        return (
            <View style={{ flex: 1 }}>
                <View style={{ position: 'relative', }}>
                <Carousel
                        threshold={75}
                        offset={offset}
                        width={width}
                        itemWidth={itemWidth}
                        data={this._getMainThumb()}
                        onMove={this._onMove}
                        callback={this._callback}
                        onIndexChange={this._onIndexChange}
                    />
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ height: 11, backgroundColor: '#FFFFFF', flex: 1 }} />
                        <Image
                            resizeMode="contain"
                            style={{ width: 220, height: 11, }}
                            source={require('root/assets/images/mask.png')}
                        />
                        <View style={{ height: 11, backgroundColor: '#FFFFFF', flex: 1 }} />
                    </View>
                </View>

                {this._getContent()}

                {modal}

            </View>
        );
    }
}

const styles = StyleSheet.create({

});

export { Navigation };
