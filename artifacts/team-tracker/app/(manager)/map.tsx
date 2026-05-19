import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Modal, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { getTeamLocations, getTeamUsers, sendAssignment, type TechLocationWithUser } from "@/lib/api";
import MapViewContainer from "@/components/MapViewContainer";

const ZONES = ["Arafat", "Mina", "Muzdalifa", "Makka", "Makka Remote"] as const;

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function buildZoneSummary(locations: TechLocationWithUser[]) {
  const map: Record<string, { on: number; off: number }> = {};
  for (const zone of ZONES) map[zone] = { on: 0, off: 0 };

  for (const loc of locations) {
    const zone = ZONES.find(z => loc.area?.toLowerCase().includes(z.toLowerCase()));
    const key  = zone ?? "Other";
    if (!map[key]) map[key] = { on: 0, off: 0 };
    if (loc.isOnDuty) map[key].on++;
    else              map[key].off++;
  }

  const totalOn  = locations.filter(l => l.isOnDuty).length;
  const totalOff = locations.length - totalOn;
  return { zones: map, totalOn, totalOff };
}

export default function ManagerMapScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { token, logout } = useAuth();

  const [locations,   setLocations]   = useState<TechLocationWithUser[]>([]);
  const [totalUsers,  setTotalUsers]  = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState<TechLocationWithUser | null>(null);
  const [msgVisible,  setMsgVisible]  = useState(false);
  const [message,     setMessage]     = useState("");
  const [sending,     setSending]     = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLocations = async () => {
    try {
      const data = await getTeamLocations(token);
      setLocations(data);
    } catch {}
    setLoading(false);
  };

  const fetchTotalUsers = async () => {
    try {
      const users = await getTeamUsers(token);
      setTotalUsers(users.filter(u => u.role === "technician").length);
    } catch {}
  };

  useEffect(() => {
    fetchLocations();
    fetchTotalUsers();
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

  const { zones, totalOn, totalOff } = buildZoneSummary(locations);
  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 16);

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Live Map</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {totalOn} online · {totalUsers} deployed · refreshes every 10s
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

          {/* Zone Summary Overlay */}
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Toggle header */}
            <TouchableOpacity
              style={styles.summaryHeader}
              onPress={() => setSummaryOpen(v => !v)}
              activeOpacity={0.7}
            >
              <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Zone Summary</Text>
              <View style={styles.summaryBadges}>
                <View style={[styles.badge, { backgroundColor: "#16a34a22" }]}>
                  <Text style={[styles.badgeText, { color: "#16a34a" }]}>
                    {totalOn} on
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>
                    {totalOff} off
                  </Text>
                </View>
                <Feather
                  name={summaryOpen ? "chevron-down" : "chevron-up"}
                  size={14}
                  color={colors.mutedForeground}
                />
              </View>
            </TouchableOpacity>

            {summaryOpen && (
              <>
                {/* Zone rows */}
                <ScrollView
                  style={styles.zoneList}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  {ZONES.map(zone => {
                    const { on, off } = zones[zone] ?? { on: 0, off: 0 };
                    const total = on + off;
                    return (
                      <View key={zone} style={[styles.zoneRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.zoneName, { color: colors.foreground }]} numberOfLines={1}>
                          {zone}
                        </Text>
                        <View style={styles.zoneCounts}>
                          <Text style={[styles.zoneOn, { color: "#16a34a" }]}>{on} on</Text>
                          <Text style={[styles.zoneSep, { color: colors.border }]}>·</Text>
                          <Text style={[styles.zoneOff, { color: colors.mutedForeground }]}>{off} off</Text>
                          <Text style={[styles.zoneTotal, { color: colors.mutedForeground }]}>
                            / {total}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                {/* Totals footer */}
                <View style={[styles.totalRow, { borderTopColor: colors.border, backgroundColor: colors.secondary }]}>
                  <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
                  <View style={styles.zoneCounts}>
                    <Text style={[styles.zoneOn, { color: "#16a34a", fontWeight: "700" }]}>{totalOn} online</Text>
                    <Text style={[styles.zoneSep, { color: colors.border }]}>·</Text>
                    <Text style={[styles.zoneOff, { color: colors.mutedForeground, fontWeight: "700" }]}>{totalUsers} deployed</Text>
                  </View>
                </View>
              </>
            )}
          </View>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1 },
  header:        {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  headerTitle:   { fontSize: 22, fontWeight: "700" as const },
  headerSub:     { fontSize: 12, marginTop: 2 },
  iconBtn:       { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  center:        { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadText:      { fontSize: 14 },
  mapArea:       { flex: 1, position: "relative" },

  summaryCard:   {
    position: "absolute", bottom: 16, left: 12, right: 12,
    borderRadius: 16, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 12, elevation: 10,
    overflow: "hidden",
  },
  summaryHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 10,
  },
  summaryTitle:  { fontSize: 13, fontWeight: "700" as const, letterSpacing: 0.3 },
  summaryBadges: { flexDirection: "row", alignItems: "center", gap: 6 },
  badge:         { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText:     { fontSize: 11, fontWeight: "600" as const },

  zoneList:      { maxHeight: 160 },
  zoneRow:       {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 7, borderTopWidth: 1,
  },
  zoneName:      { fontSize: 12, fontWeight: "600" as const, flex: 1 },
  zoneCounts:    { flexDirection: "row", alignItems: "center", gap: 4 },
  zoneOn:        { fontSize: 12, fontWeight: "600" as const },
  zoneSep:       { fontSize: 12 },
  zoneOff:       { fontSize: 12 },
  zoneTotal:     { fontSize: 11 },

  totalRow:      {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 9, borderTopWidth: 1,
  },
  totalLabel:    { fontSize: 13, fontWeight: "700" as const },

  modalOverlay:  { flex: 1 },
  modalSheet:    {
    borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTopWidth: 1,
    padding: 20, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 16,
  },
  modalTitle:    { fontSize: 18, fontWeight: "700" as const },
  modalSub:      { fontSize: 13, marginTop: -4 },
  msgInput:      { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, minHeight: 80, textAlignVertical: "top" },
  modalRow:      { flexDirection: "row", gap: 10 },
  cancelBtn:     { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  cancelText:    { fontWeight: "600" as const },
  sendBtn:       { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  sendText:      { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
});
