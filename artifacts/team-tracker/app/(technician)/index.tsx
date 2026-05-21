import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Platform, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { updateLocation, detectArea, getMyActiveFault, type ActiveFaultForTech } from "@/lib/api";
import {
  startBackgroundLocationTask,
  stopBackgroundLocationTask,
  isBackgroundLocationRunning,
} from "@/lib/backgroundLocation";
import {
  startFaultTracking,
  stopFaultTracking,
  isFaultTrackingActive,
  sendHeartbeatNow,
  haversineMeters,
  formatDistance,
  getMovementState,
  type MovementState,
} from "@/services/liveTracking";

/* ─── constants ──────────────────────────────────────────────────────────── */

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#dc2626",
  major:    "#f59e0b",
  minor:    "#3b82f6",
  warning:  "#a3a3a3",
};

const MOVEMENT_CONFIG: Record<MovementState, { color: string; label: string; icon: string }> = {
  moving:  { color: "#3b82f6", label: "MOVING",  icon: "navigation" },
  stopped: { color: "#f59e0b", label: "STOPPED", icon: "pause-circle" },
  offline: { color: "#ef4444", label: "OFFLINE", icon: "wifi-off" },
};

/* ─── FaultTrackingPanel ─────────────────────────────────────────────────── */

interface FaultPanelProps {
  fault:           ActiveFaultForTech;
  distanceM:       number | null;
  movementState:   MovementState;
  trackingActive:  boolean;
  accuracy:        number | null;
  speedKmh:        number | null;
  heartbeatStatus: "ok" | "cached" | "error" | null;
  etaSecsLeft:     number;
}

function FaultTrackingPanel({
  fault,
  distanceM,
  movementState,
  trackingActive,
  accuracy,
  speedKmh,
  heartbeatStatus,
  etaSecsLeft,
}: FaultPanelProps) {
  const sColor     = SEVERITY_COLORS[fault.severity.toLowerCase()] ?? "#a3a3a3";
  const isCritical = fault.severity.toLowerCase() === "critical";
  const stateConf  = MOVEMENT_CONFIG[movementState];

  const connColor = heartbeatStatus === "ok"     ? "#22c55e"
    : heartbeatStatus === "cached" ? "#f59e0b"
    : heartbeatStatus === "error"  ? "#ef4444"
    : "#64748b";
  const connLabel = heartbeatStatus === "ok"     ? "ONLINE"
    : heartbeatStatus === "cached" ? "CACHED"
    : heartbeatStatus === "error"  ? "ERROR"
    : "—";

  const etaMins = Math.floor(etaSecsLeft / 60);
  const etaSecs = etaSecsLeft % 60;
  const etaStr  = etaSecsLeft > 0
    ? `${etaMins}m ${String(etaSecs).padStart(2, "0")}s`
    : fault.dispatchStatus === "en_route" ? "Arriving…" : "—";
  const etaUrgent = etaSecsLeft > 0 && etaSecsLeft < 300;

  const statusLabel =
    fault.dispatchStatus === "en_route" ? "EN ROUTE" :
    fault.dispatchStatus === "assigned" ? "ASSIGNED" :
    fault.dispatchStatus === "on_site"  ? "ON SITE"  :
    fault.dispatchStatus.toUpperCase();

  return (
    <View style={[panel.container, { borderColor: sColor + "55", backgroundColor: sColor + "0d" }]}>

      {/* Header: COW ID + severity + status */}
      <View style={panel.headerRow}>
        <View style={panel.headerLeft}>
          <View style={[panel.dot, { backgroundColor: sColor }]} />
          <Text style={[panel.cowId, { color: sColor }]}>
            {isCritical ? "🚨 " : ""}{fault.cowId}
          </Text>
          <View style={[panel.badge, { backgroundColor: sColor + "22", borderColor: sColor + "44" }]}>
            <Text style={[panel.badgeText, { color: sColor }]}>{fault.severity.toUpperCase()}</Text>
          </View>
        </View>
        <View style={[panel.statusBadge, { backgroundColor: "#1e3a8a88", borderColor: "#3b82f655" }]}>
          <Text style={panel.statusBadgeText}>{statusLabel}</Text>
        </View>
      </View>

      {/* Alarm name + location */}
      <Text style={panel.alarmName} numberOfLines={2}>{fault.alarmName}</Text>
      {fault.location ? (
        <Text style={panel.locationText}>📍 {fault.location}</Text>
      ) : null}

      {/* Divider */}
      <View style={[panel.divider, { backgroundColor: sColor + "33" }]} />

      {/* Stats: Distance | ETA | GPS */}
      <View style={panel.statsRow}>
        <View style={panel.stat}>
          <Text style={panel.statLabel}>DISTANCE</Text>
          <Text style={[panel.statValue, { color: "#e2e8f0" }]}>
            {distanceM != null ? formatDistance(distanceM) : "—"}
          </Text>
        </View>
        <View style={[panel.stat, panel.statMid]}>
          <Text style={panel.statLabel}>ETA</Text>
          <Text style={[panel.statValue, { color: etaUrgent ? "#ef4444" : "#fbbf24" }]}>
            {etaStr}
          </Text>
        </View>
        <View style={panel.stat}>
          <Text style={panel.statLabel}>GPS ACCURACY</Text>
          <Text style={[panel.statValue, { color: "#86efac" }]}>
            {accuracy != null ? `±${Math.round(accuracy)}m` : "—"}
          </Text>
        </View>
      </View>

      {/* Movement + connection + speed row */}
      <View style={panel.pillRow}>
        {/* Movement state */}
        <View style={[panel.pill, { backgroundColor: stateConf.color + "22", borderColor: stateConf.color + "55" }]}>
          <View style={[panel.pillDot, { backgroundColor: stateConf.color }]} />
          <Text style={[panel.pillText, { color: stateConf.color }]}>{stateConf.label}</Text>
          {speedKmh != null && speedKmh > 1 && (
            <Text style={[panel.pillSub, { color: stateConf.color }]}> {Math.round(speedKmh)} km/h</Text>
          )}
        </View>

        {/* Connection */}
        <View style={[panel.pill, { backgroundColor: connColor + "18", borderColor: connColor + "44" }]}>
          <View style={[panel.pillDot, { backgroundColor: connColor }]} />
          <Text style={[panel.pillText, { color: connColor }]}>{connLabel}</Text>
        </View>

        {/* LIVE badge */}
        {trackingActive && (
          <View style={[panel.pill, { backgroundColor: "#dc262622", borderColor: "#dc262655" }]}>
            <View style={[panel.pillDot, { backgroundColor: "#ef4444" }]} />
            <Text style={[panel.pillText, { color: "#ef4444", fontWeight: "800" }]}>LIVE</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/* ─── TechnicianDutyScreen ───────────────────────────────────────────────── */

export default function TechnicianDutyScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, token, logout } = useAuth();

  /* ── existing duty state ── */
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [area,     setArea]     = useState<string>("—");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing,  setSyncing]  = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── fault tracking state ── */
  const [fault,            setFault]            = useState<ActiveFaultForTech | null>(null);
  const [trackingActive,   setTrackingActive]   = useState(false);
  const [currentPos,       setCurrentPos]       = useState<{
    lat: number; lng: number; speedMs: number | null;
    heading: number | null; accuracy: number | null;
  } | null>(null);
  const [lastHeartbeatAt,  setLastHeartbeatAt]  = useState<Date | null>(null);
  const [heartbeatStatus,  setHeartbeatStatus]  = useState<"ok" | "cached" | "error" | null>(null);
  const [faultFetchedAt,   setFaultFetchedAt]   = useState<Date>(new Date());
  const [tickMs,           setTickMs]           = useState(Date.now());
  const faultPollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationSubRef  = useRef<Location.LocationSubscription | null>(null);

  /* ── animations ── */
  const scale    = useSharedValue(1);
  const pulse    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity:   (2 - pulse.value) * 0.35,
  }));

  useEffect(() => {
    if (isOnDuty) {
      pulse.value = withRepeat(withTiming(2, { duration: 1600 }), -1, false);
    } else {
      pulse.value = withTiming(1);
    }
  }, [isOnDuty]);

  /* ── 1 s tick for live countdown ── */
  useEffect(() => {
    const t = setInterval(() => setTickMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Restore on-duty state on mount ── */
  useEffect(() => {
    isBackgroundLocationRunning().then(running => {
      if (running) setIsOnDuty(true);
    });
    isFaultTrackingActive().then(active => {
      if (active) setTrackingActive(true);
    });
    return () => {
      if (intervalRef.current)   clearInterval(intervalRef.current);
      if (faultPollRef.current)  clearInterval(faultPollRef.current);
      locationSubRef.current?.remove();
    };
  }, []);

  /* ── Live foreground GPS subscription ── */
  useEffect(() => {
    if (!isOnDuty || Platform.OS === "web") {
      locationSubRef.current?.remove();
      locationSubRef.current = null;
      return;
    }

    let active = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted" || !active) return;

        const sub = await Location.watchPositionAsync(
          {
            accuracy:         Location.Accuracy.High,
            timeInterval:     5_000,
            distanceInterval: 5,
          },
          (loc) => {
            const { latitude, longitude, speed, heading, accuracy } = loc.coords;
            setCurrentPos({ lat: latitude, lng: longitude, speedMs: speed, heading, accuracy });
            setLastHeartbeatAt(new Date());
            setLastSync(new Date());

            if (token) {
              sendHeartbeatNow(token, latitude, longitude, speed, heading, accuracy).then(st => {
                setHeartbeatStatus(st);
              });
            }
          },
        );
        locationSubRef.current = sub;
      } catch (err) {
        console.log("[DutyScreen] watchPositionAsync error:", String(err));
      }
    })();

    return () => {
      active = false;
      locationSubRef.current?.remove();
      locationSubRef.current = null;
    };
  }, [isOnDuty, token]);

  /* ── Fault poll — auto-start/stop tracking ── */
  useEffect(() => {
    if (!token || !isOnDuty) {
      setFault(null);
      if (faultPollRef.current) clearInterval(faultPollRef.current);
      return;
    }

    const poll = async () => {
      try {
        const f = await getMyActiveFault(token);
        setFault(f);
        setFaultFetchedAt(new Date());

        if (!f) {
          const active = await isFaultTrackingActive();
          if (active) { await stopFaultTracking(); setTrackingActive(false); }
          return;
        }

        if (f.dispatchStatus === "en_route") {
          const active = await isFaultTrackingActive();
          if (!active && user) {
            const ok = await startFaultTracking({
              faultId: f.id, techId: user.id,
              siteLat: f.siteLat, siteLng: f.siteLng,
            });
            setTrackingActive(ok);
            if (ok) console.log("[DutyScreen] Fault tracking auto-started for", f.cowId);
          } else {
            setTrackingActive(true);
          }
        }

        if (["on_site", "resolved", "closed"].includes(f.dispatchStatus)) {
          const active = await isFaultTrackingActive();
          if (active) {
            await stopFaultTracking();
            setTrackingActive(false);
            console.log("[DutyScreen] Fault tracking auto-stopped — status:", f.dispatchStatus);
          }
        }
      } catch (err) {
        console.log("[DutyScreen] fault poll error:", String(err));
      }
    };

    poll();
    faultPollRef.current = setInterval(poll, 10_000);
    return () => {
      if (faultPollRef.current) clearInterval(faultPollRef.current);
    };
  }, [token, isOnDuty, user]);

  /* ── Foreground push (duty interval when no live sub) ── */
  const pushLocation = useCallback(async (onDuty: boolean) => {
    if (!token) return;
    setSyncing(true);
    try {
      if (Platform.OS !== "web") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const { latitude, longitude } = loc.coords;
          const detectedArea = detectArea(latitude, longitude);
          setArea(onDuty ? detectedArea : "—");
          await updateLocation(token, latitude, longitude, detectedArea, onDuty);
          setLastSync(new Date());
          setSyncing(false);
          return;
        }
      }
      // Web fallback
      const pos: GeolocationPosition | null = await new Promise(resolve =>
        navigator.geolocation?.getCurrentPosition(p => resolve(p), () => resolve(null)),
      );
      const lat  = pos?.coords.latitude  ?? 21.38;
      const lng  = pos?.coords.longitude ?? 39.93;
      const area = pos ? detectArea(lat, lng) : "Holy Sites";
      setArea(onDuty ? area : "—");
      await updateLocation(token, lat, lng, area, onDuty);
      setLastSync(new Date());
    } catch {}
    setSyncing(false);
  }, [token]);

  /* ── Duty toggle ── */
  const toggleDuty = async () => {
    const next = !isOnDuty;
    scale.value = withSpring(0.9, {}, () => { scale.value = withSpring(1); });
    await Haptics.impactAsync(next ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);

    if (next) {
      const started = await startBackgroundLocationTask();
      if (!started) {
        Alert.alert(
          "Background Location Required",
          'Please grant "Always" location permission so ACES can track your position while on duty.',
        );
        return;
      }
      setIsOnDuty(true);
      await pushLocation(true);
      intervalRef.current = setInterval(() => pushLocation(true), 30_000);
    } else {
      setIsOnDuty(false);
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      await stopBackgroundLocationTask();
      await stopFaultTracking();
      setTrackingActive(false);
      setFault(null);
      setCurrentPos(null);
      if (faultPollRef.current) { clearInterval(faultPollRef.current); faultPollRef.current = null; }
      await pushLocation(false);
    }
  };

  /* ── Derived values ── */
  const movementState: MovementState = getMovementState(
    currentPos?.speedMs ?? null, lastHeartbeatAt,
  );
  const speedKmh  = currentPos?.speedMs != null ? currentPos.speedMs * 3.6 : null;
  const distanceM = fault && currentPos
    ? haversineMeters(currentPos.lat, currentPos.lng, fault.siteLat, fault.siteLng)
    : null;

  // Live ETA countdown
  const etaSecsLeft = (() => {
    if (!fault?.eta || !fault.dispatchedAt) return (fault?.eta ?? 0) * 60;
    const elapsed = (tickMs - new Date(fault.dispatchedAt).getTime()) / 1000;
    return Math.max(0, fault.eta * 60 - elapsed);
  })();

  const hasFaultActive = !!(fault && ["en_route", "assigned"].includes(fault.dispatchStatus));

  const dutyBg    = isOnDuty ? colors.primary : colors.offDuty;
  const ringColor = isOnDuty ? colors.primary : colors.offDuty;
  const topPad    = insets.top  + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.headerAccent, { backgroundColor: colors.accent }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.foreground }]}>{user?.name}</Text>
          <Text style={[styles.role, { color: colors.mutedForeground }]}>
            Field Technician{trackingActive ? " · 📡 LIVE" : ""}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={[styles.iconBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="log-out" size={17} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* ── Main ── */}
      <View style={[styles.main, { paddingBottom: bottomPad }]}>

        {/* Status chip */}
        <View style={[styles.statusChip, {
          backgroundColor: isOnDuty ? colors.primary + "14" : colors.offDuty + "18",
          borderColor:     isOnDuty ? colors.primary + "40" : colors.offDuty + "40",
        }]}>
          <View style={[styles.statusDot, { backgroundColor: isOnDuty ? colors.primary : colors.offDuty }]} />
          <Text style={[styles.statusText, { color: isOnDuty ? colors.primary : colors.offDuty }]}>
            {trackingActive ? "🛡 COW FAULT — LIVE TRACKING"
              : isOnDuty    ? "ACTIVE — Location tracking ON"
              : "OFF DUTY"}
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
                  <Text style={styles.dutyLabel}>{isOnDuty ? "ON DUTY" : "GO ON DUTY"}</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Info cards: Area + Last Sync */}
        <View style={styles.cards}>
          <View style={[styles.card, {
            backgroundColor: colors.card, borderColor: colors.border,
            borderTopColor: colors.accent, borderTopWidth: 3,
          }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.accent} />
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>AREA</Text>
            <Text style={[styles.cardValue, { color: colors.foreground }]}>{area}</Text>
          </View>
          <View style={[styles.card, {
            backgroundColor: colors.card, borderColor: colors.border,
            borderTopColor: colors.primary, borderTopWidth: 3,
          }]}>
            <MaterialCommunityIcons
              name={heartbeatStatus === "ok" ? "check-circle-outline" : heartbeatStatus === "cached" ? "cloud-sync-outline" : "sync"}
              size={18}
              color={heartbeatStatus === "ok" ? "#22c55e" : heartbeatStatus === "cached" ? "#f59e0b" : colors.primary}
            />
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>LAST SYNC</Text>
            <Text style={[styles.cardValue, { color: colors.foreground }]}>
              {lastSync ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}
            </Text>
          </View>
        </View>

        {/* Fault Tracking Panel */}
        {hasFaultActive && fault ? (
          <FaultTrackingPanel
            fault={fault}
            distanceM={distanceM}
            movementState={movementState}
            trackingActive={trackingActive}
            accuracy={currentPos?.accuracy ?? null}
            speedKmh={speedKmh}
            heartbeatStatus={heartbeatStatus}
            etaSecsLeft={Math.round(etaSecsLeft)}
          />
        ) : null}

        {/* Hint */}
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          {trackingActive
            ? "Sending GPS every 10s · 10m — continues in background"
            : isOnDuty
            ? "Location sent every 30s — continues in background"
            : "Tap the button to start your shift"}
        </Text>
      </View>
    </LinearGradient>
  );
}

/* ─── styles ─────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  root:        { flex: 1 },
  header:      {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  headerAccent:{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  name:        { fontSize: 20, fontWeight: "700" },
  role:        { fontSize: 12, marginTop: 2 },
  iconBtn:     { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  main:        { flex: 1, alignItems: "center", justifyContent: "center", gap: 20, paddingHorizontal: 20 },
  statusChip:  { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  statusDot:   { width: 7, height: 7, borderRadius: 4 },
  statusText:  { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  toggleArea:  { width: 200, height: 200, alignItems: "center", justifyContent: "center" },
  ring:        { position: "absolute", width: 200, height: 200, borderRadius: 100, borderWidth: 2 },
  dutyBtn:     {
    width: 160, height: 160, borderRadius: 80,
    alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 20, elevation: 12,
  },
  dutyLabel:   { color: "#fff", fontWeight: "800", fontSize: 13, letterSpacing: 0.5 },
  cards:       { flexDirection: "row", gap: 12, width: "100%" },
  card:        {
    flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, gap: 4, alignItems: "center",
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardLabel:   { fontSize: 10, fontWeight: "600", letterSpacing: 1 },
  cardValue:   { fontSize: 14, fontWeight: "700" },
  hint:        { fontSize: 12, textAlign: "center", lineHeight: 18 },
});

const panel = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 18, borderWidth: 1,
    padding: 16, gap: 10,
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
  },
  headerRow:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft:      { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  dot:             { width: 8, height: 8, borderRadius: 4 },
  cowId:           { fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
  badge:           { borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText:       { fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  statusBadge:     { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { color: "#93c5fd", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  alarmName:       { color: "#e2e8f0", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  locationText:    { color: "#64748b", fontSize: 11 },
  divider:         { height: 1 },
  statsRow:        { flexDirection: "row" },
  stat:            { flex: 1, alignItems: "center", gap: 3 },
  statMid:         { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#ffffff18" },
  statLabel:       { fontSize: 8, fontWeight: "700", letterSpacing: 1, color: "#64748b" },
  statValue:       { fontSize: 18, fontWeight: "900", letterSpacing: 0.5 },
  pillRow:         { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  pill:            { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  pillDot:         { width: 6, height: 6, borderRadius: 3 },
  pillText:        { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  pillSub:         { fontSize: 10, fontWeight: "600" },
});
