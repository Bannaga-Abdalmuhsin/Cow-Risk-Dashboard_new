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
  keyboardType = "default", autoCapitalize = "sentences",
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; secureTextEntry?: boolean;
  keyboardType?: "default" | "phone-pad"; autoCapitalize?: "none" | "words" | "sentences";
}) {
  return (
    <>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder ?? label}
        placeholderTextColor="rgba(107,141,184,0.55)"
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
            <Text style={styles.headerTitle}>Team Management</Text>
            <Text style={styles.headerSub}>
              {techCount} technicians · {managerCount} managers
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={openAdd} style={styles.addBtnWrap}>
          <LinearGradient
            colors={["#174EA6", "#0E3A8C"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.addBtnGrad}
          >
            <Feather name="user-plus" size={14} color="#fff" />
            <Text style={styles.addBtnText}>ADD</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#174EA6" size="large" /></View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 14, gap: 8, paddingBottom: bottomPad }}
          renderItem={({ item }) => {
            const isManager = item.role === "manager";
            return (
              <View style={styles.row}>
                <LinearGradient
                  colors={isManager
                    ? ["rgba(23,78,166,0.15)", "rgba(23,78,166,0.06)"]
                    : ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
                  style={styles.rowGrad}
                >
                  <View style={[styles.roleBar, { backgroundColor: isManager ? "#174EA6" : "#D62828" }]} />
                  <View style={[styles.avatar, {
                    backgroundColor: isManager ? "rgba(23,78,166,0.25)" : "rgba(214,40,40,0.18)",
                  }]}>
                    <MaterialCommunityIcons
                      name={isManager ? "shield-account" : "account-hard-hat"}
                      size={20} color={isManager ? "#174EA6" : "#D62828"}
                    />
                  </View>
                  <View style={styles.rowInfo}>
                    <View style={styles.rowNameRow}>
                      <Text style={styles.rowName}>{item.name}</Text>
                      <View style={[styles.roleBadge, {
                        backgroundColor: isManager ? "rgba(23,78,166,0.20)" : "rgba(214,40,40,0.12)",
                        borderColor: isManager ? "rgba(23,78,166,0.40)" : "rgba(214,40,40,0.30)",
                      }]}>
                        <Text style={[styles.roleBadgeText, { color: isManager ? "#93B8EE" : "#EF6B6B" }]}>
                          {isManager ? "MGR" : "TECH"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.rowMeta}>
                      {item.defaultArea ? item.defaultArea : isManager ? "All Regions" : "No area"}
                    </Text>
                    {(item.mcName || item.mobileNumber) ? (
                      <Text style={styles.rowDetail}>
                        {item.mcName ? `MC: ${item.mcName}` : ""}
                        {item.mcName && item.mobileNumber ? "  ·  " : ""}
                        {item.mobileNumber ? `📞 ${item.mobileNumber}` : ""}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.rowActions}>
                    <TouchableOpacity
                      onPress={() => openEdit(item)}
                      style={styles.editBtn}
                    >
                      <Feather name="edit-2" size={14} color="#174EA6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item)}
                      style={styles.deleteBtn}
                    >
                      <Feather name="trash-2" size={14} color="#D62828" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="account-group-outline" size={36} color="#3D5470" />
              </View>
              <Text style={styles.emptyText}>No team members yet</Text>
            </View>
          }
        />
      )}

      {/* Add / Edit Modal */}
      <Modal visible={showForm} transparent animationType="slide" onRequestClose={() => setShowForm(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowForm(false)} />
        <View style={[styles.sheet, { paddingBottom: bottomPad }]}>
          <LinearGradient
            colors={["rgba(10,27,52,0.99)", "rgba(6,13,26,0.99)"]}
            style={styles.sheetGrad}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetTitleRow}>
              <View style={[styles.sheetAccentBar, { backgroundColor: "#174EA6" }]} />
              <Text style={styles.sheetTitle}>
                {editTarget ? `Edit — ${editTarget.name}` : "Add Team Member"}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Field label="FULL NAME" value={form.name} onChangeText={setF("name")}
                placeholder="e.g. Ahmed Al-Rashidi" autoCapitalize="words" />
              <Field label="MC NAME" value={form.mcName} onChangeText={setF("mcName")}
                placeholder="e.g. CWN-080" autoCapitalize="none" />
              <Field label="MOBILE NUMBER" value={form.mobileNumber} onChangeText={setF("mobileNumber")}
                placeholder="+966 5x xxx xxxx" keyboardType="phone-pad" autoCapitalize="none" />
              <Field label="USERNAME (LOGIN)" value={form.username} onChangeText={setF("username")}
                placeholder="Login name" autoCapitalize="none" />
              <Field
                label={editTarget ? "NEW PASSWORD (leave blank to keep)" : "PASSWORD"}
                value={form.password} onChangeText={setF("password")}
                placeholder="Password" secureTextEntry autoCapitalize="none"
              />

              {!editTarget && (
                <>
                  <Text style={styles.fieldLabel}>ROLE</Text>
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
                          borderColor:     form.role === r ? "#174EA6" : "rgba(100,160,255,0.20)",
                          backgroundColor: form.role === r ? "rgba(23,78,166,0.20)" : "rgba(255,255,255,0.05)",
                        }]}
                      >
                        <Text style={[styles.chipText, { color: form.role === r ? "#93B8EE" : "#6B8DB8" }]}>
                          {r === "manager" ? "Manager" : "Technician"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.fieldLabel}>ASSIGNED LOCATION</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chips}>
                  {ALL_LOCATIONS.map(loc => {
                    const isAllRegions = loc === "All Regions";
                    const active = form.location === loc ||
                      (isAllRegions && form.role === "manager");
                    const activeColor = isAllRegions ? "#174EA6" : "#D62828";
                    return (
                      <TouchableOpacity
                        key={loc}
                        onPress={() => setForm(prev => ({ ...prev, location: loc as HajjLocation }))}
                        style={[styles.chip, {
                          borderColor:     active ? activeColor : "rgba(100,160,255,0.20)",
                          backgroundColor: active ? activeColor + "22" : "rgba(255,255,255,0.05)",
                        }]}
                      >
                        <Text style={[styles.chipText, { color: active ? (isAllRegions ? "#93B8EE" : "#EF6B6B") : "#6B8DB8" }]}>
                          {loc}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {!!formError && (
                <View style={styles.errorRow}>
                  <Text style={styles.formError}>{formError}</Text>
                </View>
              )}

              <View style={[styles.formRow, { marginTop: 16 }]}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowForm(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtnWrap, { opacity: saving ? 0.7 : 1 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <LinearGradient
                    colors={["#174EA6", "#0E3A8C"]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.saveBtnGrad}
                  >
                    {saving
                      ? <ActivityIndicator color="#fff" size="small" />
                      : <Text style={styles.saveBtnText}>{editTarget ? "Save Changes" : "Add Member"}</Text>
                    }
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:           { flex: 1 },

  header:         {
    paddingHorizontal: 20, paddingBottom: 14, overflow: "hidden",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomWidth: 1, borderBottomColor: "rgba(100,160,255,0.12)",
  },
  headerLeft:     { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  headerAccentBar:{ width: 3, height: 38, borderRadius: 2, backgroundColor: "#174EA6" },
  headerTitle:    { fontSize: 20, fontWeight: "700" as const, color: "#E2EFFF" },
  headerSub:      { fontSize: 11, color: "#6B8DB8", marginTop: 2 },
  addBtnWrap:     { borderRadius: 20, overflow: "hidden" },
  addBtnGrad:     { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9 },
  addBtnText:     { color: "#fff", fontWeight: "800" as const, fontSize: 12, letterSpacing: 0.8 },

  center:         { flex: 1, alignItems: "center", justifyContent: "center" },

  row:            {
    borderRadius: 16, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.15)",
    overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  rowGrad:        { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  roleBar:        { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  avatar:         { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rowNameRow:     { flexDirection: "row", alignItems: "center", gap: 8 },
  rowInfo:        { flex: 1 },
  rowName:        { fontSize: 15, fontWeight: "600" as const, color: "#E2EFFF" },
  roleBadge:      { borderWidth: 1, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  roleBadgeText:  { fontSize: 9, fontWeight: "800" as const, letterSpacing: 0.8 },
  rowMeta:        { fontSize: 12, color: "#6B8DB8", marginTop: 2 },
  rowDetail:      { fontSize: 11, color: "#3D5470", marginTop: 2 },
  rowActions:     { flexDirection: "row", gap: 6 },
  editBtn:        {
    padding: 8, borderWidth: 1,
    borderColor: "rgba(23,78,166,0.35)",
    backgroundColor: "rgba(23,78,166,0.12)",
    borderRadius: 10,
  },
  deleteBtn:      {
    padding: 8, borderWidth: 1,
    borderColor: "rgba(214,40,40,0.30)",
    backgroundColor: "rgba(214,40,40,0.10)",
    borderRadius: 10,
  },
  empty:          { alignItems: "center", gap: 12, marginTop: 60 },
  emptyIconWrap:  {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(100,160,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  emptyText:      { fontSize: 14, color: "#6B8DB8" },

  overlay:        { flex: 1 },
  sheet:          {
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    overflow: "hidden",
    borderTopWidth: 1, borderColor: "rgba(100,160,255,0.25)",
    maxHeight: "90%",
    shadowColor: "#000", shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 16,
  },
  sheetGrad:      { padding: 20 },
  sheetHandle:    {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "rgba(100,160,255,0.25)",
    alignSelf: "center", marginBottom: 16,
  },
  sheetTitleRow:  { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  sheetAccentBar: { width: 3, height: 24, borderRadius: 2 },
  sheetTitle:     { fontSize: 18, fontWeight: "700" as const, color: "#E2EFFF" },

  fieldLabel:     { fontSize: 10, fontWeight: "700" as const, letterSpacing: 1.2, marginTop: 14, marginBottom: 6, color: "#6B8DB8" },
  fieldInput:     {
    borderWidth: 1, borderRadius: 12,
    borderColor: "rgba(100,160,255,0.20)",
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: "#E2EFFF",
  },
  chips:          { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText:       { fontSize: 13, fontWeight: "600" as const },
  errorRow:       {
    borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 8,
    backgroundColor: "rgba(214,40,40,0.10)",
    borderColor: "rgba(214,40,40,0.25)",
  },
  formError:      { fontSize: 13, textAlign: "center", color: "#EF6B6B" },
  formRow:        { flexDirection: "row", gap: 10 },
  cancelBtn:      {
    flex: 1, borderWidth: 1,
    borderColor: "rgba(100,160,255,0.20)",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14, paddingVertical: 13, alignItems: "center",
  },
  cancelText:     { fontWeight: "600" as const, color: "#6B8DB8" },
  saveBtnWrap:    { flex: 1, borderRadius: 14, overflow: "hidden" },
  saveBtnGrad:    { paddingVertical: 13, alignItems: "center" },
  saveBtnText:    { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
});
