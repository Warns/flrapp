import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import { MinimalHeader } from 'root/app/components';
import { DefaultButton } from 'root/app/UI';

import { ICONS } from 'root/app/helper/Constant';

const Utils = require('root/app/helper/Global.js');


class ProductReviewsList extends React.Component {

    state = {
        data: [0, 1, 2, 3, 4, 5],
    }

    _onBackPress = () => {
        this.props.navigation.goBack();
    }

    _onAddCommentPress = () => {
        this.props.navigation.navigate('productReview', {});
    }

    componentDidMount() {
        Utils.ajx({ uri: 'https://stg.api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=caB45h2jBqXFw1OE043qoMBD1gJC8EwFNCjktzgwncXY4&Filter=ProductId:data-gen-moppq9ekthfzbc6qff3bqokie&Sort=Rating:desc&Limit=30' }, (result) => {
            if (result['type'] == 'success')
                this.setState({ data: result.data });
        });
    }

    _keyExtractor = (item, index) => index + 'k';

    _renderItem = ({ item, index }) => {
        return (
            <ListItem item={item} index={index} onPressItem={this._onPressItem} />
        )
    }

    render() {

        let { item } = this.props.product;
        //let { items, selected } = this.props.navigation.state.params;

        let _title = item ? item.productName : '';

        let _emptyItems = [];
        let n = 3;
        while (n--) {
            _emptyItems.push(
                <View key={"s" + n} style={{ marginRight: 20, marginLeft: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: "#D8D8D8", flexDirection: 'column-reverse', }}>
                    <ProductSkeleton />
                </View>
            )
        };

        return (
            <View style={{ flex: 1 }}>
                <MinimalHeader title={_title} onPress={this._onBackPress} title={_title} noMargin={this.props.SCREEN_DIMENSIONS.OS == 'android' ? true : false} />
                <View style={{ flex: 1 }}>

                    <FlatList
                        ListHeaderComponent={
                            <View style={{ padding: 30, paddingBottom: 10 }}>
                                <DefaultButton name="YORUM EKLE" callback={this._onAddCommentPress} boxColor="#000000" textColor="#ffffff" borderColor="#ffffff" />
                            </View>}
                        ListFooterComponent={
                            <View style={{ padding: 30 }}>
                                <DefaultButton name="DAHA FAZLA YÜKLE" callback={this._onAddCommentPress} boxColor="transparent" textColor="#000000" borderColor="#000000" />
                            </View>
                        }
                        ListEmptyComponent={<View>{_emptyItems}</View>}

                        style={{ backgroundColor: '#F6F0EF' }}
                        scrollEnabled={true}
                        data={this.state.data.Results}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />

                </View>
            </View>
        )
    }
}

class ListItem extends React.Component {

    render() {

        const { item } = this.props;

        Moment.locale('tr-TR');
        let _date = Moment(item.SubmissionTime).format('D MMM YYYY');

        let _ratingTop = - Math.floor(item.Rating) * 12;

        return (

            <View style={{ marginRight: 20, marginLeft: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: "#D8D8D8", flexDirection: 'column-reverse', }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 25 }}>{item.Title}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, }}>
                    <View style={{ width: 68, height: 12, position: 'relative', overflow: 'hidden', marginTop: 2, marginRight: 10, zIndex: 1 }}>
                        <Image source={ICONS['stars']} style={{ width: 68, height: 72, position: 'absolute', top: _ratingTop }} />
                    </View>
                    <Text style={{ fontSize: 13, color: '#6C6C6C', }}>{item.Rating + "/" + item.RatingRange}</Text>
                    <Text style={{ flex: 1, fontSize: 13, color: '#6C6C6C', alignContent: 'flex-end', textAlign: 'right', }}>{_date}</Text>
                </View>

                <Text style={{ fontSize: 15, color: '#6C6C6C' }}>{item.ReviewText}</Text>

                <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 25 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', }}>{item.UserNickname}</Text>
                    <Text style={{ fontSize: 15, marginLeft: 10, color: '#6C6C6C' }}>{item.UserLocation}</Text>
                </View>
            </View>
        );
    }
};

class ProductSkeleton extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, marginTop: 25, marginBottom: 25 }}>
                <View style={{ width: 140, height: 16, backgroundColor: '#CFC1BE', }}></View>
                <View style={{ width: 68, height: 12, position: 'relative', overflow: 'hidden', marginTop: 2, marginRight: 10, zIndex: 1 }}>
                    <Image source={ICONS['stars']} style={{ width: 68, height: 72, position: 'absolute', top: 0 }} />
                </View>
                <View style={{ width: "100%", height: 12, marginTop: 7, backgroundColor: '#E6E0DF', }}></View>
                <View style={{ width: "90%", height: 12, marginTop: 7, backgroundColor: '#E6E0DF', }}></View>
                <View style={{ width: "95%", height: 12, marginTop: 7, backgroundColor: '#E6E0DF', }}></View>
                <View style={{ width: "50%", height: 12, marginTop: 7, backgroundColor: '#E6E0DF', }}></View>
            </View>
        )
    }
}

function mapStateToProps(state) { return state.general; }
const ReviewsList = connect(mapStateToProps)(ProductReviewsList);

export { ReviewsList }