import { useState, useMemo } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, Pressable, Linking, RefreshControl, Modal, Platform, Alert, KeyboardAvoidingView } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSpinnerijData } from "@/hooks/useSpinnerijData";
import type { SupplyDemandItem } from "@/constants/types";
import { Dropdown } from "@/components/Dropdown";

import { WHATSAPP_BASE } from "@/constants/api";

const TYPE_OPTIONS = [
  { label: "🔍 Vraag", value: "vraag" },
  { label: "🔖 Aanbod", value: "aanbod" },
];

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
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const items = data?.supplydemanditems ?? [];

  const filtered = useMemo(
    () => (filter === "alles" ? items : items.filter((item) => item.type === filter)),
    [items, filter],
  );

  function handleAdd() {
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setFormType("");
    setFormDescription("");
  }

  function handleSubmit() {
    if (!formType) {
      if (Platform.OS === "web") {
        window.alert("Kies een type (Vraag of Aanbod)");
      } else {
        Alert.alert("Kies een type (Vraag of Aanbod)");
      }
      return;
    }
    if (!formDescription.trim()) {
      if (Platform.OS === "web") {
        window.alert("Vul een omschrijving in");
      } else {
        Alert.alert("Vul een omschrijving in");
      }
      return;
    }

    const typeLabel = formType === "vraag" ? "Vraag" : "Aanbod";
    const message = encodeURIComponent(
      `Nieuw bericht op Vraag & Aanbod\n\nType: ${typeLabel}\nOmschrijving:\n\n${formDescription.trim()}`
    );
    Linking.openURL(`${WHATSAPP_BASE}${message}`);
    handleCloseModal();
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

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={handleCloseModal}>
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nieuw bericht plaatsen</Text>
                <Pressable style={styles.modalClose} onPress={handleCloseModal}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalLabel}>Type</Text>
                <Dropdown
                  value={formType}
                  placeholder="Kies type"
                  options={TYPE_OPTIONS}
                  onChange={setFormType}
                />

                <Text style={styles.modalLabel}>Omschrijving</Text>
                <TextInput
                  style={styles.modalTextarea}
                  placeholder="Beschrijf je vraag of aanbod..."
                  placeholderTextColor={Colors.textLight}
                  value={formDescription}
                  onChangeText={setFormDescription}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </ScrollView>

              <Pressable
                style={({ pressed }) => [styles.modalSubmitButton, pressed && styles.modalSubmitButtonPressed]}
                onPress={handleSubmit}
              >
                <Text style={styles.modalSubmitButtonText}>Versturen via WhatsApp 🚀</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    maxHeight: "80%",
  },
  modalBody: {
    flexShrink: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  modalTextarea: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
    marginBottom: 16,
  },
  modalSubmitButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalSubmitButtonPressed: {
    opacity: 0.8,
  },
  modalSubmitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
