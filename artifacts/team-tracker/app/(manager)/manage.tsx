import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, Modal, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import {
  getTeamUsers, createTeamUser, updateTeamUser, deleteTeamUser,
  UnauthorizedError,
  LOCATIONS, type TeamUser, type HajjLocation,
} from "@/lib/api";

const ROLES = ["technician", "manager"] as const;
const ALL_LOCATIONS = [...LOCATIONS, "All Regions"] as const;

interface UserForm {
  name:         string;
  mcName:       string;
  mobileNumber: string;
  username:     string;
  password:     string;
  role:         "technician" | "manager";
  location:     HajjLocation | "";
}

const EMPTY_FORM: UserForm = {
  name: "", mcName: "", mobileNumber: "",
  username: "", password: "",
  role: "technician", location: "Makkah",
};

function Field({
  label, value, onChangeText, placeholder, secureTextEntry = false,
  keyboardType = "default", autoCapitalize = "sentences", colors,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; secureTextEntry?: boolean;
  keyboardType?: "default" | "phone-pad"; autoCapitalize?: "none" | "words" | "sentences";
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
        placeholder={placeholder ?? label}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </>
  );
}

export default function ManageScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { token, logout } = useAuth();

  const [users,      setUsers]      = useState<TeamUser[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState<TeamUser | null>(null);
  const [form,       setForm]       = useState<UserForm>(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState("");

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 80);

  const load = useCallback(async () => {
    try { setUsers(await getTeamUsers(token)); } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const setF = (key: keyof UserForm) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (user: TeamUser) => {
    setEditTarget(user);
    setForm({
      name:         user.name,
      mcName:       user.mcName       ?? "",
      mobileNumber: user.mobileNumber ?? "",
      username:     user.name,
      password:     "",
      role:         user.role as "technician" | "manager",
      location:     user.role === "manager"
        ? ("All Regions" as HajjLocation)
        : ((user.defaultArea as HajjLocation) ?? ""),
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.username.trim()) { setFormError("Username is required"); return; }
    if (!editTarget && !form.password.trim()) { setFormError("Password is required for new members"); return; }
    setSaving(true);
    setFormError("");
    try {
      if (editTarget) {
        const fields: Parameters<typeof updateTeamUser>[2] = {
          name:         form.username.trim(),
          defaultArea:  form.location || undefined,
          mcName:       form.mcName.trim()       || undefined,
          mobileNumber: form.mobileNumber.trim() || undefined,
        };
        if (form.password.trim()) fields.pin = form.password.trim();
        const updated = await updateTeamUser(token!, editTarget.id, fields);
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      } else {
        const created = await createTeamUser(
          token!, form.username.trim(), form.password.trim(),
          form.role, form.location || null,
          form.mcName.trim() || undefined,
          form.mobileNumber.trim() || undefined,
        );
        setUsers(prev => [...prev, created]);
      }
      setShowForm(false);
    } catch (err) {
      if (err instanceof UnauthorizedError) { await logout(); return; }
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (user: TeamUser) => {
    Alert.alert("Remove Member", `Remove ${user.name} from the team?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive",
        onPress: async () => {
          try {
            await deleteTeamUser(token!, user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));
          } catch (err) {
            if (err instanceof UnauthorizedError) { await logout(); return; }
            Alert.alert("Error", err instanceof Error ? err.message : "Failed");
          }
        },
      },
    ]);
  };

  const techCount    = users.filter(u => u.role === "technician").length;
  const managerCount = users.filter(u => u.role === "manager").length;

  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.headerAccent, { backgroundColor: colors.primary }]} />
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Manage Team</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {techCount} technicians · {managerCount} managers
          </Text>
        </View>
        <TouchableOpacity onPress={openAdd} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Feather name="user-plus" size={15} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} size="large" /></View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: bottomPad }}
          renderItem={({ item }) => {
            const isManager = item.role === "manager";
            return (
              <View style={[styles.row, {
                backgroundColor: colors.card,
                borderColor:     colors.border,
                borderLeftColor: isManager ? colors.primary : colors.accent,
              }]}>
                <View style={[styles.avatar, {
                  backgroundColor: isManager ? colors.primary : colors.accent,
                }]}>
                  <MaterialCommunityIcons
                    name={isManager ? "shield-account" : "account-hard-hat"}
                    size={20} color="#fff"
                  />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowName, { color: colors.foreground }]}>{item.name}</Text>
                  <Text style={[styles.rowMeta, { color: colors.mutedForeground }]}>
                    {isManager ? "Manager" : "Technician"}
                    {item.defaultArea ? `  ·  ${item.defaultArea}` : ""}
                  </Text>
                  {(item.mcName || item.mobileNumber) ? (
                    <Text style={[styles.rowDetail, { color: colors.mutedForeground }]}>
                      {item.mcName ? `MC: ${item.mcName}` : ""}
                      {item.mcName && item.mobileNumber ? "  ·  " : ""}
                      {item.mobileNumber ? `📞 ${item.mobileNumber}` : ""}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity
                    onPress={() => openEdit(item)}
                    style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.muted }]}
                  >
                    <Feather name="edit-2" size={14} color={colors.accent} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    style={[styles.iconBtn, { borderColor: colors.destructive + "30", backgroundColor: colors.destructive + "10" }]}
                  >
                    <Feather name="trash-2" size={14} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIconWrap, { backgroundColor: colors.muted }]}>
                <MaterialCommunityIcons name="account-group-outline" size={36} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No team members yet</Text>
            </View>
          }
        />
      )}

      {/* Add / Edit Modal */}
      <Modal visible={showForm} transparent animationType="slide" onRequestClose={() => setShowForm(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowForm(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad }]}>
          <View style={[styles.sheetHandle, { backgroundColor: "rgba(15,30,58,0.18)" }]} />

          {/* Sheet accent bar */}
          <View style={[styles.sheetAccentRow]}>
            <View style={[styles.sheetAccentDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
              {editTarget ? `Edit — ${editTarget.name}` : "Add Team Member"}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            <Field label="FULL NAME" value={form.name} onChangeText={setF("name")}
              placeholder="e.g. Ahmed Al-Rashidi" autoCapitalize="words" colors={colors} />

            <Field label="MC NAME" value={form.mcName} onChangeText={setF("mcName")}
              placeholder="e.g. CWN-080" autoCapitalize="none" colors={colors} />

            <Field label="MOBILE NUMBER" value={form.mobileNumber} onChangeText={setF("mobileNumber")}
              placeholder="+966 5x xxx xxxx" keyboardType="phone-pad" autoCapitalize="none" colors={colors} />

            <Field label="USERNAME (LOGIN)" value={form.username} onChangeText={setF("username")}
              placeholder="Login name" autoCapitalize="none" colors={colors} />

            <Field
              label={editTarget ? "NEW PASSWORD (leave blank to keep)" : "PASSWORD"}
              value={form.password} onChangeText={setF("password")}
              placeholder="Password" secureTextEntry autoCapitalize="none" colors={colors}
            />

            {!editTarget && (
              <>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>ROLE</Text>
                <View style={styles.chips}>
                  {ROLES.map(r => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setForm(prev => ({
                        ...prev,
                        role: r,
                        location: r === "manager" ? ("All Regions" as HajjLocation) : prev.location,
                      }))}
                      style={[styles.chip, {
                        borderColor:     form.role === r ? colors.primary : colors.border,
                        backgroundColor: form.role === r ? colors.primary + "15" : colors.muted,
                      }]}
                    >
                      <Text style={[styles.chipText, { color: form.role === r ? colors.primary : colors.mutedForeground }]}>
                        {r === "manager" ? "Manager" : "Technician"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>ASSIGNED LOCATION</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chips}>
                {ALL_LOCATIONS.map(loc => {
                  const isAllRegions = loc === "All Regions";
                  const active = form.location === loc ||
                    (isAllRegions && form.role === "manager");
                  const activeColor = isAllRegions ? colors.primary : colors.accent;
                  return (
                    <TouchableOpacity
                      key={loc}
                      onPress={() => setForm(prev => ({ ...prev, location: loc as HajjLocation }))}
                      style={[styles.chip, {
                        borderColor:     active ? activeColor : colors.border,
                        backgroundColor: active ? activeColor + "15" : colors.muted,
                      }]}
                    >
                      <Text style={[styles.chipText, { color: active ? activeColor : colors.mutedForeground }]}>
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {!!formError && (
              <View style={[styles.errorRow, { backgroundColor: colors.destructive + "10", borderColor: colors.destructive + "25" }]}>
                <Text style={[styles.formError, { color: colors.destructive }]}>{formError}</Text>
              </View>
            )}

            <View style={[styles.formRow, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border, backgroundColor: colors.muted }]}
                onPress={() => setShowForm(false)}
              >
                <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveBtnText}>{editTarget ? "Save Changes" : "Add Member"}</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:           { flex: 1 },
  header:         {
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1,
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  headerAccent:   { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  headerTitle:    { fontSize: 22, fontWeight: "700" as const },
  headerSub:      { fontSize: 12, marginTop: 2 },
  addBtn:         { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  addBtnText:     { color: "#fff", fontWeight: "700" as const, fontSize: 13 },
  center:         { flex: 1, alignItems: "center", justifyContent: "center" },
  row:            {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 14, borderWidth: 1, borderLeftWidth: 4,
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  avatar:         { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rowInfo:        { flex: 1 },
  rowName:        { fontSize: 15, fontWeight: "600" as const },
  rowMeta:        { fontSize: 12, marginTop: 2 },
  rowDetail:      { fontSize: 11, marginTop: 2 },
  rowActions:     { flexDirection: "row", gap: 6 },
  iconBtn:        { padding: 8, borderWidth: 1, borderRadius: 10 },
  empty:          { alignItems: "center", gap: 12, marginTop: 60 },
  emptyIconWrap:  { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  emptyText:      { fontSize: 14 },
  overlay:        { flex: 1 },
  sheet:          {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, padding: 20, maxHeight: "90%",
    shadowColor: "#0F1E3A", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 12,
  },
  sheetHandle:    { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 14 },
  sheetAccentRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  sheetAccentDot: { width: 4, height: 22, borderRadius: 2 },
  sheetTitle:     { fontSize: 18, fontWeight: "700" as const },
  fieldLabel:     { fontSize: 10, fontWeight: "600" as const, letterSpacing: 1, marginTop: 14, marginBottom: 5 },
  fieldInput:     { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  chips:          { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText:       { fontSize: 13, fontWeight: "600" as const },
  errorRow:       { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 8 },
  formError:      { fontSize: 13, textAlign: "center" },
  formRow:        { flexDirection: "row", gap: 10 },
  cancelBtn:      { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  cancelText:     { fontWeight: "600" as const },
  saveBtn:        { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  saveBtnText:    { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
});
