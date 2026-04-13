import { View, Text, Image, StyleSheet, Pressable, Linking } from "react-native";
import { Colors } from "@/constants/Colors";
import type { Huurder } from "@/constants/huurders";

interface TenantCardProps {
  huurder: Huurder;
}

export function TenantCard({ huurder }: TenantCardProps) {
  function handleWebsite() {
    Linking.openURL(huurder.website);
  }

  return (
    <View style={styles.card}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: huurder.logo }} style={styles.logo} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {huurder.name}
      </Text>
      <Text style={styles.description} numberOfLines={1}>
        {huurder.description}
      </Text>
      <View style={styles.roomBadge}>
        <Text style={styles.roomText}>{huurder.room}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.websiteLink, pressed && styles.websiteLinkPressed]}
        onPress={handleWebsite}
      >
        <Text style={styles.websiteIcon}>↗</Text>
        <Text style={styles.websiteText}>Website bezoeken</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
    height: 80,
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.skeleton,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  roomBadge: {
    backgroundColor: Colors.surfaceWarm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  roomText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.accent,
  },
  websiteLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: "auto",
  },
  websiteLinkPressed: {
    opacity: 0.6,
  },
  websiteIcon: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "700",
  },
  websiteText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
  },
});
