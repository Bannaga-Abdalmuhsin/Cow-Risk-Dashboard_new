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

  const [assignment,   setAssignment]   = useState<Assignment | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [marking,      setMarking]      = useState(false);
  const [replyText,    setReplyText]    = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const fetchAssignment = useCallback(async () => {
    try {
      const data = await getMyAssignment(token!);
      setAssignment(data);
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
    <LinearGradient colors={["#060D1A", "#0A1B34"]} style={styles.root}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 14 }]}>
        <LinearGradient
          colors={["rgba(23,78,166,0.25)", "rgba(6,13,26,0)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerAccentBar} />
        <Text style={styles.headerTitle}>My Task</Text>
        {isNew && (
          <View style={styles.newBadge}>
            <View style={styles.newDot} />
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 18, paddingBottom: bottomPad, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchAssignment(); }}
            tintColor="#174EA6"
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#174EA6" size="large" />
          </View>
        ) : !assignment ? (
          <View style={styles.emptyBlock}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="bell-sleep-outline" size={40} color="#3D5470" />
            </View>
            <Text style={styles.emptyTitle}>No tasks assigned</Text>
            <Text style={styles.emptySub}>
              Your manager will send deployment instructions here.
            </Text>
          </View>
        ) : (
          <View style={styles.assignBlock}>

            {/* From section */}
            <View style={styles.fromBadge}>
              <View style={[styles.fromDot, { backgroundColor: "#174EA6" }]} />
              <Text style={styles.fromText}>
                From <Text style={styles.fromName}>{assignment.managerName}</Text>
                {"  ·  "}{timeAgo(assignment.sentAt)}
              </Text>
            </View>

            {/* Message card */}
            <View style={[
              styles.msgCard,
              { borderLeftColor: isNew ? "#174EA6" : "#D62828" },
            ]}>
              <LinearGradient
                colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]}
                style={styles.msgCardGrad}
              >
                <Text style={styles.msgText}>{assignment.message}</Text>
              </LinearGradient>
            </View>

            {/* Acknowledge / read status */}
            {assignment.readAt ? (
              <View style={styles.readRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#00B894" />
                <Text style={styles.readText}>Acknowledged · {timeAgo(assignment.readAt)}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.ackBtn, { opacity: marking ? 0.7 : 1 }]}
                onPress={handleMarkRead}
                disabled={marking}
              >
                <LinearGradient
                  colors={["#174EA6", "#0E3A8C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ackBtnGrad}
                >
                  {marking
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <>
                        <MaterialCommunityIcons name="check-circle-outline" size={18} color="#fff" />
                        <Text style={styles.ackText}>Acknowledge Task</Text>
                      </>
                  }
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Reply section */}
            {assignment.reply ? (
              <View style={styles.replySection}>
                <View style={styles.replyHeader}>
                  <Feather name="corner-up-right" size={14} color="#174EA6" />
                  <Text style={styles.replyLabel}>Your reply</Text>
                  {assignment.repliedAt && (
                    <Text style={styles.replyTime}>· {timeAgo(assignment.repliedAt)}</Text>
                  )}
                </View>
                <View style={styles.replyCard}>
                  <Text style={styles.replyCardText}>{assignment.reply}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.replySection}>
                <View style={styles.replyHeader}>
                  <Feather name="corner-up-right" size={14} color="#6B8DB8" />
                  <Text style={[styles.replyLabel, { color: "#6B8DB8" }]}>Reply to manager</Text>
                </View>
                <View style={styles.composeRow}>
                  <TextInput
                    ref={inputRef}
                    style={styles.composeInput}
                    placeholder="Type your reply..."
                    placeholderTextColor="rgba(107,141,184,0.6)"
                    value={replyText}
                    onChangeText={setReplyText}
                    multiline
                    maxLength={500}
                    returnKeyType="send"
                  />
                  <TouchableOpacity
                    style={[styles.sendBtn, { opacity: (!replyText.trim() || sendingReply) ? 0.4 : 1 }]}
                    onPress={handleSendReply}
                    disabled={!replyText.trim() || sendingReply}
                  >
                    <LinearGradient
                      colors={["#D62828", "#9B1E1E"]}
                      style={styles.sendBtnGrad}
                    >
                      {sendingReply
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <Feather name="send" size={16} color="#fff" />
                      }
                    </LinearGradient>
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
    paddingHorizontal: 20, paddingBottom: 14,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.12)",
    overflow: "hidden",
  },
  headerAccentBar: { width: 3, height: 28, borderRadius: 2, backgroundColor: "#174EA6" },
  headerTitle:   { fontSize: 22, fontWeight: "700" as const, color: "#E2EFFF", flex: 1 },
  newBadge:      {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(23,78,166,0.20)", borderWidth: 1,
    borderColor: "rgba(23,78,166,0.40)",
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
  },
  newDot:        { width: 5, height: 5, borderRadius: 3, backgroundColor: "#174EA6" },
  newBadgeText:  { color: "#93B8EE", fontSize: 10, fontWeight: "800" as const, letterSpacing: 1 },

  center:        { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyBlock:    { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingTop: 60 },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  emptyTitle:    { fontSize: 18, fontWeight: "700" as const, color: "#E2EFFF" },
  emptySub:      { fontSize: 13, color: "#6B8DB8", textAlign: "center", lineHeight: 20 },

  assignBlock:   { gap: 14 },
  fromBadge:     {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(23,78,166,0.12)",
    borderWidth: 1, borderColor: "rgba(23,78,166,0.25)",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
  },
  fromDot:       { width: 7, height: 7, borderRadius: 4 },
  fromText:      { fontSize: 13, color: "#93B8EE" },
  fromName:      { fontWeight: "700" as const, color: "#E2EFFF" },

  msgCard:       {
    borderRadius: 16, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.20)",
    borderLeftWidth: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  msgCardGrad:   { padding: 18 },
  msgText:       { fontSize: 15, lineHeight: 24, color: "#E2EFFF" },

  readRow:       {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(0,184,148,0.10)",
    borderRadius: 12, borderWidth: 1,
    borderColor: "rgba(0,184,148,0.25)", padding: 12,
  },
  readText:      { fontSize: 13, fontWeight: "600" as const, color: "#00B894" },

  ackBtn:        { borderRadius: 14, overflow: "hidden" },
  ackBtnGrad:    {
    paddingVertical: 14, alignItems: "center",
    flexDirection: "row", justifyContent: "center", gap: 8,
  },
  ackText:       { color: "#fff", fontWeight: "700" as const, fontSize: 15 },

  divider:       { height: 1, backgroundColor: "rgba(100,160,255,0.12)" },

  replySection:  { gap: 10 },
  replyHeader:   { flexDirection: "row", alignItems: "center", gap: 6 },
  replyLabel:    { fontSize: 13, fontWeight: "600" as const, color: "#174EA6" },
  replyTime:     { fontSize: 12, color: "#6B8DB8" },
  replyCard:     {
    borderRadius: 14, borderWidth: 1,
    borderColor: "rgba(23,78,166,0.30)",
    backgroundColor: "rgba(23,78,166,0.10)",
    padding: 14,
  },
  replyCardText: { fontSize: 14, lineHeight: 22, color: "#E2EFFF" },

  composeRow:    {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    borderWidth: 1, borderColor: "rgba(100,160,255,0.20)",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
  },
  composeInput:  { flex: 1, fontSize: 15, maxHeight: 100, lineHeight: 22, color: "#E2EFFF" },
  sendBtn:       { overflow: "hidden", borderRadius: 10 },
  sendBtnGrad:   { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
});
