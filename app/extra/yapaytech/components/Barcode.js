import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import I18n from "../Language";

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null
  };

  componentWillMount() {
    this.askPermission();
  }

  askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  closeBtn(absolute = true) {
    return (
      <TouchableOpacity
        onPress={this.props.close}
        style={
          absolute
            ? {
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 2,
                backgroundColor: "white",
                borderRadius: 3,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderColor: "#fc3394",
                borderWidth: 1
              }
            : { flex: 0 }
        }
      >
        <Text style={{ fontWeight: "600" }}>{I18n.t("scanner_close")}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return null;
    }
    if (hasCameraPermission === false) {
      return (
        <View
          style={{
            height: 50,
            borderTopWidth: 1,
            borderTopColor: "#d4d4d4",
            alignItems: "center",
            backgroundColor: "#fff",
            position: "absolute",
            bottom: 0,
            width: "100%",

            display: "flex",
            flexDirection: "row",
            paddingLeft: 20,
            paddingRight: 20
          }}
        >
          <TouchableOpacity onPress={this.askPermission} style={{ flex: 1 }}>
            <Text style={{ fontWeight: "600", color: "#fc3394" }}>
              {I18n.t("scanner_access")}
            </Text>
          </TouchableOpacity>
          {this.closeBtn(false)}
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={{
            top: "50%",
            width: "60%",
            height: 1,
            left: "20%",
            backgroundColor: "#fc3394"
          }}
        />
        {this.closeBtn()}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.props.event("barcode", { type, data });
    this.props.close();
  };
}
