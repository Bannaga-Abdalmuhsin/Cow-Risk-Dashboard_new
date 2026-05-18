import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type OfflineBannerProps = {
  onRetry: () => void;
  retrying?: boolean;
  message?: string;
};

export function OfflineBanner({
  onRetry,
  retrying = false,
  message = "Server is starting up, please wait\u2026",
}: OfflineBannerProps) {
  return (
    <View style={styles.banner}>
      <Feather name="wifi-off" size={15} color="#92400e" style={styles.icon} />
      <Text style={styles.text} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        disabled={retrying}
        style={[styles.retryBtn, retrying && styles.retryBtnDisabled]}
        accessibilityLabel="Retry"
        accessibilityRole="button"
      >
        {retrying ? (
          <ActivityIndicator size="small" color="#92400e" />
        ) : (
          <Text style={styles.retryText}>Retry</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection:   "row",
    alignItems:      "center",
    backgroundColor: "#fef3c7",
    borderBottomWidth: 1,
    borderBottomColor: "#fcd34d",
    paddingHorizontal: 14,
    paddingVertical:   10,
    gap: 8,
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    flex:       1,
    fontSize:   13,
    color:      "#78350f",
    lineHeight: 18,
  },
  retryBtn: {
    flexShrink:      0,
    backgroundColor: "#fcd34d",
    borderRadius:    8,
    paddingHorizontal: 12,
    paddingVertical:   6,
    minWidth: 54,
    alignItems: "center",
  },
  retryBtnDisabled: {
    opacity: 0.6,
  },
  retryText: {
    fontSize:   13,
    fontWeight: "700",
    color:      "#78350f",
  },
});
