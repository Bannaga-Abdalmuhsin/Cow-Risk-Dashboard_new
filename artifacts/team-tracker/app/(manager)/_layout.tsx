import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const isIOS = Platform.OS === "ios";

export default function ManagerLayout() {
  const { user, loading } = useAuth();
  const colors = useColors();
  const isWeb  = Platform.OS === "web";

  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarActiveTintColor:   colors.primary,
    tabBarInactiveTintColor: colors.mutedForeground,
    tabBarStyle: {
      position:        "absolute" as const,
      backgroundColor: isIOS ? "transparent" : colors.card,
      borderTopWidth:  1,
      borderTopColor:  colors.border,
      elevation:       0,
      ...(isWeb ? { height: 84 } : {}),
    },
    tabBarBackground: isIOS
      ? () => <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      : isWeb
        ? () => <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
        : undefined,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [colors.primary, colors.mutedForeground, colors.card, colors.border, isWeb]);

  if (!loading && !user) return <Redirect href="/" />;
  if (!loading && user?.role !== "manager") return <Redirect href="/(technician)" />;

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="map"
        options={{
          title: "Live Map",
          tabBarIcon: ({ color }) =>
            <MaterialCommunityIcons name="map-marker-multiple" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "Team",
          tabBarIcon: ({ color }) =>
            <Feather name="users" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) =>
            <MaterialCommunityIcons name="message-text-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: "Manage",
          tabBarIcon: ({ color }) =>
            <MaterialCommunityIcons name="account-plus-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
