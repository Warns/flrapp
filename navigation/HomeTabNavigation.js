import React from 'react';
import {
  View,
  BackHandler,
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Minus99HorizontalTabs } from '../app/components';
import DiscoverPage from '../app/views/Discover';
import { MoreButton } from 'root/app/UI';
import { Viewer, CampaingExtraHeader } from 'root/app/viewer';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SET_MAIN_NAVIGATION,
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

class CustomHorizontalTabs extends React.Component {

  jumpToIndex = this.props.jumpTo;

  _onTabsPress = (obj, index) => {
    this.jumpToIndex(obj.routeName);
  }

  render() {
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
      "bgrCode": "7259"
    },
    "customFunc": "campaing"
  }
};

class Feeds extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    store.dispatch({ type: SET_MAIN_NAVIGATION, value: this.props.navigation });
  }

  componentWillMount() {
    this.props.navigation.setParams({ title: 'YENİLER' });
  }

  render() {
    let props = this.props;
    return <Viewer {...props} config={CONFIG['feeds']} refreshing={false} />
  }
};

class Extra extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() { this.props.navigation.setParams({ title: 'EXTRA FIRSAT', indicator: true }); }
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

