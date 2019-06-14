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

import { Palette } from '../components';

export default class Offers extends React.Component{

  static navigationOptions = ({ navigation }) => {
    const {state, setParams} = navigation;
    return {
      title: 'hellow',
      headerBackTitle: null,
      headerTintColor: "#7410E0",
    };
  };

  items = [ {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-005_medium.jpg",
    "name": "AUTUMN TIMBER",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 570429,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-autumn-timber/",
    "shortCode": "005",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-005_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-014_medium.jpg",
    "name": "CARNATION RED",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 573103,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-carnation-red/",
    "shortCode": "014",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-014_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-006_medium.jpg",
    "name": "CHERRY BLOSSOM",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 570430,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-cherry-blossom/",
    "shortCode": "006",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-006_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-007_medium.jpg",
    "name": "CLARET RED",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 570431,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-claret-red/",
    "shortCode": "007",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-007_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-004_medium.jpg",
    "name": "DAISY",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 570428,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-daisy/",
    "shortCode": "004",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-004_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-008_medium.jpg",
    "name": "DARK VIOLET",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 570432,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-dark-violet/",
    "shortCode": "008",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-008_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-002_medium.jpg",
    "name": "FALL ROSE",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 567060,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-fall-rose/",
    "shortCode": "002",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-002_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-016_medium.jpg",
    "name": "HOT COCOA",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 573105,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-hot-cocoa/",
    "shortCode": "016",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-016_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-009_medium.jpg",
    "name": "NASTY CORAL",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 573098,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-nasty-coral/",
    "shortCode": "009",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-009_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-013_medium.jpg",
    "name": "PINK DREAM",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 573102,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstickpink-dream/",
    "shortCode": "013",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-013_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-015_medium.jpg",
    "name": "PRETTY PLUM",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 573104,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-pretty-plum/",
    "shortCode": "015",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-015_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-003_medium.jpg",
    "name": "SUNSET",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 567061,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-sunset/",
    "shortCode": "003",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-003_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-010_medium.jpg",
    "name": "TENDER TERRA",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 573099,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-tender-terra/",
    "shortCode": "010",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-010_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-012_medium.jpg",
    "name": "TERRACOTTA",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 573101,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-baked/",
    "shortCode": "012",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-012_small.jpg",
  },
  {
    "hasStock": true,
    "mediumImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-001_medium.jpg",
    "name": "UNDRESSED",
    "patternUrl": "",
    "productGroupId": 228259,
    "productId": 567059,
    "productUrl": "https://www.flormar.com.tr/silk-matte-liquid-lipstick-undressed/",
    "shortCode": "001",
    "smallImageUrl": "http://mcdn.flormar.com.tr/UPLOAD/Flormar/mobile_image_1/thumb/0313062-001_small.jpg",
  }]

  render(){

    return(

        <View style={{flex:1}}>
          <Text>Offers</Text>
          <Palette items={this.items} />
        </View>
    );
    
  }
}