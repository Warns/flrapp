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

var RCTUIManager = require('NativeModules').UIManager;

styles = require('../../app/styles.js');
globals = require('../../app/globals.js');

let SCREEN_DIMENSIONS  = {};
const HEADER_HEIGHT = Platform.OS === 'android' ? 80 : 65;
const TOP = Platform.OS === 'android' ? 10 : 0;
const DETAIL_HEADER_HEIGHT = Platform.OS === 'android' ? 52 : 65;

let Header = () => {
  return(
    <View style={{height:HEADER_HEIGHT, backgroundColor:'#D8D9DC'}}>
      <Image style={{width:120, position:'absolute', top:TOP, resizeMode:'contain', alignSelf:'center'}} source={require('../../assets/images/logo-b.png')} />
    </View>
  )
}

let categories = [
  {
    selector: 'All',
    id: 'all',
  },
  {
    selector: 'Lipstik',
    id: 'lipstik',
  },
  {
    selector: 'Foundation',
    id: 'foundation',
  },
  {
    selector: 'Nails',
    id: 'nails',
  },
  {
    selector: 'Eyeliner',
    id: 'eyeliner',
  }
];

export default class List extends React.Component{

  static navigationOptions = {
    title: 'Flormar',
    header: Header(),
    headerStyle: {
      backgroundColor: '#000000',
    },
  }

  state = {
    fadeAnim: new Animated.Value(0),
    items: [],
    animatingUri: null,
    imageAnim: new Animated.Value(0),
    measurements: {},
    selectedDetail: null,
    detailIsVisible: false,
  }

  tabs(categories) {
    console.log( categories );
    let routes = [];
    categories.forEach(element => {
      routes[element.id] = this.tab( element );
    });

    return routes;


    /*
    return categories.reduce((routes, category) => {
        routes[category.get('id')] = this.tab(category);

        return routes;
    }, {});
    */
}

  tab( category ){
    //const {t} = this.props;
    const screen = this.getTabForCategory( category );
    return{
      screen: screen,
      navigationOptions:{
        title: category.selector,
      }
    }
  }

  getTabForCategory( category ){
    return() => (<CategoryPage category={category} />);
  }

  CategoriesNavigator = createMaterialTopTabNavigator(
    this.tabs(categories),
    {
      tabBarPosition: 'top',
      tabBarOptions:{
        scrollEnabled: true,
      }
    }
  )

  render(){

    return(
      <View style={{flex:1, backgroundColor:'#ffffff'}}>
        <Text>Hello</Text>
        <this.CategoriesNavigator />
      </View>
    )
  }
}

class CategoryPage extends React.Component{
  render(){

    const content  = this.props.category.selector;

    return(
      <View>
        <Text>{content}</Text>
      </View>
    )
  }
}