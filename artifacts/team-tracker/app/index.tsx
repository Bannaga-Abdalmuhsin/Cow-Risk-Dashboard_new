import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
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
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (user?.role === "manager")     return <Redirect href="/(manager)/map" />;
  if (user?.role === "technician")  return <Redirect href="/(technician)/" />;

  const handleLogin = async () => {
    if (!name.trim() || !pin.trim()) {
      setError("Enter your name and PIN");
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
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.inner, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 40), paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) }]}>

        {/* Logo */}
        <View style={styles.logoBlock}>
          <View style={[styles.logoRing, { borderColor: colors.primary }]}>
            <View style={[styles.logoDot, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.logoTitle, { color: colors.foreground }]}>ACES MSD</Text>
          <Text style={[styles.logoSub,   { color: colors.mutedForeground }]}>
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

          <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 16 }]}>PIN</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            placeholder="4-digit PIN"
            placeholderTextColor={colors.mutedForeground}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
          />

          {!!error && (
            <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary, opacity: signing ? 0.7 : 1 }]}
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  center:     { flex: 1, alignItems: "center", justifyContent: "center" },
  inner:      { flex: 1, paddingHorizontal: 24, justifyContent: "center", gap: 24 },
  logoBlock:  { alignItems: "center", gap: 8 },
  logoRing:   { width: 72, height: 72, borderRadius: 36, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  logoDot:    { width: 36, height: 36, borderRadius: 18 },
  logoTitle:  { fontSize: 28, fontWeight: "700" as const, letterSpacing: 1 },
  logoSub:    { fontSize: 13, letterSpacing: 0.5 },
  card:       { borderRadius: 16, borderWidth: 1, padding: 20 },
  label:      { fontSize: 11, fontWeight: "600" as const, letterSpacing: 1, marginBottom: 6 },
  input:      { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  error:      { fontSize: 13, marginTop: 10, textAlign: "center" },
  btn:        { marginTop: 20, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnText:    { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  footer:     { textAlign: "center", fontSize: 11 },
});
