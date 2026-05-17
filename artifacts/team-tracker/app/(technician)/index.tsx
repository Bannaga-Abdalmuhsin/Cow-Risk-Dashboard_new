import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Platform, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { updateLocation, detectArea } from "@/lib/api";

async function getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
  if (Platform.OS === "web") {
    return new Promise(resolve => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        ()  => resolve(null),
      );
    });
  }
  try {
    const Location = await import("expo-location");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
  } catch {
    return null;
  }
}

export default function TechnicianDutyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, token, logout } = useAuth();

  const [isOnDuty, setIsOnDuty] = useState(false);
  const [area,     setArea]     = useState<string>("—");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing,  setSyncing]  = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scale  = useSharedValue(1);
  const pulse  = useSharedValue(1);
  const btnStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: (2 - pulse.value) * 0.4 }));

  useEffect(() => {
    if (isOnDuty) {
      pulse.value = withRepeat(withTiming(2, { duration: 1500 }), -1, false);
    } else {
      pulse.value = withTiming(1);
    }
  }, [isOnDuty]);

  const pushLocation = useCallback(async (onDuty: boolean) => {
    if (!token) return;
    setSyncing(true);
    try {
      const pos = await getCurrentPosition();
      const lat = pos?.latitude  ?? 21.38;
      const lng = pos?.longitude ?? 39.93;
      const detectedArea = pos ? detectArea(lat, lng) : "Holy Sites";
      setArea(onDuty ? detectedArea : "—");
      await updateLocation(token, lat, lng, detectedArea, onDuty);
      setLastSync(new Date());
    } catch {}
    setSyncing(false);
  }, [token]);

  const toggleDuty = async () => {
    const next = !isOnDuty;
    scale.value = withSpring(0.9, {}, () => { scale.value = withSpring(1); });
    await Haptics.impactAsync(next ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
    setIsOnDuty(next);
    await pushLocation(next);
    if (next) {
      intervalRef.current = setInterval(() => pushLocation(true), 10000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const dutyColor = isOnDuty ? colors.onDuty : colors.offDuty;
  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.name, { color: colors.foreground }]}>{user?.name}</Text>
          <Text style={[styles.role, { color: colors.mutedForeground }]}>Field Technician</Text>
        </View>
        <TouchableOpacity onPress={logout} style={[styles.iconBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="log-out" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* Main duty area */}
      <View style={[styles.main, { paddingBottom: bottomPad }]}>

        {/* Duty toggle */}
        <View style={styles.toggleArea}>
          <Animated.View style={[styles.ring, { borderColor: dutyColor }, ringStyle]} />
          <Animated.View style={btnStyle}>
            <TouchableOpacity
              onPress={toggleDuty}
              disabled={syncing}
              activeOpacity={0.85}
              style={[styles.dutyBtn, { backgroundColor: dutyColor }]}
            >
              {syncing
                ? <ActivityIndicator color="#fff" size="large" />
                : (
                  <>
                    <Feather name={isOnDuty ? "radio" : "power"} size={40} color="#fff" />
                    <Text style={styles.dutyLabel}>
                      {isOnDuty ? "ON DUTY" : "OFF DUTY"}
                    </Text>
                  </>
                )
              }
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Status cards */}
        <View style={styles.cards}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="map-pin" size={16} color={colors.mutedForeground} />
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>AREA</Text>
            <Text style={[styles.cardValue, { color: colors.foreground }]}>{area}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="refresh-cw" size={16} color={colors.mutedForeground} />
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>LAST SYNC</Text>
            <Text style={[styles.cardValue, { color: colors.foreground }]}>
              {lastSync ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
            </Text>
          </View>
        </View>

        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          {isOnDuty
            ? "Your location is being shared every 10 seconds"
            : "Tap the button to start sharing your location"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  header:     {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  name:       { fontSize: 20, fontWeight: "700" as const },
  role:       { fontSize: 12, marginTop: 2 },
  iconBtn:    { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  main:       { flex: 1, alignItems: "center", justifyContent: "center", gap: 32, paddingHorizontal: 24 },
  toggleArea: { width: 200, height: 200, alignItems: "center", justifyContent: "center" },
  ring:       { position: "absolute", width: 200, height: 200, borderRadius: 100, borderWidth: 2 },
  dutyBtn:    {
    width: 160, height: 160, borderRadius: 80,
    alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  dutyLabel:  { color: "#fff", fontWeight: "800" as const, fontSize: 14, letterSpacing: 1 },
  cards:      { flexDirection: "row", gap: 12, width: "100%" },
  card:       {
    flex: 1, padding: 16, borderRadius: 22, borderWidth: 1, gap: 4, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
  },
  cardLabel:  { fontSize: 10, fontWeight: "600" as const, letterSpacing: 1 },
  cardValue:  { fontSize: 16, fontWeight: "700" as const },
  hint:       { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
