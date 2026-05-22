import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming,
  withSpring, Easing,
} from "react-native-reanimated";
import { Redirect } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function RadarRing({ delay, size }: { delay: number; size: number }) {
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2800, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.3 + anim.value * 1.4 }],
    opacity:   0.55 * (1 - anim.value),
  }));

  return (
    <Animated.View
      style={[
        styles.radarRing,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

export default function LoginScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, loading, login } = useAuth();

  const [name,    setName]    = useState("");
  const [pin,     setPin]     = useState("");
  const [error,   setError]   = useState("");
  const [signing, setSigning] = useState(false);

  const cardScale = useSharedValue(0.94);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardScale.value   = withSpring(1, { damping: 18, stiffness: 120 });
    cardOpacity.value = withTiming(1, { duration: 500 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity:   cardOpacity.value,
  }));

  if (loading) {
    return (
      <LinearGradient colors={["#060D1A", "#0A1B34"]} style={styles.root}>
        <View style={styles.center}>
          <ActivityIndicator color="#174EA6" size="large" />
          <Text style={styles.loadingText}>ACES Mission Control</Text>
        </View>
      </LinearGradient>
    );
  }

  if (user?.role === "manager")    return <Redirect href="/(manager)/map" />;
  if (user?.role === "technician") return <Redirect href="/(technician)" />;

  const handleLogin = async () => {
    if (!name.trim() || !pin.trim()) {
      setError("Enter your name and password");
      return;
    }
    setSigning(true);
    setError("");
    try {
      await login(name.trim(), pin.trim());
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSigning(false);
    }
  };

  return (
    <LinearGradient colors={["#060D1A", "#0A1B34", "#060D1A"]} style={styles.root}>

      {/* Radar rings — decorative background */}
      <View style={styles.radarOrigin} pointerEvents="none">
        <RadarRing delay={0}    size={240} />
        <RadarRing delay={900}  size={240} />
        <RadarRing delay={1800} size={240} />
      </View>

      {/* Subtle grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.inner, {
          paddingTop:    insets.top + (Platform.OS === "web" ? 67 : 32),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24),
        }]}>

          {/* Logo block */}
          <View style={styles.logoBlock}>
            <View style={styles.logoGlow}>
              <Image
                source={require("../assets/images/aces-logo-new.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.missionBadge}>
              <View style={[styles.missionDot, { backgroundColor: "#00B894" }]} />
              <Text style={styles.missionText}>FIELD OPERATIONS · HAJJ 1447</Text>
            </View>
          </View>

          {/* Glass card */}
          <Animated.View style={[styles.card, cardStyle]}>
            <LinearGradient
              colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.04)"]}
              style={styles.cardGradient}
            >
              {/* Card header strip */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.cardAccentBar, { backgroundColor: "#174EA6" }]} />
                  <View>
                    <Text style={styles.cardTitle}>Team Sign In</Text>
                    <Text style={styles.cardSub}>Managed Service Field Team</Text>
                  </View>
                </View>
                <View style={styles.liveChip}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>SECURE</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <Text style={styles.label}>TEAM NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="rgba(107, 141, 184, 0.6)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />

              <Text style={[styles.label, { marginTop: 14 }]}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(107, 141, 184, 0.6)"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              {!!error && (
                <View style={styles.errorRow}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleLogin}
                disabled={signing}
                activeOpacity={0.85}
                style={styles.signInWrap}
              >
                <LinearGradient
                  colors={signing ? ["#8B1414", "#6B1010"] : ["#D62828", "#B01E1E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.signInBtn, { opacity: signing ? 0.8 : 1 }]}
                >
                  {signing
                    ? <ActivityIndicator color="#fff" />
                    : <>
                        <View style={styles.signInIcon} />
                        <Text style={styles.signInText}>SIGN IN</Text>
                      </>
                  }
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerPowered}>Powered by{" "}</Text>
            <Text style={styles.footerAces}>ACES MSD</Text>
          </View>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  root:           { flex: 1 },
  flex:           { flex: 1 },
  center:         { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText:    { color: "#6B8DB8", fontSize: 13, letterSpacing: 1 },

  radarOrigin:    {
    position: "absolute",
    top: "28%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  radarRing:      {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#174EA6",
  },
  gridOverlay:    {
    position: "absolute", inset: 0,
    opacity: 0.04,
    backgroundColor: "transparent",
  },

  inner:          { flex: 1, paddingHorizontal: 22, justifyContent: "center", gap: 28 },

  logoBlock:      { alignItems: "center", gap: 12 },
  logoGlow:       {
    shadowColor: "#D62828",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 12,
  },
  logoImage:      { width: 320, height: 160 },
  missionBadge:   {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.18)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  missionDot:     { width: 6, height: 6, borderRadius: 3 },
  missionText:    { color: "#6B8DB8", fontSize: 10, fontWeight: "700" as const, letterSpacing: 1.5 },

  card:           {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(100, 160, 255, 0.22)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  cardGradient:   { padding: 20, gap: 0 },

  cardHeader:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardAccentBar:  { width: 3, height: 34, borderRadius: 2 },
  cardTitle:      { color: "#E2EFFF", fontSize: 17, fontWeight: "700" as const },
  cardSub:        { color: "#6B8DB8", fontSize: 11, marginTop: 2 },
  liveChip:       {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(0, 184, 148, 0.12)",
    borderWidth: 1, borderColor: "rgba(0, 184, 148, 0.3)",
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot:        { width: 5, height: 5, borderRadius: 3, backgroundColor: "#00B894" },
  liveText:       { color: "#00B894", fontSize: 9, fontWeight: "800" as const, letterSpacing: 1.2 },

  cardDivider:    { height: 1, backgroundColor: "rgba(100,160,255,0.12)", marginBottom: 16 },

  label:          { color: "#6B8DB8", fontSize: 10, fontWeight: "700" as const, letterSpacing: 1.2, marginBottom: 6 },
  input:          {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.18)",
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: "#E2EFFF",
  },
  errorRow:       {
    backgroundColor: "rgba(214,40,40,0.12)",
    borderWidth: 1, borderColor: "rgba(214,40,40,0.30)",
    borderRadius: 10, padding: 10, marginTop: 8,
  },
  errorText:      { color: "#EF6B6B", fontSize: 13, textAlign: "center" },

  signInWrap:     { marginTop: 18 },
  signInBtn:      {
    borderRadius: 14, paddingVertical: 15,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 10,
  },
  signInIcon:     { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.7)" },
  signInText:     { color: "#fff", fontWeight: "800" as const, fontSize: 15, letterSpacing: 1.5 },

  footer:         { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  footerPowered:  { color: "#3D5470", fontSize: 12, fontWeight: "500" as const },
  footerAces:     { color: "#174EA6", fontSize: 12, fontWeight: "800" as const, letterSpacing: 0.5 },
});
