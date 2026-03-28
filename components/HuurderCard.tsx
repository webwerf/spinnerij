import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import type { Huurder } from "@/constants/huurders";

interface HuurderCardProps {
  huurder: Huurder;
  onPress: () => void;
}

export function HuurderCard({ huurder, onPress }: HuurderCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Image source={{ uri: huurder.logo }} style={styles.logo} />
      <View style={styles.info}>
        <Text style={styles.name}>{huurder.name}</Text>
        <Text style={styles.desc}>{huurder.desc}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.skeleton,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 22,
    color: Colors.textLight,
    fontWeight: "300",
  },
});
