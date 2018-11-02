import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';

const Minus99HorizontalTabs = class Minus99HorizontalTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      offsets: [],
      selected: null,

    }
  }

  ScrollView = null;

  _x = 0;
  arr = [];
  width = null;

  componentWillReceiveProps(nextProps) {
    const _self = this;
    if (nextProps.selected != _self.props.selected)
      _self._focused(nextProps.selected);
  }

  _onPressItem = (object, sequence) => {
    const _self = this;
    _self.setState({ selectedItem: object.key });
    _self.props.callback(object, sequence);
    _self._focused(sequence);
  };

  _focused = (sequence) => {
    const _self = this,
      max = _self.state.offsets[_self.state.offsets.length - 1].x + _self.state.offsets[_self.state.offsets.length - 1].width - _self.width,
      min = 0,
      s = _self.state.offsets[sequence].x + (_self.state.offsets[sequence].width * .5) - (_self.width * .5);
    _self.ScrollView.scrollTo({ x: s <= min ? min : s >= max ? max : s });
  }

  _onDimensions = (layout, sequence) => {
    this.state.offsets.push({ width: layout.width, sequence: sequence });
    if (this.state.offsets.length == this.props.items.length)
      this._makeMeasurements();
  }

  _makeMeasurements = () => {

    this.width = Dimensions.get('window').width

    this.arr = this.state.offsets;
    this.arr.sort(function (a, b) { return a.sequence - b.sequence });

    for (var i in this.arr) {
      this.arr[i].x = this._x;
      this._x += this.arr[i].width;
    }

    const _self = this;
    setTimeout(() => {
      _self._focused(_self.props.selected);
    }, 1);
  }

  componentDidUpdate() {
    if (this.state.selected != this.props.selected)
      this.setState({ selected: this.props.selected });
  }

  render() {

    const items = [];
    if (this.props.items)
      for (item in this.props.items) {
        let bool = item == this.state.selected ? true : false;
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

  _measureDimensions = (e) => {
    this.props.onDimensions(e.nativeEvent.layout, this.props.sequence);
  }

  render() {

    const item = this.props.item;

    return (
      <TouchableHighlight underlayColor="#ffffff" onPress={this._onPress}>
        <View onLayout={e => this._measureDimensions(e)} style={[{ paddingRight: 15, paddingLeft: 15, }, styles.horizontalTab, this.props.selected ? styles.borderBottom : null]}>
          <Text style={[{ fontSize: 14, fontFamily: 'brandon', fontWeight: "bold", color: '#000000' }]}>{item.key.toUpperCase()}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}


export { Minus99HorizontalTabs };

const styles = StyleSheet.create({

  // HORIZONTAL tabs
  horizontalTabsWrapper: { flex: 1, flexDirection: "row", maxHeight: 40, backgroundColor: "#ffffff", borderBottomColor:'#dddddd', borderBottomWidth:1, },
  horizontalTab: { height: 40, justifyContent: "center", },
  borderBottom: { borderBottomColor: "#000000", borderBottomWidth: 3 },
});
