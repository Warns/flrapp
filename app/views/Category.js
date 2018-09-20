import React from 'react';
import {
  Platform,
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { TabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

styles = require('../../app/styles.js');
globals = require('../../app/globals.js');

import { store } from '../../app/store';
import { Minus99HorizontalTabs } from '../components';
import { MinimalHeader } from '../components';
import ListPage from './List';

function tabs(categories) {
  let routes = [];
  categories.forEach(element => {
    routes[element.title] = tab( element );
    //routes[element.title].params = 'nanay';
  });

  return routes;
}

function tab( category ){

  //console.log( category );
  //const {} = this.props;
  //const screen = getTabForCategory( category );

  //console.log( category );

  return{
    screen:  props => getTabForCategory({ category: category, props: props }),
    navigationOptions:{
      title: category.selector,
    }
  }
}

function getTabForCategory( {category, props} ){
  return <ListPage {...props} category={category} />;
}

export default class CategoryTabs extends React.Component{

  static navigationOptions = ({ navigation }) => {
    const {state, setParams} = navigation;
    return {
      title: 'hellow',
      header: () => <MinimalHeader nav={navigation} title={ store.getState().general.selectedCategory } />,
      headerBackTitle: null,
      headerTintColor: "#7410E0",
    };
  };

  CategoriesNavigator = createMaterialTopTabNavigator(
    tabs( store.getState().general.categories ),
    {
      tabBarComponent: CustomHorizontalTabs,
      lazy: true,
      tabBarPosition: 'top',
      initialRouteName: store.getState().general.selectedCategory,
    }
  );

  render(){

    //console.log('>>>>>', store.getState().general.selectedCategory);

    //console.log( store.getState().general );

    //return(<View />);

    return( <this.CategoriesNavigator /> );
    
  }
}

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
      <Minus99HorizontalTabs items={routes} selected={i} callback={this._onTabsPress} />
    )
  }
}