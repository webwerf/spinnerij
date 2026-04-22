import { View, Text, Image, StyleSheet, Pressable, Linking } from "react-native";
import { Colors } from "@/constants/Colors";
import type { Tenant } from "@/constants/types";

interface TenantCardProps {
  tenant: Tenant;
}

function getAvatarUrl(name: string): string {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=F4A261&color=fff&size=128&font-size=0.4&bold=true`;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

interface ContactAction {
  key: string;
  icon: string;
  label: string;
  url: string;
}

function buildContactActions(tenant: Tenant): ContactAction[] {
  const actions: ContactAction[] = [];
  if (tenant.phone) {
    actions.push({ key: "phone", icon: "✆", label: "Bel ons", url: `tel:${tenant.phone.replace(/\s/g, "")}` });
  }
  if (tenant.email) {
    actions.push({ key: "email", icon: "✉", label: "Stuur ons een e-mail", url: `mailto:${tenant.email}` });
  }
  if (tenant.website) {
    actions.push({ key: "website", icon: "↗", label: "Bezoek onze website", url: tenant.website });
  }
  if (tenant.facebook) {
    actions.push({ key: "facebook", icon: "f", label: "Facebook", url: tenant.facebook });
  }
  if (tenant.instagram) {
    actions.push({ key: "instagram", icon: "ig", label: "Instagram", url: tenant.instagram });
  }
  if (tenant.linkedin) {
    actions.push({ key: "linkedin", icon: "in", label: "LinkedIn", url: tenant.linkedin });
  }
  if (tenant.youtube) {
    actions.push({ key: "youtube", icon: "yt", label: "YouTube", url: tenant.youtube });
  }
  if (tenant.twitter) {
    actions.push({ key: "twitter", icon: "tw", label: "Twitter", url: tenant.twitter });
  }
  if (tenant.pinterest) {
    actions.push({ key: "pinterest", icon: "pt", label: "Pinterest", url: tenant.pinterest });
  }
  if (tenant.vimeo) {
    actions.push({ key: "vimeo", icon: "vi", label: "Vimeo", url: tenant.vimeo });
  }
  return actions;
}

export function TenantCard({ tenant }: TenantCardProps) {
  const actions = buildContactActions(tenant);
  const description = stripHtml(tenant.description);

  return (
    <View style={styles.card}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: getAvatarUrl(tenant.wrdtitle) }} style={styles.logo} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {tenant.wrdtitle}
      </Text>
      {description.length > 0 && (
        <Text style={styles.description}>{description}</Text>
      )}
      {tenant.room.length > 0 && (
        <View style={styles.roomBadge}>
          <Text style={styles.roomText}>{tenant.room}</Text>
        </View>
      )}
      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map((action) => (
            <Pressable
              key={action.key}
              style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
              onPress={() => { void Linking.openURL(action.url); }}
            >
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIconText}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
    height: 80,
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.skeleton,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  roomBadge: {
    backgroundColor: Colors.surfaceWarm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  roomText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.accent,
  },
  actions: {
    marginTop: "auto",
    gap: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionRowPressed: {
    opacity: 0.6,
  },
  actionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FDF0EF",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIconText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "800",
  },
  actionLabel: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
    flexShrink: 1,
  },
});
