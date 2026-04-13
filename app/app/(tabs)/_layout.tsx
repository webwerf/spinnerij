import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Colors } from "@/constants/Colors";
import { Logo } from "@/components/Logo";
import Svg, { Path } from "react-native-svg";

function ContactIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke={Colors.textSecondary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeaderRight() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push("/contact")}
      style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
    >
      <ContactIcon />
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTitleStyle: {
          fontWeight: "700",
          color: Colors.text,
          fontSize: 17,
        },
        headerShadowVisible: false,
        headerRight: () => <HeaderRight />,
        headerRightContainerStyle: { paddingRight: 16 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "",
          headerLeft: () => <Logo width={136} height={32} />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "house", android: "home", web: "home" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="huurders"
        options={{
          title: "Huurders",
          headerTitle: "",
          headerLeft: () => <Logo width={136} height={32} />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "building.2", android: "apartment", web: "apartment" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vraag-aanbod"
        options={{
          title: "Vraag & Aanbod",
          headerTitle: "",
          headerLeft: () => <Logo width={136} height={32} />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "arrow.triangle.2.circlepath", android: "swap_horiz", web: "swap_horiz" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reserveren"
        options={{
          title: "Reserveren",
          headerTitle: "",
          headerLeft: () => <Logo width={136} height={32} />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "calendar", android: "event", web: "event" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="melding"
        options={{
          title: "Melding",
          headerTitle: "",
          headerLeft: () => <Logo width={136} height={32} />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "exclamationmark.triangle", android: "warning", web: "warning" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      {/* Hide redirect screens */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
});
