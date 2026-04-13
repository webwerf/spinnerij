import { ScrollView, View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

const PHONE = "053 - 782 00 00";
const EMAIL = "servicepunt@spinnerijoosterveld.nl";

const SOCIALS = [
  { name: "Facebook", url: "https://www.facebook.com/SpinnerijOosterveld", icon: "f" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/spinnerij-oosterveld", icon: "in" },
  { name: "Instagram", url: "https://www.instagram.com/SpinnerijOosterveld", icon: "ig" },
];

function openPhone() {
  Linking.openURL(`tel:${PHONE.replace(/\s|-/g, "")}`);
}

function openEmail() {
  Linking.openURL(`mailto:${EMAIL}`);
}

function openMaps() {
  Linking.openURL("https://maps.google.com/?q=Rigtersbleek+Zandvoort+10,+7521+BE+Enschede");
}

function openUrl(url: string) {
  Linking.openURL(url);
}

export default function ContactScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Terug</Text>
      </Pressable>

      <Text style={styles.title}>Contact</Text>
      <Text style={styles.subtitle}>Neem contact op met De Spinnerij</Text>

      {/* Map */}
      <Pressable onPress={openMaps} style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>📍</Text>
          <Text style={styles.mapAddress}>Rigtersbleek Zandvoort 10</Text>
          <Text style={styles.mapCity}>7521 BE Enschede</Text>
          <Text style={styles.mapText}>Tik om in Google Maps te openen</Text>
        </View>
      </Pressable>

      {/* Quick actions */}
      <View style={styles.quickActions}>
        <Pressable
          onPress={openPhone}
          style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
        >
          <View style={styles.quickActionIconCircle}>
            <Text style={[styles.quickActionIconText, { fontSize: 27 }]}>✆</Text>
          </View>
          <Text style={styles.quickActionLabel}>Bellen</Text>
        </Pressable>
        <Pressable
          onPress={openEmail}
          style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
        >
          <View style={styles.quickActionIconCircle}>
            <Text style={styles.quickActionIconText}>@</Text>
          </View>
          <Text style={styles.quickActionLabel}>E-mail</Text>
        </Pressable>
        <Pressable
          onPress={openMaps}
          style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
        >
          <View style={styles.quickActionIconCircle}>
            <Text style={styles.quickActionIconText}>→</Text>
          </View>
          <Text style={styles.quickActionLabel}>Route</Text>
        </Pressable>
      </View>

      {/* Phone */}
      <Pressable onPress={openPhone} style={styles.section}>
        <Text style={styles.sectionLabel}>Telefoon</Text>
        <Text style={[styles.sectionValue, styles.link]}>{PHONE}</Text>
      </Pressable>

      {/* Email */}
      <Pressable onPress={openEmail} style={styles.section}>
        <Text style={styles.sectionLabel}>E-mail</Text>
        <Text style={[styles.sectionValue, styles.link]}>{EMAIL}</Text>
      </Pressable>

      {/* Opening Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Openingstijden</Text>
        <View style={styles.hoursRow}>
          <Text style={styles.hoursLabel}>Servicedesk</Text>
          <Text style={styles.hoursValue}>Ma t/m vr, 08:00 – 16:30</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.hoursRow}>
          <Text style={styles.hoursLabel}>Toegang huurders</Text>
          <Text style={styles.hoursValue}>24/7 met druppel</Text>
        </View>
      </View>

      {/* Socials */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Volg ons</Text>
        <View style={styles.socialsRow}>
          {SOCIALS.map((social) => (
            <Pressable
              key={social.name}
              style={({ pressed }) => [styles.socialButton, pressed && styles.socialPressed]}
              onPress={() => openUrl(social.url)}
            >
              <Text style={styles.socialIcon}>{social.icon}</Text>
              <Text style={styles.socialName}>{social.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Website link */}
      <Pressable
        onPress={() => openUrl("https://spinnerijoosterveld.nl")}
        style={({ pressed }) => [styles.websiteButton, pressed && styles.websiteButtonPressed]}
      >
        <Text style={styles.websiteButtonText}>Bezoek onze website →</Text>
      </Pressable>
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
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: Colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  mapIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  mapAddress: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  mapCity: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
    marginBottom: 4,
  },
  mapText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.6,
  },
  quickActions: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionPressed: {
    opacity: 0.8,
  },
  quickActionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FDF0EF",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionIconText: {
    fontSize: 18,
    color: Colors.accent,
    fontWeight: "700",
  },
  quickActionLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  sectionValue: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  link: {
    color: Colors.primary,
    fontWeight: "600",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  hoursLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "500",
  },
  hoursValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  socialsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceWarm,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  socialPressed: {
    opacity: 0.7,
  },
  socialIcon: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primary,
  },
  socialName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
  websiteButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  websiteButtonPressed: {
    opacity: 0.8,
  },
  websiteButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
