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
import { debugBaseUrl } from "@/lib/api";

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

  if (user?.role === "manager")     return <Redirect href="/(manager)/map" />;
  if (user?.role === "technician")  return <Redirect href="/(technician)/" />;

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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.inner, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 40), paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) }]}>

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

          {/* Form */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>NAME</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Your name"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 16 }]}>PASSWORD</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Password"
              placeholderTextColor={colors.mutedForeground}
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!!error && (
              <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.signIn, opacity: signing ? 0.7 : 1 }]}
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

          <Text style={[styles.footer, { color: colors.mutedForeground }]}>
            Hajj 1447 · stc COW Operations
          </Text>
          <Text style={[styles.debugUrl, { color: colors.mutedForeground }]} numberOfLines={2}>
            {debugBaseUrl()}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1 },
  flex:      { flex: 1 },
  center:    { flex: 1, alignItems: "center", justifyContent: "center" },
  inner:     { flex: 1, paddingHorizontal: 24, justifyContent: "center", gap: 24 },
  logoBlock: { alignItems: "center", gap: 6 },
  logoImage: { width: 260, height: 100 },
  logoSub:   { fontSize: 13, letterSpacing: 0.5 },
  card:      {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  label:    { fontSize: 11, fontWeight: "600" as const, letterSpacing: 1, marginBottom: 6 },
  input:    { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  error:    { fontSize: 13, marginTop: 10, textAlign: "center" },
  btn:      { marginTop: 20, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnText:  { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  footer:   { textAlign: "center", fontSize: 11 },
  debugUrl: { textAlign: "center", fontSize: 9, opacity: 0.45, marginTop: 2 },
});
