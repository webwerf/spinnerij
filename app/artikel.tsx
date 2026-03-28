import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function ArtikelScreen() {
  const router = useRouter();
  const { title, description, pubDate, thumbnail, link } = useLocalSearchParams<{
    title: string;
    description: string;
    pubDate: string;
    thumbnail: string;
    link: string;
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
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.image} />
        ) : null}

        <View style={styles.content}>
          <Text style={styles.date}>{pubDate}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <Pressable
            style={({ pressed }) => [styles.readMoreButton, pressed && styles.readMorePressed]}
            onPress={() => link && Linking.openURL(link)}
          >
            <Text style={styles.readMoreText}>Lees volledig artikel →</Text>
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
  image: {
    width: "100%",
    height: 240,
    backgroundColor: Colors.skeleton,
  },
  content: {
    padding: 20,
  },
  date: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: "500",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 32,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  readMoreButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  readMorePressed: {
    opacity: 0.85,
  },
  readMoreText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
