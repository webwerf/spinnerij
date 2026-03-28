import { FlatList, View, Text, StyleSheet, RefreshControl, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useRssFeed, type FeedItem } from "@/hooks/useRssFeed";
import { NewsCard, NewsCardSkeleton, getPlaceholderImage } from "@/components/NewsCard";

export default function NieuwsScreen() {
  const { items, loading, error, refresh } = useRssFeed();
  const router = useRouter();

  function handlePress(item: FeedItem) {
    router.push({
      pathname: "/artikel",
      params: {
        title: item.title,
        description: item.fullDescription,
        pubDate: item.pubDate,
        thumbnail: item.thumbnail || getPlaceholderImage(item.title),
        link: item.link,
      },
    });
  }

  if (error && !loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Opnieuw proberen</Text>
        </Pressable>
      </View>
    );
  }

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={items}
      keyExtractor={(item) => item.link}
      renderItem={({ item }) => (
        <NewsCard item={item} onPress={() => handlePress(item)} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 32,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
