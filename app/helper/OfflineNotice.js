/*
    https://medium.com/dailyjs/offline-notice-in-react-native-28a8d01e8cd0
*/
import React, { PureComponent } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SET_CONNECTION } from 'root/app/helper/Constant';

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
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
        if (!_self.props.offlineNotice.isConnected) {
            return <MiniOfflineSign />;
        }
        return null;
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        zIndex: 2,
        //position: 'absolute',
        //top: 30
    },
    offlineText: { color: '#fff' }
});

function mapStateToProps(state) { return state; }
const OfflineNotice = connect(mapStateToProps)(OfflineNotices);
export { OfflineNotice };