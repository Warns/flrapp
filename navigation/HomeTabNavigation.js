import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Minus99HorizontalTabs } from '../app/components';
import DiscoverPage from '../app/views/Discover';
import ShopMenuPage from '../app/views/ShopMenu';
import OffersPage from '../app/views/Offers';



class CustomHorizontalTabs extends React.Component {

  jumpToIndex = this.props.jumpTo;

  _onTabsPress = (obj, index) => {
    this.jumpToIndex(obj.routeName);
  }

  render(){

    //console.log(this.props.navigationState.routes );

    const routes = this.props.navigationState.routes,
    i = this.props.navigationState.index;

    return(
      <View style={{flex:1, maxHeight:40, flexDirection:'row', backgroundColor:'#ffffff', borderColor:'#D8D8D8', borderBottomWidth:1}}>
        <Minus99HorizontalTabs items={routes} selected={i} callback={this._onTabsPress} />
        <View style={{flex:1, maxWidth:50,}}>
          <Image source={require('../assets/images/icons/more.png')} style={{width:40, height:40, resizeMode:'contain'}} />
        </View>
      </View>
    )
  }
}

export default MainTabNavigator = createMaterialTopTabNavigator(
  {
    Discover: {
      screen: DiscoverPage,
    },
    ShopMenu: {
      screen: ShopMenuPage,
    },
    Offers: {
      screen: OffersPage,
    },
  },
  {
    tabBarComponent: CustomHorizontalTabs,
    lazy: true,
    tabBarPosition: 'top',
    initialRouteName:'Discover',
  }
);