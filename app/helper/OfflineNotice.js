/*
    https://medium.com/dailyjs/offline-notice-in-react-native-28a8d01e8cd0
*/
import React, { PureComponent } from 'react';
import {
    View,
    Text,
    NetInfo,
    Dimensions,
    StyleSheet,
    Image
} from 'react-native';
import {
    ICONS,
} from 'root/app/helper/Constant';
import { connect } from 'react-redux';
import { SET_CONNECTION } from 'root/app/helper/Constant';

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={{ zIndex: 2, position: 'absolute', flex: 1, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', top: 0, left: 0 }}>
            <View style={styles.offlineContainer}>
                <Image
                    style={{ width: 50, height: 50, marginBottom: 10 }}
                    source={ICONS['noConnection']}
                />
                <Text style={styles.offlineTitle}>HOP!</Text>
                <Text style={styles.offlineText}>İnternet bağlantısı koptu.</Text>
            </View>
        </View>
    );
}

class OfflineNotices extends PureComponent {
    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        const _self = this;
        _self.props.dispatch({ type: SET_CONNECTION, value: isConnected });
    };

    render() {
        const _self = this;
        if (!_self.props.offlineNotice.isConnected)
            return <MiniOfflineSign />;

        return null;
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#FFFFFF',
        height: 210,
        justifyContent: 'center',
        alignItems: 'center',
        width,
        zIndex: 2,
        position: 'absolute',
        bottom: 0
    },
    offlineTitle: { color: '#000', fontFamily: 'Bold', fontSize: 16 },
    offlineText: { color: '#000', fontFamily: 'RegularTyp2', fontSize: 16 }
});

function mapStateToProps(state) { return state; }
const OfflineNotice = connect(mapStateToProps)(OfflineNotices);
export { OfflineNotice };