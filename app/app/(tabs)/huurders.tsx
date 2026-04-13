import { useState, useMemo } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, useWindowDimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { huurders, categories } from "@/constants/huurders";
import { TenantCard } from "@/components/TenantCard";
import { Dropdown } from "@/components/Dropdown";

export default function HuurdersScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { width } = useWindowDimensions();

  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;

  const filtered = useMemo(() => {
    return huurders.filter((h) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.room.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || h.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const rows: (typeof huurders)[] = [];
  for (let i = 0; i < filtered.length; i += columns) {
    rows.push(filtered.slice(i, i + columns));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Onze Huurders</Text>
      <Text style={styles.subtitle}>Maak kennis met de ondernemers van De Spinnerij</Text>

      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Zoek op naam, categorie of ruimte..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
        <Dropdown
          value={selectedCategory}
          placeholder="Alle categorieën"
          options={[
            { label: "Alle categorieën", value: "" },
            ...categories.map((cat) => ({ label: cat, value: cat })),
          ]}
          onChange={setSelectedCategory}
        />
      </View>

      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((huurder) => (
              <View key={huurder.id} style={{ flex: 1 }}>
                <TenantCard huurder={huurder} />
              </View>
            ))}
            {/* Fill empty spots to maintain grid alignment */}
            {row.length < columns &&
              Array.from({ length: columns - row.length }).map((_, i) => (
                <View key={`empty-${i}`} style={{ flex: 1 }} />
              ))}
          </View>
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Geen huurders gevonden</Text>
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
  filterContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  grid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
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
