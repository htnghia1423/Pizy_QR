import React from "react";
import { View, StyleSheet } from "react-native";

const StartLayout = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: "absolute",
    backgroundColor: "#0DB07E80",
  },
  circleTopLeft: {
    width: 229,
    height: 229,
    top: -114,
    left: -75,
    borderRadius: 229 / 2,
  },
  circleTopRight: {
    width: 113,
    height: 113,
    top: 91,
    right: -51,
    borderRadius: 113 / 2,
  },
  circleBottomLeft: {
    width: 215,
    height: 215,
    bottom: -170,
    left: -51,
    borderRadius: 215 / 2,
  },
});

export default StartLayout;
