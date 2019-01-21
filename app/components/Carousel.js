import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    Image,
} from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import { Item } from '../UI';

/*
    https://github.com/kkemple/react-native-sideswipe
*/

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0
        }
    }

    _onIndexChange = (index) => {
        this.setState(() => ({ currentIndex: index }));
        const { onIndexChange, data } = this.props;
        if (onIndexChange)
            onIndexChange({ item: data[index], index: index });
    }

    _onMove = ({ dx }) => {
        const { onMove } = this.props;
        if (onMove)
            onMove({ value: dx });
    }

    _getItem = ({ ind, animatedValue }) => {
        const { data, itemTyp = 'nav' } = this.props;
        if (itemTyp == 'nav')
            return <Item index={ind} animatedValue={animatedValue} data={data[ind]} />
    }

    _getBullet = () => {
        const { currentIndex } = this.state;
        const { data, } = this.props;
        const arr = [],
            k = data.length;
        for (let i = 0; i < k; ++i) {
            let op = .6,
                m = 4;
            if (i == currentIndex)
                op = 1;
            if (i == k - 1)
                m = 0;

            arr.push(<View key={'bullet-' + i} style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' }, { opacity: op, marginRight: m }]}></View>);
        }

        return (
            <View pointerEvents={'none'} style={{ position: 'absolute', flexDirection: 'row', left: 0, right: 0, justifyContent: 'center', bottom: 20, }}>
                {arr}
            </View>
        )
    }

    _callback = (o) => {
        const { callback } = this.props;
        if (callback)
            callback(o);
    }

    render() {
        const { data, itemWidth, width = Dimensions.get('window').width, offset = 0, threshold = 0 } = this.props;

        return (
            <View style={{ position: 'relative', }}>
                <SideSwipe
                    data={data}
                    shouldCapture={() => true}
                    style={[{ ...this.props.style }, { width }]}
                    contentContainerStyle={{ ...this.props.contentStyle }}
                    itemWidth={itemWidth}
                    threshold={threshold}
                    extractKey={item => 'ids-' + item.id}
                    contentOffset={offset}
                    onMove={this._onMove}
                    callback={this._callback}
                    onIndexChange={this._onIndexChange}
                    renderItem={({ itemIndex, currentIndex, item, animatedValue }) => this._getItem({ ind: itemIndex, animatedValue: animatedValue })}
                />
                {this._getBullet()}
            </View>
        );
    }
}

export { Carousel }