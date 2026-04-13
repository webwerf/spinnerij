import { useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, Pressable, Linking, Alert, Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import { Dropdown } from "@/components/Dropdown";

const CATEGORIES = [
  "Verlichting",
  "Verwarming / klimaat",
  "Sanitair",
  "Schoonmaak",
  "Lift",
  "Parkeren",
  "Veiligheid",
  "Overig",
];

const WHATSAPP_BASE = "https://wa.me/31534500000?text=";

export default function MeldingScreen() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!category) {
      if (Platform.OS === "web") {
        window.alert("Kies een categorie");
      } else {
        Alert.alert("Kies een categorie");
      }
      return;
    }
    if (!description.trim()) {
      if (Platform.OS === "web") {
        window.alert("Vul een omschrijving in");
      } else {
        Alert.alert("Vul een omschrijving in");
      }
      return;
    }

    const message = encodeURIComponent(
      `Melding - ${category}\n\n${description.trim()}`
    );
    Linking.openURL(`${WHATSAPP_BASE}${message}`);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Melding maken</Text>
      <Text style={styles.subtitle}>Meld een probleem of storing</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Categorie</Text>
        <Dropdown
          value={category}
          placeholder="Kies categorie"
          options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
          onChange={setCategory}
        />

        <Text style={styles.label}>Omschrijving</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Beschrijf het probleem..."
          placeholderTextColor={Colors.textLight}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Foto (optioneel)</Text>
        <View style={styles.photoUpload}>
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoText}>Foto toevoegen</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Versturen via WhatsApp 🚀</Text>
        </Pressable>
      </View>
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
    marginBottom: 20,
  },
  form: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  textarea: {
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
  photoUpload: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  photoIcon: {
    fontSize: 28,
  },
  photoText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
