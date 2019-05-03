import React from 'react';
import {
  View,
  Image,
  Animated,
  FlatList,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { ICONS } from 'root/app/helper/Constant';
import { Minus99MultipleSelect, SelectBox } from 'root/app/form';

class Palette extends React.Component {

  state = {
    selected: 0,
    items: [],
    index: 0,
    width: 50,
    visible: false,
    refresh: false,
  }

  componentWillMount() {
    let index = 0;
    let { items, selected, width } = this.props;

    for (i in items)
      if (items[i].productId === selected)
        break;
    index = i;

    if (items.length * this.state.width < width) {
      this.setState({
        width: Math.ceil(width / items.length),
      })
    }

    this.setState({
      items: items,
      selected: selected,//[items.findIndex(obj => obj.shortCode == selected)],
      index: index,
    });
  }

  _keyExtractor = (item, index) => index + 'k';

  _renderItem = ({ item, index }) => {
    let sel = item.productId == this.state.selected ? true : false;
    
    return (
      <ListItem isSelected={sel} width={this.state.width} item={item} index={index} onPressItem={this._onPressItem} />
    )
  }

  _renderModalItem = ({ item, index }) => {
    let sel = item.productId == this.state.selected ? true : false;
    
    return (
      <ModalListItem isSelected={sel} width={this.state.width} item={item} index={index} onPressItem={this._onPressItem} />
    )
  }

  //_listRef = null;

  _onPressItem = (index, item) => {

    this._closeModal();

    this.setState({
      refresh: !this.state.refresh
    })

    this.props.onPress(item.productId);

    this.setState({
      index: index,
      selected: item.productId,
    })

    //console.log(this.state)

    //this.refs.flatList.scrollToEnd();

    //console.log('pps>', this.listRef);

    /*
    let data = [];
    for(var i=0; i<this.props.items.length; ++i){
      data.push(this.props.items[i]);
    }

    this.setState({
      items: data,
      selected: item.shortCode,
      index: index,
      selectedDetail: index,
      animatingUri: this.state.items[index].mediumImageUrl,
    });
    */
  }

  _onColorSelectorPress = () => {
    this.setState({ visible: true });
  }

  _closeModal = () => {
    this.setState({ visible: false });
  }

  layout = (data, index) => {
    return { length: 50, offset: 50 * index, index }
  };

  render() {

    let { items, width } = this.props;
    let colorsArray = [];

    //console.log('palette', items.length);

    if (items.length * this.state.width < width) {
      this.setState({
        width: Math.ceil(width / items.length),
      })
    }

    /*
    for( i in items ){
      colorsArray.push({
        name: items[i].shortCode + ' ' + items[i].name,
        id: items[i].productId,
        order: i,
        icon: items[i].smallImageUrl.replace('mobile_image_1', 'mobile_texture').replace('http', 'https')
      })
    }
*/
    //console.log('>>>..', this.state.selected);

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', maxHeight: 165, height: 125, backgroundColor: '#ffffff' }}>
        <FlatList
          //style={{ borderWidth: 1, borderColor: 'red' }}
          scrollEnabled={true}
          data={items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          extraData={this.state.refresh}
          ref='flatList'
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this._onColorSelectorPress}>
          <View style={{ backgroundColor: '#ffffff', height: 60, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20, }}>
            <Text style={{ fontSize: 13, marginRight: 5 }}>RENK</Text>
            <Text style={{ color: '#6C6C6C', fontSize: 13, }}>{items[this.state.index].shortCode + ' ' + items[this.state.index].name}</Text>
            <View style={{ height: 28, borderWidth: 1, borderColor: '#979797', borderRadius: 14, paddingLeft: 10, paddingRight: 3, right: 20, position: 'absolute', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12 }}>{items.length}</Text>
              <Image source={(ICONS['downArrow'])} style={{ width: 28, height: 28, resizeMode: 'contain' }} />
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          visible={this.state.visible}
          animationType="slide"
          transparent={true}
          onRequestClose={this._closeModal}
        >
          <View style={{ flex: 1, maxHeight: 200, height: 200, backgroundColor: "rgba(0,0,0,.2)" }}>
            <TouchableOpacity style={{ height: 200 }} onPress={this._closeModal}>
            </TouchableOpacity>
          </View>
          <FlatList
            style={{ backgroundColor: '#ffffff' }}
            scrollEnabled={true}
            data={items}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderModalItem}
            ref='modalFlatList'
          />
        </Modal>
        { /*
        <Minus99MultipleSelect
        defaultTitle='RENK'
        slug='RENK'
        callback={this._closed}
        selected={this.state.selected}
        multiple={false}
        items={colorsArray}
        /> */
        }
      </View >
    )
  }
}

class ListItem extends React.Component {

  state = {
    isSelected: false,
  }

  _onPress = () => {
    this.props.onPressItem(this.props.index, this.props.item);
  }

  componentDidMount() {
    this.setState({
      isSelected: this.props.isSelected,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSelected != this.state.isSelected) {
      this.setState({ isSelected: nextProps.isSelected });
    }
  }

  render() {

    const { item, index, width } = this.props;
    const { isSelected } = this.state;

    let thumbnail = item.smallImageUrl.replace('mobile_image_1', 'mobile_texture');//.replace('http', 'https');
    let _height = isSelected ? 65 : 60;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        ref='Single'
        onPress={this._onPress}>
        <View style={{ width: width, height: 65, flexDirection: 'column-reverse' }}>
          <Image
            style={{ width: width, height: _height, resizeMode: 'cover', }}
            source={{ uri: thumbnail }}
          />
        </View>
      </TouchableOpacity>
    );
  }
};

class ModalListItem extends React.Component {

  state = {
    isSelected: false,
  }

  _onPress = () => {
    this.props.onPressItem(this.props.index, this.props.item);
  }

  componentDidMount() {
    this.setState({
      isSelected: this.props.isSelected,
    });
  }

  render() {

    const { item, index, width } = this.props;
    const { isSelected } = this.state;

    let thumbnail = item.smallImageUrl.replace('mobile_image_1', 'mobile_texture');//.replace('http', 'https');

    let check = isSelected ? <Image source={(ICONS['check'])} style={{ position: 'absolute', right: 20, width: 32, height: 32, resizeMode: 'contain' }} /> : null;
    let selectedStyle = isSelected ? { fontWeight: 'bold' } : {};

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        ref='Single'
        onPress={this._onPress}>
        <View style={{ position: 'relative', height: 60, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 40, height: 40, resizeMode: 'cover', margin: 10, }}
            source={{ uri: thumbnail }}
          />
          <Text style={[{ marginRight: 10 }, selectedStyle]}>{item.shortCode}</Text>
          <Text style={selectedStyle}>{item.name}</Text>
          {check}
        </View>
      </TouchableOpacity>
    );
  }
};

export { Palette };