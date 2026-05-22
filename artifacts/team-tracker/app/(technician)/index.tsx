import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Platform, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming,
  withDelay, Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { updateLocation, detectArea, getMyActiveFault, type ActiveFaultForTech } from "@/lib/api";
import { wsClient } from "@/lib/wsClient";
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
  heartbeatStatus: "ok" | "cached" | "filtered" | "error" | null;
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

  const connColor = heartbeatStatus === "ok"       ? "#22c55e"
    : heartbeatStatus === "cached"   ? "#f59e0b"
    : heartbeatStatus === "filtered" ? "#a855f7"
    : heartbeatStatus === "error"    ? "#ef4444"
    : "#64748b";
  const connLabel = heartbeatStatus === "ok"       ? "ONLINE"
    : heartbeatStatus === "cached"   ? "CACHED"
    : heartbeatStatus === "filtered" ? "FILTERED"
    : heartbeatStatus === "error"    ? "ERROR"
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
        <View style={[panel.pill, { backgroundColor: stateConf.color + "22", borderColor: stateConf.color + "55" }]}>
          <View style={[panel.pillDot, { backgroundColor: stateConf.color }]} />
          <Text style={[panel.pillText, { color: stateConf.color }]}>{stateConf.label}</Text>
          {speedKmh != null && speedKmh > 1 && (
            <Text style={[panel.pillSub, { color: stateConf.color }]}> {Math.round(speedKmh)} km/h</Text>
          )}
        </View>

        <View style={[panel.pill, { backgroundColor: connColor + "18", borderColor: connColor + "44" }]}>
          <View style={[panel.pillDot, { backgroundColor: connColor }]} />
          <Text style={[panel.pillText, { color: connColor }]}>{connLabel}</Text>
        </View>

        {trackingActive && (
          <View style={[panel.pill, { backgroundColor: "#dc262622", borderColor: "#dc262655" }]}>
            <View style={[panel.pillDot, { backgroundColor: "#ef4444" }]} />
            <Text style={[panel.pillText, { color: "#ef4444", fontWeight: "800" as const }]}>LIVE</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/* ─── PulseRing ──────────────────────────────────────────────────────────── */

function PulseRing({ delay, color, size }: { delay: number; color: string; size: number }) {
  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.5 + anim.value }],
    opacity:   0.5 * (1 - anim.value),
  }));
  return (
    <Animated.View
      style={[{
        position: "absolute",
        width: size, height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
      }, style]}
    />
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
  const [heartbeatStatus,  setHeartbeatStatus]  = useState<"ok" | "cached" | "filtered" | "error" | null>(null);
  const [faultFetchedAt,   setFaultFetchedAt]   = useState<Date>(new Date());
  const [tickMs,           setTickMs]           = useState(Date.now());
  const faultPollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationSubRef  = useRef<Location.LocationSubscription | null>(null);

  /* ── animations ── */
  const scale    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

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
            accuracy:         Location.Accuracy.BestForNavigation,
            timeInterval:     5_000,
            distanceInterval: 1,
          },
          (loc) => {
            const { latitude, longitude, speed, heading, accuracy } = loc.coords;
            setCurrentPos({ lat: latitude, lng: longitude, speedMs: speed, heading, accuracy });
            setLastHeartbeatAt(new Date());
            setLastSync(new Date());

            if (token) {
              /* WS primary path (lower latency) — HTTP fallback if not connected */
              const wsSent = wsClient.sendLocation({
                lat:      latitude,
                lng:      longitude,
                accuracy: accuracy ?? null,
                speed:    speed    ?? null,
                heading:  heading  ?? null,
                isOnDuty: true,
              });
              if (wsSent) {
                setHeartbeatStatus("ok");
              } else {
                sendHeartbeatNow(token, latitude, longitude, speed, heading, accuracy).then(st => {
                  setHeartbeatStatus(st);
                });
              }
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

  /* ── Foreground push ── */
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
      if (token) wsClient.connect(token);
      await pushLocation(true);
      intervalRef.current = setInterval(() => pushLocation(true), 30_000);
    } else {
      setIsOnDuty(false);
      wsClient.disconnect();
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

  const etaSecsLeft = (() => {
    if (!fault?.eta || !fault.dispatchedAt) return (fault?.eta ?? 0) * 60;
    const elapsed = (tickMs - new Date(fault.dispatchedAt).getTime()) / 1000;
    return Math.max(0, fault.eta * 60 - elapsed);
  })();

  const hasFaultActive = !!(fault && ["en_route", "assigned"].includes(fault.dispatchStatus));

  const topPad    = insets.top  + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  const dutyBtnColor  = isOnDuty ? "#174EA6" : "#1C2A3A";
  const ringColor     = isOnDuty ? "#174EA6"  : "#3D5470";
  const glowColor     = isOnDuty ? "#174EA6"  : "transparent";

  return (
    <LinearGradient colors={["#060D1A", "#0A1B34"]} style={styles.root}>

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 14 }]}>
        <LinearGradient
          colors={["rgba(23,78,166,0.25)", "rgba(6,13,26,0)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAccentBar} />
            <View>
              <Text style={styles.headerName}>{user?.name}</Text>
              <View style={styles.headerRoleRow}>
                <Text style={styles.headerRole}>Field Technician</Text>
                {trackingActive && (
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={styles.logoutBtn}
          >
            <Feather name="log-out" size={16} color="#6B8DB8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main ── */}
      <View style={[styles.main, { paddingBottom: bottomPad }]}>

        {/* Status pill */}
        <View style={[
          styles.statusPill,
          {
            backgroundColor: isOnDuty
              ? trackingActive ? "rgba(214,40,40,0.12)" : "rgba(0,184,148,0.10)"
              : "rgba(61,84,112,0.15)",
            borderColor: isOnDuty
              ? trackingActive ? "rgba(214,40,40,0.35)" : "rgba(0,184,148,0.30)"
              : "rgba(61,84,112,0.30)",
          },
        ]}>
          <View style={[
            styles.statusDot,
            { backgroundColor: isOnDuty ? (trackingActive ? "#D62828" : "#00B894") : "#3D5470" },
          ]} />
          <Text style={[
            styles.statusText,
            { color: isOnDuty ? (trackingActive ? "#EF6B6B" : "#00B894") : "#3D5470" },
          ]}>
            {trackingActive
              ? "🛡 COW FAULT — LIVE TRACKING"
              : isOnDuty
              ? "ACTIVE · GPS BROADCASTING"
              : "OFF DUTY"}
          </Text>
        </View>

        {/* Duty toggle with pulse rings */}
        <View style={styles.toggleArea}>
          {isOnDuty && (
            <>
              <PulseRing delay={0}    color={ringColor} size={220} />
              <PulseRing delay={700}  color={ringColor} size={220} />
              <PulseRing delay={1400} color={ringColor} size={220} />
            </>
          )}
          <Animated.View style={btnStyle}>
            <TouchableOpacity
              onPress={toggleDuty}
              disabled={syncing}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={isOnDuty
                  ? ["#1E5FCC", "#0E3A8C"]
                  : ["#1C2A3A", "#111B28"]}
                style={[
                  styles.dutyBtn,
                  {
                    shadowColor: glowColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isOnDuty ? 0.8 : 0,
                    shadowRadius: 24,
                    elevation: isOnDuty ? 20 : 8,
                  },
                ]}
              >
                {syncing ? (
                  <ActivityIndicator color="#fff" size="large" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name={isOnDuty ? "radar" : "power"}
                      size={40}
                      color={isOnDuty ? "#fff" : "#6B8DB8"}
                    />
                    <Text style={[styles.dutyLabel, { color: isOnDuty ? "#fff" : "#6B8DB8" }]}>
                      {isOnDuty ? "ON DUTY" : "GO ON DUTY"}
                    </Text>
                    {isOnDuty && (
                      <Text style={styles.dutySubLabel}>TAP TO END SHIFT</Text>
                    )}
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Info cards */}
        <View style={styles.cards}>
          {/* Area */}
          <View style={styles.card}>
            <LinearGradient
              colors={["rgba(23,78,166,0.20)", "rgba(23,78,166,0.08)"]}
              style={styles.cardGrad}
            >
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#174EA6" />
              <Text style={styles.cardLabel}>AREA</Text>
              <Text style={styles.cardValue} numberOfLines={1}>{area}</Text>
            </LinearGradient>
          </View>

          {/* GPS / Last Sync */}
          <View style={styles.card}>
            <LinearGradient
              colors={[
                heartbeatStatus === "ok"
                  ? "rgba(0,184,148,0.20)"
                  : "rgba(23,78,166,0.20)",
                "rgba(6,13,26,0.08)",
              ]}
              style={styles.cardGrad}
            >
              <MaterialCommunityIcons
                name={heartbeatStatus === "ok" ? "check-circle-outline"
                  : heartbeatStatus === "cached" ? "cloud-sync-outline"
                  : heartbeatStatus === "filtered" ? "filter-outline"
                  : "satellite-variant"}
                size={16}
                color={heartbeatStatus === "ok" ? "#00B894"
                  : heartbeatStatus === "cached" ? "#f59e0b"
                  : heartbeatStatus === "filtered" ? "#a855f7"
                  : "#174EA6"}
              />
              <Text style={styles.cardLabel}>GPS SYNC</Text>
              <Text style={styles.cardValue} numberOfLines={1}>
                {lastSync
                  ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                  : "—"}
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Accuracy card (only when on duty) */}
        {isOnDuty && currentPos?.accuracy != null && (
          <View style={styles.accuracyRow}>
            <MaterialCommunityIcons name="crosshairs-gps" size={13} color="#00B894" />
            <Text style={styles.accuracyText}>
              GPS ±{Math.round(currentPos.accuracy)}m
            </Text>
            {currentPos.speedMs != null && currentPos.speedMs > 0.5 && (
              <>
                <View style={styles.accuracySep} />
                <MaterialCommunityIcons name="speedometer" size={13} color="#174EA6" />
                <Text style={[styles.accuracyText, { color: "#174EA6" }]}>
                  {Math.round(currentPos.speedMs * 3.6)} km/h
                </Text>
              </>
            )}
          </View>
        )}

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
        <Text style={styles.hint}>
          {trackingActive
            ? "Sending GPS every 10s · continues in background"
            : isOnDuty
            ? "Location sent every 30s · continues in background"
            : "Tap the button to start your shift"}
        </Text>
      </View>
    </LinearGradient>
  );
}

/* ─── styles ─────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  root:           { flex: 1 },

  header:         {
    paddingHorizontal: 20, paddingBottom: 14, overflow: "hidden",
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.12)",
  },
  headerContent:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft:     { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAccentBar:{ width: 3, height: 38, borderRadius: 2, backgroundColor: "#174EA6" },
  headerName:     { fontSize: 20, fontWeight: "700" as const, color: "#E2EFFF" },
  headerRoleRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  headerRole:     { fontSize: 12, color: "#6B8DB8" },
  liveBadge:      {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(214,40,40,0.15)",
    borderWidth: 1, borderColor: "rgba(214,40,40,0.35)",
    borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2,
  },
  liveDot:        { width: 5, height: 5, borderRadius: 3, backgroundColor: "#D62828" },
  liveText:       { color: "#EF6B6B", fontSize: 9, fontWeight: "800" as const, letterSpacing: 1 },
  logoutBtn:      {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  main:           { flex: 1, alignItems: "center", justifyContent: "center", gap: 18, paddingHorizontal: 20 },

  statusPill:     {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 9,
  },
  statusDot:      { width: 7, height: 7, borderRadius: 4 },
  statusText:     { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.8 },

  toggleArea:     { width: 220, height: 220, alignItems: "center", justifyContent: "center" },
  dutyBtn:        {
    width: 170, height: 170, borderRadius: 85,
    alignItems: "center", justifyContent: "center", gap: 6,
    borderWidth: 1, borderColor: "rgba(100,160,255,0.20)",
  },
  dutyLabel:      { fontWeight: "800" as const, fontSize: 14, letterSpacing: 1 },
  dutySubLabel:   { color: "rgba(255,255,255,0.45)", fontSize: 9, letterSpacing: 0.8, fontWeight: "600" as const },

  cards:          { flexDirection: "row", gap: 12, width: "100%" },
  card:           {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1, borderColor: "rgba(100,160,255,0.18)",
    overflow: "hidden",
  },
  cardGrad:       { padding: 14, gap: 4, alignItems: "flex-start" },
  cardLabel:      { fontSize: 9, fontWeight: "700" as const, color: "#6B8DB8", letterSpacing: 1.2, marginTop: 4 },
  cardValue:      { fontSize: 14, fontWeight: "700" as const, color: "#E2EFFF" },

  accuracyRow:    {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(0,184,148,0.08)",
    borderWidth: 1, borderColor: "rgba(0,184,148,0.20)",
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
  },
  accuracyText:   { fontSize: 11, fontWeight: "600" as const, color: "#00B894" },
  accuracySep:    { width: 1, height: 10, backgroundColor: "rgba(100,160,255,0.25)", marginHorizontal: 2 },

  hint:           { color: "#3D5470", fontSize: 11, textAlign: "center", paddingHorizontal: 20 },
});

/* ─── FaultTrackingPanel styles ──────────────────────────────────────────── */

const panel = StyleSheet.create({
  container:       {
    width: "100%",
    borderWidth: 1, borderRadius: 16,
    padding: 14, gap: 10,
  },
  headerRow:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft:      { flexDirection: "row", alignItems: "center", gap: 8 },
  dot:             { width: 8, height: 8, borderRadius: 4 },
  cowId:           { fontSize: 15, fontWeight: "800" as const },
  badge:           { borderWidth: 1, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText:       { fontSize: 9, fontWeight: "800" as const, letterSpacing: 0.8 },
  statusBadge:     { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { color: "#93c5fd", fontSize: 9, fontWeight: "700" as const, letterSpacing: 0.8 },
  alarmName:       { fontSize: 13, fontWeight: "600" as const, color: "#e2e8f0", lineHeight: 18 },
  locationText:    { fontSize: 11, color: "#94a3b8" },
  divider:         { height: 1 },
  statsRow:        { flexDirection: "row" },
  stat:            { flex: 1, alignItems: "center", gap: 3 },
  statMid:         { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "rgba(100,160,255,0.15)" },
  statLabel:       { fontSize: 8, fontWeight: "700" as const, color: "#64748b", letterSpacing: 0.8 },
  statValue:       { fontSize: 16, fontWeight: "800" as const },
  pillRow:         { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill:            {
    flexDirection: "row", alignItems: "center", gap: 5,
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  pillDot:         { width: 5, height: 5, borderRadius: 3 },
  pillText:        { fontSize: 10, fontWeight: "700" as const },
  pillSub:         { fontSize: 10 },
});
