import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { type TechLocationWithUser } from "@/lib/api";

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

interface Props {
  locations: TechLocationWithUser[];
  onDutyColor: string;
  offDutyColor: string;
  onMarkerPress: (loc: TechLocationWithUser) => void;
}

export default function MapViewContainer({ locations, onDutyColor, offDutyColor, onMarkerPress }: Props) {
  if (locations.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialCommunityIcons name="map-marker-off" size={40} color="#6B7280" />
        <Text style={styles.emptyText}>No technicians on duty yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.webNotice}>
        <MaterialCommunityIcons name="cellphone" size={12} color="#9CA3AF" />
        <Text style={styles.noticeText}>Open on your phone to see the live map</Text>
      </View>
      {locations.map(loc => {
        const mins   = minutesAgo(loc.updatedAt);
        const online = loc.isOnDuty && mins < 3;
        return (
          <TouchableOpacity
            key={loc.userId}
            style={[styles.row, { borderLeftColor: online ? onDutyColor : offDutyColor }]}
            onPress={() => onMarkerPress(loc)}
            activeOpacity={0.8}
          >
            <View style={[styles.dot, { backgroundColor: online ? onDutyColor : offDutyColor }]} />
            <View style={styles.info}>
              <Text style={styles.name}>{loc.userName}</Text>
              <Text style={styles.area}>{loc.area ?? "Unknown area"}</Text>
            </View>
            <Text style={[styles.status, { color: online ? onDutyColor : "#6B7280" }]}>
              {online ? "LIVE" : `${mins}m ago`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, padding: 12, gap: 8 },
  empty:       { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyText:   { fontSize: 14, color: "#6B7280" },
  webNotice:   { flexDirection: "row", alignItems: "center", gap: 6, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#2D1F50", marginBottom: 4 },
  noticeText:  { fontSize: 11, color: "#6B7280" },
  row:         { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, backgroundColor: "#1A1135", borderRadius: 10, borderLeftWidth: 3 },
  dot:         { width: 8, height: 8, borderRadius: 4 },
  info:        { flex: 1 },
  name:        { fontSize: 14, fontWeight: "600" as const, color: "#fff" },
  area:        { fontSize: 11, color: "#8B7DAE", marginTop: 2 },
  status:      { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.5 },
});
