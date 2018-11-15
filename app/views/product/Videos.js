import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { MinimalHeader } from 'root/app/components';
import YoutubePlayer from 'root/app/sub-views/YoutubePlayer';

class ProductVideos extends React.Component{

    _onBackPress = ()=>{
        this.props.navigation.goBack();
    }

    render(){

        let { item } = this.props.product;
        let { items, selected } = this.props.navigation.state.params;

        let _title = item ? item.productName : '';

        return(
            <View style={{flex:1}}>
                <MinimalHeader title={_title} onPress={this._onBackPress} title={_title} noMargin={this.props.SCREEN_DIMENSIONS.OS == 'android' ? true : false } />
                <YoutubePlayer items={items} selected={selected} />
            </View>
        )
    }
}

function mapStateToProps(state) { return state.general; }
const Videos = connect(mapStateToProps)( ProductVideos );

export { Videos }