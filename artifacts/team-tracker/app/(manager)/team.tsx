import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, FlatList, Platform, RefreshControl,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
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
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.dot, { backgroundColor: online ? colors.onDuty : colors.offDuty }]} />
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName,  { color: colors.foreground }]}>{loc.userName}</Text>
        <Text style={[styles.rowArea,  { color: colors.mutedForeground }]}>{loc.area ?? "Unknown area"}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={[styles.rowStatus, { color: online ? colors.onDuty : colors.mutedForeground }]}>
          {online ? "ON DUTY" : "OFFLINE"}
        </Text>
        <Text style={[styles.rowTime, { color: colors.mutedForeground }]}>
          {loc.isOnDuty ? `${mins}m ago` : "—"}
        </Text>
      </View>
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
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Team</Text>
          <Text style={[styles.headerSub,   { color: colors.mutedForeground }]}>
            {onDutyCount} on duty · {locations.length} total
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={[styles.iconBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="log-out" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={item => String(item.userId)}
          renderItem={({ item }) => <TechRow loc={item} colors={colors} />}
          contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80) }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          scrollEnabled={!!locations.length}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="users" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No technicians logged in yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  header:      { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  headerTitle: { fontSize: 22, fontWeight: "700" as const },
  headerSub:   { fontSize: 12, marginTop: 2 },
  iconBtn:     { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  center:      { flex: 1, alignItems: "center", justifyContent: "center" },
  row:         { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  dot:         { width: 10, height: 10, borderRadius: 5 },
  rowInfo:     { flex: 1 },
  rowName:     { fontSize: 15, fontWeight: "600" as const },
  rowArea:     { fontSize: 12, marginTop: 2 },
  rowRight:    { alignItems: "flex-end" },
  rowStatus:   { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.5 },
  rowTime:     { fontSize: 11, marginTop: 2 },
  empty:       { alignItems: "center", gap: 10, marginTop: 60 },
  emptyText:   { fontSize: 14 },
});
