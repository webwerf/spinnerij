import { useState } from "react";
import { FlatList, View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { huurders, type Huurder } from "@/constants/huurders";
import { HuurderCard } from "@/components/HuurderCard";

export default function HuurdersScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = huurders.filter((h) => {
    const q = search.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.desc.toLowerCase().includes(q) ||
      h.room.toLowerCase().includes(q)
    );
  });

  function handlePress(huurder: Huurder) {
    router.push({
      pathname: "/huurder",
      params: {
        name: huurder.name,
        desc: huurder.desc,
        room: huurder.room,
        logo: huurder.logo,
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek huurder..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HuurderCard huurder={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Geen huurders gevonden</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 24,
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
