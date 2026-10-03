import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, fontFamily } from "@/theme";

const actions = [
  {
    icon: "people-outline" as const,
    title: "Manage Workers",
    tone: "green" as const,
  },
  {
    icon: "bed-outline" as const,
    title: "Room Configuration",
    tone: "amber" as const,
  },
  {
    icon: "calendar-outline" as const,
    title: "Scheduling & Reminders",
    tone: "light" as const,
  },
];

type Props = {
  onRoomConfiguration: () => void;
  disabled?: boolean;
};

export function PropertyDetailsActions({ onRoomConfiguration, disabled = false }: Props) {
  return (
    <View style={styles.actions}>
      {actions.map((action) => (
        <Pressable
          key={action.title}
          onPress={disabled ? undefined : () => action.title === 'Room Configuration'
            ? onRoomConfiguration()
            : Alert.alert(action.title, 'This section is not available yet.')}
          disabled={disabled}
          style={({ pressed }) => [
            styles.action,
            styles[action.tone],
            disabled && styles.disabled,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={action.title}
          accessibilityState={{ disabled }}
        >
          <Ionicons
            name={action.icon}
            size={20}
            color={disabled ? colors.textMuted : action.tone === "light" ? colors.primary : colors.white}
          />
          <View style={styles.actionLabelRow}>
            <AppText
              style={styles.actionText}
              color={disabled ? colors.textMuted : action.tone === "light" ? colors.textDark : colors.white}
              numberOfLines={2}
            >
              {action.title}
            </AppText>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={disabled ? colors.textMuted : action.tone === "light" ? colors.primary : colors.white}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  action: {
    flex: 1,
    minHeight: 82,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  actionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionText: {
    flexShrink: 1,
    fontFamily: fontFamily.medium,
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
  },
  green: { backgroundColor: "#075C43" },
  amber: { backgroundColor: "#B6651F" },
  light: { backgroundColor: "#F5F7F1", borderWidth: 1, borderColor: "#E2E8DF" },
  disabled: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  pressed: { opacity: 0.82 },
});
