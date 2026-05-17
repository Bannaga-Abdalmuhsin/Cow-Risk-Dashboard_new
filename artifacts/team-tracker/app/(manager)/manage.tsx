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
  LOCATIONS, type TeamUser, type HajjLocation,
} from "@/lib/api";

const ROLES = ["technician", "manager"] as const;

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
  const { token } = useAuth();

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
      location:     (user.defaultArea as HajjLocation) ?? "",
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
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Manage Team</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {techCount} technicians · {managerCount} managers
          </Text>
        </View>
        <TouchableOpacity onPress={openAdd} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Feather name="user-plus" size={16} color="#fff" />
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
                  {item.defaultArea   ? `  ·  ${item.defaultArea}`   : ""}
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
                  style={[styles.iconBtn, { borderColor: colors.border }]}
                >
                  <Feather name="edit-2" size={15} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  style={[styles.iconBtn, { borderColor: colors.destructive }]}
                >
                  <Feather name="trash-2" size={15} color={colors.destructive} />
                </TouchableOpacity>
              </View>
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

      {/* Add / Edit Modal */}
      <Modal visible={showForm} transparent animationType="slide" onRequestClose={() => setShowForm(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowForm(false)} />
        <View style={[styles.sheet, { backgroundColor: "#0D1E30", borderColor: colors.border, paddingBottom: bottomPad }]}>
          <View style={styles.sheetHandle} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
            {editTarget ? `Edit — ${editTarget.name}` : "Add Team Member"}
          </Text>

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

            {/* Role — hide for edit (can't change own role) */}
            {!editTarget && (
              <>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>ROLE</Text>
                <View style={styles.chips}>
                  {ROLES.map(r => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setForm(prev => ({ ...prev, role: r }))}
                      style={[styles.chip, {
                        borderColor:     form.role === r ? colors.primary : colors.border,
                        backgroundColor: form.role === r ? colors.primary + "30" : "transparent",
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

            {/* Location */}
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>ASSIGNED LOCATION</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chips}>
                {LOCATIONS.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => setForm(prev => ({ ...prev, location: loc }))}
                    style={[styles.chip, {
                      borderColor:     form.location === loc ? colors.onDuty : colors.border,
                      backgroundColor: form.location === loc ? colors.onDuty + "20" : "transparent",
                    }]}
                  >
                    <Text style={[styles.chipText, { color: form.location === loc ? colors.onDuty : colors.mutedForeground }]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {!!formError && <Text style={[styles.formError, { color: colors.destructive }]}>{formError}</Text>}

            <View style={[styles.formRow, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
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
  root:        { flex: 1 },
  header:      {
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
  rowDetail:   { fontSize: 11, marginTop: 2 },
  rowActions:  { flexDirection: "row", gap: 6 },
  iconBtn:     { padding: 7, borderWidth: 1, borderRadius: 8 },
  empty:       { alignItems: "center", gap: 10, marginTop: 60 },
  emptyText:   { fontSize: 14 },
  overlay:     { flex: 1 },
  sheet:       { borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTopWidth: 1, padding: 20, maxHeight: "90%" },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#3A5470", alignSelf: "center", marginBottom: 8 },
  sheetTitle:  { fontSize: 18, fontWeight: "700" as const, marginBottom: 8 },
  fieldLabel:  { fontSize: 10, fontWeight: "600" as const, letterSpacing: 1, marginTop: 12, marginBottom: 4 },
  fieldInput:  { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
  chips:       { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip:        { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText:    { fontSize: 13, fontWeight: "600" as const },
  formError:   { fontSize: 13, marginTop: 8 },
  formRow:     { flexDirection: "row", gap: 10 },
  cancelBtn:   { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  cancelText:  { fontWeight: "600" as const },
  saveBtn:     { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
});
