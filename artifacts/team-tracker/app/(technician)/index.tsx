import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Platform, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { updateLocation, detectArea } from "@/lib/api";
import {
  startBackgroundLocationTask,
  stopBackgroundLocationTask,
  isBackgroundLocationRunning,
} from "@/lib/backgroundLocation";

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

  const scale     = useSharedValue(1);
  const pulse     = useSharedValue(1);
  const btnStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: (2 - pulse.value) * 0.35,
  }));

  useEffect(() => {
    if (isOnDuty) {
      pulse.value = withRepeat(withTiming(2, { duration: 1600 }), -1, false);
    } else {
      pulse.value = withTiming(1);
    }
  }, [isOnDuty]);

  /* Restore isOnDuty state on mount if background task was already running */
  useEffect(() => {
    isBackgroundLocationRunning().then(running => {
      if (running) setIsOnDuty(true);
    });
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  /* Foreground push — updates server + "Last Sync" UI when app is open */
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

    if (next) {
      /* ── Going On Duty ── */
      const started = await startBackgroundLocationTask();
      if (!started) {
        Alert.alert(
          "Background Location Required",
          'Please grant "Always" location permission so ACES can track your position while on duty. Go to Settings → ACES Field Tracker → Location → Always.',
        );
        return;
      }
      setIsOnDuty(true);
      await pushLocation(true);
      /* Foreground interval keeps "Last Sync" timer fresh while app is open */
      intervalRef.current = setInterval(() => pushLocation(true), 10000);
    } else {
      /* ── Going Off Duty ── */
      setIsOnDuty(false);
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      await stopBackgroundLocationTask();
      await pushLocation(false);
    }
  };

  const dutyBg    = isOnDuty ? colors.primary : colors.offDuty;
  const ringColor = isOnDuty ? colors.primary : colors.offDuty;
  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.headerAccent, { backgroundColor: colors.accent }]} />
        <View>
          <Text style={[styles.name, { color: colors.foreground }]}>{user?.name}</Text>
          <Text style={[styles.role, { color: colors.mutedForeground }]}>Field Technician</Text>
        </View>
        <TouchableOpacity onPress={logout} style={[styles.iconBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="log-out" size={17} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* Main duty area */}
      <View style={[styles.main, { paddingBottom: bottomPad }]}>

        {/* Status chip */}
        <View style={[styles.statusChip, {
          backgroundColor: isOnDuty ? colors.primary + "14" : colors.offDuty + "18",
          borderColor:     isOnDuty ? colors.primary + "40" : colors.offDuty + "40",
        }]}>
          <View style={[styles.statusDot, { backgroundColor: isOnDuty ? colors.primary : colors.offDuty }]} />
          <Text style={[styles.statusText, { color: isOnDuty ? colors.primary : colors.offDuty }]}>
            {isOnDuty ? "ACTIVE — Location tracking ON" : "OFF DUTY"}
          </Text>
        </View>

        {/* Duty toggle */}
        <View style={styles.toggleArea}>
          <Animated.View style={[styles.ring, { borderColor: ringColor }, ringStyle]} />
          <Animated.View style={btnStyle}>
            <TouchableOpacity
              onPress={toggleDuty}
              disabled={syncing}
              activeOpacity={0.88}
              style={[styles.dutyBtn, { backgroundColor: dutyBg }]}
            >
              {syncing ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <>
                  <Feather name={isOnDuty ? "radio" : "power"} size={38} color="#fff" />
                  <Text style={styles.dutyLabel}>
                    {isOnDuty ? "ON DUTY" : "GO ON DUTY"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Status cards */}
        <View style={styles.cards}>
          <View style={[styles.card, {
            backgroundColor: colors.card,
            borderColor:     colors.border,
            borderTopColor:  colors.accent,
            borderTopWidth:  3,
          }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.accent} />
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>AREA</Text>
            <Text style={[styles.cardValue, { color: colors.foreground }]}>{area}</Text>
          </View>
          <View style={[styles.card, {
            backgroundColor: colors.card,
            borderColor:     colors.border,
            borderTopColor:  colors.primary,
            borderTopWidth:  3,
          }]}>
            <MaterialCommunityIcons name="sync" size={18} color={colors.primary} />
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>LAST SYNC</Text>
            <Text style={[styles.cardValue, { color: colors.foreground }]}>
              {lastSync ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
            </Text>
          </View>
        </View>

        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          {isOnDuty
            ? "Location sent every 10s — continues in background"
            : "Tap the button to start your shift"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  header:      {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  headerAccent:{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  name:        { fontSize: 20, fontWeight: "700" as const },
  role:        { fontSize: 12, marginTop: 2 },
  iconBtn:     { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  main:        { flex: 1, alignItems: "center", justifyContent: "center", gap: 28, paddingHorizontal: 24 },
  statusChip:  { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  statusDot:   { width: 7, height: 7, borderRadius: 4 },
  statusText:  { fontSize: 12, fontWeight: "700" as const, letterSpacing: 0.5 },
  toggleArea:  { width: 200, height: 200, alignItems: "center", justifyContent: "center" },
  ring:        { position: "absolute", width: 200, height: 200, borderRadius: 100, borderWidth: 2 },
  dutyBtn:     {
    width: 160, height: 160, borderRadius: 80,
    alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 20, elevation: 12,
  },
  dutyLabel:   { color: "#fff", fontWeight: "800" as const, fontSize: 13, letterSpacing: 0.5 },
  cards:       { flexDirection: "row", gap: 12, width: "100%" },
  card:        {
    flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, gap: 4, alignItems: "center",
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardLabel:   { fontSize: 10, fontWeight: "600" as const, letterSpacing: 1 },
  cardValue:   { fontSize: 16, fontWeight: "700" as const },
  hint:        { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
