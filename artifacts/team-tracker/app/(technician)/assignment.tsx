import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Keyboard, Platform, RefreshControl, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { getMyAssignment, markAssignmentRead, replyToAssignment, UnauthorizedError, type Assignment } from "@/lib/api";
import { OfflineBanner } from "@/components/OfflineBanner";

export default function AssignmentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [assignment,   setAssignment]   = useState<Assignment | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [marking,      setMarking]      = useState(false);
  const [replyText,    setReplyText]    = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [retrying,     setRetrying]     = useState(false);

  const inputRef = useRef<TextInput>(null);

  const fetchAssignment = useCallback(async () => {
    try {
      const data = await getMyAssignment(token!);
      setAssignment(data);
      setNetworkError(false);
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) setNetworkError(true);
    }
    setLoading(false);
    setRefreshing(false);
  }, [token]);

  const handleRetry = async () => {
    setRetrying(true);
    await fetchAssignment();
    setRetrying(false);
  };

  useEffect(() => {
    fetchAssignment();
    const id = setInterval(fetchAssignment, 15000);
    return () => clearInterval(id);
  }, [fetchAssignment]);

  const handleMarkRead = async () => {
    if (!assignment || assignment.readAt) return;
    setMarking(true);
    try {
      await markAssignmentRead(token!, assignment.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAssignment(prev => prev ? { ...prev, readAt: new Date().toISOString() } : null);
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) {
        Alert.alert("Could not acknowledge", "Server may be starting up. Please try again.");
      }
    }
    setMarking(false);
  };

  const handleSendReply = async () => {
    if (!assignment || !replyText.trim()) return;
    Keyboard.dismiss();
    setSendingReply(true);
    try {
      await replyToAssignment(token!, assignment.id, replyText.trim());
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAssignment(prev => prev
        ? { ...prev, reply: replyText.trim(), repliedAt: new Date().toISOString() }
        : null,
      );
      setReplyText("");
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) {
        Alert.alert("Could not send reply", "Server may be starting up. Please try again.");
      }
    }
    setSendingReply(false);
  };

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  const isNew = assignment && !assignment.readAt;
  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1)  return "Just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.headerAccent, { backgroundColor: colors.primary }]} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>My Task</Text>
        {isNew && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
      </View>

      {networkError && <OfflineBanner onRetry={handleRetry} retrying={retrying} />}

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAssignment(); }} tintColor={colors.primary} />
        }
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : !assignment ? (
          <View style={styles.emptyBlock}>
            <View style={[styles.emptyIconWrap, { backgroundColor: colors.muted }]}>
              <MaterialCommunityIcons name="bell-sleep-outline" size={40} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No tasks yet</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Your manager will send you deployment instructions here.
            </Text>
          </View>
        ) : (
          <View style={styles.assignBlock}>

            {/* From section */}
            <View style={[styles.fromBadge, { backgroundColor: colors.accent + "12", borderColor: colors.accent + "30" }]}>
              <View style={[styles.fromDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.fromText, { color: colors.accent }]}>
                From <Text style={styles.fromName}>{assignment.managerName}</Text>
                {"  ·  "}{timeAgo(assignment.sentAt)}
              </Text>
            </View>

            {/* Message card */}
            <View style={[
              styles.msgCard,
              {
                backgroundColor: colors.card,
                borderColor:     isNew ? colors.primary : colors.border,
                borderLeftColor: isNew ? colors.primary : colors.accent,
                borderLeftWidth: 4,
              },
            ]}>
              <Text style={[styles.msgText, { color: colors.foreground }]}>{assignment.message}</Text>
            </View>

            {/* Acknowledge / read status */}
            {assignment.readAt ? (
              <View style={[styles.readRow, { backgroundColor: colors.onDuty + "12", borderRadius: 10, padding: 10 }]}>
                <MaterialCommunityIcons name="check-circle" size={16} color={colors.onDuty} />
                <Text style={[styles.readText, { color: colors.onDuty }]}>
                  Acknowledged · {timeAgo(assignment.readAt)}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.ackBtn, { backgroundColor: colors.primary, opacity: marking ? 0.7 : 1 }]}
                onPress={handleMarkRead}
                disabled={marking}
              >
                {marking
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <>
                      <MaterialCommunityIcons name="check-circle-outline" size={18} color="#fff" />
                      <Text style={styles.ackText}>Acknowledge Task</Text>
                    </>
                }
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Reply section */}
            {assignment.reply ? (
              <View style={styles.replySection}>
                <View style={styles.replyHeader}>
                  <Feather name="corner-up-right" size={14} color={colors.accent} />
                  <Text style={[styles.replyLabel, { color: colors.accent }]}>Your reply</Text>
                  {assignment.repliedAt && (
                    <Text style={[styles.replyTime, { color: colors.mutedForeground }]}>
                      · {timeAgo(assignment.repliedAt)}
                    </Text>
                  )}
                </View>
                <View style={[styles.replyCard, { backgroundColor: colors.accent + "10", borderColor: colors.accent + "35" }]}>
                  <Text style={[styles.replyCardText, { color: colors.foreground }]}>{assignment.reply}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.replySection}>
                <View style={styles.replyHeader}>
                  <Feather name="corner-up-right" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.replyLabel, { color: colors.mutedForeground }]}>Reply to manager</Text>
                </View>
                <View style={[styles.composeRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput
                    ref={inputRef}
                    style={[styles.composeInput, { color: colors.foreground }]}
                    placeholder="Type your reply..."
                    placeholderTextColor={colors.mutedForeground}
                    value={replyText}
                    onChangeText={setReplyText}
                    multiline
                    maxLength={500}
                    returnKeyType="send"
                  />
                  <TouchableOpacity
                    style={[styles.sendBtn, {
                      backgroundColor: colors.accent,
                      opacity: (!replyText.trim() || sendingReply) ? 0.4 : 1,
                    }]}
                    onPress={handleSendReply}
                    disabled={!replyText.trim() || sendingReply}
                  >
                    {sendingReply
                      ? <ActivityIndicator color="#fff" size="small" />
                      : <Feather name="send" size={16} color="#fff" />
                    }
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1 },
  header:        {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  headerAccent:  { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  headerTitle:   { fontSize: 22, fontWeight: "700" as const },
  badge:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText:     { color: "#fff", fontSize: 10, fontWeight: "800" as const, letterSpacing: 1 },
  center:        { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyBlock:    { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingTop: 60 },
  emptyIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  emptyTitle:    { fontSize: 18, fontWeight: "700" as const },
  emptySub:      { fontSize: 14, textAlign: "center", lineHeight: 20 },
  assignBlock:   { gap: 14 },
  fromBadge:     {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  fromDot:       { width: 7, height: 7, borderRadius: 4 },
  fromText:      { fontSize: 13 },
  fromName:      { fontWeight: "700" as const },
  msgCard:       {
    borderRadius: 16, borderWidth: 1, padding: 18,
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  msgText:       { fontSize: 16, lineHeight: 24 },
  readRow:       { flexDirection: "row", alignItems: "center", gap: 8 },
  readText:      { fontSize: 13, fontWeight: "600" as const },
  ackBtn:        { borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 },
  ackText:       { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
  divider:       { height: 1 },
  replySection:  { gap: 10 },
  replyHeader:   { flexDirection: "row", alignItems: "center", gap: 6 },
  replyLabel:    { fontSize: 13, fontWeight: "600" as const },
  replyTime:     { fontSize: 12 },
  replyCard:     { borderRadius: 14, borderWidth: 1, padding: 14 },
  replyCardText: { fontSize: 15, lineHeight: 22 },
  composeRow:    {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
  },
  composeInput:  { flex: 1, fontSize: 15, maxHeight: 100, lineHeight: 22 },
  sendBtn:       { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
});
