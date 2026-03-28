import React from "react";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Colors } from "@/constants/Colors";
import { Logo } from "@/components/Logo";

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
          backgroundColor: Colors.primary,
        },
        headerTitleStyle: {
          fontWeight: "700",
          color: "#FFFFFF",
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="nieuws"
        options={{
          title: "Nieuws",
          headerTitle: "",
          headerLeft: () => <Logo width={136} height={32} />,
          headerLeftContainerStyle: { paddingLeft: 16 },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "newspaper", android: "newspaper", web: "newspaper" }}
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
          headerTitle: "Huurders",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "person.2", android: "people", web: "people" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          headerTitle: "Contact",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "phone", android: "phone", web: "phone" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      {/* Hide default template screens */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
