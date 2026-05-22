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

  const [users,     setUsers]     = useState<TeamUser[]>([]);
  const [locations, setLocations] = useState<TechLocationWithUser[]>([]);
  const [loading,   setLoading]   = useState(true);

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
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const openChat = async (user: TeamUser) => {
    setSelected(user);
    setHistLoad(true);
    try {
      const h = await getChatHistory(token!, user.id);
      setHistory(h);
    } catch {}
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
    <LinearGradient colors={["#060D1A", "#0A1B34"]} style={styles.root}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 14 }]}>
        <LinearGradient
          colors={["rgba(23,78,166,0.25)", "rgba(6,13,26,0)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerLeft}>
          <View style={styles.headerAccentBar} />
          <View>
            <Text style={styles.headerTitle}>Dispatch</Text>
            <Text style={styles.headerSub}>{users.length} technicians</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.prompt
              ? Alert.prompt("Broadcast Message", "Send to all technicians:", msg => { if (msg?.trim()) handleBroadcast(msg.trim()); })
              : Alert.alert("Broadcast", "Use chat to select a technician and send");
          }}
          style={styles.broadcastBtn}
        >
          <LinearGradient
            colors={["#D62828", "#9B1E1E"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.broadcastBtnGrad}
          >
            <MaterialCommunityIcons name="broadcast" size={14} color="#fff" />
            <Text style={styles.broadcastBtnText}>BROADCAST</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#174EA6" size="large" />
        </View>
      ) : (
        <>
          {/* Quick location broadcast bar */}
          <View style={styles.locBar}>
            <Text style={styles.locBarLabel}>RELOCATE ALL →</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.locChips}>
                {LOCATIONS.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => handleBroadcast(`Please move to ${loc} immediately`)}
                    style={styles.locChip}
                  >
                    <Text style={styles.locChipText}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Tech list */}
          <FlatList
            data={users}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ padding: 14, gap: 8, paddingBottom: bottomPad }}
            renderItem={({ item }) => {
              const loc    = locationOf(item.id);
              const online = loc?.isOnDuty ?? false;
              return (
                <TouchableOpacity
                  onPress={() => openChat(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.techRow}>
                    <LinearGradient
                      colors={online
                        ? ["rgba(0,184,148,0.10)", "rgba(0,184,148,0.03)"]
                        : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
                      style={styles.techRowGrad}
                    >
                      <View style={[styles.techStatusBar, { backgroundColor: online ? "#00B894" : "#3D5470" }]} />
                      <View style={[styles.techAvatar, { backgroundColor: online ? "rgba(0,184,148,0.18)" : "rgba(61,84,112,0.20)" }]}>
                        <Text style={[styles.techAvatarText, { color: online ? "#00B894" : "#3D5470" }]}>
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.techInfo}>
                        <Text style={styles.techName}>{item.name}</Text>
                        <Text style={styles.techMeta}>
                          {online ? `On duty · ${loc?.area ?? "Unknown area"}` : (item.defaultArea ? `Assigned: ${item.defaultArea}` : "Offline")}
                        </Text>
                      </View>
                      <View style={[styles.chatIcon, { backgroundColor: "rgba(23,78,166,0.18)" }]}>
                        <Feather name="message-circle" size={18} color="#174EA6" />
                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.center}>
                <MaterialCommunityIcons name="account-off-outline" size={40} color="#3D5470" />
                <Text style={styles.emptyText}>No technicians</Text>
              </View>
            }
          />
        </>
      )}

      {/* Individual Chat Modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={closeChat}>
        <LinearGradient colors={["#060D1A", "#0A1B34"]} style={styles.chatModal}>

          {/* Chat header */}
          <View style={[styles.chatHeader, { paddingTop: topPad + 14 }]}>
            <LinearGradient
              colors={["rgba(23,78,166,0.25)", "rgba(6,13,26,0)"]}
              style={StyleSheet.absoluteFill}
            />
            <TouchableOpacity onPress={closeChat} style={styles.backBtn}>
              <Feather name="arrow-left" size={22} color="#E2EFFF" />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>{selected?.name}</Text>
              <Text style={styles.chatHeaderSub}>
                {locationOf(selected?.id ?? 0)?.isOnDuty
                  ? `On duty · ${locationOf(selected?.id ?? 0)?.area ?? "Unknown"}`
                  : (selected?.defaultArea ? `Assigned: ${selected.defaultArea}` : "Offline")}
              </Text>
            </View>
            <View style={[
              styles.chatStatusDot,
              { backgroundColor: locationOf(selected?.id ?? 0)?.isOnDuty ? "#00B894" : "#3D5470" },
            ]} />
          </View>

          {/* Quick location buttons */}
          <View style={styles.quickBar}>
            <Text style={styles.quickLabel}>MOVE TO:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickChips}>
                {LOCATIONS.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => handleSend(`Please move to ${loc} immediately`)}
                    style={styles.quickChip}
                  >
                    <Text style={styles.quickChipText}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Messages */}
          <View style={styles.chatMessages}>
            {histLoad ? (
              <View style={styles.center}>
                <ActivityIndicator color="#174EA6" />
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
                    <View style={styles.msgBubble}>
                      <LinearGradient
                        colors={["#174EA6", "#0E3A8C"]}
                        style={styles.bubble}
                      >
                        <Text style={styles.bubbleText}>{item.message}</Text>
                      </LinearGradient>
                      <Text style={styles.bubbleTime}>
                        {timeLabel(item.sentAt)}{item.readAt ? "  ✓ Read" : ""}
                      </Text>
                    </View>
                    {item.reply ? (
                      <View style={styles.replyBubbleRow}>
                        <View style={styles.replyBubble}>
                          <Text style={styles.replyBubbleText}>{item.reply}</Text>
                        </View>
                        <Text style={styles.bubbleTime}>
                          {item.repliedAt ? timeLabel(item.repliedAt) : ""}{"  ← Reply"}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyChat}>
                    No messages yet. Send a task below.
                  </Text>
                }
              />
            )}
          </View>

          {/* Compose */}
          <View style={[styles.compose, { paddingBottom: bottomPad }]}>
            <TextInput
              style={styles.composeInput}
              placeholder="Type a dispatch message..."
              placeholderTextColor="rgba(107,141,184,0.6)"
              value={message}
              onChangeText={setMessage}
              multiline
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={sending || !message.trim()}
              style={[styles.sendBtnWrap, { opacity: sending || !message.trim() ? 0.45 : 1 }]}
            >
              <LinearGradient
                colors={["#174EA6", "#0E3A8C"]}
                style={styles.sendBtnGrad}
              >
                {sending
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Feather name="send" size={18} color="#fff" />
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:             { flex: 1 },

  header:           {
    paddingHorizontal: 20, paddingBottom: 14, overflow: "hidden",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.12)",
  },
  headerLeft:       { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAccentBar:  { width: 3, height: 38, borderRadius: 2, backgroundColor: "#D62828" },
  headerTitle:      { fontSize: 22, fontWeight: "700" as const, color: "#E2EFFF" },
  headerSub:        { fontSize: 11, color: "#6B8DB8", marginTop: 2 },
  broadcastBtn:     { borderRadius: 20, overflow: "hidden" },
  broadcastBtnGrad: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  broadcastBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 11, letterSpacing: 0.8 },

  locBar:           {
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.10)",
    backgroundColor: "rgba(23,78,166,0.06)", gap: 6,
  },
  locBarLabel:      { fontSize: 9, fontWeight: "700" as const, color: "#3D5470", letterSpacing: 1.2 },
  locChips:         { flexDirection: "row", gap: 8 },
  locChip:          {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1,
    borderColor: "rgba(23,78,166,0.35)", backgroundColor: "rgba(23,78,166,0.12)",
  },
  locChipText:      { fontSize: 12, fontWeight: "600" as const, color: "#93B8EE" },

  center:           { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyText:        { fontSize: 14, color: "#6B8DB8" },

  techRow:          {
    borderRadius: 16, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.15)",
    overflow: "hidden",
  },
  techRowGrad:      { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  techStatusBar:    { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  techAvatar:       {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
  },
  techAvatarText:   { fontSize: 16, fontWeight: "700" as const },
  techInfo:         { flex: 1 },
  techName:         { fontSize: 15, fontWeight: "600" as const, color: "#E2EFFF" },
  techMeta:         { fontSize: 12, color: "#6B8DB8", marginTop: 2 },
  chatIcon:         { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  chatModal:        { flex: 1 },
  chatHeader:       {
    paddingHorizontal: 16, paddingBottom: 14, overflow: "hidden",
    flexDirection: "row", alignItems: "center", gap: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.12)",
  },
  backBtn:          {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center", justifyContent: "center",
  },
  chatHeaderInfo:   { flex: 1 },
  chatHeaderName:   { fontSize: 18, fontWeight: "700" as const, color: "#E2EFFF" },
  chatHeaderSub:    { fontSize: 12, color: "#6B8DB8", marginTop: 2 },
  chatStatusDot:    { width: 10, height: 10, borderRadius: 5 },

  quickBar:         {
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.10)",
    backgroundColor: "rgba(214,40,40,0.06)",
    flexDirection: "row", alignItems: "center", gap: 10,
  },
  quickLabel:       { fontSize: 9, fontWeight: "700" as const, color: "#3D5470", letterSpacing: 1.2 },
  quickChips:       { flexDirection: "row", gap: 8 },
  quickChip:        {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1,
    borderColor: "rgba(214,40,40,0.35)", backgroundColor: "rgba(214,40,40,0.10)",
  },
  quickChipText:    { fontSize: 12, fontWeight: "600" as const, color: "#EF6B6B" },

  chatMessages:     { flex: 1 },
  msgThread:        { gap: 6 },
  msgBubble:        { alignItems: "flex-end" },
  bubble:           { maxWidth: "85%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, borderBottomRightRadius: 4 },
  bubbleText:       { color: "#fff", fontSize: 14, lineHeight: 20 },
  bubbleTime:       { fontSize: 10, color: "#3D5470", marginTop: 4, marginRight: 2 },
  replyBubbleRow:   { alignItems: "flex-start" },
  replyBubble:      {
    maxWidth: "85%", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18, borderBottomLeftRadius: 4, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  replyBubbleText:  { fontSize: 14, lineHeight: 20, color: "#E2EFFF" },
  emptyChat:        { textAlign: "center", marginTop: 40, fontSize: 14, color: "#3D5470" },

  compose:          {
    flexDirection: "row", alignItems: "flex-end", gap: 10, padding: 12,
    borderTopWidth: 1, borderTopColor: "rgba(100,160,255,0.12)",
    backgroundColor: "rgba(6,13,26,0.95)",
  },
  composeInput:     {
    flex: 1, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.20)",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, maxHeight: 100, color: "#E2EFFF",
  },
  sendBtnWrap:      { borderRadius: 22, overflow: "hidden" },
  sendBtnGrad:      { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
