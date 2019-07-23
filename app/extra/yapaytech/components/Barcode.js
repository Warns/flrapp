import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import I18n from "../Language";

const styles = StyleSheet.create({
  redBorder: { borderWidth: 1, borderColor: "red" },
  active: { opacity: 1 },
  tabwrap: {
    height: 63,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    position: "absolute",
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabimage: { width: 40, height: 40, opacity: 0.5 },
  overlaywrap: {
    zIndex: 1
  },
  overlayPart: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    flex: 1,
    alignItems: "center"
  },
  overlaycenter: {
    width: 276,
    height: 166,
    maxWidth: "100%",
    padding: 10
  },
  overlayCorner: {}
});

function upper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const directions = ["left", "right", "top", "bottom"];
const Corner = props => {
  let style = {
    width: 10,
    height: 10,
    position: "absolute",
    borderColor: "white"
  };
  for (let i = 0; i < directions.length; i++) {
    const dir = directions[i];
    const is = props.hasOwnProperty(dir);
    if (is) {
      style[dir] = 0;
      style[`border${upper(dir)}Width`] = 2;
    }
  }
  return <View style={style} />;
};

const OverlayCorners = props => (
  <View style={{ flex: 1 }}>
    <Corner top left />
    <Corner top right />
    <Corner bottom left />
    <Corner bottom right />
    <View
      style={{
        position: "absolute",
        top: "50%",
        left: "30%",
        width: "40%",
        backgroundColor: "white",
        height: 2
      }}
    />
  </View>
);

const Overlay = props => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.overlaywrap]}>
      <View style={styles.overlayPart} />
      <View style={{ flexDirection: "row" }}>
        <View style={styles.overlayPart} />
        <View style={styles.overlaycenter}>
          <OverlayCorners />
        </View>
        <View style={styles.overlayPart} />
      </View>
      <View style={styles.overlayPart}>
        <Text
          style={{
            maxWidth: 276,
            color: "white",
            marginTop: 15,
            textAlign: "center",
            fontSize: 14
          }}
        >
          Ürünü bulmak için barkod veya QR kodu üzerinde alt kısma gelin
        </Text>
      </View>
    </View>
  );
};

const TitleBar = props => {
  return (
    <View
      style={{
        height: 60,
        alignItems: "center",
        padding: 10,
        flexDirection: "row",
        backgroundColor: "white"
      }}
    >
      <TouchableOpacity onPress={props.close}>
        <Image
          style={{ width: 40, height: 40 }}
          source={require("../assets/back2x.png")}
        />
      </TouchableOpacity>

      <Text
        style={{
          lineHeight: 18,
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 0.5
        }}
      >
        QR CODE ARAMA
      </Text>
    </View>
  );
};

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    tab: 0
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
          left: 0,
          backgroundColor: "white"
        }}
      >
        <TitleBar close={this.props.close} />

        <View style={{ flex: 1 }}>
          <View style={styles.tabwrap}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => this.setState({ tab: 0 })}
            >
              <Image
                style={[styles.tabimage, !this.state.tab && styles.active]}
                source={require("../assets/camera.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => this.setState({ tab: 1 })}
            >
              <Image
                style={[styles.tabimage, this.state.tab && styles.active]}
                source={require("../assets/keyboard.png")}
              />
            </TouchableOpacity>
          </View>

          {this.props.error && (
            <View
              style={{
                backgroundColor: "#fe546a",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",

                top: 63,
                left: 0,
                right: 0,
                height: 51,
                zIndex: 3
              }}
            >
              <Text style={{ fontSize: 14, color: "white" }}>
                {this.props.error.message || "Geçersiz kod!"}
              </Text>
            </View>
          )}
          {this.state.tab ? (
            <ImageBackground
              style={{
                flex: 1
              }}
              imageStyle={{
                resizeMode: "cover"
              }}
              source={require("../assets/barcodetext.png")}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,.6)",
                  flex: 1,
                  paddingTop: 63,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  style={{ width: 220, height: 70 }}
                  source={require("../assets/barcode.png")}
                />
                <TextInput
                  autoFocus={true}
                  placeholder="..............."
                  keyboardType="number-pad"
                  placeholderTextColor="white"
                  maxLength={13}
                  onChangeText={this.handleInputChange}
                  selectionColor="white"
                  style={{
                    color: "white",
                    fontSize: 40,
                    lineHeight: 40,
                    height: 42
                  }}
                />
              </View>
            </ImageBackground>
          ) : (
            <>
              <BarCodeScanner
                onBarCodeScanned={this.handleBarCodeScanned}
                style={StyleSheet.absoluteFill}
              />
              <Overlay />
            </>
          )}
        </View>
      </View>
    );
  }

  handleInputChange = data => {
    if (data && data.length === 13)
      this.handleBarCodeScanned({ type: 32, data });
  };

  handleBarCodeScanned = ({ type, data }) => {
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.props.event("barcode", { type, barcode: data });
    //this.props.close();
  };
}

/***
 * <View
          style={{
            top: "50%",
            width: "60%",
            height: 1,
            left: "20%",
            backgroundColor: "#fc3394"
          }}
        />
 */
