import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';

const Minus99HorizontalTabs = class Minus99HorizontalTabs extends React.Component{

  constructor(props){
    super(props);
    this.state = {

      offsets: [],

    }
  }

  ScrollView = null;

  _x = 0;
  arr = [];
  width = null;

  _onPressItem = ( object, sequence ) => {

    this.setState({selectedItem: object.key });
    this.props.callback( object, sequence );

    var max = this.state.offsets[this.state.offsets.length-1].x + this.state.offsets[this.state.offsets.length-1].width - this.width;
    var min = 0;
    var s = this.state.offsets[sequence].x + (this.state.offsets[sequence].width * .5) - (this.width * .5);

    this.ScrollView.scrollTo({x: s <= min ? min : s >= max ? max : s });

  };

  _onDimensions = ( layout, sequence ) => {
    this.state.offsets.push({width:layout.width, sequence: sequence});
    if( this.state.offsets.length == this.props.items.length )
      this._makeMeasurements();
  }

  _makeMeasurements = () => {

    this.width = Dimensions.get('window').width

    this.arr = this.state.offsets;
    this.arr.sort(function(a, b){ return a.sequence - b.sequence });

    for(var i in this.arr)
    {
      this.arr[i].x = this._x;
      this._x += this.arr[i].width;
    }

  }

  render() {

    const items = [];
    if(this.props.items)
      for(item in this.props.items)
      {
        let bool = item == this.props.selected ? true : false;
        items.push(<TabItem 
                        selected={bool} 
                        key={item} 
                        sequence={item} 
                        onPressItem={this._onPressItem} 
                        item={this.props.items[item]} 
                        onDimensions={this._onDimensions} 
                    />);
      }

    return (
      <ScrollView
        ref={ref => this.ScrollView = ref}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.horizontalTabsWrapper}
        >
        {items}
      </ScrollView>
    );
  }
}

class TabItem extends React.Component {

  _onPress = () => {
    this.props.onPressItem(this.props.item, this.props.sequence);
  }

  _measureDimensions = ( e ) => {
    this.props.onDimensions(e.nativeEvent.layout, this.props.sequence);
  }

  render(){

    const item = this.props.item;

    return(
      <TouchableHighlight underlayColor="#ffffff" onPress={this._onPress}>
        <View onLayout={e => this._measureDimensions(e) } style={[{paddingRight:15, paddingLeft:15,}, styles.horizontalTab, this.props.selected ? styles.borderBottom : null ]}>
          <Text style={[{fontSize:14, fontFamily:'brandon', fontWeight:"bold", color:'#000000'}]}>{item.key.toUpperCase()}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}


export { Minus99HorizontalTabs };

const styles = StyleSheet.create({
  // ALL STYLES GO HERE
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row",
  },
  redBox:{
    backgroundColor:"red",
    height:200,
    justifyContent:"center",
    alignItems:"center",
    marginLeft: 20,
    marginRight: 20,
  },
  container2:{
    backgroundColor:"blue",
    flex:1,
  },
  listItem:{
    flex:1,
    height:140,
    backgroundColor:"#ffffff",
    borderBottomColor:"#dddddd",
    borderBottomWidth:1,
    paddingRight:20,
    paddingTop:0,
    paddingBottom:10,
    paddingLeft:50,
  },
  listItemWrapper:{
    top:-10,
  },
  listItemImage:{
    left:-40,
    top:20,
  },
  listItemFooter:{
    flex:1,
    flexDirection:"row",
    marginTop:10,
    minHeight:20
  },
  timesheetListItem:{
    flex:1,
    minHeight:70,
    backgroundColor:"#ffffff",
    borderBottomColor:"#dddddd",
    borderBottomWidth:1,
    paddingRight:20,
    paddingTop:15,
    paddingBottom:10,
    paddingLeft:20,
  },

  smallUserImage:{
    width:30,
    height:30,
    borderRadius:15,
  },

  timerButtonWrapper:{
    flex:1,
    minHeight:165,
    backgroundColor:"#5C80FF",
    borderBottomColor:"#ffffff",
    borderBottomWidth:1,
  },
  timerButton:{
    minHeight:165,
    width:75,
    justifyContent:"center",
    alignItems:"center",
  },

  xlarge:{ fontSize: 28 },
  large:{ fontSize: 22 },
  normal:{ fontSize: 16 },
  small:{ fontSize: 14 },
  tiny:{ fontSize: 12 },

  bold:{ fontWeight: "bold" },
  slim:{ fontWeight: "normal" },
  white:{ color:"#ffffff" },
  mainColor:{ color:"#5F00D8" },
  lightColor:{ color:"#80808D" },

  right:{ justifyContent:"flex-end", flexDirection:"row" },
  left:{ justifyContent:"flex-start", flexDirection:"row" },
  center:{ justifyContent:"center", flexDirection:"row" },

  tabIcon:{ width:24, height:24, },
  addNewTabIcon: { width:60, height:60, borderRadius:30, borderColor:"#5F00D8", borderWidth:2, justifyContent:"center", alignItems:"center" },
  iconNormalSize: {width:24, height:24},
  iconSmallSize: {width:16, height:16},
  iconTinySize: {width:12, height:12},

  iconButton:{ width:40, height:40, justifyContent:"center", alignItems:"center" },
  boxButton:{ alignItems:"center", justifyContent:"center", backgroundColor:"#5F00D8", height:50 },

  // multiselect box
  searchInput:{ backgroundColor: "#E7E9F1", flex:1, borderRadius:5, padding:5, paddingRight:10, paddingLeft:10, alignItems:"center", fontSize:14 },

  input:{
    minHeight:50,
    backgroundColor:"#ffffff",
    borderColor:"#dddddd",
    borderWidth:1,
    paddingRight:12,
    paddingTop:0,
    paddingLeft:12,
    //justifyContent:"center",
    marginBottom:10,
  },

  contentWrapper:{
    flex:1,
    margin:20,
  },

  welcomeWrapper:{ flex:1, maxHeight:400, minHeight:250, },
  welcomeImage:{ flex:1, alignSelf:'center', resizeMode:'cover', width:"100%", top:0, left:0, },
  welcomeText:{ top:150, left:20, height:100, width:300, backgroundColor:"transparent" },

  listFiltersWrapper:{ padding:20, flex:1, flexDirection:"row" },

  // HORIZONTAL tabs
  horizontalTabsWrapper:{ flex:1, flexDirection:"row", maxHeight:40, backgroundColor:"#ffffff", borderBottomColor:'#D8D8D8', borderBottomWidth:1, },
  horizontalTab:{ height:40, justifyContent:"center", },
  borderBottom:{ borderBottomColor:"#000000", borderBottomWidth:2 },
});
