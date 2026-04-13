import { ScrollView, View, Text, Image, StyleSheet, Pressable, Linking } from "react-native";
import { Colors } from "@/constants/Colors";
import { ruimtes } from "@/constants/ruimtes";

const WHATSAPP_BASE = "https://wa.me/31534500000?text=";

export default function ReserverenScreen() {
  function handleReserve(roomName: string) {
    const message = encodeURIComponent(`Hoi Inge, ik wil graag ${roomName} reserveren.`);
    Linking.openURL(`${WHATSAPP_BASE}${message}`);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reserveren</Text>
      <Text style={styles.subtitle}>Boek een vergaderruimte</Text>

      {ruimtes.map((ruimte) => (
        <View key={ruimte.id} style={styles.card}>
          <Image source={{ uri: ruimte.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.roomName}>
              {ruimte.name} - {ruimte.subtitle}
            </Text>
            <View style={styles.capacityBadge}>
              <Text style={styles.capacityIcon}>👥</Text>
              <Text style={styles.capacityText}>Max. {ruimte.capacity} personen</Text>
            </View>
            <Text style={styles.description}>{ruimte.description}</Text>
            <Pressable
              style={({ pressed }) => [styles.reserveButton, pressed && styles.reserveButtonPressed]}
              onPress={() => handleReserve(`${ruimte.name} - ${ruimte.subtitle}`)}
            >
              <Text style={styles.reserveButtonText}>Reserveren →</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 220,
    backgroundColor: Colors.accent,
  },
  cardContent: {
    padding: 18,
  },
  roomName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  capacityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceWarm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 6,
  },
  capacityIcon: {
    fontSize: 14,
  },
  capacityText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  reserveButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  reserveButtonPressed: {
    opacity: 0.8,
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
