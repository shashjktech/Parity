import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, fontFamily } from "@/theme";
import type { WorkerProperty } from "../types/worker-types";
type Props = { status: WorkerProperty["verificationStatus"] };

export function PropertyStatusBadge({ status }: Props) {
  const active = status === "VERIFIED";

  return (
    <View style={[styles.badge, active ? styles.active : styles.inactive]}>
      <Ionicons
        name={active ? "checkmark-circle" : "time-outline"}
        size={14}
        color={active ? colors.primary : colors.textSecondary}
      />
      <AppText
        style={styles.label}
        color={active ? colors.primary : colors.textSecondary}
      >
        {active
          ? "Verified"
          : status === "ACTION_REQUIRED"
            ? "Action Required"
            : "Pending"}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    elevation: 2, // keeps it above the image on Android
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  active: { backgroundColor: "#E1F4E6" },
  inactive: { backgroundColor: "#EEF0ED" },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 14 },
});
