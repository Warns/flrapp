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

import { 
  SET_SELECTED_CATEGORY,
  NAVIGATE,
} from 'root/app/helper/Constant';
import { store } from 'root/app/store';

styles = require('../../app/styles.js');
globals = require('../../app/globals.js');

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

  _goBack = () => {
    
  }

  _cats = store.getState().general.categories

  static navigationOptions = ({ navigation }) => {
    const {state, setParams} = navigation;
    return {
      title: 'hellow',
      header: () => <MinimalHeader onPress={()=> store.dispatch({type: NAVIGATE, value:{item:{navigation:"Home"}}}) } nav={navigation} title={ store.getState().general.selectedCategory } />,
      headerBackTitle: null,
      headerTintColor: "#7410E0",
    };
  };

  CategoriesNavigator = createMaterialTopTabNavigator(
    tabs( this._cats ),
    {
      tabBarComponent: this._cats.length > 1 ? CustomHorizontalTabs : null,
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

    //console.log('kkkkkkk', this.props.navigationState.routes[this.props.navigationState.index].key );

    const routes = this.props.navigationState.routes,
    i = this.props.navigationState.index;

    store.dispatch({type:SET_SELECTED_CATEGORY, value:this.props.navigationState.routes[this.props.navigationState.index].key});

    return(
      <Minus99HorizontalTabs items={routes} selected={i} callback={this._onTabsPress} />
    )
  }
}