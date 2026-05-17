import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { type TechLocationWithUser } from "@/lib/api";

const MAKKAH = { latitude: 21.38, longitude: 39.93, latitudeDelta: 0.3, longitudeDelta: 0.3 };

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
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={StyleSheet.absoluteFillObject}
      initialRegion={MAKKAH}
      userInterfaceStyle="dark"
    >
      {locations.map(loc => {
        const mins   = minutesAgo(loc.updatedAt);
        const online = loc.isOnDuty && mins < 3;
        return (
          <Marker
            key={loc.userId}
            coordinate={{ latitude: loc.lat, longitude: loc.lng }}
            onPress={() => onMarkerPress(loc)}
          >
            <View style={[
              styles.marker,
              { backgroundColor: online ? onDutyColor : offDutyColor },
            ]}>
              <Text style={styles.markerText}>{loc.userName.replace("Tech-", "T")}</Text>
              {online && <View style={styles.liveRing} />}
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{loc.userName}</Text>
                <Text style={styles.calloutSub}>{loc.area ?? "Unknown area"}</Text>
                <Text style={styles.calloutTime}>{online ? "Online" : `${mins}m ago`}</Text>
              </View>
            </Callout>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  marker:      { paddingHorizontal: 7, paddingVertical: 5, borderRadius: 12, borderWidth: 2, borderColor: "#fff", alignItems: "center", justifyContent: "center", minWidth: 38, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 8 },
  markerText:  { color: "#fff", fontSize: 10, fontWeight: "800" as const },
  liveRing:    { position: "absolute", top: -3, right: -3, width: 9, height: 9, borderRadius: 5, backgroundColor: "#34D399", borderWidth: 1.5, borderColor: "#fff" },
  callout:     { padding: 8, minWidth: 120 },
  calloutName: { fontWeight: "700" as const, fontSize: 13 },
  calloutSub:  { fontSize: 11, color: "#666", marginTop: 2 },
  calloutTime: { fontSize: 11, color: "#888", marginTop: 2 },
});
