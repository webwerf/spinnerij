import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function HuurderScreen() {
  const router = useRouter();
  const { name, desc, room, logo } = useLocalSearchParams<{
    name: string;
    desc: string;
    room: string;
    logo: string;
  }>();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Terug</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero section */}
        <View style={styles.hero}>
          <Image source={{ uri: logo }} style={styles.logo} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.desc}>{desc}</Text>
        </View>

        {/* Info cards */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Ruimte</Text>
          <Text style={styles.infoValue}>{room}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Over</Text>
          <Text style={styles.infoText}>
            Dit is een placeholder beschrijving voor {name}. Hier komt straks een uitgebreidere
            tekst over het bedrijf, hun diensten en wat ze te bieden hebben voor klanten en
            bezoekers van Spinnerij Oosterveld.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Pressable
            style={({ pressed }) => [styles.contactRow, pressed && { opacity: 0.6 }]}
            onPress={() => Linking.openURL("mailto:info@voorbeeld.nl")}
          >
            <Text style={styles.contactIcon}>✉</Text>
            <Text style={styles.contactLink}>info@voorbeeld.nl</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.contactRow, pressed && { opacity: 0.6 }]}
            onPress={() => Linking.openURL("tel:+31530000000")}
          >
            <Text style={styles.contactIcon}>✆</Text>
            <Text style={styles.contactLink}>053 - 000 00 00</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backPressed: {
    opacity: 0.6,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.primary,
    fontWeight: "300",
    lineHeight: 28,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.skeleton,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  contactIcon: {
    fontSize: 16,
  },
  contactLink: {
    fontSize: 15,
    color: Colors.accent,
    fontWeight: "600",
  },
});
