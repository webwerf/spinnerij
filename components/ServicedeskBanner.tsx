import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";

function getServicedeskStatus(): { open: boolean; label: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours * 60 + minutes;

  const openTime = 8 * 60;      // 08:00
  const closeTime = 16 * 60 + 30; // 16:30

  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && time >= openTime && time < closeTime;

  if (isOpen) {
    const remaining = closeTime - time;
    if (remaining <= 30) {
      return { open: true, label: `Open — sluit over ${remaining} min` };
    }
    return { open: true, label: "Open tot 16:30" };
  }

  // Calculate next opening
  if (isWeekday && time < openTime) {
    // Before opening today
    return { open: false, label: "Gesloten — opent om 08:00" };
  }

  if (day === 5 && time >= closeTime) {
    // Friday after close
    return { open: false, label: "Gesloten — opent maandag 08:00" };
  }

  if (day === 6) {
    // Saturday
    return { open: false, label: "Gesloten — opent maandag 08:00" };
  }

  if (day === 0) {
    // Sunday
    return { open: false, label: "Gesloten — opent morgen 08:00" };
  }

  // Weekday after close
  return { open: false, label: "Gesloten — opent morgen 08:00" };
}

export function ServicedeskBanner() {
  const [status, setStatus] = useState(getServicedeskStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getServicedeskStatus());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.banner, status.open ? styles.bannerOpen : styles.bannerClosed]}>
      <View style={[styles.dot, status.open ? styles.dotOpen : styles.dotClosed]} />
      <Text style={styles.label}>
        <Text style={styles.prefix}>Servicedesk </Text>
        {status.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 8,
  },
  bannerOpen: {
    backgroundColor: "#1E4A30",
  },
  bannerClosed: {
    backgroundColor: "#4A1A1A",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotOpen: {
    backgroundColor: "#4ADE80",
  },
  dotClosed: {
    backgroundColor: "#F87171",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  prefix: {
    fontWeight: "700",
  },
});
