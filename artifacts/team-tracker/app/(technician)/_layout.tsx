import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const isIOS = Platform.OS === "ios";

export default function TechnicianLayout() {
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
  if (!loading && user?.role !== "technician") return <Redirect href="/(manager)/map" />;

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Duty",
          tabBarIcon: ({ color }) =>
            <MaterialCommunityIcons name="map-marker-radius" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assignment"
        options={{
          title: "Task",
          tabBarIcon: ({ color }) =>
            <MaterialCommunityIcons name="bell-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
