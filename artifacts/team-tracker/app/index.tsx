import React, { useState } from "react";
import {
  ActivityIndicator, Image, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, loading, login } = useAuth();

  const [name,    setName]    = useState("");
  const [pin,     setPin]     = useState("");
  const [error,   setError]   = useState("");
  const [signing, setSigning] = useState(false);

  if (loading) {
    return (
      <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
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
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
      {/* Navy top accent bar */}
      <View style={[styles.topBar, { backgroundColor: colors.accent }]} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.inner, {
          paddingTop:    insets.top + (Platform.OS === "web" ? 67 : 32),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
        }]}>

          {/* Logo */}
          <View style={styles.logoBlock}>
            <Image
              source={require("../assets/images/aces-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>
              Field Team Tracker
            </Text>
          </View>

          {/* Form card */}
          <View style={[styles.card, {
            backgroundColor: colors.card,
            borderColor:     colors.border,
            borderLeftColor: colors.accent,
          }]}>

            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Sign In</Text>
            <Text style={[styles.cardSub,   { color: colors.mutedForeground }]}>
              Hajj 1447 · stc COW Operations
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.label, { color: colors.mutedForeground }]}>NAME</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: colors.input,
                borderColor:     colors.border,
                color:           colors.foreground,
              }]}
              placeholder="Your name"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 14 }]}>PASSWORD</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: colors.input,
                borderColor:     colors.border,
                color:           colors.foreground,
              }]}
              placeholder="Password"
              placeholderTextColor={colors.mutedForeground}
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!!error && (
              <View style={[styles.errorRow, { backgroundColor: colors.destructive + "12", borderColor: colors.destructive + "30" }]}>
                <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.signIn, opacity: signing ? 0.75 : 1 }]}
              onPress={handleLogin}
              disabled={signing}
              activeOpacity={0.85}
            >
              {signing
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Sign In</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerBlock}>
            <View style={styles.footerRow}>
              <Text style={[styles.footerPowered, { color: colors.primary }]}>Powered by </Text>
              <Text style={[styles.footerAces,    { color: colors.accent }]}>ACES MSD</Text>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1 },
  topBar:        { height: 4 },
  flex:          { flex: 1 },
  center:        { flex: 1, alignItems: "center", justifyContent: "center" },
  inner:         { flex: 1, paddingHorizontal: 24, justifyContent: "center", gap: 24 },

  logoBlock:     { alignItems: "center", gap: 10 },
  logoImage:     { width: 340, height: 132 },
  logoSub:       { fontSize: 13, letterSpacing: 0.5 },

  card:          {
    borderRadius: 18,
    borderWidth:  1,
    borderLeftWidth: 4,
    padding:      20,
    shadowColor:  "#0F1E3A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation:    6,
    gap:          6,
  },
  cardTitle:     { fontSize: 20, fontWeight: "700" as const },
  cardSub:       { fontSize: 12 },
  divider:       { height: 1, marginVertical: 8 },

  label:         { fontSize: 11, fontWeight: "600" as const, letterSpacing: 1, marginBottom: 5 },
  input:         {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16,
  },
  errorRow:      { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 4 },
  errorText:     { fontSize: 13, textAlign: "center" },

  btn:           { marginTop: 16, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnText:       { color: "#fff", fontWeight: "700" as const, fontSize: 16 },

  footerBlock:   { alignItems: "center", gap: 4 },
  footerRow:     { flexDirection: "row", alignItems: "center" },
  footerPowered: { fontSize: 12, fontWeight: "500" as const },
  footerAces:    { fontSize: 12, fontWeight: "800" as const, letterSpacing: 0.5 },
  debugUrl:      { fontSize: 9, opacity: 0.4, textAlign: "center" },
});
