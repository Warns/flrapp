import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader } from 'root/app/components';

class ProductReviewsList extends React.Component{

    _onBackPress = ()=>{
        this.props.navigation.goBack();
    }

    render(){

        let { item } = this.props.product;
        //let { items, selected } = this.props.navigation.state.params;

        let _title = item ? item.productName : '';

        return(
            <View style={{flex:1}}>
                <MinimalHeader title={_title} onPress={this._onBackPress} title={_title} noMargin={this.props.SCREEN_DIMENSIONS.OS == 'android' ? true : false } />
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text>⏳ Reviews integration.</Text>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) { return state.general; }
const ReviewsList = connect(mapStateToProps)( ProductReviewsList );

export { ReviewsList }