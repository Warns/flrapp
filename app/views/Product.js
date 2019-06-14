import React from 'react';
import {
  View,
  Text,
  Image,
  Easing,
  Animated,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';

import {
  Details,
  Videos,
  ReviewsList,
  Review
} from './product';

import {
  CLOSE_PRODUCT_DETAILS
} from "root/app/helper/Constant";

class DetailsPage extends React.Component {
  render() { return <Details {...this.props} /> }
}

class VideosPage extends React.Component {
  render() { return <Videos {...this.props} /> }
}

class ReviewsListPage extends React.Component {
  render() { return <ReviewsList {...this.props} /> }
}

class ReviewPage extends React.Component {
  render() { return <Review {...this.props} /> }
}

const ProductNavigator = createStackNavigator(
  {
    productDetails: { screen: DetailsPage },
    productVideos: { screen: VideosPage },
    productReviewsList: { screen: ReviewsListPage },
    productReview: { screen: ReviewPage },
    //productImageZoom: { screen: ImageZoom },
  },
  {
    index: 0,
    lazy: true,
    initialRouteName: 'productDetails',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
    cardStyle: {
      backgroundColor: '#ffffff',
      //backgroundColor:'transparent',
      //opacity:1,
      elevation: 0,
    },
    /*
    transitionConfig : () => ({
      containerStyle: {
        backgroundColor: 'transparent',
      }
    })
    */
  }
);

class ProductView extends React.Component {

  _onRequestClose = () => {
    this.props.dispatch({ type: CLOSE_PRODUCT_DETAILS, Value: {} });
  }

  render() {
    return (
      <Modal
        animationType='none'
        transparent={true}
        visible={this.props.product.visibility}
        onRequestClose={this._onRequestClose}
      >
        <ProductNavigator {...this.props} />
      </Modal>
    )
  }
}

// filter state
function mapStateToProps(state) { return state.general; }
export default connect(mapStateToProps)(ProductView);


