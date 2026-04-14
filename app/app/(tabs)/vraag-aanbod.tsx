import { useState, useMemo } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, Linking, RefreshControl } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSpinnerijData } from "@/hooks/useSpinnerijData";
import type { SupplyDemandItem } from "@/constants/types";

import { WHATSAPP_BASE } from "@/constants/api";

const WHATSAPP_URL = `${WHATSAPP_BASE}${encodeURIComponent("Hoi Inge, ik wil graag iets plaatsen op Vraag & Aanbod")}`;

type Filter = "alles" | "vraag" | "aanbod";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

function TypeBadge({ type }: { type: SupplyDemandItem["type"] }) {
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
  const { data, loading, error, refresh } = useSpinnerijData();
  const [filter, setFilter] = useState<Filter>("alles");

  const items = data?.supplydemanditems ?? [];

  const filtered = useMemo(
    () => (filter === "alles" ? items : items.filter((item) => item.type === filter)),
    [items, filter],
  );

  function handleAdd() {
    Linking.openURL(WHATSAPP_URL);
  }

  function handleEmail(email: string) {
    Linking.openURL(`mailto:${email}`);
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

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Vraag & Aanbod</Text>
              <Text style={styles.subtitle}>Deel en vind hulp binnen de community</Text>
            </View>
          </View>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Colors.primary} />}
      >
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
          <View key={item.wrdid} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardTopRow}>
                <TypeBadge type={item.type} />
                <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.wrdtitle}</Text>
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
    height: 200,
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
