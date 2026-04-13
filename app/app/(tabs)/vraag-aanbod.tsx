import { useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, Pressable, Linking } from "react-native";
import { Colors } from "@/constants/Colors";
import { vraagAanbodItems, type VraagAanbodType } from "@/constants/vraagAanbod";

const WHATSAPP_URL = "https://wa.me/31534500000?text=Hoi%20Inge%2C%20ik%20wil%20graag%20iets%20plaatsen%20op%20Vraag%20%26%20Aanbod";

type Filter = "alles" | "vraag" | "aanbod";

function FilterTabs({ active, onChange }: { active: Filter; onChange: (f: Filter) => void }) {
  const tabs: { key: Filter; label: string }[] = [
    { key: "alles", label: "Alles" },
    { key: "vraag", label: "🔍 Vraag" },
    { key: "aanbod", label: "🔖 Aanbod" },
  ];

  return (
    <View style={styles.filterRow}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[styles.filterTab, active === tab.key && styles.filterTabActive]}
          onPress={() => onChange(tab.key)}
        >
          <Text style={[styles.filterTabText, active === tab.key && styles.filterTabTextActive]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function TypeBadge({ type }: { type: VraagAanbodType }) {
  const isAanbod = type === "aanbod";
  return (
    <View style={[styles.typeBadge, isAanbod ? styles.typeBadgeAanbod : styles.typeBadgeVraag]}>
      <Text style={styles.typeBadgeText}>
        {isAanbod ? "🔖 Aanbod" : "🔍 Vraag"}
      </Text>
    </View>
  );
}

export default function VraagAanbodScreen() {
  const [filter, setFilter] = useState<Filter>("alles");

  const filtered = filter === "alles"
    ? vraagAanbodItems
    : vraagAanbodItems.filter((item) => item.type === filter);

  function handleAdd() {
    Linking.openURL(WHATSAPP_URL);
  }

  function handleEmail(email: string) {
    Linking.openURL(`mailto:${email}`);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Vraag & Aanbod</Text>
            <Text style={styles.subtitle}>Deel en vind hulp binnen de community</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <FilterTabs active={filter} onChange={setFilter} />

        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.cardImage} />
            )}
            <View style={styles.cardContent}>
              <View style={styles.cardTopRow}>
                <TypeBadge type={item.type} />
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <View style={styles.authorRow}>
                <Text style={styles.authorIcon}>📋</Text>
                <Text style={styles.authorText}>
                  {item.author} • {item.organization}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.emailButton, pressed && styles.emailButtonPressed]}
                onPress={() => handleEmail(item.email)}
              >
                <Text style={styles.emailButtonIcon}>✉</Text>
                <Text style={styles.emailButtonText}>E-mail</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Geen items gevonden</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "700",
    lineHeight: 28,
  },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: Colors.accent,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.skeleton,
  },
  cardContent: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeAanbod: {
    backgroundColor: "#FFF3E0",
  },
  typeBadgeVraag: {
    backgroundColor: "#E3F2FD",
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
  cardDate: {
    fontSize: 13,
    color: Colors.textLight,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.accent,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundWarm,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  authorIcon: {
    fontSize: 14,
  },
  authorText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  emailButtonPressed: {
    opacity: 0.8,
  },
  emailButtonIcon: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  emailButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
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
