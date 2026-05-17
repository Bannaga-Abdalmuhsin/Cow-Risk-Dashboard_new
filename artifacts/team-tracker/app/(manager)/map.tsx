import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Modal, Platform, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { getTeamLocations, sendAssignment, type TechLocationWithUser } from "@/lib/api";
import MapViewContainer from "@/components/MapViewContainer";

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

export default function ManagerMapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { token, logout } = useAuth();

  const [locations,   setLocations]   = useState<TechLocationWithUser[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState<TechLocationWithUser | null>(null);
  const [msgVisible,  setMsgVisible]  = useState(false);
  const [message,     setMessage]     = useState("");
  const [sending,     setSending]     = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLocations = async () => {
    try {
      const data = await getTeamLocations(token);
      setLocations(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
    intervalRef.current = setInterval(fetchLocations, 10000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [token]);

  const onMarkerPress = (loc: TechLocationWithUser) => {
    setSelected(loc);
    setMsgVisible(true);
    setMessage("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSend = async () => {
    if (!selected || !message.trim()) return;
    setSending(true);
    try {
      await sendAssignment(token!, selected.userId, message.trim());
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMsgVisible(false);
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const onDutyCount = locations.filter(l => l.isOnDuty).length;
  const topPad      = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad   = insets.bottom + (Platform.OS === "web" ? 34 : 16);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Live Map</Text>
          <Text style={[styles.headerSub,   { color: colors.mutedForeground }]}>
            {onDutyCount}/{locations.length} on duty · refreshes every 10s
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={[styles.iconBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="log-out" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadText, { color: colors.mutedForeground }]}>Loading team...</Text>
        </View>
      ) : (
        <View style={styles.mapArea}>
          <MapViewContainer
            locations={locations}
            onDutyColor={colors.onDuty}
            offDutyColor={colors.offDuty}
            onMarkerPress={onMarkerPress}
          />
        </View>
      )}

      {/* Send Assignment Modal */}
      <Modal visible={msgVisible} transparent animationType="slide" onRequestClose={() => setMsgVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMsgVisible(false)} />
        <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: bottomPad }]}>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>
            Send to {selected?.userName}
          </Text>
          <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
            {selected?.area ?? "Unknown area"} · {selected ? minutesAgo(selected.updatedAt) : 0}m ago
          </Text>
          <TextInput
            style={[styles.msgInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            placeholder="e.g. Proceed to CWN080, check rectifier..."
            placeholderTextColor={colors.mutedForeground}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            autoFocus
          />
          <View style={styles.modalRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={() => setMsgVisible(false)}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: sending || !message.trim() ? 0.6 : 1 }]}
              onPress={handleSend}
              disabled={sending || !message.trim()}
            >
              {sending
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.sendText}>Send</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1 },
  header:       { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  headerTitle:  { fontSize: 22, fontWeight: "700" as const },
  headerSub:    { fontSize: 12, marginTop: 2 },
  iconBtn:      { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  center:       { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadText:     { fontSize: 14 },
  mapArea:      { flex: 1, position: "relative" },
  modalOverlay: { flex: 1 },
  modalSheet:   { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, padding: 20, gap: 12 },
  modalTitle:   { fontSize: 18, fontWeight: "700" as const },
  modalSub:     { fontSize: 13, marginTop: -4 },
  msgInput:     { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, minHeight: 80, textAlignVertical: "top" },
  modalRow:     { flexDirection: "row", gap: 10 },
  cancelBtn:    { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  cancelText:   { fontWeight: "600" as const },
  sendBtn:      { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  sendText:     { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
});
