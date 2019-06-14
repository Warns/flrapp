import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
  itemsWidth = null;

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
    if (this.itemsWidth > this.width) {
      const _self = this,
        max = _self.state.offsets[_self.state.offsets.length - 1].x + _self.state.offsets[_self.state.offsets.length - 1].width - _self.width,
        min = 0,
        s = _self.state.offsets[sequence].x + (_self.state.offsets[sequence].width * .5) - (_self.width * .5);
      _self.ScrollView.scrollTo({ x: s <= min ? min : s >= max ? max : s });
    }
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

    this.itemsWidth = this._x //+ this.arr[this.arr.length - 1].width;

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
        style={[styles.horizontalTabsWrapper, this.props.wrapperStyle]}
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

    let title = item.key,
      indicator = null;

    if (item.params) {
      title = item.params.title ? item.params.title : title;
      indicator = item.params.indicator ? <View style={{ width: 6, height: 6, backgroundColor: '#FF2B94', borderRadius: 3, marginLeft: 5 }}></View> : null;
    }

    return (
      <TouchableOpacity activeOpacity={.7} onPress={this._onPress}>
        <View onLayout={e => this._measureDimensions(e)} style={[{ paddingRight: 15, paddingLeft: 15, }, styles.horizontalTab, this.props.selected ? styles.borderBottom : null]}>
          <Text style={[{ fontSize: 14, fontFamily: 'brandon', fontWeight: "bold", color: '#000000' }]}>{title.toUpperCase()}</Text>
          {indicator}
        </View>
      </TouchableOpacity>
    );
  }
}


export { Minus99HorizontalTabs };

const styles = StyleSheet.create({

  // HORIZONTAL tabs
  horizontalTabsWrapper: { flex: 1, flexDirection: "row", maxHeight: 40, backgroundColor: "#ffffff", borderBottomColor: '#dddddd', borderBottomWidth: 1, },
  horizontalTab: { height: 40, alignItems: "center", flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: 'rgba(0,0,0,0)' },
  borderBottom: { borderBottomColor: "#000000" },
});
