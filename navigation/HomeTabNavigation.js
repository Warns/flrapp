import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Minus99HorizontalTabs } from '../app/components';
import DiscoverPage from '../app/views/Discover';
import { MoreButton } from 'root/app/UI';
import { Viewer } from 'root/app/viewer';

import {
  ICONS,
} from 'root/app/helper/Constant';
import { ScrollView } from 'react-native-gesture-handler';

class CustomHorizontalTabs extends React.Component {

  jumpToIndex = this.props.jumpTo;

  _onTabsPress = (obj, index) => {
    this.jumpToIndex(obj.routeName);
  }

  render() {

    //console.log(this.props.navigationState.routes );

    const routes = this.props.navigationState.routes,
      i = this.props.navigationState.index;

    return (
      <View style={{ flex: 1, maxHeight: 40, flexDirection: 'row', backgroundColor: '#ffffff' }}>
        <Minus99HorizontalTabs items={routes} selected={i} callback={this._onTabsPress} />
        <View style={{ flex: 1, maxWidth: 50, borderBottomColor: '#dddddd', borderBottomWidth: 1 }}>
          <MoreButton />
        </View>
      </View>
    )
  }
}

const CONFIG = {
  feeds: {
    "title": "FEEDS",
    "type": "segmentify",
    "itemType": "feeds",
    "keys": {
      "id": "productId",
      "arr": "seg",
    },
    "data": {
      "name": "PAGE_VIEW",
      "category": "Home Page"
    }
  },
  campaing: {
    "title": "KAMPANYALAR",
    "type": "listViewer",
    "itemType": "campaing",
    "uri": {
      "key": "banner",
      "subKey": "getBannerList"
    },
    "siteURI": "/kampanyalar.html",
    "keys": {
      "id": "id",
      "arr": "banners",
    },
    "data": {
      "bgrCode": "6764"
    },
    "customFunc": "campaing"
  }
};

class CampaingExtraHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const _self = this;
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ position: 'absolute', alignItems: 'center', zIndex: 2 }}>
          <Image
            style={{
              width: 120,
              height: 43,
              marginTop: 31,
              marginBottom: 15
            }}
            source={ICONS['campaingTitle']}
          />
          <View style={{ borderColor: '#FFFFFF', borderWidth: 3, backgroundColor: '#4acacf', width: 101, height: 101, borderRadius: 101, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: '#FFFFFF', fontFamily: 'RegularTyp2' }}>Bakiyeniz</Text>
            <Text style={{ fontSize: 30, color: '#FFFFFF', fontFamily: 'Regular' }}>₺23</Text>
          </View>
        </View>
        <Image
          style={{
            width: '100%',
            height: 220,
            resizeMode: 'cover',
          }}
          source={ICONS['campaingRectangle']}
        />
        <Text style={{ fontSize: 18, color: '#4a4a4a', fontFamily: 'RegularTyp2', paddingBottom: 10 }}>Size özel kazanç dolu kampanyalar</Text>
      </View>
    );
  }
}

class Feeds extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() { this.props.navigation.setParams({ title: 'YENİLER' }); }
  render() {
    let props = this.props;
    return <Viewer {...props} config={CONFIG['feeds']} refreshing={false} />
  }
};

class Extra extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() { this.props.navigation.setParams({ title: 'EKTRA FIRSAT', indicator: true }); }
  render() {
    let props = this.props;
    return (
      <ScrollView style={{ flex: 1 }}>
        <CampaingExtraHeader />
        <Viewer scrollEnabled={false} {...props} config={CONFIG['campaing']} refreshing={false} />
      </ScrollView>
    )
  }
};

export default MainTabNavigator = createMaterialTopTabNavigator(
  {
    Feeds: {
      screen: Feeds
    },
    Categories: {
      screen: DiscoverPage,
    },
    Promo: {
      screen: Extra
    },
  },
  {
    tabBarComponent: CustomHorizontalTabs,
    lazy: true,
    tabBarPosition: 'top',
    initialRouteName: 'Feeds',
  }
);

