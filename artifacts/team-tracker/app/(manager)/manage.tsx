import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, Modal, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import {
  getTeamUsers, createTeamUser, deleteTeamUser,
  LOCATIONS, type TeamUser, type HajjLocation,
} from "@/lib/api";

const ROLES = ["technician", "manager"] as const;

export default function ManageScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [users,    setUsers]    = useState<TeamUser[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [name,        setName]        = useState("");
  const [password,    setPassword]    = useState("");
  const [role,        setRole]        = useState<"technician" | "manager">("technician");
  const [location,    setLocation]    = useState<HajjLocation | "">("Makkah");
  const [saving,      setSaving]      = useState(false);
  const [formError,   setFormError]   = useState("");

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  const load = useCallback(async () => {
    try {
      const data = await getTeamUsers(token);
      setUsers(data);
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setName(""); setPassword(""); setRole("technician");
    setLocation("Makkah"); setFormError("");
  };

  const handleAdd = async () => {
    if (!name.trim() || !password.trim()) {
      setFormError("Name and password are required");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const user = await createTeamUser(token!, name.trim(), password.trim(), role, location || null);
      setUsers(prev => [...prev, user]);
      resetForm();
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (user: TeamUser) => {
    Alert.alert(
      "Remove Member",
      `Remove ${user.name} from the team?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove", style: "destructive",
          onPress: async () => {
            try {
              await deleteTeamUser(token!, user.id);
              setUsers(prev => prev.filter(u => u.id !== user.id));
            } catch (err) {
              Alert.alert("Error", err instanceof Error ? err.message : "Failed");
            }
          },
        },
      ],
    );
  };

  const techCount    = users.filter(u => u.role === "technician").length;
  const managerCount = users.filter(u => u.role === "manager").length;

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Manage Team</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {techCount} technicians · {managerCount} managers
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => { resetForm(); setShowForm(true); }}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="user-plus" size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: bottomPad }}
          renderItem={({ item }) => (
            <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: item.role === "manager" ? colors.primary : colors.secondary }]}>
                <MaterialCommunityIcons
                  name={item.role === "manager" ? "shield-account" : "account-hard-hat"}
                  size={20} color="#fff"
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.rowMeta, { color: colors.mutedForeground }]}>
                  {item.role === "manager" ? "Manager" : "Technician"}
                  {item.defaultArea ? `  ·  ${item.defaultArea}` : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={[styles.deleteBtn, { borderColor: colors.destructive }]}
              >
                <Feather name="trash-2" size={15} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="account-group-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No team members yet</Text>
            </View>
          }
        />
      )}

      {/* Add User Modal */}
      <Modal visible={showForm} transparent animationType="slide" onRequestClose={() => setShowForm(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowForm(false)} />
        <View style={[styles.sheet, { backgroundColor: "#0D1E30", borderColor: colors.border, paddingBottom: bottomPad }]}>
          <View style={styles.sheetHandle} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Add Team Member</Text>

          {/* Name */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>USERNAME</Text>
          <TextInput
            style={[styles.fieldInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Full name"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* Password */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>PASSWORD</Text>
          <TextInput
            style={[styles.fieldInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Role */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>ROLE</Text>
          <View style={styles.chips}>
            {ROLES.map(r => (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                style={[
                  styles.chip,
                  { borderColor: role === r ? colors.primary : colors.border,
                    backgroundColor: role === r ? colors.primary + "30" : "transparent" },
                ]}
              >
                <Text style={[styles.chipText, { color: role === r ? colors.primary : colors.mutedForeground }]}>
                  {r === "manager" ? "Manager" : "Technician"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>ASSIGNED LOCATION</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locScroll}>
            <View style={styles.chips}>
              {LOCATIONS.map(loc => (
                <TouchableOpacity
                  key={loc}
                  onPress={() => setLocation(loc)}
                  style={[
                    styles.chip,
                    { borderColor: location === loc ? colors.onDuty : colors.border,
                      backgroundColor: location === loc ? colors.onDuty + "20" : "transparent" },
                  ]}
                >
                  <Text style={[styles.chipText, { color: location === loc ? colors.onDuty : colors.mutedForeground }]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {!!formError && <Text style={[styles.formError, { color: colors.destructive }]}>{formError}</Text>}

          <View style={styles.formRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={() => setShowForm(false)}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
              onPress={handleAdd}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.saveBtnText}>Add Member</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  header:     {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  headerTitle: { fontSize: 22, fontWeight: "700" as const },
  headerSub:   { fontSize: 12, marginTop: 2 },
  addBtn:      { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  addBtnText:  { color: "#fff", fontWeight: "700" as const, fontSize: 13 },
  center:      { flex: 1, alignItems: "center", justifyContent: "center" },
  row:         {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 22, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
  },
  avatar:      { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rowInfo:     { flex: 1 },
  rowName:     { fontSize: 15, fontWeight: "600" as const },
  rowMeta:     { fontSize: 12, marginTop: 2 },
  deleteBtn:   { padding: 8, borderWidth: 1, borderRadius: 8 },
  empty:       { alignItems: "center", gap: 10, marginTop: 60 },
  emptyText:   { fontSize: 14 },
  overlay:     { flex: 1 },
  sheet:       {
    borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTopWidth: 1,
    padding: 20, gap: 8,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#3A5470", alignSelf: "center", marginBottom: 8 },
  sheetTitle:  { fontSize: 18, fontWeight: "700" as const, marginBottom: 8 },
  fieldLabel:  { fontSize: 10, fontWeight: "600" as const, letterSpacing: 1, marginTop: 8, marginBottom: 4 },
  fieldInput:  { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
  chips:       { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip:        { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText:    { fontSize: 13, fontWeight: "600" as const },
  locScroll:   { marginBottom: 4 },
  formError:   { fontSize: 13, marginTop: 4 },
  formRow:     { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn:   { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  cancelText:  { fontWeight: "600" as const },
  saveBtn:     { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
});
