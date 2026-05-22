import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Modal, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
  const [wsLive,      setWsLive]      = useState(false);
  const wsRef       = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsLiveRef   = useRef(false);

  const fetchLocations = useCallback(async () => {
    try {
      const data = await getTeamLocations(token);
      setLocations(data);
    } catch {}
    setLoading(false);
  }, [token]);

  const fetchTotalUsers = useCallback(async () => {
    try {
      const users = await getTeamUsers(token);
      setTotalUsers(users.filter(u => u.role === "technician").length);
    } catch {}
  }, [token]);

  useEffect(() => {
    fetchLocations();
    fetchTotalUsers();

    const apiBase = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "") ||
      "https://4a3b2adb-54bb-4c8a-a7b7-fee922024ba6-00-25arfy9uinng9.picard.replit.dev";
    const wsUrl = apiBase.replace(/^https?/, s => s === "https" ? "wss" : "ws") + "/api/team/ws";

    let ws: WebSocket;
    let dead = false;

    const connect = () => {
      if (dead) return;
      try {
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (token) ws.send(JSON.stringify({ type: "auth", token }));
        };

        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(typeof e.data === "string" ? e.data : "") as Record<string, unknown>;

            if (msg.type === "auth_ok") {
              wsLiveRef.current = true;
              setWsLive(true);
              setLoading(false);
              if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
              return;
            }

            if (msg.type === "location" && wsLiveRef.current) {
              const loc = msg as {
                userId: number; userName: string; lat: number; lng: number;
                area: string | null; isOnDuty: boolean; updatedAt: string;
                role: string; defaultArea: string | null;
              };
              setLocations(prev => {
                const next = prev.filter(l => l.userId !== loc.userId);
                next.push({
                  id:          loc.userId,
                  userId:      loc.userId,
                  userName:    loc.userName,
                  role:        loc.role ?? "technician",
                  defaultArea: loc.defaultArea ?? null,
                  lat:         loc.lat,
                  lng:         loc.lng,
                  area:        loc.area,
                  isOnDuty:    loc.isOnDuty,
                  updatedAt:   loc.updatedAt,
                });
                return next;
              });
            }
          } catch {}
        };

        ws.onclose = () => {
          wsRef.current   = null;
          wsLiveRef.current = false;
          setWsLive(false);
          if (!dead) {
            if (!intervalRef.current) {
              intervalRef.current = setInterval(fetchLocations, 10_000);
            }
          }
        };

        ws.onerror = () => { ws.close(); };
      } catch {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(fetchLocations, 10_000);
        }
      }
    };

    connect();

    return () => {
      dead = true;
      wsRef.current?.close();
      wsRef.current = null;
      wsLiveRef.current = false;
      setWsLive(false);
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <LinearGradient colors={["#060D1A", "#0A1B34"]} style={styles.root}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 14 }]}>
        <LinearGradient
          colors={["rgba(23,78,166,0.30)", "rgba(6,13,26,0)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerLeft}>
          <View style={styles.headerAccentBar} />
          <View>
            <Text style={styles.headerTitle}>Live Map</Text>
            <View style={styles.headerSubRow}>
              <View style={[styles.wsIndicator, { backgroundColor: wsLive ? "#00B894" : "#D62828" }]} />
              <Text style={styles.headerSub}>
                {totalOn} online · {totalUsers} deployed · {wsLive ? "live" : "polling"}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Feather name="log-out" size={16} color="#6B8DB8" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="radar" size={36} color="#174EA6" />
          <ActivityIndicator color="#174EA6" size="large" />
          <Text style={styles.loadText}>Connecting to NOC...</Text>
        </View>
      ) : (
        <View style={styles.mapArea}>
          <MapViewContainer
            locations={locations}
            onDutyColor="#00B894"
            offDutyColor="#3D5470"
            onMarkerPress={onMarkerPress}
          />

          {/* Zone Summary Overlay */}
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={["rgba(6,13,26,0.95)", "rgba(10,27,52,0.92)"]}
              style={styles.summaryGrad}
            >
              <TouchableOpacity
                style={styles.summaryHeader}
                onPress={() => setSummaryOpen(v => !v)}
                activeOpacity={0.7}
              >
                <View style={styles.summaryTitleRow}>
                  <View style={[styles.summaryAccentDot, { backgroundColor: "#174EA6" }]} />
                  <Text style={styles.summaryTitle}>Zone Summary</Text>
                </View>
                <View style={styles.summaryBadges}>
                  <View style={styles.onBadge}>
                    <Text style={styles.onBadgeText}>{totalOn} on</Text>
                  </View>
                  <View style={styles.offBadge}>
                    <Text style={styles.offBadgeText}>{totalOff} off</Text>
                  </View>
                  <Feather
                    name={summaryOpen ? "chevron-down" : "chevron-up"}
                    size={14}
                    color="#6B8DB8"
                  />
                </View>
              </TouchableOpacity>

              {summaryOpen && (
                <>
                  <View style={styles.summaryDivider} />
                  <ScrollView
                    style={styles.zoneList}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    {ZONES.map(zone => {
                      const { on, off } = zones[zone] ?? { on: 0, off: 0 };
                      const total = on + off;
                      return (
                        <View key={zone} style={styles.zoneRow}>
                          <Text style={styles.zoneName} numberOfLines={1}>{zone}</Text>
                          <View style={styles.zoneCounts}>
                            <Text style={styles.zoneOn}>{on} on</Text>
                            <Text style={styles.zoneSep}>·</Text>
                            <Text style={styles.zoneOff}>{off} off</Text>
                            <Text style={styles.zoneTotal}>/ {total}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL</Text>
                    <View style={styles.zoneCounts}>
                      <Text style={[styles.zoneOn, { fontWeight: "700" as const }]}>{totalOn} online</Text>
                      <Text style={styles.zoneSep}>·</Text>
                      <Text style={[styles.zoneOff, { fontWeight: "700" as const }]}>{totalUsers} deployed</Text>
                    </View>
                  </View>
                </>
              )}
            </LinearGradient>
          </View>
        </View>
      )}

      {/* Send Assignment Modal */}
      <Modal visible={msgVisible} transparent animationType="slide" onRequestClose={() => setMsgVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMsgVisible(false)} />
        <View style={[styles.modalSheet, { paddingBottom: bottomPad }]}>
          <LinearGradient
            colors={["rgba(15,30,60,0.98)", "rgba(6,13,26,0.98)"]}
            style={styles.modalGrad}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <View style={[styles.modalAccentBar, { backgroundColor: "#174EA6" }]} />
              <View>
                <Text style={styles.modalTitle}>Dispatch to {selected?.userName}</Text>
                <Text style={styles.modalSub}>
                  {selected?.area ?? "Unknown area"} · {selected ? minutesAgo(selected.updatedAt) : 0}m ago
                </Text>
              </View>
            </View>

            <TextInput
              style={styles.msgInput}
              placeholder="e.g. Proceed to CWN080, check rectifier..."
              placeholderTextColor="rgba(107,141,184,0.6)"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setMsgVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendBtnWrap, { opacity: sending || !message.trim() ? 0.6 : 1 }]}
                onPress={handleSend}
                disabled={sending || !message.trim()}
              >
                <LinearGradient
                  colors={["#174EA6", "#0E3A8C"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.sendBtnGrad}
                >
                  {sending
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.sendText}>Dispatch</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1 },

  header:        {
    paddingHorizontal: 20, paddingBottom: 14, overflow: "hidden",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.12)",
  },
  headerLeft:    { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAccentBar: { width: 3, height: 38, borderRadius: 2, backgroundColor: "#174EA6" },
  headerTitle:   { fontSize: 22, fontWeight: "700" as const, color: "#E2EFFF" },
  headerSubRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  wsIndicator:   { width: 6, height: 6, borderRadius: 3 },
  headerSub:     { fontSize: 11, color: "#6B8DB8" },
  logoutBtn:     {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  center:        { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  loadText:      { fontSize: 13, color: "#6B8DB8", letterSpacing: 0.5 },
  mapArea:       { flex: 1, position: "relative" },

  summaryCard:   {
    position: "absolute", bottom: 16, left: 12, right: 12,
    borderRadius: 18, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.20)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 12,
  },
  summaryGrad:   {},
  summaryHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 12,
  },
  summaryTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryAccentDot: { width: 4, height: 18, borderRadius: 2 },
  summaryTitle:  { fontSize: 13, fontWeight: "700" as const, color: "#E2EFFF", letterSpacing: 0.3 },
  summaryBadges: { flexDirection: "row", alignItems: "center", gap: 6 },
  onBadge:       {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
    backgroundColor: "rgba(0,184,148,0.15)", borderWidth: 1, borderColor: "rgba(0,184,148,0.30)",
  },
  onBadgeText:   { fontSize: 11, fontWeight: "600" as const, color: "#00B894" },
  offBadge:      {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
    backgroundColor: "rgba(61,84,112,0.25)",
  },
  offBadgeText:  { fontSize: 11, fontWeight: "600" as const, color: "#6B8DB8" },

  summaryDivider: { height: 1, backgroundColor: "rgba(100,160,255,0.12)", marginHorizontal: 14 },
  zoneList:      { maxHeight: 150 },
  zoneRow:       {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 7,
    borderTopWidth: 1, borderTopColor: "rgba(100,160,255,0.08)",
  },
  zoneName:      { fontSize: 12, fontWeight: "600" as const, color: "#C8DEFF", flex: 1 },
  zoneCounts:    { flexDirection: "row", alignItems: "center", gap: 4 },
  zoneOn:        { fontSize: 12, fontWeight: "600" as const, color: "#00B894" },
  zoneSep:       { fontSize: 12, color: "rgba(100,160,255,0.20)" },
  zoneOff:       { fontSize: 12, color: "#6B8DB8" },
  zoneTotal:     { fontSize: 11, color: "#3D5470" },
  totalRow:      {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: "rgba(100,160,255,0.15)",
    backgroundColor: "rgba(23,78,166,0.10)",
  },
  totalLabel:    { fontSize: 11, fontWeight: "700" as const, color: "#93B8EE", letterSpacing: 0.8 },

  modalOverlay:  { flex: 1 },
  modalSheet:    {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: "hidden",
    borderTopWidth: 1, borderColor: "rgba(100,160,255,0.25)",
    shadowColor: "#000", shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 16,
  },
  modalGrad:     { padding: 20, gap: 14 },
  modalHandle:   {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "rgba(100,160,255,0.25)",
    alignSelf: "center", marginBottom: 4,
  },
  modalTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  modalAccentBar:{ width: 3, height: 38, borderRadius: 2, marginTop: 2 },
  modalTitle:    { fontSize: 18, fontWeight: "700" as const, color: "#E2EFFF" },
  modalSub:      { fontSize: 12, color: "#6B8DB8", marginTop: 3 },
  msgInput:      {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.20)",
    borderRadius: 14, padding: 14, fontSize: 15,
    minHeight: 90, textAlignVertical: "top",
    color: "#E2EFFF",
  },
  modalRow:      { flexDirection: "row", gap: 10 },
  cancelBtn:     {
    flex: 1, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.20)",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14, paddingVertical: 13, alignItems: "center",
  },
  cancelText:    { fontWeight: "600" as const, color: "#6B8DB8" },
  sendBtnWrap:   { flex: 1, borderRadius: 14, overflow: "hidden" },
  sendBtnGrad:   { paddingVertical: 13, alignItems: "center" },
  sendText:      { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
});
