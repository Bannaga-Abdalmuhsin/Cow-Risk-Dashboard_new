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
    tabBarActiveTintColor:   "#174EA6",
    tabBarInactiveTintColor: "#3D5470",
    tabBarStyle: {
      position:        "absolute" as const,
      backgroundColor: isIOS ? "transparent" : "#0A1B34",
      borderTopWidth:  1,
      borderTopColor:  "rgba(100, 160, 255, 0.15)",
      elevation:       0,
      height:          isWeb ? 84 : 60,
    },
    tabBarBackground: isIOS
      ? () => (
          <BlurView
            intensity={90}
            tint="dark"
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(6,13,26,0.75)" }]}
          />
        )
      : isWeb
        ? () => (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "#0A1B34", borderTopWidth: 1, borderTopColor: "rgba(100,160,255,0.15)" },
              ]}
            />
          )
        : undefined,
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: "700" as const,
      letterSpacing: 0.5,
      marginBottom: isIOS ? 0 : 4,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [colors.primary, isWeb]);

  if (!loading && !user) return <Redirect href="/" />;
  if (!loading && user?.role !== "manager") return <Redirect href="/(technician)" />;

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="map"
        options={{
          title: "LIVE MAP",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <MaterialCommunityIcons name="map-marker-multiple" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "TEAM",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Feather name="users" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "DISPATCH",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <MaterialCommunityIcons name="message-text-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: "MANAGE",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <MaterialCommunityIcons name="account-cog-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrap: {
    backgroundColor: "rgba(23, 78, 166, 0.18)",
    borderRadius: 10,
    padding: 4,
    shadowColor: "#174EA6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
});
