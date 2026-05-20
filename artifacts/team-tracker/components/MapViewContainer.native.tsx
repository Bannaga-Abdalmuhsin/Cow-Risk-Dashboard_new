import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { type TechLocationWithUser } from "@/lib/api";

interface Props {
  locations: TechLocationWithUser[];
  onDutyColor: string;
  offDutyColor: string;
  onMarkerPress: (loc: TechLocationWithUser) => void;
}

export default function MapViewContainer({ locations, onDutyColor }: Props) {
  const onCount  = locations.filter(l => l.isOnDuty).length;
  const offCount = locations.length - onCount;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Feather name="map" size={48} color="#475569" />
        <Text style={styles.title}>Live Map</Text>
        <Text style={styles.sub}>Interactive map coming in next update</Text>
        <View style={styles.stats}>
          <View style={[styles.badge, { backgroundColor: onDutyColor + "22", borderColor: onDutyColor + "55" }]}>
            <View style={[styles.dot, { backgroundColor: onDutyColor }]} />
            <Text style={[styles.badgeText, { color: onDutyColor }]}>{onCount} On Duty</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "#47556922", borderColor: "#47556955" }]}>
            <View style={[styles.dot, { backgroundColor: "#475569" }]} />
            <Text style={[styles.badgeText, { color: "#475569" }]}>{offCount} Off Duty</Text>
          </View>
        </View>
        <Text style={styles.hint}>Use the Team tab to see full technician list</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
  inner:     { alignItems: "center", gap: 12, paddingHorizontal: 32 },
  title:     { fontSize: 22, fontWeight: "700" as const, color: "#e2e8f0", marginTop: 8 },
  sub:       { fontSize: 14, color: "#94a3b8", textAlign: "center" },
  stats:     { flexDirection: "row", gap: 10, marginTop: 4 },
  badge:     { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  dot:       { width: 8, height: 8, borderRadius: 4 },
  badgeText: { fontSize: 13, fontWeight: "600" as const },
  hint:      { fontSize: 12, color: "#64748b", textAlign: "center", marginTop: 4 },
});
