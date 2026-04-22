import { ScrollView, View, Text, StyleSheet, Pressable, Linking, RefreshControl } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSpinnerijData } from "@/hooks/useSpinnerijData";

import { WHATSAPP_BASE } from "@/constants/api";

export default function ReserverenScreen() {
  const { data, loading, error, refresh } = useSpinnerijData();
  const rooms = data?.rooms ?? [];

  function handleReserve(roomName: string) {
    const message = encodeURIComponent(`Hoi Inge,\n\nIk wil graag ${roomName} reserveren.\n\nDatum: `);
    Linking.openURL(`${WHATSAPP_BASE}${message}`);
  }

  if (error && !loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorIcon}>⚠</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Opnieuw proberen</Text>
        </Pressable>
      </View>
    );
  }

  if (loading && rooms.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Reserveren</Text>
          <Text style={styles.subtitle}>Boek een vergaderruimte</Text>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Colors.primary} />}
    >
      <Text style={styles.title}>Reserveren</Text>
      <Text style={styles.subtitle}>Boek een vergaderruimte</Text>

      {rooms.map((room) => (
        <View key={room.wrdid} style={styles.card}>
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.cardImageText}>{room.wrdtitle}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.roomName}>
              {room.wrdtitle} - {room.subtitle}
            </Text>
            {room.capacity > 0 && (
              <View style={styles.capacityBadge}>
                <Text style={styles.capacityIcon}>👥</Text>
                <Text style={styles.capacityText}>Max. {room.capacity} personen</Text>
              </View>
            )}
            <Text style={styles.description}>{room.description}</Text>
            <Pressable
              style={({ pressed }) => [styles.reserveButton, pressed && styles.reserveButtonPressed]}
              onPress={() => handleReserve(`${room.wrdtitle} - ${room.subtitle}`)}
            >
              <Text style={styles.reserveButtonText}>Reserveren →</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {rooms.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Geen ruimtes beschikbaar</Text>
        </View>
      )}
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
  cardImagePlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImageText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    opacity: 0.8,
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
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  skeletonCard: {
    backgroundColor: Colors.skeleton,
    borderRadius: 16,
    height: 340,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  empty: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textLight,
  },
});
