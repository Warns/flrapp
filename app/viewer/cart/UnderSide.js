import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';
import { Viewer } from 'root/app/viewer/';
import {
    ICONS,
    DATA_LOADED,
    ASSISTANT_OPENED
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';

/* Fırsatlar */
const DATA = {
    "title": "FIRSATLAR",
    "type": "listViewer",
    "itemType": "opportunity",
    "uri": {
        "key": "banner",
        "subKey": "getBannerList"
    },
    "siteURI": "/mobiapp-opportunity.html",
    "keys": {
        "id": "id",
        "arr": "banners",
    },
    "data": {
        "bgrCode": "7255"
    },
    "horizontal": true,
    "showsHorizontalScrollIndicator": false,
    "customFunc": "opportunity"
};

const UnderSide = class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0
        }
    }

    _callback = ({ type, data }) => {
        const _self = this;
        if (type === DATA_LOADED)
            _self.setState({ totalCount: data.length });
    }

    _getOpportunity = () => {
        const _self = this,
            { opportunity = false } = _self.props,
            { totalCount = 0 } = _self.state,
            title = totalCount == 0 ? null : (<View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                <Text style={{ fontFamily: 'Bold', fontSize: 16 }}>FIRSATLAR</Text>
                <Text style={{ paddingLeft: 5, fontFamily: 'Bold', fontSize: 16, color: 'rgb(255, 43, 148)' }}>{totalCount}</Text>
            </View>);

        let view = null;

        if (opportunity)
            view = (
                <View>
                    {title}
                    <Viewer callback={_self._callback} wrapperStyle={{ marginBottom: 25 }} config={DATA} />
                </View>
            );

        return view;
    }

    _onAssistanClick = () => {
        const _self = this;
        _self.props.dispatch({ type: ASSISTANT_OPENED, value: true });
    }

    _getView = () => {
        const _self = this;

        return (
            <View style={{ paddingTop: 20, paddingBottom: 45, flex: 1 }}>

                {_self._getOpportunity()}

                <TouchableOpacity activeOpacity={0.8} onPress={_self._onAssistanClick}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}>
                        <View style={{ width: 50, height: 50, backgroundColor: '#FFFFFF', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ width: 40, height: 40, resizeMode: 'contain' }}
                                source={ICONS['asistanButton']}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: 15, fontWeight: 'bold' }}>Yardım ister misin?</Text>
                            <Text style={{ fontFamily: 'RegularTyp2', fontSize: 15 }}>Aklına takılan sorular ile ilgili satış temsilcimiz ile iletişıme geçebilirsin.</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const _self = this,
            { cartNoResult = false } = _self.props.cart,
            view = cartNoResult ? null : _self._getView();
        return view;
    }
}

function mapStateToProps(state) { return state }
export default connect(mapStateToProps)(UnderSide);