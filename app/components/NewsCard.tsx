import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import type { FeedItem } from "@/hooks/useRssFeed";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=360&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=360&fit=crop",
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=360&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=360&fit=crop",
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&h=360&fit=crop",
  "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600&h=360&fit=crop",
];

export function getPlaceholderImage(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_IMAGES[Math.abs(hash) % PLACEHOLDER_IMAGES.length];
}

interface NewsCardProps {
  item: FeedItem;
  onPress: () => void;
}

export function NewsCard({ item, onPress }: NewsCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Image
        source={{ uri: item.thumbnail || getPlaceholderImage(item.title) }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.dateLine}>
          <View style={styles.dateAccent} />
          <Text style={styles.date}>{item.pubDate}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <Text style={styles.readMore}>Lees meer →</Text>
      </View>
    </Pressable>
  );
}

export function NewsCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={[styles.image, styles.skeleton]} />
      <View style={styles.content}>
        <View style={[styles.skeletonLine, { width: "40%" }]} />
        <View style={[styles.skeletonLine, { width: "90%", height: 18 }]} />
        <View style={[styles.skeletonLine, { width: "70%" }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.skeleton,
  },
  content: {
    padding: 18,
  },
  dateLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dateAccent: {
    width: 3,
    height: 14,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  date: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: "600",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 26,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
  },
  readMore: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "700",
  },
  skeleton: {
    backgroundColor: Colors.skeleton,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: Colors.skeleton,
    borderRadius: 4,
    marginBottom: 8,
  },
});
