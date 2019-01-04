import Moment from 'moment';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader, Minus99HorizontalTabs } from 'root/app/components';
import { ICONS } from 'root/app/helper/Constant';
import { DefaultButton } from 'root/app/UI';


const Utils = require('root/app/helper/Global.js');


class ProductReviewsList extends React.Component {

    state = {
        data: [0, 1, 2, 3, 4, 5],
        sortSelection: 0,
        sorting: 'Rating:desc',
        limit: 5,
        total: 0,
        noComment: false,
    }

    _onBackPress = () => {
        this.props.navigation.goBack();
    }

    _onAddCommentPress = () => {
        this.props.navigation.navigate('productReview', {});
    }

    _onLoadMorePress = () => {
        let { limit, total } = this.state;
        if (limit < total)
            this.setState({
                limit: limit + 15
            }, () => { this._updateList(); });
    }

    componentDidMount() {
        this._updateList();
    }

    _updateList = () => {

        let { sorting, limit } = this.state;
        Utils.ajx({
            uri:
                'https://stg.api.bazaarvoice.com/data/reviews.json' +
                '?apiversion=5.4' +
                '&passkey=carF2u1HidJWt3HKndfcCctCD4pXmjz9vzavhSM7ldgPA' +
                '&Filter=ProductId:0414001-22711' +
                '&Sort=' + sorting +
                '&Limit=' + limit
        }, (result) => {
            if (result['type'] == 'success' && result.data.TotalResults > 0)
                this.setState({ data: result.data, noComment: false, total: result.data.TotalResults });
            else {
                this.setState({ noComment: true });
            }
        });
    }

    _keyExtractor = (item, index) => index + 'k';

    _renderItem = ({ item, index }) => {
        return (
            <ListItem item={item} index={index} onPressItem={this._onPressItem} />
        )
    }

    _onTabsPress = (val) => {
        this.setState({
            sortSelection: val.name,
            sorting: val.name == 0 ? 'Rating:desc' : 'SubmissionTime:desc'
        }, () => { this._updateList(); });
    }

    render() {

        let { item } = this.props.product;
        let { sortSelection, noComment, total, limit } = this.state;

        let _title = item ? item.productName : '';

        let _emptyItems = [];
        let _sortingTabs = null;

        let _loadMoreButton = null;


        if (noComment) {
            _emptyItems.push(
                <View key="a1" style={{ height: 300, justifyContent: 'center', alignItems: 'center', }}>
                    <Image source={ICONS['comment']} style={{ width: 60, height: 60, resizeMode: 'contain', marginBottom: 30 }} />
                    <Text style={{ fontSize: 16 }}>İlk yorumu sen yap.</Text>
                </View>
            );
        }
        else {
            let n = 3;
            while (n--) {
                _emptyItems.push(
                    <View key={"s" + n} style={{ marginRight: 20, marginLeft: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: "#D8D8D8", flexDirection: 'column-reverse', }}>
                        <ProductSkeleton />
                    </View>
                )
            };

            _sortingTabs = (
                <View style={{ height: 40, marginTop: 20, }}>
                    <Minus99HorizontalTabs items={[{ key: 'Puana göre sırala', name: 0 }, { key: 'Tarihe göre sırala', name: 1 }]} selected={sortSelection} callback={this._onTabsPress} wrapperStyle={{ backgroundColor: 'transparent' }} />
                </View>
            );

            if (total > limit)
                _loadMoreButton = (
                    <View style={{ padding: 30 }}>
                        <DefaultButton name={"DAHA FAZLA YÜKLE (" + limit + "/" + total + ")"} callback={this._onLoadMorePress} boxColor="transparent" textColor="#000000" borderColor="#000000" />
                    </View>
                );
        }

        return (
            <View style={{ flex: 1 }}>
                <MinimalHeader title={_title} onPress={this._onBackPress} title={_title} noMargin={this.props.SCREEN_DIMENSIONS.OS == 'android' ? true : false} />

                < View style={{ flex: 1 }}>

                    <FlatList
                        ListHeaderComponent={
                            <View style={{ padding: 30, paddingBottom: 0, paddingTop: 30, }}>
                                <DefaultButton name="YORUM EKLE" callback={this._onAddCommentPress} boxColor="#000000" textColor="#ffffff" borderColor="#ffffff" />
                                {_sortingTabs}
                            </View>}
                        ListFooterComponent={
                            _loadMoreButton
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

        let _recommendation = null;

        if (item.IsRecommended == true) {
            _recommendation = (
                <View style={{ flexDirection: 'row', marginTop: 10, }}>
                    <Image source={ICONS['thumbsUp']} style={{ width: 30, height: 30, marginRight: 5 }} />
                    <Text style={{ fontSize: 15, lineHeight: 30, color: '#6C6C6C' }}>Öneriyorum</Text>
                </View>
            );
        } else if (item.IsRecommended == false) {
            _recommendation = (
                <View style={{ flexDirection: 'row', marginTop: 10, }}>
                    <Image source={ICONS['thumbsDown']} style={{ width: 30, height: 30, marginRight: 5 }} />
                    <Text style={{ fontSize: 15, lineHeight: 30, color: '#6C6C6C' }}>Önermiyorum</Text>
                </View>
            );
        }

        console.log(item);

        return (

            <View style={{ marginRight: 20, marginLeft: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: "#D8D8D8" }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 25 }}>{item.Title}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, }}>
                    <View style={{ width: 68, height: 12, position: 'relative', overflow: 'hidden', marginTop: 2, marginRight: 10, zIndex: 1 }}>
                        <Image source={ICONS['stars']} style={{ width: 68, height: 72, position: 'absolute', top: _ratingTop }} />
                    </View>
                    <Text style={{ fontSize: 13, color: '#6C6C6C', }}>{item.Rating + "/" + item.RatingRange}</Text>
                    <Text style={{ flex: 1, fontSize: 13, color: '#6C6C6C', alignContent: 'flex-end', textAlign: 'right', }}>{_date}</Text>
                </View>

                <Text style={{ fontSize: 15, color: '#6C6C6C' }}>{item.ReviewText}</Text>

                {_recommendation}

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

export { ReviewsList };

