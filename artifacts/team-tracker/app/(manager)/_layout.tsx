import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Redirect, Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="map">
        <Icon sf={{ default: "map", selected: "map.fill" }} />
        <Label>Live Map</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="team">
        <Icon sf={{ default: "person.3", selected: "person.3.fill" }} />
        <Label>Team</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chat">
        <Icon sf={{ default: "bubble.left.and.bubble.right", selected: "bubble.left.and.bubble.right.fill" }} />
        <Label>Chat</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="manage">
        <Icon sf={{ default: "person.badge.plus", selected: "person.badge.plus" }} />
        <Label>Manage</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors      = useColors();
  const colorScheme = useColorScheme();
  const isDark      = colorScheme === "dark";
  const isIOS       = Platform.OS === "ios";
  const isWeb       = Platform.OS === "web";

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
            <BlurView intensity={80} tint={isDark ? "dark" : "dark"} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Live Map",
          tabBarIcon: ({ color }) =>
            isIOS
              ? <SymbolView name="map.fill" tintColor={color} size={22} />
              : <MaterialCommunityIcons name="map-marker-multiple" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "Team",
          tabBarIcon: ({ color }) =>
            isIOS
              ? <SymbolView name="person.3.fill" tintColor={color} size={22} />
              : <Feather name="users" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) =>
            isIOS
              ? <SymbolView name="bubble.left.and.bubble.right.fill" tintColor={color} size={22} />
              : <MaterialCommunityIcons name="message-text-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: "Manage",
          tabBarIcon: ({ color }) =>
            isIOS
              ? <SymbolView name="person.badge.plus" tintColor={color} size={22} />
              : <MaterialCommunityIcons name="account-plus-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function ManagerLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Redirect href="/" />;
  if (!loading && user?.role !== "manager") return <Redirect href="/(technician)/" />;
  return isLiquidGlassAvailable() ? <NativeTabLayout /> : <ClassicTabLayout />;
}
