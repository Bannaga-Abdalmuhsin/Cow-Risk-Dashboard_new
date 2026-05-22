import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, FlatList, Platform, RefreshControl,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { getTeamLocations, type TechLocationWithUser } from "@/lib/api";

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function TechRow({ loc, colors }: { loc: TechLocationWithUser; colors: ReturnType<typeof useColors> }) {
  const mins   = minutesAgo(loc.updatedAt);
  const online = loc.isOnDuty && mins < 3;

  return (
    <View style={styles.row}>
      <LinearGradient
        colors={online
          ? ["rgba(0,184,148,0.12)", "rgba(0,184,148,0.04)"]
          : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
        style={styles.rowGrad}
      >
        {/* Status indicator */}
        <View style={[styles.statusBar, { backgroundColor: online ? "#00B894" : "#3D5470" }]} />

        <View style={[styles.avatar, { backgroundColor: online ? "rgba(0,184,148,0.20)" : "rgba(61,84,112,0.25)" }]}>
          <MaterialCommunityIcons
            name="account-hard-hat"
            size={20}
            color={online ? "#00B894" : "#3D5470"}
          />
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.rowName}>{loc.userName}</Text>
          <Text style={styles.rowArea}>{loc.area ?? "Unknown area"}</Text>
        </View>

        <View style={styles.rowRight}>
          <View style={[styles.statusChip, {
            backgroundColor: online ? "rgba(0,184,148,0.15)" : "rgba(61,84,112,0.20)",
            borderColor:     online ? "rgba(0,184,148,0.30)" : "rgba(61,84,112,0.25)",
          }]}>
            {online && <View style={styles.onlinePulse} />}
            <Text style={[styles.statusChipText, { color: online ? "#00B894" : "#3D5470" }]}>
              {online ? "ON DUTY" : "OFFLINE"}
            </Text>
          </View>
          <Text style={styles.rowTime}>
            {loc.isOnDuty ? `${mins}m ago` : "—"}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function ManagerTeamScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { token, logout } = useAuth();

  const [locations,  setLocations]  = useState<TechLocationWithUser[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = useCallback(async () => {
    try {
      const data = await getTeamLocations(token);
      setLocations(data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [token]);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  const onRefresh = () => { setRefreshing(true); fetchLocations(); };

  const onDutyCount = locations.filter(l => l.isOnDuty).length;
  const topPad      = insets.top + (Platform.OS === "web" ? 67 : 0);

  return (
    <LinearGradient colors={["#060D1A", "#0A1B34"]} style={styles.root}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 14 }]}>
        <LinearGradient
          colors={["rgba(23,78,166,0.25)", "rgba(6,13,26,0)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerLeft}>
          <View style={styles.headerAccentBar} />
          <View>
            <Text style={styles.headerTitle}>Field Team</Text>
            <View style={styles.headerSubRow}>
              <View style={[styles.headerDot, { backgroundColor: onDutyCount > 0 ? "#00B894" : "#3D5470" }]} />
              <Text style={styles.headerSub}>
                {onDutyCount} on duty · {locations.length} deployed
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Feather name="log-out" size={16} color="#6B8DB8" />
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{onDutyCount}</Text>
          <Text style={styles.statLabel}>ON DUTY</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: "#6B8DB8" }]}>{locations.length - onDutyCount}</Text>
          <Text style={styles.statLabel}>OFFLINE</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: "#174EA6" }]}>{locations.length}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#174EA6" size="large" />
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={item => String(item.userId)}
          renderItem={({ item }) => <TechRow loc={item} colors={colors} />}
          contentContainerStyle={{
            padding: 14, gap: 8,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80),
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#174EA6" />
          }
          scrollEnabled={!!locations.length}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <Feather name="users" size={32} color="#3D5470" />
              </View>
              <Text style={styles.emptyText}>No technicians logged in</Text>
            </View>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1 },

  header:       {
    paddingHorizontal: 20, paddingBottom: 14, overflow: "hidden",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.12)",
  },
  headerLeft:   { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAccentBar: { width: 3, height: 38, borderRadius: 2, backgroundColor: "#174EA6" },
  headerTitle:  { fontSize: 22, fontWeight: "700" as const, color: "#E2EFFF" },
  headerSubRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  headerDot:    { width: 6, height: 6, borderRadius: 3 },
  headerSub:    { fontSize: 11, color: "#6B8DB8" },
  logoutBtn:    {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  statsBar:     {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 10, paddingHorizontal: 20,
    backgroundColor: "rgba(23,78,166,0.08)",
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.10)",
  },
  statItem:     { flex: 1, alignItems: "center", gap: 2 },
  statNum:      { fontSize: 20, fontWeight: "800" as const, color: "#00B894" },
  statLabel:    { fontSize: 9, fontWeight: "700" as const, color: "#3D5470", letterSpacing: 1 },
  statDivider:  { width: 1, height: 28, backgroundColor: "rgba(100,160,255,0.15)" },

  center:       { flex: 1, alignItems: "center", justifyContent: "center" },

  row:          {
    borderRadius: 16, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.15)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  rowGrad:      { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  statusBar:    { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  avatar:       { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rowInfo:      { flex: 1 },
  rowName:      { fontSize: 15, fontWeight: "600" as const, color: "#E2EFFF" },
  rowArea:      { fontSize: 12, color: "#6B8DB8", marginTop: 2 },
  rowRight:     { alignItems: "flex-end", gap: 4 },
  statusChip:   {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  onlinePulse:  { width: 5, height: 5, borderRadius: 3, backgroundColor: "#00B894" },
  statusChipText: { fontSize: 10, fontWeight: "700" as const, letterSpacing: 0.5 },
  rowTime:      { fontSize: 11, color: "#3D5470" },

  empty:        { alignItems: "center", gap: 12, marginTop: 60 },
  emptyIconWrap:{ width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(100,160,255,0.12)" },
  emptyText:    { fontSize: 14, color: "#6B8DB8" },
});
