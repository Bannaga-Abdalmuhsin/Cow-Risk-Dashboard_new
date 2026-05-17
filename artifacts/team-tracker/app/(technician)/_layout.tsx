import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Redirect, Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "location.circle", selected: "location.circle.fill" }} />
        <Label>Duty</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="assignment">
        <Icon sf={{ default: "bell", selected: "bell.fill" }} />
        <Label>Task</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isIOS  = Platform.OS === "ios";
  const isWeb  = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position:        "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth:  1,
          borderTopColor:  colors.border,
          elevation:       0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Duty",
          tabBarIcon: ({ color }) =>
            isIOS
              ? <SymbolView name="location.circle.fill" tintColor={color} size={22} />
              : <MaterialCommunityIcons name="map-marker-radius" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assignment"
        options={{
          title: "Task",
          tabBarIcon: ({ color }) =>
            isIOS
              ? <SymbolView name="bell.fill" tintColor={color} size={22} />
              : <MaterialCommunityIcons name="bell-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TechnicianLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Redirect href="/" />;
  if (!loading && user?.role !== "technician") return <Redirect href="/(manager)/map" />;
  return (Platform.OS === "ios" && isLiquidGlassAvailable()) ? <NativeTabLayout /> : <ClassicTabLayout />;
}
