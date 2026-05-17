import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Keyboard, Platform, RefreshControl, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { getMyAssignment, markAssignmentRead, replyToAssignment, type Assignment } from "@/lib/api";

export default function AssignmentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [assignment,  setAssignment]  = useState<Assignment | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [marking,     setMarking]     = useState(false);
  const [replyText,   setReplyText]   = useState("");
  const [replySent,   setReplySent]   = useState(false);
  const [sendingReply,setSendingReply]= useState(false);

  const inputRef = useRef<TextInput>(null);

  const fetchAssignment = useCallback(async () => {
    try {
      const data = await getMyAssignment(token!);
      setAssignment(data);
      if (data?.reply) setReplySent(true);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [token]);

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
    } catch {}
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
      setReplySent(true);
      setReplyText("");
    } catch {}
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
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Task</Text>
        {isNew && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
      </View>

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
            <MaterialCommunityIcons name="bell-sleep-outline" size={56} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No tasks yet</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Your manager will send you deployment instructions here.
            </Text>
          </View>
        ) : (
          <View style={styles.assignBlock}>
            {/* Manager message */}
            <View style={styles.fromRow}>
              <View style={[styles.managerDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.fromText, { color: colors.mutedForeground }]}>
                From <Text style={[styles.fromName, { color: colors.foreground }]}>{assignment.managerName}</Text>
                {" · "}{timeAgo(assignment.sentAt)}
              </Text>
            </View>

            <View style={[
              styles.msgCard,
              { backgroundColor: colors.card, borderColor: isNew ? colors.primary : colors.border, borderLeftWidth: isNew ? 4 : 1 },
            ]}>
              <Text style={[styles.msgText, { color: colors.foreground }]}>{assignment.message}</Text>
            </View>

            {/* Acknowledge button */}
            {assignment.readAt ? (
              <View style={styles.readRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color={colors.onDuty} />
                <Text style={[styles.readText, { color: colors.mutedForeground }]}>
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
                  : <Text style={styles.ackText}>Acknowledge</Text>
                }
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Reply section */}
            {assignment.reply ? (
              <View style={styles.replySection}>
                <View style={styles.replyHeader}>
                  <Feather name="corner-up-right" size={14} color={colors.onDuty} />
                  <Text style={[styles.replyLabel, { color: colors.onDuty }]}>Your reply</Text>
                  {assignment.repliedAt && (
                    <Text style={[styles.replyTime, { color: colors.mutedForeground }]}>
                      · {timeAgo(assignment.repliedAt)}
                    </Text>
                  )}
                </View>
                <View style={[styles.replyCard, { backgroundColor: colors.onDuty + "18", borderColor: colors.onDuty + "40" }]}>
                  <Text style={[styles.replyCardText, { color: colors.foreground }]}>{assignment.reply}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.replySection}>
                <Text style={[styles.replyLabel, { color: colors.mutedForeground }]}>Reply to manager</Text>
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
                    style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: (!replyText.trim() || sendingReply) ? 0.4 : 1 }]}
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
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  headerTitle:   { fontSize: 22, fontWeight: "700" as const },
  badge:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText:     { color: "#fff", fontSize: 10, fontWeight: "800" as const, letterSpacing: 1 },
  center:        { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyBlock:    { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 60 },
  emptyTitle:    { fontSize: 18, fontWeight: "700" as const },
  emptySub:      { fontSize: 14, textAlign: "center", lineHeight: 20 },
  assignBlock:   { gap: 16 },
  fromRow:       { flexDirection: "row", alignItems: "center", gap: 8 },
  managerDot:    { width: 8, height: 8, borderRadius: 4 },
  fromText:      { fontSize: 13 },
  fromName:      { fontWeight: "600" as const },
  msgCard:       {
    borderRadius: 22, borderWidth: 1, padding: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
  },
  msgText:       { fontSize: 16, lineHeight: 24 },
  readRow:       { flexDirection: "row", alignItems: "center", gap: 6 },
  readText:      { fontSize: 12 },
  ackBtn:        { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  ackText:       { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
  divider:       { height: 1 },
  replySection:  { gap: 10 },
  replyHeader:   { flexDirection: "row", alignItems: "center", gap: 6 },
  replyLabel:    { fontSize: 13, fontWeight: "600" as const },
  replyTime:     { fontSize: 12 },
  replyCard:     { borderRadius: 16, borderWidth: 1, padding: 14 },
  replyCardText: { fontSize: 15, lineHeight: 22 },
  composeRow:    {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10,
  },
  composeInput:  { flex: 1, fontSize: 15, maxHeight: 100, lineHeight: 22 },
  sendBtn:       { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
});
