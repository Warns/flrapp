import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/*
  https://github.com/facebook/react-native/issues/614
  
  render() {
    const htm = 'Bir stajyer <b>Monitise</b>’a toplamda <b>4.2</b> puan verdi.<span>7 dk önce</span>';
    return (
      <View style={styles.container}>
        <ParserHTML>{htm}</ParserHTML>
      </View>
    );
  }

*/

class ParserHTML extends Component {

    constructor(props) {
        super(props);
    }

    _render = (text) => {
        text = text.split(/(<.*?>.*?<\/.*?>)/g);   
        const style = { ...this.props.style };
        for (var i = 1; i < text.length; i += 2) {    
            var word = text[i].replace(/<.*?>(.*?)<\/.*?>/, '$1'),
                tagName = text[i].match(/<([^\s>]+)(\s|>)+/)[1];            
            text[i] = <Text key={i} style={[styles[tagName], style]}>{word}</Text>;
        }
        return text;
    }

    render() {
        return (
            <Text style={this.props.wrapperStyle}>{this._render(this.props.children)}</Text>
        );
    }
}

const styles = StyleSheet.create({
    u: {
        textDecorationLine: 'underline',
    },
    b: {
        fontFamily: 'Medium',
        fontSize: 16,
        lineHeight: 23,
    },
    time: {
        color: '#adabab',
        fontSize: 16,
        lineHeight: 23,
    }
});

export { ParserHTML };