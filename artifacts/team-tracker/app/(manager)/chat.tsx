import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, Keyboard, Modal, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import {
  getTeamUsers, getChatHistory, sendAssignment, broadcastMessage,
  getTeamLocations, UnauthorizedError, LOCATIONS,
  type TeamUser, type ChatMessage, type TechLocationWithUser,
} from "@/lib/api";
import { OfflineBanner } from "@/components/OfflineBanner";

function timeLabel(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { token, logout } = useAuth();

  const [users,        setUsers]        = useState<TeamUser[]>([]);
  const [locations,    setLocations]    = useState<TechLocationWithUser[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [retrying,     setRetrying]     = useState(false);

  const [selected,  setSelected]  = useState<TeamUser | null>(null);
  const [history,   setHistory]   = useState<ChatMessage[]>([]);
  const [histLoad,  setHistLoad]  = useState(false);
  const [message,   setMessage]   = useState("");
  const [sending,   setSending]   = useState(false);

  const flatRef    = useRef<FlatList>(null);
  const topPad     = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad  = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  const loadData = useCallback(async () => {
    try {
      const [u, l] = await Promise.all([getTeamUsers(token), getTeamLocations(token)]);
      setUsers(u.filter(x => x.role === "technician"));
      setLocations(l);
      setNetworkError(false);
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) setNetworkError(true);
    }
    setLoading(false);
  }, [token]);

  const handleRetry = async () => {
    setRetrying(true);
    await loadData();
    setRetrying(false);
  };

  useEffect(() => { loadData(); }, [loadData]);

  const openChat = async (user: TeamUser) => {
    setSelected(user);
    setHistLoad(true);
    try {
      const h = await getChatHistory(token!, user.id);
      setHistory(h);
    } catch (err) {
      if (err instanceof UnauthorizedError) { await logout(); return; }
      Alert.alert("Could not load history", "Server may be starting up. Try again in a moment.");
    }
    setHistLoad(false);
  };

  const closeChat = () => {
    setSelected(null);
    setHistory([]);
    setMessage("");
  };

  const handleSend = async (msg?: string) => {
    const text = (msg ?? message).trim();
    if (!text || !selected) return;
    Keyboard.dismiss();
    setSending(true);
    try {
      await sendAssignment(token!, selected.id, text);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const h = await getChatHistory(token!, selected.id);
      setHistory(h);
      setMessage("");
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      if (err instanceof UnauthorizedError) { await logout(); return; }
      Alert.alert("Error", err instanceof Error ? err.message : "Failed");
    } finally {
      setSending(false);
    }
  };

  const handleBroadcast = async (msg: string) => {
    Alert.alert(
      "Broadcast to All",
      `Send "${msg}" to all ${users.length} technicians?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send All", style: "default",
          onPress: async () => {
            try {
              const r = await broadcastMessage(token!, msg);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Sent", `Message delivered to ${r.sent} technicians`);
            } catch (err) {
              if (err instanceof UnauthorizedError) { await logout(); return; }
              Alert.alert("Error", err instanceof Error ? err.message : "Failed");
            }
          },
        },
      ],
    );
  };

  const locationOf = (userId: number) => locations.find(l => l.userId === userId);

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Team Chat</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {users.length} technicians
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.prompt
              ? Alert.prompt("Broadcast Message", "Send to all technicians:", msg => { if (msg?.trim()) handleBroadcast(msg.trim()); })
              : Alert.alert("Broadcast", "Use chat to select a technician and send");
          }}
          style={[styles.broadcastBtn, { backgroundColor: colors.primary }]}
        >
          <MaterialCommunityIcons name="broadcast" size={16} color="#fff" />
          <Text style={styles.broadcastBtnText}>Broadcast</Text>
        </TouchableOpacity>
      </View>

      {networkError && <OfflineBanner onRetry={handleRetry} retrying={retrying} />}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <>
          {/* Quick location broadcast bar */}
          <View style={[styles.locBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Text style={[styles.locBarLabel, { color: colors.mutedForeground }]}>MOVE ALL TO →</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.locChips}>
                {LOCATIONS.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => handleBroadcast(`Please move to ${loc} immediately`)}
                    style={[styles.locChip, { borderColor: colors.primary + "50", backgroundColor: colors.primary + "10" }]}
                  >
                    <Text style={[styles.locChipText, { color: colors.primary }]}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Tech list */}
          <FlatList
            data={users}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: bottomPad }}
            renderItem={({ item }) => {
              const loc    = locationOf(item.id);
              const online = loc?.isOnDuty ?? false;
              return (
                <TouchableOpacity
                  onPress={() => openChat(item)}
                  activeOpacity={0.8}
                  style={[styles.techRow, {
                    backgroundColor: colors.card,
                    borderColor:     colors.border,
                    borderLeftColor: online ? colors.onDuty : colors.border,
                  }]}
                >
                  <View style={[styles.dot, { backgroundColor: online ? colors.onDuty : colors.offDuty }]} />
                  <View style={styles.techInfo}>
                    <Text style={[styles.techName, { color: colors.foreground }]}>{item.name}</Text>
                    <Text style={[styles.techMeta, { color: colors.mutedForeground }]}>
                      {online ? `On duty · ${loc?.area ?? "Unknown area"}` : (item.defaultArea ? `Assigned: ${item.defaultArea}` : "Offline")}
                    </Text>
                  </View>
                  <View style={[styles.chatIcon, { backgroundColor: colors.primary + "12" }]}>
                    <Feather name="message-circle" size={18} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.center}>
                <MaterialCommunityIcons name="account-off-outline" size={40} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No technicians</Text>
              </View>
            }
          />
        </>
      )}

      {/* Individual Chat Modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={closeChat}>
        <View style={[styles.chatModal, { backgroundColor: colors.background }]}>

          {/* Chat header */}
          <View style={[styles.chatHeader, {
            backgroundColor:  colors.card,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
            paddingTop: topPad + 12,
          }]}>
            <View style={[styles.chatHeaderAccent, { backgroundColor: colors.accent }]} />
            <TouchableOpacity onPress={closeChat} style={styles.backBtn}>
              <Feather name="arrow-left" size={22} color={colors.foreground} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={[styles.chatHeaderName, { color: colors.foreground }]}>{selected?.name}</Text>
              <Text style={[styles.chatHeaderSub, { color: colors.mutedForeground }]}>
                {locationOf(selected?.id ?? 0)?.isOnDuty
                  ? `On duty · ${locationOf(selected?.id ?? 0)?.area ?? "Unknown"}`
                  : (selected?.defaultArea ? `Assigned: ${selected.defaultArea}` : "Offline")}
              </Text>
            </View>
          </View>

          {/* Quick location buttons */}
          <View style={[styles.quickBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>Move to:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickChips}>
                {LOCATIONS.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => handleSend(`Please move to ${loc} immediately`)}
                    style={[styles.quickChip, { borderColor: colors.accent + "50", backgroundColor: colors.accent + "10" }]}
                  >
                    <Text style={[styles.quickChipText, { color: colors.accent }]}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Messages */}
          <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.chatMessages}>
            {histLoad ? (
              <View style={styles.center}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              <FlatList
                ref={flatRef}
                data={[...history].reverse()}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={{ padding: 16, gap: 14 }}
                onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
                renderItem={({ item }) => (
                  <View style={styles.msgThread}>
                    {/* Outgoing manager bubble (right, dark red) */}
                    <View style={styles.msgBubble}>
                      <View style={[styles.bubble, { backgroundColor: colors.primary }]}>
                        <Text style={styles.bubbleText}>{item.message}</Text>
                      </View>
                      <Text style={[styles.bubbleTime, { color: colors.mutedForeground }]}>
                        {timeLabel(item.sentAt)}{item.readAt ? "  ✓ Read" : ""}
                      </Text>
                    </View>
                    {/* Incoming tech reply (left, navy) */}
                    {item.reply ? (
                      <View style={styles.replyBubbleRow}>
                        <View style={[styles.replyBubble, { backgroundColor: colors.accent + "12", borderColor: colors.accent + "40" }]}>
                          <Text style={[styles.replyBubbleText, { color: colors.foreground }]}>{item.reply}</Text>
                        </View>
                        <Text style={[styles.bubbleTime, { color: colors.mutedForeground }]}>
                          {item.repliedAt ? timeLabel(item.repliedAt) : ""}{"  ← Reply"}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={[styles.emptyChat, { color: colors.mutedForeground }]}>
                    No messages yet. Send a task below.
                  </Text>
                }
              />
            )}
          </LinearGradient>

          {/* Compose */}
          <View style={[styles.compose, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad }]}>
            <TextInput
              style={[styles.composeInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Type a message or task..."
              placeholderTextColor={colors.mutedForeground}
              value={message}
              onChangeText={setMessage}
              multiline
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={sending || !message.trim()}
              style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: sending || !message.trim() ? 0.45 : 1 }]}
            >
              {sending
                ? <ActivityIndicator color="#fff" size="small" />
                : <Feather name="send" size={18} color="#fff" />
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:             { flex: 1 },
  header:           {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  headerTitle:      { fontSize: 22, fontWeight: "700" as const },
  headerSub:        { fontSize: 12, marginTop: 2 },
  broadcastBtn:     { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  broadcastBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 13 },
  locBar:           { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, gap: 6 },
  locBarLabel:      { fontSize: 10, fontWeight: "600" as const, letterSpacing: 1 },
  locChips:         { flexDirection: "row", gap: 8 },
  locChip:          { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  locChipText:      { fontSize: 12, fontWeight: "600" as const },
  center:           { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyText:        { fontSize: 14 },
  techRow:          {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 16, borderWidth: 1, borderLeftWidth: 3,
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  dot:              { width: 9, height: 9, borderRadius: 5 },
  techInfo:         { flex: 1 },
  techName:         { fontSize: 15, fontWeight: "600" as const },
  techMeta:         { fontSize: 12, marginTop: 2 },
  chatIcon:         { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  chatModal:        { flex: 1 },
  chatHeaderAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  chatHeader:       { paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "flex-end", gap: 12 },
  backBtn:          { padding: 4 },
  chatHeaderInfo:   { flex: 1 },
  chatHeaderName:   { fontSize: 18, fontWeight: "700" as const },
  chatHeaderSub:    { fontSize: 12, marginTop: 2 },
  quickBar:         { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  quickLabel:       { fontSize: 10, fontWeight: "600" as const, letterSpacing: 1 },
  quickChips:       { flexDirection: "row", gap: 8 },
  quickChip:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  quickChipText:    { fontSize: 12, fontWeight: "600" as const },
  chatMessages:     { flex: 1 },
  msgThread:        { gap: 6 },
  msgBubble:        { alignItems: "flex-end" },
  bubble:           { maxWidth: "85%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, borderBottomRightRadius: 4 },
  bubbleText:       { color: "#fff", fontSize: 14, lineHeight: 20 },
  bubbleTime:       { fontSize: 10, marginTop: 4, marginRight: 2 },
  replyBubbleRow:   { alignItems: "flex-start" },
  replyBubble:      { maxWidth: "85%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, borderBottomLeftRadius: 4, borderWidth: 1 },
  replyBubbleText:  { fontSize: 14, lineHeight: 20 },
  emptyChat:        { textAlign: "center", marginTop: 40, fontSize: 14 },
  compose:          { flexDirection: "row", alignItems: "flex-end", gap: 10, padding: 12, borderTopWidth: 1 },
  composeInput:     { flex: 1, borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn:          { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
