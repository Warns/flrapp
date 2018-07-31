/* STYLES */
'use strict';
var React = require('react-native');
var { StyleSheet, } = React;

module.exports = StyleSheet.create({
  // ALL STYLES GO HERE
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row",
  },
  backgroundImage: {
    flex:1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom:0,
    width: null,
    height: null,
  },

  iconButton:{ width:40, height:40, justifyContent:"center", alignItems:"center" },
  boxButton:{ alignItems:"center", justifyContent:"center", backgroundColor:"#5F00D8", height:50 },

  xlarge:{ fontSize: 28 },
  large:{ fontSize: 22 },
  normal:{ fontSize: 16 },
  small:{ fontSize: 14 },
  tiny:{ fontSize: 12 },

  bold:{ fontWeight: "bold", fontFamily:'brandon'},
  slim:{ fontWeight: "normal" },
  white:{ color:"#ffffff" },
  mainColor:{ color:"#5F00D8" },
  lightColor:{ color:"#80808D" },

  right:{ justifyContent:"flex-end", flexDirection:"row" },
  left:{ justifyContent:"flex-start", flexDirection:"row" },
  center:{ justifyContent:"center", flexDirection:"row" },
});
