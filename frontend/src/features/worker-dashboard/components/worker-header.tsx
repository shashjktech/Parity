import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { images } from "@/constants/assets";
import { colors, fontFamily } from "@/theme";

type Props = { workerName: string };

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "WK"
  );
}

export function WorkerHeader({ workerName }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={styles.brandRow}>
          <Image
            source={images.brand.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <AppText
            variant="heading"
            color={colors.primary}
            style={styles.brandText}
          >
            parity
          </AppText>
        </View>
        <AppText
          variant="subtitle"
          color={colors.accent}
          style={styles.tagline}
        >
          CLEAN SPACES HIGHER STANDARDS
        </AppText>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.notification}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons
            name="notifications-outline"
            size={25}
            color={colors.primary}
          />
          <View style={styles.notificationDot} />
        </Pressable>
        <View style={styles.avatar}>
          <AppText style={styles.initials} color={colors.primary}>
            {getInitials(workerName)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexShrink: 1, alignItems: "flex-start" },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 84, height: 60, alignSelf: "flex-start", top: 2, right: 20 },
  brandText: { fontSize: 34, right: 30, bottom: 2 },
  tagline: { marginTop: -4, fontSize: 8, lineHeight: 14, letterSpacing: 2.5 },
  actions: { flexDirection: "row", alignItems: "center", gap: 14 },
  notification: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 7,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#F21E2B",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E9F0E9",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
});
