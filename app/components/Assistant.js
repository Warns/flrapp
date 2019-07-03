import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Modal,
  WebView,
  Platform,
  KeyboardAvoidingView,
  Linking
} from "react-native";

import { connect } from "react-redux";
import { MinimalHeader } from "../components/header/MinimalHeader";
import {
  SET_ASSISTANT,
  ASSISTANT_OPENED,
  OPEN_PRODUCT_DETAILS,
  SHOW_CUSTOM_POPUP,
  SET_VIDEO_PLAYER,
  FEEDSTYPE,
  SET_CATEGORIES,
  SET_SELECTED_CATEGORY,
  NAVIGATE,
  SET_VIEWER,
  SET_WEBVIEW
} from "root/app/helper/Constant";
import Dahi from "root/app/extra/yapaytech";

const Utils = require("root/app/helper/Global.js");
const Globals = require("root/app/globals.js");

//globals = require('../globals.js');

class Assistant extends React.Component {
  state = {
    expanded: false,
    assistantIsVisible: false,
    boxAnim: new Animated.Value(0),
    opacity: 0
  };

  componentDidMount() {
    const _self = this,
      { onRef } = _self.props;

    _self._isMounted = true;

    if (onRef) onRef(this);
  }

  componentWillUnmount() {
    const _self = this,
      { onRef } = _self.props;

    _self._isMounted = false;

    if (onRef) onRef(null);
  }

  _openModal = () => {
    this.setState({ assistantIsVisible: true });
    this._animateBox();
  };

  _animateBox = () => {
    Animated.timing(this.state.boxAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic)
    }).start();
  };

  _closeModal = () => {
    this.setState({
      assistantIsVisible: false,
      expanded: false
    });
    this.state.boxAnim.setValue(0);
  };

  _expand = () => {
    this.setState({ expanded: true });
  };

  _onMessage = m => {
    console.log(m);
  };

  _closed = () => {
    const _self = this;
    /* toogle olduğu için kapanacak */
    _self.props.dispatch({ type: ASSISTANT_OPENED });
  };

  render() {
    const _self = this,
      { user = {} } = _self.props,
      userID = user.userId || "";

    return (
      <Dahi
        header={
          <MinimalHeader
            noMargin={true}
            title="Kapat"
            onCardPress={_self._closed}
            onPress={_self._closed}
          />
        }
        onRef={ref => _self.props.dispatch({ type: SET_ASSISTANT, value: ref })}
        user={userID}
        token="89400cde1b7e4df233b195554d93c69f"
        event={(type, data) => {
          const { id = "", labels = "" } = data;
          switch (type) {
            case "barcode": {
              const { barcode = "" /*'8690604539086',*/ } = data;
              Globals.AJX(
                {
                  _self: _self,
                  uri: Utils.getURL({
                    key: "product",
                    subKey: "getProductIdByBarcode"
                  }),
                  data: { barcode: barcode }
                },
                res => {
                  const { status, data = {} } = res,
                    { productId = "" } = data;

                  if (status == 200) {
                    _self.props.dispatch({
                      type: OPEN_PRODUCT_DETAILS,
                      value: {
                        id: productId,
                        measurements: {},
                        animate: false,
                        sequence: 0
                      }
                    });
                  }
                }
              );
              break;
            }
            case "Webview": {
              _self.props.dispatch({
                type: SHOW_CUSTOM_POPUP,
                value: {
                  visibility: true,
                  type: SET_WEBVIEW,
                  data: data
                }
              });
              break;
            }
            case "external": {
              if (labels == FEEDSTYPE["PRODUCT"])
                _self.props.dispatch({
                  type: OPEN_PRODUCT_DETAILS,
                  value: {
                    id: id,
                    measurements: {},
                    animate: false,
                    sequence: 0
                  }
                });
              else if (labels == FEEDSTYPE["VIDEO"]) {
                const { videoName = "", youtubeId = "" } = data;
                _self.props.dispatch({
                  type: SHOW_CUSTOM_POPUP,
                  value: {
                    visibility: true,
                    type: SET_VIDEO_PLAYER,
                    data: {
                      selected: 0,
                      items: [
                        {
                          provider: "youtube",
                          text: videoName,
                          videoId: youtubeId
                        }
                      ]
                    }
                  }
                });
              } else if (FEEDSTYPE["BLOGPOST"] == labels) {
                const data = {
                  type: "htmlToJSON",
                  itemType: "customDetail",
                  uri: {
                    key: "export",
                    subKey: "getExport"
                  },
                  keys: {
                    id: "id",
                    arr: "html",
                    obj: "data",
                    objArr: "content"
                  },
                  data: {
                    exportType: "mobiAppFeedsDetail",
                    customParameters: [
                      {
                        key: "icr",
                        value: id
                      }
                    ]
                  }
                };

                _self.props.dispatch({
                  type: SHOW_CUSTOM_POPUP,
                  value: { visibility: true, type: SET_VIEWER, data: data }
                });

                break;
              } else if (
                FEEDSTYPE["CAMPAING"] == labels ||
                FEEDSTYPE["COLLECTION"] == labels
              ) {
                const {
                    title = "",
                    utp = "",
                    image_link = "",
                    desc = "",
                    catCode = ""
                  } = data,
                  arr = [
                    {
                      title: title,
                      img: Utils.getImage(image_link),
                      utpId: utp,
                      desc: desc,
                      id: catCode //--> kategori id'si
                    }
                  ];

                _self.props.dispatch({ type: SET_CATEGORIES, value: arr });
                _self.props.dispatch({
                  type: SET_SELECTED_CATEGORY,
                  value: title
                });
                _self.props.dispatch({
                  type: NAVIGATE,
                  value: { item: { navigation: "Category" } }
                });
              }

              break;
            }

            default:
              break;
          }

          _self._closed();
          console.log("@", type, data);
        }}
      />
    );

    /* let topMargin = this.state.boxAnim.interpolate({
       inputRange: [0, 1],
       outputRange: [100, 0],
     });

     let vailHeight = this.state.expanded ? 0 : null;
     let area = this.state.expanded ? null : <TouchableOpacity style={styles.area} activeOpacity={1} onPress={this._expand} />;

     let header = this.state.expanded ? <MinimalHeader title="" onBackPress={this._closeModal} /> : null;


     return (

       <View style={styles.wrapper}>
         <TouchableOpacity activeOpacity={.9} onPress={this._openModal}>
           <View style={styles.circle}>
             <Image source={require('../../assets/images/assistant.gif')} style={{ resizeMode: 'contain', width: 50, height: 50, borderRadius: 25 }} />
           </View>
         </TouchableOpacity>
         <Modal
           animationType="none"
           transparent={true}
           visible={this.state.assistantIsVisible}
         >
           <View style={{ backgroundColor: 'rgba(0,0,0,.4)', flex: 1 }}>
             <View style={{ flex: 1, maxHeight: vailHeight }}>
               <TouchableOpacity style={{ flex: 1 }} onPress={this._closeModal} />
             </View>
             {header}
             <Animated.View style={{ flex: 1, marginTop: topMargin, backgroundColor: '#ffffff' }}>
               <Image source={require('../../assets/images/loader.gif')} style={{ position: 'absolute', alignSelf: 'center', bottom: 100, width: 250, height: 151, }} />
               {area}
               <WebView
                 source={{ uri: 'https://www.minus99.com/lab/misc/flormar-assistant.html' }}
                 style={{ margin: 0, opacity: this.state.opacity }}
                 onLoadEnd={() => { this.setState({ opacity: 1 }) }}
                 onMessage={this._onMessage}
               />
             </Animated.View>
           </View>
         </Modal>
       </View>

     )
     */
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(0,0,0,.1)",
    width: 52,
    height: 52,
    position: "absolute",
    overflow: "hidden",
    bottom: 15,
    right: 15,
    borderRadius: 26,
    padding: 1,
    ...Platform.select({
      ios: {
        zIndex: 9
      },
      android: {
        elevation: 999
      }
    })
  },
  circle: {
    backgroundColor: "#dddddd",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        zIndex: 9
      },
      android: {
        elevation: 999
      }
    })
  },
  area: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    zIndex: 1
  }
});

// filter state
function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Assistant);
