import { FlatList, View, Text, StyleSheet, RefreshControl, Pressable, Linking } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRssFeed, type FeedItem } from "@/hooks/useRssFeed";
import { NewsCard, NewsCardSkeleton } from "@/components/NewsCard";

function WelcomeBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerTitle}>Hoi daar 👋</Text>
      <Text style={styles.bannerSubtitle}>Welkom terug bij De Spinnerij</Text>
    </View>
  );
}

function SectionHeader() {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Nieuws & Updates</Text>
      <Text style={styles.sectionSubtitle}>Blijf op de hoogte van het laatste nieuws</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { items, loading, error, refresh } = useRssFeed();

  function handlePress(item: FeedItem) {
    Linking.openURL(item.link);
  }

  if (error && !loading) {
    return (
      <View style={styles.container}>
        <WelcomeBanner />
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Opnieuw proberen</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <WelcomeBanner />
        <SectionHeader />
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
      ListHeaderComponent={
        <>
          <WelcomeBanner />
          <SectionHeader />
        </>
      }
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
    paddingBottom: 24,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 24,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
